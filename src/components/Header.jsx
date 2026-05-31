import React from "react";
import customLogo from "../assets/social_cartography_logo.png";
import authorAvatar from "../assets/author_avatar.png";
import { useTheme } from "../contexts/ThemeContext";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const MainHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="main-header">
      <div className="header-left">
        <img
          src={customLogo}
          alt="Cartografía Social"
          className="header-custom-logo"
          width="38"
          height="38"
          decoding="async"
          loading="eager"
        />
        <div className="header-brand">
          <span className="header-chip">Sistema de Cartografía Social Distrital</span>
          <h1 className="header-title">Kennedy: Caracterización Social</h1>
          <span className="header-subtitle">Análisis de vulnerabilidad y presencia institucional</span>
        </div>
      </div>
      <div className="header-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
          title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="header-author-compact">
          <img
            src={authorAvatar}
            alt="Autora"
            className="header-author-avatar"
            width="28"
            height="28"
            decoding="async"
          />
          <div className="header-author-info">
            <span className="header-author-name">SARAI YIRETH CORREDOR MIRANDA</span>
            <span className="header-author-field">Trabajo Social — U. La Salle</span>
          </div>
        </div>
      </div>
    </header>
  );
};
