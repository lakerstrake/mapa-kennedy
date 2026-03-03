import fs from 'fs';
import { institutions } from './src/mockData.js';

const geojsonPath = './public/saludupz.geojson';
const outPath = './geocoded.json';

const kennedyBounds = {
  left: -74.22,
  top: 4.69,
  right: -74.11,
  bottom: 4.56,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const pointInRing = (point, ring) => {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / ((yj - yi) || Number.EPSILON) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
};

const pointInPolygon = (point, rings) => {
  if (!rings?.length) return false;
  if (!pointInRing(point, rings[0])) return false;
  for (let i = 1; i < rings.length; i += 1) if (pointInRing(point, rings[i])) return false;
  return true;
};

const containsPoint = (feature, lon, lat) => {
  const geom = feature?.geometry;
  const point = [lon, lat];
  if (!geom) return false;
  if (geom.type === 'Polygon') return pointInPolygon(point, geom.coordinates);
  if (geom.type === 'MultiPolygon') return geom.coordinates.some((rings) => pointInPolygon(point, rings));
  return false;
};

const geo = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
const kennedyFeatures = geo.features.filter((f) => String(f.properties?.LocNombre || '').toUpperCase() === 'KENNEDY');
const uniqueByCode = new Map();
for (const f of kennedyFeatures) {
  const code = String(f.properties?.UPlCodigo || '');
  if (!uniqueByCode.has(code)) uniqueByCode.set(code, f);
}
const kennedyUnique = [...uniqueByCode.values()];
const inKennedy = (lon, lat) => kennedyUnique.some((f) => containsPoint(f, lon, lat));

const toNominatimCandidates = async (query, bounded = true) => {
  const params = new URLSearchParams({ q: query, format: 'jsonv2', addressdetails: '1', limit: '5', countrycodes: 'co' });
  if (bounded) {
    params.set('bounded', '1');
    params.set('viewbox', `${kennedyBounds.left},${kennedyBounds.top},${kennedyBounds.right},${kennedyBounds.bottom}`);
  }

  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'mapa-kennedy-geocoder/2.0 (local validation)', 'Accept-Language': 'es' },
  });
  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
  const rows = await res.json();
  return rows.map((r) => ({ provider: 'nominatim', lat: Number(r.lat), lon: Number(r.lon), label: r.display_name, providerScore: Number(r.importance || 0) }));
};

const toArcgisCandidates = async (query) => {
  const params = new URLSearchParams({
    f: 'json',
    singleLine: query,
    countryCode: 'COL',
    outFields: '*',
    maxLocations: '5',
    location: '-74.157,4.626',
    distance: '20000',
  });
  const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ArcGIS HTTP ${res.status}`);
  const data = await res.json();
  const cands = data?.candidates || [];
  return cands.map((c) => ({
    provider: 'arcgis',
    lat: Number(c.location?.y),
    lon: Number(c.location?.x),
    label: c.address,
    providerScore: Number(c.score || 0) / 100,
  }));
};

const scoreCandidate = (cand, inst, query, provider) => {
  const lat = Number(cand.lat);
  const lon = Number(cand.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return -9999;

  const label = String(cand.label || '').toLowerCase();
  let score = 0;
  if (inKennedy(lon, lat)) score += 130;
  if (label.includes('kennedy')) score += 25;
  if (label.includes('bogotá') || label.includes('bogota')) score += 8;
  if (provider === 'arcgis') score += 8;
  if (query.includes('kennedy')) score += 6;
  score += (cand.providerScore || 0) * 10;

  const dLat = lat - Number(inst.lat || 0);
  const dLon = lon - Number(inst.lng || 0);
  const roughDistance = Math.sqrt(dLat * dLat + dLon * dLon);
  score -= roughDistance * 600;
  return score;
};

const resolveInstitution = async (inst) => {
  const baseAddress = String(inst.address || '').replace(/[()]/g, ' ');
  const queries = [
    `${baseAddress}, Kennedy, Bogotá, Colombia`,
    `${inst.name}, Kennedy, Bogotá, Colombia`,
    `${baseAddress}, Bogotá, Colombia`,
    `${inst.name}, Bogotá, Colombia`,
  ];

  let best = null;

  for (const query of queries) {
    const providers = [
      () => toNominatimCandidates(query, true),
      () => toNominatimCandidates(query, false),
      () => toArcgisCandidates(query),
    ];

    for (const run of providers) {
      let candidates = [];
      try {
        candidates = await run();
      } catch {
        candidates = [];
      }

      for (const cand of candidates) {
        const provider = cand.provider;
        const score = scoreCandidate(cand, inst, query.toLowerCase(), provider);
        if (!best || score > best.score) {
          best = {
            id: inst.id,
            name: inst.name,
            address: inst.address,
            oldLat: inst.lat,
            oldLng: inst.lng,
            newLat: cand.lat,
            newLng: cand.lon,
            score,
            inKennedy: inKennedy(cand.lon, cand.lat),
            query,
            provider,
            displayName: cand.label,
          };
        }
      }
      await sleep(550);
    }
  }

  if (!best) {
    return { id: inst.id, name: inst.name, address: inst.address, oldLat: inst.lat, oldLng: inst.lng, status: 'not_found' };
  }

  return { ...best, status: best.inKennedy ? 'updated' : 'outside_kennedy' };
};

const main = async () => {
  console.log(`Geocodificando ${institutions.length} instituciones...`);
  const output = [];

  for (const inst of institutions) {
    const resolved = await resolveInstitution(inst);
    output.push(resolved);
    console.log(`${resolved.status.toUpperCase()}: ${inst.id} -> ${resolved.newLat ?? 'n/a'}, ${resolved.newLng ?? 'n/a'} (${resolved.provider ?? 'none'})`);
  }

  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  const summary = output.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  console.log('Resumen:', summary);
  console.log(`Resultados guardados en ${outPath}`);
};

await main();
