// src/MapaKennedy.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
  GeoJSON,
  Marker,
  Popup,
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
import { MainHeader } from './components/Header';
import { MapLegend } from './components/MapLegend';
import { Accordion, Switch } from './components/DataCards';
import PovertyDataSection from './components/DataCards';
import StatsCharts from './components/StatsCharts';
import {
  escapeHtml,
  normalizeUpzCode,
  featureContainsPoint,
  kennedyBounds,
  iconsByType,
  createUpzLabelIcon,
  FitToSelection,
  ZoomWatcher,
  formatPercent,
} from './components/MapUtils';

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
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  // ESC cierra capas modales (estándar WAI-ARIA para dialog patterns)
  useEffect(() => {
    if (!isSourcesModalOpen && !isMobilePanelOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsSourcesModalOpen(false);
        setIsMobilePanelOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isSourcesModalOpen, isMobilePanelOpen]);

  const [loadError, setLoadError] = useState(null);

  // Carga GeoJSON con AbortController (cancelable en unmount) y timeout 15s
  // para evitar requests colgados. Mantiene la app responsive ante red lenta.
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const allowedNames = new Set([
      'KENNEDY CENTRAL', 'AMERICAS', 'CARVAJAL', 'BAVARIA',
      'PATIO BONITO', 'TINTAL NORTE', 'CALANDAIMA', 'CORABASTOS',
      'CASTILLA', 'TIMIZA', 'GRAN BRITALIA', 'LAS MARGARITAS',
    ]);

    (async () => {
      try {
        const res = await fetch('/saludupz.geojson', {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const text = await res.text();
        if (text.trim().startsWith('<')) {
          throw new Error('Respuesta no JSON');
        }

        const data = JSON.parse(text);
        if (!data || !Array.isArray(data.features)) {
          throw new Error('Estructura GeoJSON inválida');
        }

        const selectedFeatures = data.features.filter((f) => {
          const name = String(f?.properties?.UPlNombre || '').toUpperCase();
          return allowedNames.has(name);
        });

        setUpzFeatures(selectedFeatures);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setLoadError('No se pudieron cargar los datos espaciales.');
        }
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    })();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
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
      const key = normalizeUpzCode(zone.upzCode);
      if (key && !map.has(key)) {
        map.set(key, zone);
      }
    });
    return map;
  }, []);

  // Sanitiza una celda CSV: previene CSV injection (formula execution en Excel)
  // y escapa comillas seg\u00FAn RFC 4180.
  const csvCell = useCallback((value) => {
    const s = String(value ?? '');
    // Prefija con ap\u00F3strofe si empieza con caracteres de f\u00F3rmula
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    // Escapa comillas dobles duplic\u00E1ndolas y envuelve si contiene , " o newline
    if (/[",\n\r]/.test(safe)) {
      return `"${safe.replace(/"/g, '""')}"`;
    }
    return safe;
  }, []);

  // handleExportCSV est\u00E1 m\u00E1s abajo, tras filteredInstitutions (evita TDZ en deps)

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

  const upzCentroidByCode = useMemo(() => {
    const map = new Map();
    if (!upzFeatures || upzFeatures.length === 0) return map;

    upzFeatures.forEach((feature) => {
      const code = normalizeUpzCode(feature?.properties?.UPlCodigo);
      if (!code || map.has(code)) return;

      const center = L.geoJSON(feature).getBounds().getCenter();
      map.set(code, { lat: center.lat, lng: center.lng });
    });

    return map;
  }, [upzFeatures]);

  const validatedInstitutions = useMemo(() => {
    if (!upzFeatures || upzFeatures.length === 0) return institutions;

    return institutions.reduce((acc, inst) => {
      const point = [inst.lng, inst.lat];
      const isInsideKennedy = upzFeatures.some((feature) =>
        featureContainsPoint(feature, point)
      );

      if (isInsideKennedy) {
        acc.push(inst);
        return acc;
      }

      const targetUpzCode = normalizeUpzCode(inst.upzCode);
      const centroid = upzCentroidByCode.get(targetUpzCode);
      if (!centroid) return acc;

      acc.push({
        ...inst,
        lat: centroid.lat,
        lng: centroid.lng,
        isRelocated: true,
      });
      return acc;
    }, []);
  }, [upzFeatures, upzCentroidByCode]);

  const filteredInstitutions = useMemo(() => {
    if (selectedUpz === 'all') return validatedInstitutions;

    const selectedCode = normalizeUpzCode(selectedUpz);
    return validatedInstitutions.filter(
      (inst) => normalizeUpzCode(inst.upzCode) === selectedCode
    );
  }, [selectedUpz, validatedInstitutions]);

  const handleExportCSV = useCallback(() => {
    const headers = ['Tipo', 'Nombre', 'UPZ', 'Dirección', 'Teléfono', 'Horario'];
    const rows = filteredInstitutions.map((inst) => [
      csvCell(inst.type),
      csvCell(inst.name),
      csvCell(inst.upzCode),
      csvCell(inst.address || ''),
      csvCell(inst.phone || ''),
      csvCell(inst.hours || ''),
    ]);
    const csvContent =
      '﻿' +
      headers.map(csvCell).join(',') + '\n' +
      rows.map((r) => r.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `instituciones_kennedy_${selectedUpz}.csv`;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  }, [filteredInstitutions, selectedUpz, csvCell]);

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
      <div className="app-loading" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p>Cargando datos espaciales…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="app-error" role="alert">
        <h1>No se pudieron cargar los datos</h1>
        <p>{loadError}</p>
        <button onClick={() => window.location.reload()} className="sources-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="layout-root">
      {/* Skip link — primer foco del documento para usuarios de teclado/AT */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <MainHeader />
      {/* Overlay oscuro: cierra el panel al tocar fuera en móvil */}
      <div
        className={`mobile-overlay${isMobilePanelOpen ? ' is-visible' : ''}`}
        onClick={() => setIsMobilePanelOpen(false)}
        aria-hidden="true"
      />

      {/* FAB: visible solo en móvil, abre el Bottom Sheet */}
      <button
        className="mobile-fab"
        onClick={() => setIsMobilePanelOpen(true)}
        aria-expanded={isMobilePanelOpen}
        aria-haspopup="dialog"
        aria-label="Abrir panel de análisis"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 20v-6M6 20V10M18 20V4"/>
        </svg>
        Análisis
      </button>

      <main id="main-content" className="layout-content" tabIndex="-1">
        {/* Panel lateral — en móvil se convierte en Bottom Sheet */}
        <aside
          className={`sidebar${isMobilePanelOpen ? ' is-open' : ''}`}
          aria-label="Panel de análisis territorial"
        >
          {/* Handle visual + botón cierre para el Bottom Sheet en móvil */}
          <div className="sheet-topbar">
            <div className="sheet-handle" aria-hidden="true" />
            <button
              className="sheet-close-btn"
              onClick={() => setIsMobilePanelOpen(false)}
              aria-label="Cerrar panel de análisis"
            >
              ✕
            </button>
          </div>
          {/* Header movido a la parte superior principal */}

          <div className="sidebar-section">
            <h2 className="sidebar-section-title">
              <span className="sidebar-title-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              </span>
              Filtros de Análisis
            </h2>
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
                  const selectedUpzOption = upzOptions.find(
                    (u) => String(u.code) === String(code)
                  );
                  const indicatorsByName = selectedUpzOption
                    ? socialZoneByName.get(
                        String(selectedUpzOption.name || '').toUpperCase().trim()
                      )
                    : null;
                  const indicators =
                    indicatorsByName ||
                    socialZoneByCode.get(normalizeUpzCode(code)) ||
                    socialZones.find((z) => String(z.id).includes(String(code).toLowerCase()));
                  if (indicators) {
                    setSelectedFeature({
                      ...indicators,
                      name:
                        selectedUpzOption?.name && selectedUpzOption?.code
                          ? `UPZ ${selectedUpzOption.code.replace('UPZ', '')} - ${selectedUpzOption.name}`
                          : indicators.name || `UPZ ${code}`,
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
            <h2 className="sidebar-section-title">
              <span className="sidebar-title-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
              </span>
              Capas de Información
            </h2>
            <div className="layer-item">
              <div className="layer-label">
                <span className="author-icon" style={{ color: '#2563eb' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                <span>Instituciones Públicas</span>
              </div>
              <Switch checked={showInstitutions} onChange={setShowInstitutions} id="sw-inst" ariaLabel="Mostrar instituciones públicas en el mapa" />
            </div>
            <div className="layer-item">
              <div className="layer-label">
                <span className="author-icon" style={{ color: '#f59e0b' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </span>
                <span>Cartografía de Pobreza</span>
              </div>
              <Switch checked={showPoverty} onChange={setShowPoverty} id="sw-poverty" ariaLabel="Mostrar cartografía de pobreza en el mapa" />
            </div>
          </div>

          <div className="sidebar-section">
            <h2 className="sidebar-section-title">
              <span className="sidebar-title-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
              </span>
              Panel Analítico
            </h2>
            <div className="sidebar-tabs sidebar-tabs-contained">
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
            </div>
            <button
              className="sources-btn sidebar-export-btn"
              onClick={handleExportCSV}
              title="Exportar datos de instituciones a CSV"
            >
              Exportar CSV de instituciones
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

                  <Accordion title="Pobreza y desigualdad" defaultOpen>
                    <p><strong>Índice de Gini:</strong> {kennedySummary.gini}</p>
                    <p>
                      <strong>Pobreza Bogotá (2023):</strong><br />
                      Moderada: {kennedySummary.pobrezaBogota.moderada} | Extrema: {kennedySummary.pobrezaBogota.extrema}<br />
                      IPM Multidimensional: {kennedySummary.pobrezaBogota.multidimensional}
                    </p>
                    <strong>Sisbén IV Kennedy (Marzo 2025):</strong>
                    <div className="summary-subtotal">Total: {kennedySummary.sisben.total}</div>
                    <ul className="summary-list">
                      <li>Grupo A (Extrema): {kennedySummary.sisben.grupoA.personas} ({kennedySummary.sisben.grupoA.porcentaje})</li>
                      <li>Grupo B (Moderada): {kennedySummary.sisben.grupoB.personas} ({kennedySummary.sisben.grupoB.porcentaje})</li>
                      <li>Grupo C (Vulnerabilidad): {kennedySummary.sisben.grupoC.personas} ({kennedySummary.sisben.grupoC.porcentaje})</li>
                      <li>Grupo D (No pobres): {kennedySummary.sisben.grupoD.personas} ({kennedySummary.sisben.grupoD.porcentaje})</li>
                    </ul>
                  </Accordion>

                  <Accordion title="Empleo jóvenes (18-28 años)">
                    <ul className="summary-list">
                      <li>Informalidad/Precariedad: {kennedySummary.jovenes18_28.informalidad}</li>
                      <li>Formación Universitaria: {kennedySummary.jovenes18_28.universitaria}</li>
                      <li>Nivel Media (Bachillerato): {kennedySummary.jovenes18_28.media}</li>
                    </ul>
                  </Accordion>

                  <Accordion title="Seguridad alimentaria">
                    <ul className="summary-list">
                      <li>Gestantes bajo peso: {kennedySummary.seguridadAlimentaria.bajoPesoGestantes}</li>
                      <li>Gestantes exceso peso: {kennedySummary.seguridadAlimentaria.excesoPesoGestantes}</li>
                      <li>Retraso talla niños &lt; 5 años: {kennedySummary.seguridadAlimentaria.retrasoTallaMenores5}</li>
                    </ul>
                  </Accordion>

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

          <div className="sidebar-section">
            <h2 className="sidebar-section-title">
              <span className="sidebar-title-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
              </span>
              Datos de Territorio
            </h2>
            <PovertyDataSection />
          </div>
        </aside>

        {/* Modal de Fuentes */}
        {/* role="dialog" + aria-modal isolate the dialog for screen readers */}
        <div
          id="sources-modal"
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-hidden={!isSourcesModalOpen}
          style={{ display: isSourcesModalOpen ? 'flex' : 'none' }}
          onClick={(e) => {
            if (e.target.id === 'sources-modal') setIsSourcesModalOpen(false);
          }}
        >
          <div className="modal-card shadow-lg">
            <div className="modal-header">
              <h2 id="modal-title">📚 Fuentes y Referencias Académicas</h2>
              <button
                className="modal-close"
                onClick={() => setIsSourcesModalOpen(false)}
                aria-label="Cerrar ventana de fuentes"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="source-section">
                <h3>📈 FUENTES DE DATOS ESTADÍSTICOS</h3>
                <p><strong>[1] DANE – Encuesta de Calidad de Vida (ECV) 2023:</strong> Indicadores de pobreza monetaria, multidimensional y desigualdad. <a href="https://www.dane.gov.co/index.php/estadisticas-por-tema/pobreza-y-condiciones-de-vida" target="_blank" rel="noopener noreferrer">Enlace</a></p>
                <p><strong>[2] DANE – Medición de Pobreza Monetaria y Multidimensional Colombia 2023:</strong> Gini 0,530 | Pobreza moderada 23,7% | Extrema 5,5% | IPM 3,6%. <a href="https://www.dane.gov.co/index.php/estadisticas-por-tema/pobreza-y-condiciones-de-vida/pobreza-y-desigualdad" target="_blank" rel="noopener noreferrer">Enlace</a></p>
                <p><strong>[3] Sisbén IV – Departamento Nacional de Planeación (DNP):</strong> Corte: marzo 2025 | Kennedy: 474.049 registros. <a href="https://www.sisben.gov.co" target="_blank" rel="noopener noreferrer">www.sisben.gov.co</a></p>
                <p><strong>[4] Secretaría Distrital de Planeación (SDP):</strong> Diagnóstico Local Localidad de Kennedy, Bogotá D.C., 2024. <a href="https://www.sdp.gov.co" target="_blank" rel="noopener noreferrer">www.sdp.gov.co</a></p>
                <p><strong>[5] Secretaría Distrital de Salud de Bogotá:</strong> Diagnóstico de Salud – Localidad Kennedy 2023-2024. <a href="https://saludcapital.gov.co" target="_blank" rel="noopener noreferrer">saludcapital.gov.co</a></p>
              </div>
              <div className="source-section">
                <h3>🏛️ FUENTES INSTITUCIONALES (verificadas)</h3>
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
                      key={`upz-${selectedUpz}`}
                      data={{
                        type: 'FeatureCollection',
                        features: upzFeatures,
                      }}
                      style={(feature) => {
                        const indicators = getIndicatorsForUpz(feature);
                        const fillColor = getZoneColor(
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

                        const code = String(feature.properties.UPlCodigo);

                        // Estilo de reposo (respeta si la UPZ está seleccionada)
                        const restStyle = () => {
                          const isSelected =
                            selectedUpz !== 'all' && code === String(selectedUpz);
                          return {
                            weight: isSelected ? 3 : 1.2,
                            color: isSelected ? '#1e293b' : 'rgba(15, 23, 42, 0.55)',
                            fillOpacity: isSelected ? 0.7 : 0.45,
                          };
                        };

                        // Tooltip rápido: cifra clave sin desviar la mirada al panel
                        layer.bindTooltip(
                          `<span class="tt-name">${escapeHtml(indicators.upzName)}</span>` +
                          `<span class="tt-stat">${escapeHtml(formatPercent(indicators.pobrezaMultidimensional))} pobreza multidim.</span>`,
                          {
                            sticky: true,
                            direction: 'top',
                            className: 'upz-tooltip',
                            opacity: 1,
                          }
                        );

                        // Hover: resalta el polígono sutilmente
                        layer.on('mouseover', () => {
                          layer.setStyle({ weight: 2.5, fillOpacity: 0.7, color: '#1e293b' });
                          layer.bringToFront();
                        });
                        layer.on('mouseout', () => {
                          layer.setStyle(restStyle());
                        });

                        layer.on('click', () => {
                          setSelectedUpz(code);
                          setSelectedFeature({
                            ...indicators,
                            name: `UPZ ${feature.properties.UPlCodigo} - ${indicators.upzName}`,
                            isUpz: true
                          });
                        });

                        layer.bindPopup(() => {
                          const zone = indicators;
                          // Escape defensivo: previene XSS si la fuente de datos
                          // alguna vez se vuelve externa o user-controlled.
                          return (
                            `<div style="font-size:0.85rem;">
                            <strong>${escapeHtml(zone.name)}</strong><br />
                            Estrato predominante: ${escapeHtml(zone.estrato)}<br />
                            Empleo formal: ${escapeHtml(formatPercent(zone.empleoFormal))}<br />
                            Empleo informal: ${escapeHtml(formatPercent(zone.empleoInformal))}<br />
                            Tasa de desempleo: ${escapeHtml(formatPercent(zone.tasaDesempleo))}<br />
                            Pobreza multidimensional: ${escapeHtml(formatPercent(zone.pobrezaMultidimensional))} (DANE)<br />
                            Pobreza monetaria: ${escapeHtml(formatPercent(zone.pobrezaMonetaria))} (DANE)<br />
                            <small>Fuente: ${escapeHtml(zone.fuente)}</small>
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
                              if (inst.upzCode) setSelectedUpz(normalizeUpzCode(inst.upzCode));
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
                                {inst.isRelocated && (
                                  <p>
                                    <span className="popup-label">Nota:</span> Ubicacion ajustada al centro de la UPZ tras validacion territorial.
                                  </p>
                                )}
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
      </main>
    </div>
  );
};

