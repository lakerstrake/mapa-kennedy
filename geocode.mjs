import { institutions } from './src/mockData.js';
import fs from 'fs';

async function geocode() {
    const results = [];
    console.log("Starting geocoding...");
    for (const inst of institutions) {
        try {
            // try precise queries that work better with OSM
            const searchTerms = [
                `${inst.name} Bogota`,
                `${inst.name.split('–')[0].trim()} Bogota`,
                `${inst.address.split('(')[0].split(',')[0].trim()} Bogota Kennedy`
            ];

            let found = false;
            for (const term of searchTerms) {
                if (found) break;
                const q = encodeURIComponent(term);
                const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;
                const res = await fetch(url, { headers: { 'User-Agent': 'AppScript/1.0 (test@example.com)' } });
                const data = await res.json();

                if (data && data.length > 0) {
                    results.push({
                        id: inst.id,
                        name: inst.name,
                        address: inst.address,
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon),
                        queryUsed: term
                    });
                    console.log(`✅ Found [${inst.id}] with query: "${term}" -> ${data[0].lat}, ${data[0].lon}`);
                    found = true;
                }
                await new Promise(r => setTimeout(r, 1100)); // Rate limit 1 req/sec
            }

            if (!found) {
                console.log(`❌ Not Found: [${inst.id}] with any query.`);
            }

        } catch (err) {
            console.error(`Error processing ${inst.id}:`, err.message);
        }
    }
    fs.writeFileSync('geocoded.json', JSON.stringify(results, null, 2));
    console.log("Geocoding complete. Results saved to geocoded.json");
}
geocode();
