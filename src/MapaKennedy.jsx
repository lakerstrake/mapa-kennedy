// src/MapaKennedy.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import authorAvatar from './assets/author_avatar.png';
import customLogo from './assets/social_cartography_logo.png';
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
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import {
  kennedyCenter,
  socialZones,
  institutions,
  getZoneColor,
  kennedySummary,
} from './mockData';

// Iconos personalizados para instituciones con SVG (Lucide-style)
const createIcon = (color, svgPath) =>
  L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: white;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 2px solid ${color};
        box-shadow: 0 3px 8px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.8);
        color: ${color};
        transition: transform 0.2s ease;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${svgPath}
        </svg>
      </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

// Rinas de iconos (Paths de Lucide)
const paths = {
  building: '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22"></line><line x1="13" y1="22" x2="13" y2="22"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="10" x2="20" y2="10"></line><line x1="4" y1="14" x2="20" y2="14"></line><line x1="4" y1="18" x2="20" y2="18"></line>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
  landmark: '<line x1="2" y1="20" x2="22" y2="20"></line><path d="M7 11v8"></path><path d="M12 11v8"></path><path d="M17 11v8"></path><path d="M2 11h20"></path><path d="M12 2 2 7h20L12 2z"></path>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
};

const iconConfigs = {
  SuperCADE: { color: '#2563eb', path: paths.building },
  Salud: { color: '#ef4444', path: paths.heart },
  'Integración Social': { color: '#f97316', path: paths.users },
  'Desarrollo Local': { color: '#8b5cf6', path: paths.briefcase },
  Empleo: { color: '#10b981', path: paths.user },
  'Educación': { color: '#f59e0b', path: paths.book },
  'Administración': { color: '#64748b', path: paths.landmark },
  default: { color: '#475569', path: paths.building }
};

const iconsByType = Object.keys(iconConfigs).reduce((acc, type) => {
  acc[type] = createIcon(iconConfigs[type].color, iconConfigs[type].path);
  return acc;
}, {});

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
    iconSize: [width, 0], // Height 0 lets CSS handle wrapping height
    iconAnchor: [width / 2, 0], // Anchor at center-top of the text block
  });
};

// Limites aproximados de Kennedy para "bloquear" el zoom/pan
const kennedyBounds = L.latLngBounds(
  [4.600, -74.190], // sudoeste aprox
  [4.660, -74.130]  // noreste aprox
);

// Ajusta el mapa según la selección de UPZ (o muestra toda Kennedy)
const DataCard = ({ title, value, unit = '%', total, icon, progress, color = '#2563eb' }) => (
  <div className="data-card">
    <div className="card-header">
      <span className="card-title">{title}</span>
      <span className="card-icon" style={{ color }}>{icon}</span>
    </div>
    <div className="metric-main">
      <span className="metric-value">{value}</span>
      <span className="metric-unit">{unit}</span>
    </div>
    {total && <div className="metric-total">{total} personas</div>}
    {progress !== undefined && (
      <div className="progress-container">
        <div className="progress-track" style={{ height: '5px' }}>
          <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: color }}></div>
        </div>
      </div>
    )}
  </div>
);

const ComparisonBar = ({ label, value, color }) => (
  <div className="comp-bar-group" style={{ marginBottom: '6px' }}>
    <div className="comp-bar-row">
      <div className="comp-bar-track" style={{ height: '8px' }}>
        <div className="comp-bar-fill" style={{ width: `${value}%`, backgroundColor: color }}></div>
      </div>
      <span className="comp-value" style={{ fontSize: '0.65rem', fontWeight: 700, minWidth: '35px', textAlign: 'right' }}>{value}%</span>
    </div>
    <div className="comp-label" style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '1px' }}>{label}</div>
  </div>
);

const PovertyAccordion = () => {
  return (
    <div className="poverty-data-section">
      <DataCard
        title="NIVEL GENERAL (Sisbén IV)"
        value="33.1"
        total="156.874"
        progress={33.1}
        color="#2563eb"
        icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
        <DataCard
          title="Extrema (A)"
          value="6.0"
          total="28.375"
          color="#ef4444"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>}
        />
        <DataCard
          title="Moderada (B)"
          value="27.1"
          total="128.499"
          color="#f59e0b"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>}
        />
      </div>

      <div className="data-card">
        <div className="card-header">
          <span className="card-title">Comparativa Bogotá vs Kennedy</span>
        <span className="card-icon">📊</span>
        </div>
        <ComparisonBar label="Kennedy" value={33.1} color="#2563eb" />
        <ComparisonBar label="Bogotá" value={23.7} color="#94a3b8" />
      </div>

      <div className="data-footer">
        📌 Fuentes: <strong>DANE</strong> (Pobreza 2023) | <strong>Sisbén IV</strong> (Mar 2025) | <strong>SDP</strong>.
      </div>
    </div>
  );
};

// Componente de Gráficas Estadísticas
const StatsCharts = ({ selectedFeature }) => {
  const sisbenRef = useRef(null);
  const youthRef = useRef(null);
  const radarRef = useRef(null);

  const sisbenChart = useRef(null);
  const youthChart = useRef(null);
  const radarChart = useRef(null);

  useEffect(() => {
    if (!window.Chart) return;

    if (selectedFeature && selectedFeature.isUpz) {
      // Gráfica Radial (Radar) para comparar UPZ vs Kennedy
      const radarCtx = radarRef.current.getContext('2d');
      if (radarChart.current) radarChart.current.destroy();

      const upzMetrics = [
        selectedFeature.pobrezaMultidimensional * 100,
        selectedFeature.pobrezaMonetaria * 100,
        selectedFeature.empleoInformal * 100,
        selectedFeature.tasaDesempleo * 100,
      ];
      // Promedios aproximados de la localidad
      const avgMetrics = [31, 25, 56, 14];

      radarChart.current = new window.Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: ['Pobreza Multid.', 'Pobreza Monetaria', 'Empleo Informal', 'Tasa Desempleo'],
          datasets: [
            {
              label: `${selectedFeature.name}`,
              data: upzMetrics,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
            },
            {
              label: 'Promedio Localidad',
              data: avgMetrics,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { r: { min: 0, max: 80, ticks: { stepSize: 20 } } },
          plugins: {
            title: { display: true, text: 'Comparativa Socioeconómica (%)' }
          }
        }
      });
    } else {
      // Gráfica 1: Distribución Sisbén IV
      const sisbenCtx = sisbenRef.current.getContext('2d');
      if (sisbenChart.current) sisbenChart.current.destroy();
      sisbenChart.current = new window.Chart(sisbenCtx, {
        type: 'doughnut',
        data: {
          labels: ['Grupo A (Extrema)', 'Grupo B (Moderada)', 'Grupo C (Vulnerabilidad)', 'Grupo D (No pobres)'],
          datasets: [{
            data: [6.0, 27.1, 46.7, 20.2],
            backgroundColor: ['#d73027', '#fc8d59', '#fee090', '#74add1'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
            title: { display: true, text: 'Distribución Sisbén IV (Mar 2025)', font: { size: 12 } }
          }
        }
      });

      // Gráfica 2: Empleo Jóvenes
      const youthCtx = youthRef.current.getContext('2d');
      if (youthChart.current) youthChart.current.destroy();
      youthChart.current = new window.Chart(youthCtx, {
        type: 'bar',
        data: {
          labels: ['Informal', 'Formal', 'Sin U.', 'Con U.'],
          datasets: [{
            label: 'Porcentaje (%)',
            data: [63.3, 36.7, 78.7, 21.3],
            backgroundColor: ['#d73027', '#1a9850', '#f46d43', '#74add1']
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { max: 100, ticks: { font: { size: 9 } } }, y: { ticks: { font: { size: 9 } } } },
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Empleo/Edu Jóvenes', font: { size: 12 } }
          }
        }
      });
    }

    return () => {
      if (sisbenChart.current) sisbenChart.current.destroy();
      if (youthChart.current) youthChart.current.destroy();
      if (radarChart.current) radarChart.current.destroy();
    };
  }, [selectedFeature]);

  return (
    <div className="stats-charts-container">
      {selectedFeature && selectedFeature.isUpz ? (
        <div className="chart-wrapper" style={{ height: '300px', marginBottom: '20px' }}>
          <canvas ref={radarRef}></canvas>
          <p className="chart-source" style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '5px' }}>Fuente: SDDE 2024</p>
        </div>
      ) : (
        <>
          <div className="chart-wrapper" style={{ height: '220px', marginBottom: '20px' }}>
            <canvas ref={sisbenRef}></canvas>
            <p className="chart-source" style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '5px' }}>Fuente: Sisbén IV, DNP</p>
          </div>
          <div className="chart-wrapper" style={{ height: '200px' }}>
            <canvas ref={youthRef}></canvas>
            <p className="chart-source" style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '5px' }}>Fuente: SDDE, 2024</p>
          </div>
        </>
      )}
    </div>
  );
};

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
const legendGrades = [0, 0.1, 0.2, 0.3, 0.4];
const institutionThemes = [
  { label: 'Salud', color: '#ef4444' },
  { label: 'CADE', color: '#2563eb' },
  { label: 'Ed.', color: '#f59e0b' },
  { label: 'Emp.', color: '#10b981' },
  { label: 'Adm.', color: '#64748b' },
];

const MapLegend = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section
      className={`legend-floating ${isOpen ? 'is-open' : 'is-collapsed'}`}
      role="complementary"
      aria-label="Leyenda del mapa"
    >
      <button
        className="legend-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="legend-content"
      >
        <span className="legend-toggle-icon">{isOpen ? '▼' : '▶'}</span>
        <span className="legend-toggle-text">Leyenda del Mapa</span>
      </button>

      {isOpen && (
        <div className="legend-content-inner" id="legend-content">
          <div className="legend-section">
            <div className="legend-title">Incidencia Pobreza</div>
            <div className="legend-ramp">
              {legendGrades.map((from) => (
                <div key={from} className="ramp-swatch" style={{ background: getZoneColor(from + 0.001) }} />
              ))}
            </div>
            <div className="legend-labels">
              <span>Menor</span>
              <span>Mayor</span>
            </div>
          </div>

          <div className="legend-divider" />

          <div className="legend-section">
            <div className="legend-title">Sedes Institucionales</div>
            <div className="legend-grid-compact">
              {institutionThemes.map((theme) => (
                <div key={theme.label} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: theme.color }}></span> {theme.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const MainHeader = () => {
  return (
    <header className="main-header">
      <div className="header-left">
        <img src={customLogo} alt="Cartografía Social" className="header-custom-logo" />
        <div className="header-brand">
          <span className="header-chip">
            Sistema de Cartografía Social Distrital
          </span>
          <h1 className="header-title">Kennedy: Caracterización Social</h1>
          <span className="header-subtitle">Análisis de vulnerabilidad y presencia institucional</span>
        </div>
      </div>
      <div className="header-author-compact">
        <div className="author-info-group">
          <span className="author-name-header">SARAI YIRETH CORREDOR MIRANDA</span>
          <span className="author-subtext">Trabajo Social — U. La Salle</span>
        </div>
        <img src={authorAvatar} alt="Sarai" className="author-avatar-img" />
      </div>
    </header>
  );
};

const Switch = ({ checked, onChange, id }) => (
  <label className="switch" htmlFor={id}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="slider"></span>
  </label>
);

export const MapaKennedy = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedUpz, setSelectedUpz] = useState('all');
  const [upzFeatures, setUpzFeatures] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' o 'stats'
  const [showInstitutions, setShowInstitutions] = useState(true);
  const [showPoverty, setShowPoverty] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

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
      } finally {
        setIsLoading(false);
      }
    };

    loadUpz();
  }, []);

  const socialZoneByName = useMemo(() => {
    const map = new Map();
    socialZones.forEach((zone) => {
      const key = String(zone.upzName || '').toUpperCase().trim();
      if (key && !map.has(key)) {
        map.set(key, zone);
      }
    });
    return map;
  }, []);

  const socialZoneByCode = useMemo(() => {
    const map = new Map();
    socialZones.forEach((zone) => {
      const key = String(zone.upzCode || '').trim();
      if (key && !map.has(key)) {
        map.set(key, zone);
      }
    });
    return map;
  }, []);

  const handleExportCSV = () => {
    const headers = ['Tipo', 'Nombre', 'UPZ', 'Direccion', 'Telefono', 'Horario'];
    const rows = filteredInstitutions.map(inst => [
      inst.type,
      `"${inst.name}"`,
      inst.upzCode,
      `"${inst.address || ''}"`,
      `"${inst.phone || ''}"`,
      `"${inst.hours || ''}"`
    ]);
    const csvContent = '\uFEFF'
      + headers.join(',') + '\n'
      + rows.map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', downloadUrl);
    link.setAttribute('download', `instituciones_kennedy_${selectedUpz}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

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
    const upzName = String(feature.properties.UPlNombre || '').toUpperCase().trim();
    return socialZoneByName.get(upzName) || null;
  };

  const filteredInstitutions = useMemo(() => {
    return institutions.filter(
      (inst) => selectedUpz === 'all' || String(inst.upzCode) === String(selectedUpz)
    );
  }, [selectedUpz]);

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

    const seen = new Set();
    const result = [];

    upzFeatures.forEach((feature) => {
      const code = String(feature.properties.UPlCodigo);
      if (!seen.has(code)) {
        seen.add(code);
        const center = L.geoJSON(feature).getBounds().getCenter();
        result.push({
          code,
          name: String(feature.properties.UPlNombre),
          lat: center.lat,
          lng: center.lng,
        });
      }
    });

    return result;
  }, [upzFeatures]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <div className="loading-spinner" style={{ border: '4px solid #cbd5e1', borderTop: '4px solid #2563eb', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '15px' }}></div>
        <h2 style={{ color: '#0f172a' }}>Cargando datos espaciales...</h2>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="layout-root">
      <MainHeader />
      <div className="layout-content">
        {/* Panel lateral de información */}
        <aside className="sidebar">
          {/* Header movido a la parte superior principal */}

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">
              <span className="sidebar-title-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              </span>
              Filtros de Análisis
            </h3>
            <label className="sidebar-select-label" htmlFor="upz-select">
              Explorar Territorio
            </label>
            <select
              id="upz-select"
              className="sidebar-select"
              value={selectedUpz}
              onChange={(e) => {
                const code = e.target.value;
                setSelectedUpz(code);
                if (code === 'all') {
                  setSelectedFeature(null);
                } else {
                  const indicators =
                    socialZoneByCode.get(String(code)) ||
                    socialZones.find((z) => String(z.id).includes(String(code).toLowerCase()));
                  if (indicators) {
                    setSelectedFeature({
                      ...indicators,
                      name: indicators.name || `UPZ ${code}`,
                      isUpz: true
                    });
                  }
                }
              }}
            >
              <option value="all">Todas las UPZ de Kennedy</option>
              {upzOptions.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.code} - {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">
              <span className="sidebar-title-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
              </span>
              Capas de Información
            </h3>
            <div className="layer-item">
              <div className="layer-label">
                <span className="author-icon" style={{ color: '#2563eb' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                <span>Instituciones Públicas</span>
              </div>
              <Switch checked={showInstitutions} onChange={setShowInstitutions} id="sw-inst" />
            </div>
            <div className="layer-item">
              <div className="layer-label">
                <span className="author-icon" style={{ color: '#f59e0b' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </span>
                <span>Cartografía de Pobreza</span>
              </div>
              <Switch checked={showPoverty} onChange={setShowPoverty} id="sw-poverty" />
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">
              <span className="sidebar-title-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
              </span>
              Datos de Territorio
            </h3>
            <PovertyAccordion />
          </div>

          <div className="sidebar-tabs">
            <button
              className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              Resumen
            </button>
            <button
              className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              Estadisticas
            </button>
            <button
              className="tab-btn tab-btn-export"
              onClick={handleExportCSV}
              title="Exportar datos de instituciones a CSV"
            >
              CSV
            </button>
          </div>

          {activeTab === 'summary' ? (
            <>
              {selectedFeature ? (
                <div className="sidebar-section">
                  <div className="sidebar-metrics-title">Detalle del territorio / institucion</div>
                  <div className="detail-head">
                    <h3 className="detail-title">{selectedFeature.name}</h3>
                    <span className="detail-badge">{selectedFeature.isUpz ? 'UPZ' : selectedFeature.type}</span>
                  </div>

                  {selectedFeature.isUpz ? (
                    <div className="sidebar-detail-grid">
                      <div className="detail-kpi"><span className="detail-kpi-label">Estrato</span><strong className="detail-kpi-value">{selectedFeature.estrato || 'N/A'}</strong></div>
                      <div className="detail-kpi"><span className="detail-kpi-label">Empleo formal</span><strong className="detail-kpi-value">{formatPercent(selectedFeature.empleoFormal)}</strong></div>
                      <div className="detail-kpi"><span className="detail-kpi-label">Empleo informal</span><strong className="detail-kpi-value">{formatPercent(selectedFeature.empleoInformal)}</strong></div>
                      <div className="detail-kpi"><span className="detail-kpi-label">Desempleo</span><strong className="detail-kpi-value">{formatPercent(selectedFeature.tasaDesempleo)}</strong></div>
                      <div className="detail-kpi"><span className="detail-kpi-label">Pobreza multidim.</span><strong className="detail-kpi-value">{formatPercent(selectedFeature.pobrezaMultidimensional)}</strong></div>
                      <div className="detail-kpi"><span className="detail-kpi-label">Pobreza monetaria</span><strong className="detail-kpi-value">{formatPercent(selectedFeature.pobrezaMonetaria)}</strong></div>
                    </div>
                  ) : (
                    <div className="sidebar-institution-details">
                      <p><strong>Tipo:</strong> {selectedFeature.type}</p>
                      <p><strong>Direccion:</strong> {selectedFeature.address}</p>
                      {selectedFeature.phone && <p><strong>Telefono:</strong> {selectedFeature.phone}</p>}
                      {selectedFeature.hours && <p><strong>Horario:</strong> {selectedFeature.hours}</p>}
                      <p><strong>Servicios:</strong> {selectedFeature.services}</p>
                      {selectedFeature.web && (
                        <p>
                          <strong>Web:</strong>{' '}
                          <a href={selectedFeature.web.startsWith('http') ? selectedFeature.web : `https://${selectedFeature.web}`} target="_blank" rel="noopener noreferrer">
                            {selectedFeature.web}
                          </a>
                        </p>
                      )}
                    </div>
                  )}

                  <p className="metric-source">
                    <strong>Fuente:</strong>{' '}
                    {selectedFeature.fuente ? (
                      selectedFeature.fuente.includes('|') ? (
                        <>
                          {selectedFeature.fuente.split(' | ')[0]}{' - '}
                          <a
                            href={selectedFeature.fuente.split(' | ')[1].startsWith('http') ? selectedFeature.fuente.split(' | ')[1] : `https://${selectedFeature.fuente.split(' | ')[1]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {selectedFeature.fuente.split(' | ')[1]}
                          </a>
                        </>
                      ) : selectedFeature.fuente
                    ) : (selectedFeature.isUpz ? 'SDP / DANE' : 'Directorio Institucional Kennedy 2024')}
                  </p>

                  <button className="sources-btn sources-btn-muted" onClick={() => setSelectedFeature(null)}>
                    Volver al resumen general
                  </button>
                </div>
              ) : (
                <div className="sidebar-section sidebar-summary">
                  <div className="sidebar-metrics-title">Contexto demografico y social</div>

                  <div className="summary-kpis">
                    <div className="summary-kpi"><span className="summary-kpi-label">Poblacion</span><strong className="summary-kpi-value">{kennedySummary.poblacion}</strong></div>
                    <div className="summary-kpi"><span className="summary-kpi-label">Extension</span><strong className="summary-kpi-value">{kennedySummary.extension}</strong></div>
                    <div className="summary-kpi"><span className="summary-kpi-label">UPZ</span><strong className="summary-kpi-value">{kennedySummary.upzCount}</strong></div>
                  </div>

                  <div className="summary-block">
                    <h4 className="summary-title">Pobreza y desigualdad</h4>
                    <p><strong>Indice de Gini:</strong> {kennedySummary.gini}</p>
                    <p>
                      <strong>Pobreza Bogota (2023):</strong><br />
                      Moderada: {kennedySummary.pobrezaBogota.moderada} | Extrema: {kennedySummary.pobrezaBogota.extrema}<br />
                      IPM Multidimensional: {kennedySummary.pobrezaBogota.multidimensional}
                    </p>
                    <strong>Sisben IV Kennedy (Marzo 2025):</strong>
                    <div className="summary-subtotal">Total: {kennedySummary.sisben.total}</div>
                    <ul className="summary-list">
                      <li>Grupo A (Extrema): {kennedySummary.sisben.grupoA.personas} ({kennedySummary.sisben.grupoA.porcentaje})</li>
                      <li>Grupo B (Moderada): {kennedySummary.sisben.grupoB.personas} ({kennedySummary.sisben.grupoB.porcentaje})</li>
                      <li>Grupo C (Vulnerabilidad): {kennedySummary.sisben.grupoC.personas} ({kennedySummary.sisben.grupoC.porcentaje})</li>
                      <li>Grupo D (No pobres): {kennedySummary.sisben.grupoD.personas} ({kennedySummary.sisben.grupoD.porcentaje})</li>
                    </ul>
                  </div>

                  <div className="summary-block">
                    <h4 className="summary-title">Empleo jovenes (18-28 anos)</h4>
                    <ul className="summary-list">
                      <li>Informalidad/Precariedad: {kennedySummary.jovenes18_28.informalidad}</li>
                      <li>Formacion Universitaria: {kennedySummary.jovenes18_28.universitaria}</li>
                      <li>Nivel Media (Bachillerato): {kennedySummary.jovenes18_28.media}</li>
                    </ul>
                  </div>

                  <div className="summary-block">
                    <h4 className="summary-title">Seguridad alimentaria</h4>
                    <ul className="summary-list">
                      <li>Gestantes bajo peso: {kennedySummary.seguridadAlimentaria.bajoPesoGestantes}</li>
                      <li>Gestantes exceso peso: {kennedySummary.seguridadAlimentaria.excesoPesoGestantes}</li>
                      <li>Retraso talla ninos &lt; 5 anos: {kennedySummary.seguridadAlimentaria.retrasoTallaMenores5}</li>
                    </ul>
                  </div>

                  <div className="summary-help">
                    <div className="sidebar-metrics-title">Como leer este mapa</div>
                    <p>Explora la relacion entre pobreza multidimensional, empleo y presencia institucional en Kennedy.</p>
                    <p className="summary-sources">
                      Fuentes: DANE ECV 2023 | Sisben IV, corte marzo 2025 | Secretaria Distrital de Planeacion - Diagnostico Local Kennedy 2024 | Secretaria Distrital de Salud 2023-2024
                    </p>
                  </div>

                  <div className="summary-actions">
                    <button className="sources-btn" onClick={() => setIsSourcesModalOpen(true)}>
                      Ver fuentes y referencias
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="sidebar-section">
              <StatsCharts selectedFeature={selectedFeature} />
            </div>
          )}
        </aside>

        {/* Modal de Fuentes */}
        <div
          id="sources-modal"
          className="modal-overlay"
          style={{ display: isSourcesModalOpen ? 'flex' : 'none' }}
          onClick={(e) => {
            if (e.target.id === 'sources-modal') setIsSourcesModalOpen(false);
          }}
        >
          <div className="modal-card shadow-lg">
            <div className="modal-header">
              <h3>📚 Fuentes y Referencias Académicas</h3>
              <button className="modal-close" onClick={() => setIsSourcesModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="source-section">
                <h4>📈 FUENTES DE DATOS ESTADÍSTICOS</h4>
                <p><strong>[1] DANE – Encuesta de Calidad de Vida (ECV) 2023:</strong> Indicadores de pobreza monetaria, multidimensional y desigualdad. <a href="https://www.dane.gov.co/index.php/estadisticas-por-tema/pobreza-y-condiciones-de-vida" target="_blank" rel="noopener noreferrer">Enlace</a></p>
                <p><strong>[2] DANE – Medición de Pobreza Monetaria y Multidimensional Colombia 2023:</strong> Gini 0,530 | Pobreza moderada 23,7% | Extrema 5,5% | IPM 3,6%. <a href="https://www.dane.gov.co/index.php/estadisticas-por-tema/pobreza-y-condiciones-de-vida/pobreza-y-desigualdad" target="_blank" rel="noopener noreferrer">Enlace</a></p>
                <p><strong>[3] Sisbén IV – Departamento Nacional de Planeación (DNP):</strong> Corte: marzo 2025 | Kennedy: 474.049 registros. <a href="https://www.sisben.gov.co" target="_blank" rel="noopener noreferrer">www.sisben.gov.co</a></p>
                <p><strong>[4] Secretaría Distrital de Planeación (SDP):</strong> Diagnóstico Local Localidad de Kennedy, Bogotá D.C., 2024. <a href="https://www.sdp.gov.co" target="_blank" rel="noopener noreferrer">www.sdp.gov.co</a></p>
                <p><strong>[5] Secretaría Distrital de Salud de Bogotá:</strong> Diagnóstico de Salud – Localidad Kennedy 2023-2024. <a href="https://saludcapital.gov.co" target="_blank" rel="noopener noreferrer">saludcapital.gov.co</a></p>
              </div>
              <div className="source-section">
                <h4>🏛️ FUENTES INSTITUCIONALES (verificadas)</h4>
                <p><strong>[6] Alcaldía Local de Kennedy:</strong> Transversal 78K No. 41A-04 Sur | (601) 448 14 00 ext. 8100. Lunes a viernes 7:00 a.m. a 4:30 p.m. <a href="https://bogota.gov.co/servicios/puntos-de-atencion/alcaldia-local-kennedy" target="_blank" rel="noopener noreferrer">Fuente directa</a></p>
                <p><strong>[7] SuperCADE Américas (Kennedy - Tintalito):</strong> Carrera 86 No. 43-55 Sur | Tel: 195. Lunes a viernes 7:00 a.m. a 4:30 p.m. | Sábados 8:00 a.m. a 12:00 m. <a href="https://bogota.gov.co/servicios/cades/supercade-americas" target="_blank" rel="noopener noreferrer">Fuente directa</a></p>
                <p><strong>[8] Subred Integrada de Servicios de Salud Sur Occidente E.S.E.:</strong> (incluye Hospital Occidente de Kennedy, U.S.S. 29 Kennedy, U.S.S. 79 Carvajal, U.S.S. 68 Britalia y otras unidades). Citas: (601) 3795180 | Urgencias 24h. <a href="https://subredsuroccidente.gov.co" target="_blank" rel="noopener noreferrer">subredsuroccidente.gov.co</a></p>
                <p><strong>[9] SENA – Agencia Pública de Empleo Kennedy:</strong> Transversal 78J No. 41D-15 Sur | Tel: 601-7366060. Lunes a viernes 8:00 a.m. a 4:00 p.m. <a href="https://bogota.gov.co/servicios/puntos-de-atencion/agencia-publica-de-empleo-centro-de-actividad-fisica-y-cultura-sena-localidad-kennedy" target="_blank" rel="noopener noreferrer">Fuente directa</a></p>
                <p><strong>[10] Secretaría Distrital de Desarrollo Económico (SDDE):</strong> Programas: ferias de empleo, Talento Capital, Bogotá Trabaja Te Conecta. <a href="https://www.bogotatrabaja.gov.co" target="_blank" rel="noopener noreferrer">bogotatrabaja.gov.co</a></p>
              </div>
              <div className="source-note">
                <strong>ℹ️ NOTA METODOLÓGICA:</strong>
                <p>Esta cartografía es un ejercicio académico de caracterización social del territorio para la Localidad No. 8 de Bogotá D.C. (Kennedy), elaborado en el marco de un trabajo de Trabajo Social. Los polígonos de UPZ corresponden a la cartografía oficial de la SDP. Los datos son de fuentes oficiales del Gobierno Nacional y Distrital. Fecha de elaboración: 2025-2026.</p>
                <p><em>Basemap: © OpenStreetMap contributors | © Leaflet</em></p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor del mapa */}
        <div className="map-shell">
          <MapContainer
            center={[kennedyCenter.lat, kennedyCenter.lng]}
            zoom={kennedyCenter.zoom}
            style={{ height: '100%', width: '100%' }}
          >
            <FitToSelection selectedUpz={selectedUpz} upzFeatures={upzFeatures || []} />
            <ZoomWatcher onZoomChange={setZoomLevel} />

            <LayersControl position="topright">
              {/* Mapa Base Estándar */}
              <LayersControl.BaseLayer checked name="Mapa Base (OSM)">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | Cartografía: SDP Bogotá | Datos: DANE 2023, Sisbén IV 2025'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>

              {/* Mapa Satelital */}
              <LayersControl.BaseLayer name="Mapa Satélite (Esri)">
                <TileLayer
                  attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>

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
                  {upzFeatures && showPoverty && (
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
                            isUpz: true
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
                          zIndexOffset={-500} // Labels stay below icons
                        />
                      );
                    })}
                  </LayerGroup>
                </LayersControl.Overlay>
              )}

              {/* Capa 2: Instituciones, separadas por tipo */}
              {/* Capa de Instituciones Públicas */}
              <LayersControl.Overlay checked={showInstitutions} name="Instituciones Públicas">
                <LayerGroup>
                  <MarkerClusterGroup
                    chunkedLoading
                    maxClusterRadius={40}
                    spiderfyOnMaxZoom={true}
                  >
                    {filteredInstitutions.map((inst) => {
                      const customIcon = iconsByType[inst.type] || iconsByType['default'];

                      return (
                        <Marker
                          key={inst.id}
                          position={[inst.lat, inst.lng]}
                          icon={customIcon}
                          zIndexOffset={1000}
                          eventHandlers={{
                            click: () => {
                              setSelectedFeature({
                                ...inst,
                                isUpz: false
                              });
                              // Opcional: enfocar la UPZ a la que pertenece esta institución
                              if (inst.upzCode) setSelectedUpz(inst.upzCode.replace('UPZ', ''));
                            }
                          }}
                        >
                          <Popup className="institution-popup">
                            <div className="popup-content">
                              <div className="popup-header" style={{ borderLeft: `4px solid ${inst.color || '#333'}` }}>
                                <div className="popup-type">{inst.type.toUpperCase()}</div>
                                <div className="popup-name">{inst.name}</div>
                              </div>
                              <div className="popup-body">
                                {inst.address && <p><span className="popup-label">Dirección:</span> {inst.address}</p>}
                                {inst.phone && <p><span className="popup-label">Teléfono:</span> {inst.phone}</p>}
                                {inst.hours && <p><span className="popup-label">Horario:</span> {inst.hours}</p>}
                                {inst.services && <p><span className="popup-label">Servicios:</span> {inst.services}</p>}
                                {inst.web && (
                                  <p><span className="popup-label">Web:</span> <a href={inst.web.startsWith('http') ? inst.web : `https://${inst.web.split(' | ')[0]}`} target="_blank" rel="noopener noreferrer">{inst.web.split(' | ')[0]}</a></p>
                                )}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MarkerClusterGroup>
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer >

          <MapLegend />
        </div>
      </div>
    </div>
  );
};

