import React, { useState } from 'react';
import { getZoneColor } from '../mockData';

const legendGrades = [0, 0.1, 0.2, 0.3, 0.4];
const institutionThemes = [
  { label: 'Salud', color: '#ef4444' },
  { label: 'CADE', color: '#2563eb' },
  { label: 'Educacion', color: '#f59e0b' },
  { label: 'Empleo', color: '#10b981' },
  { label: 'Adm.', color: '#64748b' },
];

export const MapLegend = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <section className={`legend-floating ${isOpen ? 'is-open' : 'is-collapsed'}`} role="complementary" aria-label="Leyenda del mapa">
      <button className="legend-toggle" onClick={() => setIsOpen((p) => !p)} aria-expanded={isOpen} aria-controls="legend-content">
        <span className="legend-toggle-icon">{isOpen ? '\u25BC' : '\u25B6'}</span>
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
            <div className="legend-labels"><span>Menor</span><span>Mayor</span></div>
          </div>
          <div className="legend-divider" />
          <div className="legend-section">
            <div className="legend-title">Sedes Institucionales</div>
            <div className="legend-grid-compact">
              {institutionThemes.map((t) => (
                <div key={t.label} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: t.color }}></span> {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
