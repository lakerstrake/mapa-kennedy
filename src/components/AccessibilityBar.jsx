import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAccessibility } from "../contexts/AccessibilityContext";

const A11yIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/>
  </svg>
);

const ContrastIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20V2Z" fill="currentColor"/>
  </svg>
);

export const AccessibilityBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { fontSize, highContrast, reduceMotion, updateSetting } = useAccessibility();

  return (
    <>
      <button
        className="a11y-fab"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Opciones de accesibilidad"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <A11yIcon />
      </button>

      <div
        className={`a11y-panel ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-label="Panel de accesibilidad"
        aria-hidden={!isOpen}
      >
        <div className="a11y-panel-header">
          <A11yIcon />
          <span>Accesibilidad</span>
          <button className="a11y-close" onClick={() => setIsOpen(false)} aria-label="Cerrar panel">&times;</button>
        </div>

        <div className="a11y-section">
          <span className="a11y-label">Tema</span>
          <button className="a11y-btn" onClick={toggleTheme} aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}>
            {theme === "light" ? <><MoonIcon /> Oscuro</> : <><SunIcon /> Claro</>}
          </button>
        </div>

        <div className="a11y-section">
          <span className="a11y-label">Tamano texto</span>
          <div className="a11y-btn-group">
            <button className="a11y-btn" onClick={() => updateSetting("fontSize", Math.min(150, fontSize + 15))} aria-label="Aumentar tamano de texto">
              <TextIcon /> +{fontSize}%
            </button>
            <button className="a11y-btn" onClick={() => updateSetting("fontSize", Math.max(70, fontSize - 15))} aria-label="Reducir tamano de texto">
              <TextIcon /> -{fontSize}%
            </button>
          </div>
        </div>

        <div className="a11y-section">
          <span className="a11y-label">Contraste</span>
          <button
            className={`a11y-btn ${highContrast ? "is-active" : ""}`}
            onClick={() => updateSetting("highContrast", !highContrast)}
            aria-pressed={highContrast}
            aria-label="Alto contraste"
          >
            <ContrastIcon /> {highContrast ? "Activado" : "Desactivado"}
          </button>
        </div>

        <div className="a11y-section">
          <span className="a11y-label">Animaciones</span>
          <button
            className={`a11y-btn ${reduceMotion ? "is-active" : ""}`}
            onClick={() => updateSetting("reduceMotion", !reduceMotion)}
            aria-pressed={reduceMotion}
            aria-label="Reducir movimiento"
          >
            {reduceMotion ? "Desactivadas" : "Activadas"}
          </button>
        </div>
      </div>
    </>
  );
};
