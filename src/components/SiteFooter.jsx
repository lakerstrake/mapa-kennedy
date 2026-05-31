import React from "react";

const APP_VERSION = "1.1.0";
const COMMIT = "local";

const EFI_URL = "https://efisolution.jmlagos2003.workers.dev/";
const GITHUB_URL = "https://github.com/lakerstrake";
const LINKEDIN_URL = "https://www.linkedin.com/in/juanmlagosm/";
const EMAIL = "jmlagos2003@gmail.com";

// Fecha de carga formateada en hora de Colombia (COT), estilo "31 de may de 2026, 01:21 COT"
const buildStamp = (() => {
  try {
    const fmt = new Intl.DateTimeFormat("es-CO", {
      timeZone: "America/Bogota",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
    const month = String(parts.month || "").replace(".", "");
    return `${parts.day} de ${month} de ${parts.year}, ${parts.hour}:${parts.minute} COT`;
  } catch {
    return "";
  }
})();

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.41 7.86 10.94.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.51C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.74C24 .78 23.2 0 22.22 0Z" />
  </svg>
);

export const SiteFooter = () => (
  <footer className="site-footer">
    <p className="site-footer-credit">
      © 2026{" "}
      <a href={EFI_URL} target="_blank" rel="noopener noreferrer" className="site-footer-brand">
        Efi Solution
      </a>
      . Hecho en Colombia.
    </p>

    <div className="site-footer-contact">
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="site-footer-icon" aria-label="GitHub de Efi Solution">
        <GitHubIcon />
      </a>
      <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="site-footer-icon" aria-label="LinkedIn de Juan M. Lagos">
        <LinkedInIcon />
      </a>
      <a href={`mailto:${EMAIL}`} className="site-footer-email">
        {EMAIL}
      </a>
    </div>

    <div className="site-footer-meta">
      <span className="site-footer-badge site-footer-version">v{APP_VERSION}</span>
      {buildStamp && <span className="site-footer-badge">Sync GH -&gt; CF: {buildStamp}</span>}
      <span className="site-footer-badge">Commit: {COMMIT}</span>
    </div>
  </footer>
);

export default SiteFooter;
