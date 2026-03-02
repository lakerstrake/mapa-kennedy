// src/MapaKennedy.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  kennedyCenter,
  socialZones,
  institutions,
  getZoneStyle,
  getZoneColor,
  kennedySummary,
} from './mockData';

// Iconos personalizados para instituciones
const createIcon = (color) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<span style="
      background:${color};
      width:14px;
      height:14px;
      display:block;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 4px rgba(0,0,0,0.4);
    "></span>`,
    iconSize: [18, 18],
  });

const iconsByType = {
  SuperCADE: createIcon('#1f78b4'),
  Salud: createIcon('#33a02c'),
  'Integración Social': createIcon('#e31a1c'),
  'Desarrollo Local': createIcon('#ff7f00'),
  Empleo: createIcon('#6a3d9a'),
  Educación: createIcon('#e6ab02'),
  Administración: createIcon('#a65628'),
};

const createUpzLabelIcon = (name, isSelected, zoomLevel) => {
  // Ajustar tamaño de etiqueta según el nivel de zoom
  let sizeClass = '';
  let factor = 0.7;
  if (zoomLevel >= 15) {
    sizeClass = ' size-large';
    factor = 1;
  } else if (zoomLevel >= 13) {
    sizeClass = '';
    factor = 0.85;
  } else {
    sizeClass = ' size-small';
    factor = 0.7;
  }

  const baseWidth = 110;
  const baseHeight = 22;
  const width = baseWidth * factor;
  const height = baseHeight * factor;

  return L.divIcon({
    className: 'upz-label',
    html: `<div class="upz-label-inner${sizeClass}${isSelected ? ' is-selected' : ''}">${name}</div>`,
    iconSize: [width, height],
    iconAnchor: [width / 2, height / 2],
  });
};

// Limites aproximados de Kennedy para "bloquear" el zoom/pan
const kennedyBounds = L.latLngBounds(
  [4.600, -74.190], // sudoeste aprox
  [4.660, -74.130]  // noreste aprox
);

// Ajusta el mapa según la selección de UPZ (o muestra toda Kennedy)
const FitToSelection = ({ selectedUpz, upzFeatures }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!map) return;

    // Si no hay datos de UPZ aún, usamos el bounding box aproximado
    if (!upzFeatures || upzFeatures.length === 0) {
      map.fitBounds(kennedyBounds);
      map.setMaxBounds(kennedyBounds);
      map.setMinZoom(12);
      map.setMaxZoom(18);
      return;
    }

    // Vista general de toda la localidad de Kennedy (todas las UPZ)
    if (!selectedUpz || selectedUpz === 'all') {
      const bounds = L.geoJSON({ type: 'FeatureCollection', features: upzFeatures }).getBounds();
      map.fitBounds(bounds);
      map.setMaxBounds(bounds);
      map.setMinZoom(12);
      map.setMaxZoom(18);
      return;
    }

    // Zoom a la UPZ seleccionada
    const feature = upzFeatures.find(
      (f) => String(f.properties.UPlCodigo) === String(selectedUpz)
    );

    if (feature) {
      const bounds = L.geoJSON(feature).getBounds();
      map.fitBounds(bounds);
    }
  }, [map, selectedUpz, upzFeatures]);

  return null;
};

const formatPercent = (value) => `${Math.round(value * 100)}%`;

const ZoomWatcher = ({ onZoomChange }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    onZoomChange(map.getZoom());
    const handle = () => onZoomChange(map.getZoom());
    map.on('zoomend', handle);
    return () => {
      map.off('zoomend', handle);
    };
  }, [map, onZoomChange]);

  return null;
};

export const MapaKennedy = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedUpz, setSelectedUpz] = useState('all');
  const [upzFeatures, setUpzFeatures] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(kennedyCenter.zoom);

  // Cargar GeoJSON de UPZ de salud y quedarnos solo con las de la localidad de Kennedy
  useEffect(() => {
    const loadUpz = async () => {
      try {
        const res = await fetch('/saludupz.geojson');
        if (!res.ok) {
          console.error('No se encontró /saludupz.geojson (HTTP ' + res.status + ')');
          return;
        }

        const text = await res.text();
        // Si por error devuelve HTML (por ejemplo index.html), evitamos romper el mapa
        if (text.trim().startsWith('<')) {
          console.error('El recurso /saludupz.geojson no es JSON válido (parece HTML).');
          return;
        }

        const data = JSON.parse(text);
        if (!data || !Array.isArray(data.features)) return;

        // Solo las 12 UPZ de interés, identificadas por su nombre
        const allowedNames = new Set([
          'KENNEDY CENTRAL',
          'AMERICAS',
          'CARVAJAL',
          'BAVARIA',
          'PATIO BONITO',
          'TINTAL NORTE',
          'CALANDAIMA',
          'CORABASTOS',
          'CASTILLA',
          'TIMIZA',
          'GRAN BRITALIA',
          'LAS MARGARITAS',
        ]);

        const selectedFeatures = data.features.filter((f) => {
          if (!f.properties) return false;
          const name = String(f.properties.UPlNombre || '').toUpperCase();
          return allowedNames.has(name);
        });

        setUpzFeatures(selectedFeatures);
      } catch (err) {
        console.error('Error cargando saludupz.geojson', err);
      }
    };

    loadUpz();
  }, []);

  // Opciones de UPZ basadas en el GeoJSON real
  const upzOptions = useMemo(() => {
    const map = new Map();

    // Preferimos las UPZ del GeoJSON si existen
    if (upzFeatures && upzFeatures.length > 0) {
      upzFeatures.forEach((f) => {
        const code = String(f.properties.UPlCodigo);
        const name = String(f.properties.UPlNombre);
        if (!map.has(code)) map.set(code, name);
      });
    } else {
      // Fallback: usamos las UPZ mock definidas en socialZones
      socialZones.forEach((z) => {
        if (z.upzCode && z.upzName && !map.has(z.upzCode)) {
          map.set(z.upzCode, z.upzName);
        }
      });
    }

    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
  }, [upzFeatures]);

  // Función auxiliar: encuentra los indicadores sociales de mockData para una UPZ del GeoJSON
  const getIndicatorsForUpz = (feature) => {
    if (!feature) return null;
    const upzName = String(feature.properties.UPlNombre || '').toUpperCase();
    return (
      socialZones.find(
        (z) => z.upzName && z.upzName.toUpperCase() === upzName
      ) || null
    );
  };

  const filteredInstitutions = useMemo(() => {
    // Por ahora filtramos instituciones por código de UPZ del dataset de salud (UPlCodigo)
    return institutions.filter(
      (inst) => selectedUpz === 'all' || String(inst.upzCode) === String(selectedUpz)
    );
  }, [selectedUpz]);

  const groupedInstitutions = useMemo(() => {
    const groups = {};
    filteredInstitutions.forEach((inst) => {
      if (!groups[inst.type]) groups[inst.type] = [];
      groups[inst.type].push(inst);
    });
    return groups;
  }, [filteredInstitutions]);

  const upzColorMap = useMemo(() => {
    // Paleta con 12 colores suaves y distintos para cada UPZ
    const palette = [
      '#fecaca', // rosa suave
      '#fed7aa', // naranja suave
      '#fef08a', // amarillo suave
      '#bbf7d0', // verde menta
      '#bfdbfe', // azul claro
      '#e9d5ff', // lila
      '#fbcfe8', // rosado pastel
      '#fde68a', // ámbar suave
      '#a5f3fc', // cian suave
      '#ddd6fe', // violeta claro
      '#fee2e2', // rojo muy claro
      '#dcfce7', // verde claro
    ];

    const map = new Map();
    socialZones.forEach((zone, index) => {
      const code = String(zone.upzCode);
      if (!map.has(code)) {
        map.set(code, palette[index % palette.length]);
      }
    });
    return map;
  }, []);

  const upzCentroids = useMemo(() => {
    if (!upzFeatures || upzFeatures.length === 0) return [];
    return upzFeatures.map((feature) => {
      const center = L.geoJSON(feature).getBounds().getCenter();
      return {
        code: String(feature.properties.UPlCodigo),
        name: String(feature.properties.UPlNombre),
        lat: center.lat,
        lng: center.lng,
      };
    });
  }, [upzFeatures]);

  return (
    <div className="layout-root">
      {/* Panel lateral de información */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div>
            <div className="sidebar-chip">Mapa social</div>
            <div className="sidebar-title">Caracterización Social - Kennedy</div>
            <div className="sidebar-subtitle">
              Pobreza, empleo y presencia institucional por UPZ.
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <label className="sidebar-select-label" htmlFor="upz-select">
            Filtrar por UPZ
          </label>
          <select
            id="upz-select"
            className="sidebar-select"
            value={selectedUpz}
            onChange={(e) => {
              setSelectedFeature(null);
              setSelectedUpz(e.target.value);
            }}
          >
            <option value="all">Todas las UPZ de Kennedy</option>
            {upzOptions.map((u) => (
              <option key={u.code} value={u.code}>
                {u.code} - {u.name}
              </option>
            ))}
          </select>
          <p className="sidebar-description">
            Usa el filtro para comparar desigualdades territoriales entre las UPZ de la localidad.
          </p>
        </div>

        {selectedFeature ? (
          <div className="sidebar-section">
            <div className="sidebar-metrics-title">Detalle del territorio / institución</div>
            <h3 style={{ margin: '4px 0 6px', fontSize: '1rem' }}>{selectedFeature.name}</h3>
            {selectedFeature.estrato && (
              <p style={{ margin: 0 }}>
                <strong>Estrato predominante:</strong> {selectedFeature.estrato}
              </p>
            )}
            {selectedFeature.type && (
              <p style={{ margin: 0 }}>
                <strong>Tipo de institución:</strong> {selectedFeature.type}
              </p>
            )}
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', marginTop: '0.6rem' }}>
              <li>
                <span className="metric-label">Empleo formal:</span>{' '}
                {formatPercent(selectedFeature.empleoFormal)}
              </li>
              <li>
                <span className="metric-label">Empleo informal:</span>{' '}
                {formatPercent(selectedFeature.empleoInformal)}
              </li>
              <li>
                <span className="metric-label">Tasa de desempleo:</span>{' '}
                {formatPercent(selectedFeature.tasaDesempleo)}
              </li>
              <li>
                <span className="metric-label">Pobreza multidimensional:</span>{' '}
                {formatPercent(selectedFeature.pobrezaMultidimensional)}{' '}
                <span style={{ fontSize: '0.8rem', color: '#777' }}>(DANE)</span>
              </li>
              <li>
                <span className="metric-label">Pobreza monetaria:</span>{' '}
                {formatPercent(selectedFeature.pobrezaMonetaria)}{' '}
                <span style={{ fontSize: '0.8rem', color: '#777' }}>(DANE)</span>
              </li>
            </ul>
            <p className="metric-source">
              <strong>Fuente:</strong> {selectedFeature.fuente}
            </p>
            <p className="metric-note">
              NOTA: Los valores actuales son datos mock. Reemplázalos por las cifras oficiales del
              DANE y de las entidades locales que tengas en tus notas.
            </p>
          </div>
        ) : (
          <div className="sidebar-section" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', paddingRight: '8px' }}>
            <div className="sidebar-metrics-title">Contexto Demográfico y Social</div>

            <h4 style={{ margin: '10px 0 4px', fontSize: '0.95rem' }}>Perfil Poblacional</h4>
            <p style={{ margin: '0 0 10px', fontSize: '0.85rem' }}>
              Población total: <strong>{kennedySummary.poblacion}</strong><br />
              {kennedySummary.piramidePoblacional}
            </p>

            <h4 style={{ margin: '14px 0 4px', fontSize: '0.95rem' }}>Salud y Mortalidad</h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', margin: '0 0 10px' }}>
              {kennedySummary.mortalidad.map((causa, i) => <li key={i}>{causa}</li>)}
            </ul>

            <h4 style={{ margin: '14px 0 4px', fontSize: '0.95rem' }}>Pobreza y Desigualdad</h4>
            <div style={{ fontSize: '0.85rem', marginBottom: '10px' }}>
              <p style={{ margin: '0 0 4px' }}><strong>Índice de Gini (Bogotá):</strong> {kennedySummary.gini}</p>
              <p style={{ margin: '0 0 4px' }}><strong>Estratos:</strong> 1 ({kennedySummary.estrato1}), 0 ({kennedySummary.estrato0})</p>
              <strong>Clasificación Sisbén:</strong>
              <ul style={{ paddingLeft: '1.2rem', margin: '4px 0' }}>
                <li>Grupo A (Extrema): {kennedySummary.sisben.grupoA.personas} ({kennedySummary.sisben.grupoA.porcentaje})</li>
                <li>Grupo B (Moderada): {kennedySummary.sisben.grupoB.personas} ({kennedySummary.sisben.grupoB.porcentaje})</li>
                <li>Grupo C (Vulnerabilidad): {kennedySummary.sisben.grupoC.personas} ({kennedySummary.sisben.grupoC.porcentaje})</li>
                <li>Grupo D (No pobres): {kennedySummary.sisben.grupoD.porcentaje}</li>
              </ul>
            </div>

            <h4 style={{ margin: '14px 0 4px', fontSize: '0.95rem' }}>Inclusión Laboral y Jóvenes</h4>
            <div style={{ fontSize: '0.85rem', marginBottom: '10px' }}>
              <p style={{ margin: '0 0 4px' }}><strong>Desempleo:</strong> {kennedySummary.desempleoKennnedy} (vs {kennedySummary.desempleoBogota} Bogotá)</p>
              <p style={{ margin: '0 0 4px' }}><strong>Informalidad local:</strong> {kennedySummary.informalidadLocal}</p>
              <strong>Jóvenes 18-28 años:</strong>
              <ul style={{ paddingLeft: '1.2rem', margin: '4px 0' }}>
                <li>Educación media: {kennedySummary.jovenes18_28.educacionMedia}</li>
                <li>Educación universitaria: {kennedySummary.jovenes18_28.formacionUniversitaria}</li>
                <li>Informalidad (sin pensión): {kennedySummary.jovenes18_28.informalidadNoPension}</li>
              </ul>
            </div>

            <div className="sidebar-metrics-title" style={{ marginTop: '1.5rem' }}>Cómo leer este mapa</div>
            <p style={{ fontSize: '0.85rem' }}>
              Explora la relación entre pobreza multidimensional, empleo y presencia institucional.
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              La escala de color va de <strong>verde</strong> (menor vulnerabilidad) a{' '}
              <strong>rojo</strong> (mayor vulnerabilidad), basada en pobreza multidimensional.
            </p>
          </div>
        )}
      </aside>

      {/* Contenedor del mapa */}
      <div className="map-shell">
        <MapContainer
          center={[kennedyCenter.lat, kennedyCenter.lng]}
          zoom={kennedyCenter.zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <FitToSelection selectedUpz={selectedUpz} upzFeatures={upzFeatures || []} />
          <ZoomWatcher onZoomChange={setZoomLevel} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LayersControl position="topright">
            {/* Área general de la localidad cuando se ve todo */}
            {upzFeatures && selectedUpz === 'all' && (
              <GeoJSON
                data={{ type: 'FeatureCollection', features: upzFeatures }}
                style={{
                  color: 'rgba(15, 23, 42, 0.85)',
                  weight: 2,
                  fillColor: 'rgba(15, 23, 42, 0.08)',
                  fillOpacity: 0.08,
                }}
                pane="overlayPane"
                interactive={false}
              />
            )}

            {/* Capa 1: Cartografía Social (UPZ con límites reales) */}
            <LayersControl.Overlay checked name="Cartografía Social (UPZ Kennedy)">
              <LayerGroup>
                {upzFeatures && (
                  <GeoJSON
                    data={{
                      type: 'FeatureCollection',
                      features: upzFeatures,
                    }}
                    style={(feature) => {
                      const indicators = getIndicatorsForUpz(feature);
                      const code = String(feature.properties.UPlCodigo);
                      const fillColor =
                        upzColorMap.get(code) ||
                        getZoneColor(
                          (indicators && indicators.pobrezaMultidimensional) || 0.25
                        );

                      const baseStyle = {
                        color: 'rgba(15, 23, 42, 0.55)',
                        weight: 1.2,
                        fillColor,
                        fillOpacity: 0.45,
                      };
                      const isSelected =
                        selectedUpz !== 'all' &&
                        String(feature.properties.UPlCodigo) === String(selectedUpz);

                      return {
                        ...baseStyle,
                        weight: isSelected ? 3 : baseStyle.weight,
                        color: isSelected ? '#1e293b' : baseStyle.color,
                        fillOpacity: isSelected ? 0.7 : baseStyle.fillOpacity,
                      };
                    }}
                    onEachFeature={(feature, layer) => {
                      const indicators = getIndicatorsForUpz(feature);
                      if (!indicators) return;

                      layer.on('click', () => {
                        setSelectedUpz(String(feature.properties.UPlCodigo));
                        setSelectedFeature({
                          ...indicators,
                          name: `UPZ ${feature.properties.UPlCodigo} - ${indicators.upzName}`,
                        });
                      });

                      layer.bindPopup(() => {
                        const zone = indicators;
                        return (
                          `<div style="font-size:0.85rem;">
                            <strong>${zone.name}</strong><br />
                            Estrato predominante: ${zone.estrato}<br />
                            Empleo formal: ${formatPercent(zone.empleoFormal)}<br />
                            Empleo informal: ${formatPercent(zone.empleoInformal)}<br />
                            Tasa de desempleo: ${formatPercent(zone.tasaDesempleo)}<br />
                            Pobreza multidimensional: ${formatPercent(
                            zone.pobrezaMultidimensional
                          )} (DANE)<br />
                            Pobreza monetaria: ${formatPercent(
                            zone.pobrezaMonetaria
                          )} (DANE)<br />
                            <small>Fuente: ${zone.fuente}</small>
                          </div>`
                        );
                      });
                    }}
                  />
                )}
              </LayerGroup>
            </LayersControl.Overlay>

            {/* Etiquetas con el nombre de cada UPZ */}
            {upzCentroids.length > 0 && zoomLevel >= 12 && (
              <LayersControl.Overlay checked name="Nombres de UPZ">
                <LayerGroup>
                  {upzCentroids.map((item) => {
                    const isSelected =
                      selectedUpz !== 'all' && String(item.code) === String(selectedUpz);
                    return (
                      <Marker
                        key={item.code}
                        position={[item.lat, item.lng]}
                        icon={createUpzLabelIcon(item.name, isSelected, zoomLevel)}
                        interactive={false}
                      />
                    );
                  })}
                </LayerGroup>
              </LayersControl.Overlay>
            )}

            {/* Capa 2: Instituciones, separadas por tipo */}
            {Object.entries(groupedInstitutions).map(([type, items]) => (
              <LayersControl.Overlay key={type} checked name={`Instituciones - ${type}`}>
                <LayerGroup>
                  {items.map((inst) => (
                    <Marker
                      key={inst.id}
                      position={[inst.lat, inst.lng]}
                      icon={iconsByType[inst.type] || iconsByType['Empleo']}
                      eventHandlers={{
                        click: () => setSelectedFeature(inst),
                      }}
                    >
                      <Popup>
                        <div style={{ fontSize: '0.85rem' }}>
                          <strong>{inst.name}</strong>
                          <br />
                          Tipo: {inst.type}
                          <br />
                          Empleo formal: {formatPercent(inst.empleoFormal)} <br />
                          Empleo informal: {formatPercent(inst.empleoInformal)} <br />
                          Tasa de desempleo: {formatPercent(inst.tasaDesempleo)} <br />
                          Pobreza multidimensional: {formatPercent(inst.pobrezaMultidimensional)}{' '}
                          (DANE) <br />
                          Pobreza monetaria: {formatPercent(inst.pobrezaMonetaria)} (DANE)
                          <br />
                          <small>Fuente: {inst.fuente}</small>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            ))}
          </LayersControl>

          {/* Leyenda tipo heatmap */}
          <MapLegend />
        </MapContainer>
      </div>
    </div>
  );
};

// Leyenda de colores para desigualdad / pobreza multidimensional
const MapLegend = () => {
  const grades = [0, 0.1, 0.2, 0.3, 0.4];

  const getLabel = (from, to) => {
    const fromPct = Math.round(from * 100);
    const toPct = to !== undefined ? Math.round(to * 100) : null;

    if (toPct === null) return `≥ ${fromPct}%`;
    return `${fromPct}% – ${toPct}%`;
  };

  return (
    <div className="legend-card">
      <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
        Pobreza multidimensional (DANE)
      </div>
      {grades.map((from, i) => {
        const to = grades[i + 1];
        return (
          <div key={from} className="legend-row">
            <span
              className="legend-swatch"
              style={{ background: getZoneColor(from + 0.001) }}
            />
            <span>{getLabel(from, to)}</span>
          </div>
        );
      })}
      <div className="legend-caption">
        <strong>Rojo</strong>: mayor vulnerabilidad <br />
        <strong>Verde</strong>: mayor estabilidad económica
      </div>
    </div>
  );
};