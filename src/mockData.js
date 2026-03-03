// src/mockData.js
// Indicadores socioeconómicos por UPZ de la Localidad No. 8 – Kennedy, Bogotá D.C.
// Fuente principal: SDP – Diagnóstico Local Kennedy 2024 (sdp.gov.co)
// Coordinadas geográficas corregidas mediante interpolación matemática de la cuadrícula urbana (Anclas: Portal Américas y Corabastos).

export const kennedyCenter = {
  lat: 4.626, // Centro de la Localidad Kennedy
  lng: -74.157,
  zoom: 13,
};

// Indicadores de cartografía social por UPZ (sin geometría).
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
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
    fuente: 'SDP – Diagnóstico Local Kennedy 2024 | sdp.gov.co',
  },
];

export const kennedySummary = {
  poblacion: "1.037.929 habitantes (proyección 2024)",
  extension: "3.859 ha | Área urbana: 98,1% | Área rural: 1,8%",
  upzCount: "12 zonas de planeamiento zonal",
  gini: "0,530 — alta concentración de riqueza (DANE 2023)",
  sisben: {
    total: "474.049 personas",
    grupoA: { personas: "28.375", porcentaje: "6,0%" },
    grupoB: { personas: "128.499", porcentaje: "27,1%" },
    grupoC: { personas: "221.193", porcentaje: "46,7%" },
    grupoD: { personas: "96.082", porcentaje: "20,2%" }
  },
  pobrezaBogota: {
    moderada: "23,7%",
    extrema: "5,5%",
    multidimensional: "3,6% (IPM)"
  },
  jovenes18_28: {
    informalidad: "63,3% NO cotiza a pensión",
    universitaria: "21,3%",
    media: "44,1% (bachillerato)"
  },
  seguridadAlimentaria: {
    bajoPesoGestantes: "10,9%",
    excesoPesoGestantes: "50,6% (supera promedio distrital)",
    retrasoTallaMenores5: "13,5%"
  }
};

export const institutions = [

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. PUNTOS DE ATENCIÓN AL CIUDADANO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'cade-kennedy',
    name: 'CADE Kennedy',
    type: 'SuperCADE',
    upzCode: 'UPZ47',
    address: 'Calle 36 Bis Sur No. 78K-40',
    phone: '195 (Bogotá Responde)',
    hours: 'Lunes a viernes 7:30 a.m. a 4:00 p.m.',
    services: 'Trámites distritales, Registro Civil, Movilidad, Sisbén (SDP).',
    web: 'bogota.gov.co/servicios/cades',
    lat: 4.640,
    lng: -74.153,
    color: '#2563eb'
  },
  {
    id: 'supercade-americas',
    name: 'SuperCADE Américas',
    type: 'SuperCADE',
    upzCode: 'UPZ79',
    address: 'Avenida Carrera 86 No. 43-55 Sur, junto al Portal Américas',
    phone: '195 (Bogotá Responde)',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m. | Sábados 8:00 m.',
    services: 'Más de 200 trámites distritales, SENA Empleo, ICBF.',
    web: 'bogota.gov.co/servicios/cades/supercade-americas',
    lat: 4.6048,
    lng: -74.1728,
    color: '#2563eb'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. CENTROS DE ATENCIÓN EN SALUD
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'hospital-occidente-kennedy',
    name: 'Hospital Occidente de Kennedy E.S.E. (Nivel III)',
    type: 'Salud',
    upzCode: 'UPZ47',
    address: 'Transversal 74F No. 40B-54 Sur (Av. 1° de Mayo)',
    phone: '(601) 384 91 60 | Urgencias: (601) 379 51 80',
    hours: 'Urgencias: 24 horas',
    services: 'Urgencias, UCI adultos y neonatal, Cirugía compleja.',
    web: 'subredsuroccidente.gov.co',
    lat: 4.6175,
    lng: -74.144,
    color: '#dc2626'
  },
  {
    id: 'hospital-pediatrico-tintal',
    name: 'Hospital Pediátrico El Tintal',
    type: 'Salud',
    upzCode: 'UPZ80',
    address: 'Avenida Ciudad de Cali No. 10A-45',
    phone: '(601) 448 00 30',
    hours: 'Urgencias: 24 horas',
    services: 'Pediatría, Urgencias pediátricas, Hospitalización.',
    web: 'subredsuroccidente.gov.co',
    lat: 4.6450,
    lng: -74.1600,
    color: '#dc2626'
  },
  {
    id: 'caps-patio-bonito',
    name: 'CAPS / USS Patio Bonito',
    type: 'Salud',
    upzCode: 'UPZ82',
    address: 'Calle 38 Sur No. 87-07',
    phone: '(601) 448 00 30',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Medicina General, Vacunación, Odontología.',
    web: 'subredsuroccidente.gov.co',
    lat: 4.630,
    lng: -74.1755,
    color: '#dc2626'
  },
  {
    id: 'caps-britalia',
    name: 'CAPS / USS Britalia',
    type: 'Salud',
    upzCode: 'UPZ81',
    address: 'Calle 46A Sur No. 81-19',
    phone: '(601) 448 00 30',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Medicina General, Odontología, Vacunación.',
    web: 'subredsuroccidente.gov.co',
    lat: 4.587,
    lng: -74.1605,
    color: '#dc2626'
  },
  {
    id: 'uss-bellavista',
    name: 'USS Bellavista',
    type: 'Salud',
    upzCode: 'UPZ82',
    address: 'Calle 38 Sur No. 94C-29',
    phone: '(601) 448 00 30',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Medicina General, Vacunación, Odontología.',
    web: 'subredsuroccidente.gov.co',
    lat: 4.630,
    lng: -74.193,
    color: '#dc2626'
  },
  {
    id: 'uss-pio-xii',
    name: 'USS Pío XII',
    type: 'Salud',
    upzCode: 'UPZ44',
    address: 'Calle 30A Sur No. 78-65',
    phone: '(601) 448 00 30',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Medicina General, Vacunación, Odontología.',
    web: 'subredsuroccidente.gov.co',
    lat: 4.6675,
    lng: -74.153,
    color: '#dc2626'
  },
  {
    id: 'uss-bomberos',
    name: 'USS Bomberos',
    type: 'Salud',
    upzCode: 'UPZ47',
    address: 'Calle 38 Sur No. 73-41',
    phone: '(601) 448 00 30',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Medicina General, Vacunación, Enfermería.',
    web: 'subredsuroccidente.gov.co',
    lat: 4.630,
    lng: -74.1405,
    color: '#dc2626'
  },
  {
    id: 'uss-abastos',
    name: 'USS Abastos',
    type: 'Salud',
    upzCode: 'UPZ80',
    address: 'Calle 38 Sur No. 82-45',
    phone: '(601) 448 00 30',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Medicina General, Vacunación, Odontología.',
    web: 'subredsuroccidente.gov.co',
    lat: 4.630,
    lng: -74.163,
    color: '#dc2626'
  },
  {
    id: 'uss-dindalito',
    name: 'USS Dindalito',
    type: 'Salud',
    upzCode: 'UPZ82',
    address: 'Calle 42A Sur No. 90-85',
    phone: '(601) 448 00 30',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Medicina General, Vacunación, Control prenatal.',
    web: 'subredsuroccidente.gov.co',
    lat: 4.6075,
    lng: -74.183,
    color: '#dc2626'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. SEGURIDAD Y CONVIVENCIA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'alcaldia-local-kennedy',
    name: 'Alcaldía Local de Kennedy',
    type: 'Administración',
    upzCode: 'UPZ47',
    address: 'Transversal 78K No. 41A-04 Sur',
    phone: '(601) 382 06 60',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Despacho del Alcalde Local, Participación Ciudadana.',
    web: 'kennedy.gov.co',
    lat: 4.6125,
    lng: -74.154,
    color: '#f97316'
  },
  {
    id: 'casa-justicia-kennedy',
    name: 'Casa de Justicia de Kennedy',
    type: 'Administración',
    upzCode: 'UPZ47',
    address: 'Avenida 1 de Mayo No. 38C-51 Sur',
    phone: '(601) 448 14 00 ext. 8200',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Fiscalía, ICBF, Secretaría de la Mujer, mediación.',
    web: 'bogota.gov.co',
    lat: 4.6275,
    lng: -74.144,
    color: '#f97316'
  },
  {
    id: 'jal-kennedy',
    name: 'Junta Administradora Local (JAL)',
    type: 'Administración',
    upzCode: 'UPZ47',
    address: 'Transversal 78K No. 41A-04 Sur',
    phone: '(601) 448 14 00',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Representación comunitaria y debate de presupuesto.',
    web: 'kennedy.gov.co',
    lat: 4.6125,
    lng: -74.154,
    color: '#f97316'
  },
  {
    id: 'comisaria-familia-1',
    name: 'Comisaría de Familia 1 Kennedy',
    type: 'Administración',
    upzCode: 'UPZ47',
    address: 'Calle 35 Sur No. 73-35',
    phone: '(601) 448 14 00',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Protección a víctimas de violencia intrafamiliar.',
    web: 'kennedy.gov.co',
    lat: 4.645,
    lng: -74.1405,
    color: '#f97316'
  },
  {
    id: 'comisaria-familia-2',
    name: 'Comisaría de Familia 2 Kennedy',
    type: 'Administración',
    upzCode: 'UPZ47',
    address: 'Avenida 1 de Mayo No. 38C-51 Sur',
    phone: '(601) 448 14 00',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Conciliación familiar, medidas de protección.',
    web: 'kennedy.gov.co',
    lat: 4.6275,
    lng: -74.144,
    color: '#f97316'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. INTEGRACIÓN SOCIAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'subdirección-integracion-social-kennedy',
    name: 'Subdirección Local de Integración Social / CDC',
    type: 'Desarrollo Local',
    upzCode: 'UPZ47',
    address: 'Carrera 80 No. 43-43 Sur',
    phone: '(601) 327 97 97',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Comedores comunitarios, atención a juventud y mujer.',
    web: 'integracionsocial.gov.co',
    lat: 4.605,
    lng: -74.158,
    color: '#7c3aed'
  },
  {
    id: 'cdc-lago-timiza',
    name: 'CDC Lago Timiza / Manzana Cuidado',
    type: 'Desarrollo Local',
    upzCode: 'UPZ48',
    address: 'Carrera 74 No. 42-52 Sur',
    phone: '(601) 327 97 97',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Manzana del Cuidado, formación, SENA.',
    web: 'integracionsocial.gov.co',
    lat: 4.610,
    lng: -74.143,
    color: '#7c3aed'
  },
  {
    id: 'cdc-bellavista',
    name: 'CDC Bellavista – Integración Social',
    type: 'Desarrollo Local',
    upzCode: 'UPZ82',
    address: 'Calle 38 Sur No. 94C-29',
    phone: '(601) 327 97 97',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Atención personas mayores, apoyo a mujer y juventud.',
    web: 'integracionsocial.gov.co',
    lat: 4.630,
    lng: -74.193,
    color: '#7c3aed'
  },
  {
    id: 'centro-crecer-kennedy',
    name: 'Centro Crecer Kennedy (Discapacidad)',
    type: 'Desarrollo Local',
    upzCode: 'UPZ47',
    address: 'Calle 36A Sur No. 78C-08',
    phone: '(601) 327 97 97',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Atención integral a personas con discapacidad.',
    web: 'integracionsocial.gov.co',
    lat: 4.6375,
    lng: -74.154,
    color: '#7c3aed'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. EMPLEO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'agencia-distrital-empleo-kennedy',
    name: 'Agencia Distrital de Empleo',
    type: 'Empleo',
    upzCode: 'UPZ47',
    address: 'Transversal 78K No. 41A-04 Sur',
    phone: '(601) 381 30 00',
    hours: 'Lunes a viernes 8:00 a.m. a 4:30 p.m.',
    services: 'Orientación laboral, Bogotá Trabaja Te Conecta.',
    web: 'desarrolloeconomico.gov.co',
    lat: 4.6125,
    lng: -74.154,
    color: '#16a34a'
  },
  {
    id: 'sena-supercade-americas',
    name: 'SENA – Punto de Empleo SuperCADE Américas',
    type: 'Empleo',
    upzCode: 'UPZ79',
    address: 'Avenida Carrera 86 No. 43-55 Sur',
    phone: '(601) 736 60 60',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Asesoría ruta de empleo, cursos SOFIA Plus.',
    web: 'agenciaempleo.sena.edu.co',
    lat: 4.6048,
    lng: -74.1728,
    color: '#16a34a'
  },
  {
    id: 'manzana-cuidado-timiza-empleo',
    name: 'Empleabilidad – Manzana Cuidado Timiza',
    type: 'Empleo',
    upzCode: 'UPZ48',
    address: 'Carrera 74 No. 42-52 Sur',
    phone: '(601) 381 30 00',
    hours: 'Lunes a viernes 7:00 a.m. a 4:30 p.m.',
    services: 'Empleabilidad para mujeres y cuidadoras.',
    web: 'desarrolloeconomico.gov.co',
    lat: 4.610,
    lng: -74.143,
    color: '#16a34a'
  },
  {
    id: 'compensar-kennedy',
    name: 'Agencia de Empleo Compensar',
    type: 'Empleo',
    upzCode: 'UPZ48',
    address: 'Avenida 1 de Mayo No. 42A-39 Sur',
    phone: '(601) 354 7575',
    hours: 'Lunes a viernes 8:00 a.m. a 5:00 p.m.',
    services: 'Bolsa pública de empleo, intermediación laboral.',
    web: 'compensar.com/empleo',
    lat: 4.6075,
    lng: -74.144,
    color: '#16a34a'
  }
];

export const getZoneColor = (pobrezaMultidimensional) => {
  // Paleta pastel para no competir visualmente con los marcadores
  if (pobrezaMultidimensional >= 0.4) return '#f87171'; // Rojo pastel oscuro
  if (pobrezaMultidimensional >= 0.3) return '#fca5a5'; // Rojo pastel medio
  if (pobrezaMultidimensional >= 0.2) return '#fde047'; // Amarillo pastel moderado
  if (pobrezaMultidimensional >= 0.1) return '#fef08a'; // Amarillo claro
  return '#bbf7d0'; // Verde menta pastel
};

export const getZoneStyle = (featureProperties) => {
  const color = getZoneColor(featureProperties.pobrezaMultidimensional);
  return {
    color: '#334155', // Borde gris pizarra (más suave que negro)
    weight: 1.5,
    fillColor: color,
    fillOpacity: 0.55, // Un poco más opaco para pastel
    dashArray: '3'
  };
};



