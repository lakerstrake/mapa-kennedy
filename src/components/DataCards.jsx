import React, { useState, useRef } from "react";

let accordionSeq = 0;

export const DataCard = ({ title, value, unit = "%", total, icon, progress, color = "#2563eb" }) => (
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
        <div className="progress-track" style={{ height: "5px" }}>
          <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: color }}></div>
        </div>
      </div>
    )}
  </div>
);

export const ComparisonBar = ({ label, value, color }) => (
  <div className="comp-bar-group" style={{ marginBottom: "6px" }}>
    <div className="comp-bar-row">
      <div className="comp-bar-track" style={{ height: "8px" }}>
        <div className="comp-bar-fill" style={{ width: `${value}%`, backgroundColor: color }}></div>
      </div>
      <span className="comp-value" style={{ fontSize: "0.65rem", fontWeight: 700, minWidth: "35px", textAlign: "right" }}>{value}%</span>
    </div>
    <div className="comp-label" style={{ fontSize: "0.6rem", color: "#64748b", marginTop: "1px" }}>{label}</div>
  </div>
);

export const Accordion = ({ title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const idRef = useRef(`acc-${(accordionSeq += 1)}`);
  const panelId = `${idRef.current}-panel`;
  const btnId = `${idRef.current}-btn`;
  return (
    <div className={`accordion${isOpen ? " is-open" : ""}`}>
      <h3 className="accordion-heading">
        <button type="button" id={btnId} className="accordion-btn" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setIsOpen((v) => !v)}>
          <span className="accordion-title">{title}</span>
          <svg className="accordion-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={btnId} className="accordion-panel" hidden={!isOpen}>
        <div className="accordion-panel-inner">{children}</div>
      </div>
    </div>
  );
};

const PovertyDataSection = () => {
  const svgPie = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>;
  const svgAlert = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
  const svgBar = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>;
  return (
    <div className="poverty-data-section">
      <DataCard title="NIVEL GENERAL (Sisben IV)" value="33.1" total="156.874" progress={33.1} color="#2563eb" icon={svgPie} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
        <DataCard title="Extrema (A)" value="6.0" total="28.375" color="#ef4444" icon={svgAlert} />
        <DataCard title="Moderada (B)" value="27.1" total="128.499" color="#f59e0b" icon={svgBar} />
      </div>
      <div className="data-card">
        <div className="card-header">
          <span className="card-title">Comparativa Bogota vs Kennedy</span>
          <span className="card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg></span>
        </div>
        <ComparisonBar label="Kennedy" value={33.1} color="#2563eb" />
        <ComparisonBar label="Bogota" value={23.7} color="#94a3b8" />
      </div>
      <div className="data-footer">
        Fuentes: <strong>DANE</strong> (Pobreza 2023) | <strong>Sisben IV</strong> (Mar 2025) | <strong>SDP</strong>.
      </div>
    </div>
  );
};

export default PovertyDataSection;

export const Switch = ({ checked, onChange, id, ariaLabel }) => (
  <label className="switch" htmlFor={id}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={ariaLabel}
    />
    <span className="slider"></span>
  </label>
);
