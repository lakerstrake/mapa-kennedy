// src/mockData.js

// IMPORTANTE:
// - Todas las coordenadas son APROXIMADAS para demo.
// - Reemplaza lat/lng por coordenadas exactas de tus fuentes.
// - Reemplaza cifras de empleo, desempleo y pobreza por los datos del DANE que tienes en tus notas.

export const kennedyCenter = {
  lat: 4.626, // Centro aproximado de Kennedy, Bogotá
  lng: -74.157,
  zoom: 13,
};

// Indicadores de cartografía social por UPZ (sin geometría).
// La geometría real de las UPZ viene del archivo saludupz.geojson (cuando esté disponible).
export const socialZones = [
  {
    id: 'upz-78-kennedy-central',
    name: 'UPZ 78 - Kennedy Central',
    upzCode: 'UPZ78',
    upzName: 'KENNEDY CENTRAL',
    estrato: '2-3',
    pobrezaMultidimensional: 0.32,
    pobrezaMonetaria: 0.27,
    empleoFormal: 0.42,
    empleoInformal: 0.58,
    tasaDesempleo: 0.15,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-79-americas',
    name: 'UPZ 79 - Américas',
    upzCode: 'UPZ79',
    upzName: 'AMERICAS',
    estrato: '2-3',
    pobrezaMultidimensional: 0.27,
    pobrezaMonetaria: 0.21,
    empleoFormal: 0.47,
    empleoInformal: 0.53,
    tasaDesempleo: 0.12,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-80-carvajal',
    name: 'UPZ 80 - Carvajal',
    upzCode: 'UPZ80',
    upzName: 'CARVAJAL',
    estrato: '2-3',
    pobrezaMultidimensional: 0.34,
    pobrezaMonetaria: 0.28,
    empleoFormal: 0.41,
    empleoInformal: 0.59,
    tasaDesempleo: 0.15,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-81-bavaria',
    name: 'UPZ 81 - Bavaria',
    upzCode: 'UPZ81',
    upzName: 'BAVARIA',
    estrato: '3',
    pobrezaMultidimensional: 0.22,
    pobrezaMonetaria: 0.17,
    empleoFormal: 0.56,
    empleoInformal: 0.44,
    tasaDesempleo: 0.1,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-82-patio-bonito',
    name: 'UPZ 82 - Patio Bonito',
    upzCode: 'UPZ82',
    upzName: 'PATIO BONITO',
    estrato: '1-2',
    pobrezaMultidimensional: 0.44,
    pobrezaMonetaria: 0.36,
    empleoFormal: 0.28,
    empleoInformal: 0.72,
    tasaDesempleo: 0.18,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-83-tintal-norte',
    name: 'UPZ 83 - Tintal Norte',
    upzCode: 'UPZ83',
    upzName: 'TINTAL NORTE',
    estrato: '2-3',
    pobrezaMultidimensional: 0.31,
    pobrezaMonetaria: 0.25,
    empleoFormal: 0.43,
    empleoInformal: 0.57,
    tasaDesempleo: 0.14,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-113-calandaima',
    name: 'UPZ 113 - Calandaima',
    upzCode: 'UPZ113',
    upzName: 'CALANDAIMA',
    estrato: '2',
    pobrezaMultidimensional: 0.29,
    pobrezaMonetaria: 0.23,
    empleoFormal: 0.41,
    empleoInformal: 0.59,
    tasaDesempleo: 0.13,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-45-corabastos',
    name: 'UPZ 45 - Corabastos',
    upzCode: 'UPZ45',
    upzName: 'CORABASTOS',
    estrato: '2',
    pobrezaMultidimensional: 0.38,
    pobrezaMonetaria: 0.32,
    empleoFormal: 0.35,
    empleoInformal: 0.65,
    tasaDesempleo: 0.17,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-46-castilla',
    name: 'UPZ 46 - Castilla',
    upzCode: 'UPZ46',
    upzName: 'CASTILLA',
    estrato: '2-3',
    pobrezaMultidimensional: 0.26,
    pobrezaMonetaria: 0.20,
    empleoFormal: 0.50,
    empleoInformal: 0.50,
    tasaDesempleo: 0.11,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-47-timiza',
    name: 'UPZ 47 - Timiza',
    upzCode: 'UPZ47',
    upzName: 'TIMIZA',
    estrato: '2-3',
    pobrezaMultidimensional: 0.29,
    pobrezaMonetaria: 0.23,
    empleoFormal: 0.46,
    empleoInformal: 0.54,
    tasaDesempleo: 0.13,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-108-gran-britalia',
    name: 'UPZ 108 - Gran Britalia',
    upzCode: 'UPZ108',
    upzName: 'GRAN BRITALIA',
    estrato: '2',
    pobrezaMultidimensional: 0.33,
    pobrezaMonetaria: 0.27,
    empleoFormal: 0.38,
    empleoInformal: 0.62,
    tasaDesempleo: 0.16,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
  {
    id: 'upz-116-margaritas',
    name: 'UPZ 116 - Margaritas',
    upzCode: 'UPZ116',
    upzName: 'LAS MARGARITAS',
    estrato: '2',
    pobrezaMultidimensional: 0.3,
    pobrezaMonetaria: 0.24,
    empleoFormal: 0.4,
    empleoInformal: 0.6,
    tasaDesempleo: 0.14,
    fuente: 'DANE (mock, reemplazar por datos oficiales)',
  },
];

// Resumen General Demográfico y Social de la Localidad de Kennedy
export const kennedySummary = {
  poblacion: "1.037.929 habitantes",
  estrato1: "1,3%",
  estrato0: "11%",
  piramidePoblacional: "Predomina población entre 25-39 años. Incremento esperanza vida (>75), baja natalidad.",
  mortalidad: ["Enfermedades isquémicas del corazón", "Enfermedades respiratorias crónicas", "Cerebrovasculares y neoplasias"],
  gini: "0,530",
  sisben: {
    grupoA: { personas: "28.375", porcentaje: "6,0%" },
    grupoB: { personas: "128.499", porcentaje: "27,1%" },
    grupoC: { personas: "221.193", porcentaje: "46,7%" },
    grupoD: { porcentaje: "20,2%" }
  },
  jovenes18_28: {
    educacionMedia: "44,1%",
    formacionUniversitaria: "21,3%",
    informalidadNoPension: "63,3%"
  },
  desempleoKennnedy: "16,5%",
  desempleoBogota: "8,5% - 9,7%",
  ocupacionJuvenil: {
    ocupados: "57,2%",
    buscandoEmpleo: "10,6%",
    inactividad: "19,1% (estudiantes), 8,6% (hogar)"
  },
  informalidadLocal: "39,9%"
};

// Instituciones en Kennedy (coordenadas aproximadas)
// Ajustadas según el directorio de servicios aportado.
export const institutions = [
  // Empleabilidad
  {
    id: 'agencia-compensar',
    name: 'Agencia de Empleo Compensar',
    type: 'Empleo',
    upzCode: 'UPZ78', // Kennedy Central (Calle 40 Sur # 73D-23)
    lat: 4.629,
    lng: -74.155,
    empleoFormal: 0.8,
    empleoInformal: 0.2,
    tasaDesempleo: 0.1,
    pobrezaMultidimensional: 0.25,
    pobrezaMonetaria: 0.18,
    fuente: 'Directorio de Servicios',
  },
  {
    id: 'agencia-sena',
    name: 'Agencia Pública de Empleo SENA',
    type: 'Empleo',
    upzCode: 'UPZ79', // Américas (Tranversal 79 # 41D-15 Sur)
    lat: 4.627,
    lng: -74.162,
    empleoFormal: 0.75,
    empleoInformal: 0.25,
    tasaDesempleo: 0.12,
    pobrezaMultidimensional: 0.27,
    pobrezaMonetaria: 0.20,
    fuente: 'Directorio de Servicios',
  },
  {
    id: 'cdc-bellavista',
    name: 'CDC Bellavista (Formación Empleo)',
    type: 'Empleo',
    upzCode: 'UPZ82', // Patio Bonito (Calle 38 Sur # 94C-29)
    lat: 4.640,
    lng: -74.175,
    empleoFormal: 0.5,
    empleoInformal: 0.5,
    tasaDesempleo: 0.15,
    pobrezaMultidimensional: 0.35,
    pobrezaMonetaria: 0.28,
    fuente: 'Directorio de Servicios',
  },
  {
    id: 'cdc-kennedy',
    name: 'CDC Kennedy',
    type: 'Empleo',
    upzCode: 'UPZ45', // Corabastos (Av. Carrera 80 # 43-43 Sur)
    lat: 4.623,
    lng: -74.165,
    empleoFormal: 0.55,
    empleoInformal: 0.45,
    tasaDesempleo: 0.14,
    pobrezaMultidimensional: 0.33,
    pobrezaMonetaria: 0.26,
    fuente: 'Directorio de Servicios',
  },
  {
    id: 'supercade-americas',
    name: 'SuperCADE Américas',
    type: 'SuperCADE',
    upzCode: 'UPZ79', // Américas (Av. Carrera 86 # 43-55 Sur)
    lat: 4.630,
    lng: -74.168,
    empleoFormal: 0.8,
    empleoInformal: 0.2,
    tasaDesempleo: 0.1,
    pobrezaMultidimensional: 0.24,
    pobrezaMonetaria: 0.17,
    fuente: 'Directorio de Servicios',
  },
  {
    id: 'cade-kennedy',
    name: 'CADE Kennedy',
    type: 'SuperCADE',
    upzCode: 'UPZ78', // Kennedy Central (Carrera 78K # 36-55 Sur)
    lat: 4.632,
    lng: -74.158,
    empleoFormal: 0.78,
    empleoInformal: 0.22,
    tasaDesempleo: 0.11,
    pobrezaMultidimensional: 0.26,
    pobrezaMonetaria: 0.19,
    fuente: 'Directorio de Servicios',
  },
  // Salud
  {
    id: 'hospital-occidente',
    name: 'Hospital Occidente de Kennedy',
    type: 'Salud',
    upzCode: 'UPZ78', // Kennedy Central (Transversal 74F # 40B-54 Sur)
    lat: 4.628,
    lng: -74.154,
    empleoFormal: 0.9,
    empleoInformal: 0.1,
    tasaDesempleo: 0.05,
    pobrezaMultidimensional: 0.30,
    pobrezaMonetaria: 0.22,
    fuente: 'Directorio de Servicios',
  },
  {
    id: 'cs-mexicana',
    name: 'Centro de Salud Mexicana',
    type: 'Salud',
    upzCode: 'UPZ46', // Castilla (Calle 39 Sur # 89C-12)
    lat: 4.637,
    lng: -74.172,
    empleoFormal: 0.65,
    empleoInformal: 0.35,
    tasaDesempleo: 0.12,
    pobrezaMultidimensional: 0.29,
    pobrezaMonetaria: 0.23,
    fuente: 'Directorio de Servicios',
  },
  {
    id: 'cs-britalia',
    name: 'Centro de Salud Britalia',
    type: 'Salud',
    upzCode: 'UPZ108', // Gran Britalia (Carrera 81C # 48-25 Sur)
    lat: 4.615,
    lng: -74.164,
    empleoFormal: 0.60,
    empleoInformal: 0.40,
    tasaDesempleo: 0.13,
    pobrezaMultidimensional: 0.32,
    pobrezaMonetaria: 0.26,
    fuente: 'Directorio de Servicios',
  },
  // Instituciones Administrativas
  {
    id: 'sdis-local',
    name: 'Sec. Integración Social (Subdirección Local)',
    type: 'Integración Social',
    upzCode: 'UPZ82', // Patio Bonito (Calle 38 Sur # 94C-29) - Comparte sede con CDC Bellavista
    lat: 4.640,
    lng: -74.174,
    empleoFormal: 0.85,
    empleoInformal: 0.15,
    tasaDesempleo: 0.08,
    pobrezaMultidimensional: 0.35,
    pobrezaMonetaria: 0.28,
    fuente: 'Directorio de Servicios',
  },
  {
    id: 'sec-educacion-cadel',
    name: 'CADEL (Sec. Educación)',
    type: 'Educación',
    upzCode: 'UPZ78', // Kennedy Central (Carrera 78J # 38B Sur-70)
    lat: 4.631,
    lng: -74.159,
    empleoFormal: 0.8,
    empleoInformal: 0.2,
    tasaDesempleo: 0.09,
    pobrezaMultidimensional: 0.27,
    pobrezaMonetaria: 0.20,
    fuente: 'Directorio de Servicios',
  },
  {
    id: 'alcaldia-local',
    name: 'Alcaldía Local de Kennedy',
    type: 'Administración',
    upzCode: 'UPZ78', // Kennedy Central (Transversal 78K # 41A-04 Sur)
    lat: 4.629,
    lng: -74.159,
    empleoFormal: 0.85,
    empleoInformal: 0.15,
    tasaDesempleo: 0.07,
    pobrezaMultidimensional: 0.25,
    pobrezaMonetaria: 0.18,
    fuente: 'Directorio de Servicios',
  },
];

// Función de color tipo "heatmap":
// Rojo = mayor vulnerabilidad, Verde = mayor estabilidad.
export const getZoneColor = (pobrezaMultidimensional) => {
  // Paleta suave pero expresiva para lectura social:
  //  - rojo profundo: mayor vulnerabilidad
  //  - naranjas / amarillos: transición
  //  - verdes: mayor estabilidad
  if (pobrezaMultidimensional >= 0.4) return '#b91c1c'; // rojo intenso
  if (pobrezaMultidimensional >= 0.3) return '#f97316'; // naranja
  if (pobrezaMultidimensional >= 0.2) return '#facc15'; // amarillo
  if (pobrezaMultidimensional >= 0.1) return '#4ade80'; // verde claro
  return '#16a34a'; // verde (menor vulnerabilidad)
};

// Estilo base de polígonos
export const getZoneStyle = (featureProperties) => {
  const color = getZoneColor(featureProperties.pobrezaMultidimensional);
  return {
    color: 'rgba(15, 23, 42, 0.55)',
    weight: 1.2,
    fillColor: color,
    fillOpacity: 0.45, // transparencia por defecto
  };
};