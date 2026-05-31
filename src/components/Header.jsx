import React from 'react';
import customLogo from '../assets/social_cartography_logo.png';
import authorAvatar from '../assets/author_avatar.png';

export const MainHeader = () => (
  <header className="main-header">
    <div className="header-left">
      <img
        src={customLogo}
        alt="Cartografía Social"
        className="header-custom-logo"
        width="44"
        height="44"
        decoding="async"
        loading="eager"
      />
      <div className="header-brand">
        <span className="header-chip">Sistema de Cartografía Social Distrital</span>
        <h1 className="header-title">Kennedy: Caracterización Social</h1>
        <span className="header-subtitle">Análisis de vulnerabilidad y presencia institucional</span>
      </div>
    </div>
    <div className="header-author-compact">
      <div className="author-info-group">
        <span className="author-name-header">SARAI YIRETH CORREDOR MIRANDA</span>
        <span className="author-subtext">Trabajo Social — U. La Salle</span>
      </div>
      <img
        src={authorAvatar}
        alt="Foto de Sarai Yireth Corredor Miranda"
        className="author-avatar-img"
        width="44"
        height="44"
        decoding="async"
        loading="lazy"
      />
    </div>
  </header>
);
