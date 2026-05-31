import React from "react";
import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./style.css";
import App from "./App";

const root = document.getElementById("app");

// Flash prevention: apply saved theme immediately
(function() {
  try {
    const saved = localStorage.getItem("mapa-kennedy-theme");
    const theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}

  try {
    const a11y = JSON.parse(localStorage.getItem("mapa-kennedy-a11y") || "{}");
    if (a11y.highContrast) document.documentElement.classList.add("high-contrast");
    if (a11y.reduceMotion) document.documentElement.classList.add("reduce-motion");
    if (a11y.fontSize) document.documentElement.style.fontSize = a11y.fontSize + "%";
  } catch (e) {}
})();

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
