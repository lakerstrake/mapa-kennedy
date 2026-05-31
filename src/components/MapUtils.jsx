import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const kennedyBounds = L.latLngBounds([4.600, -74.190], [4.660, -74.130]);

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"\']/g, (ch) => {
    switch (ch) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "\"": return "&quot;";
      case "\'": return "&#39;";
      default: return ch;
    }
  });

const normalizeUpzCode = (value) =>
  String(value ?? "").toUpperCase().replace("UPZ", "").replace(/\D/g, "");

const pointInRing = (point, ring) => {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / ((yj - yi) || Number.EPSILON) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
};

const pointInPolygon = (point, rings) => {
  if (!rings || rings.length === 0) return false;
  if (!pointInRing(point, rings[0])) return false;
  for (let i = 1; i < rings.length; i += 1) {
    if (pointInRing(point, rings[i])) return false;
  }
  return true;
};

const geometryContainsPoint = (geometry, point) => {
  if (!geometry) return false;
  if (geometry.type === "Polygon") return pointInPolygon(point, geometry.coordinates);
  if (geometry.type === "MultiPolygon") return geometry.coordinates.some((rings) => pointInPolygon(point, rings));
  return false;
};

const featureContainsPoint = (feature, point) => geometryContainsPoint(feature?.geometry, point);

const createIcon = (color, svgPath) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="background:white;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:2px solid ${color};box-shadow:0 3px 8px rgba(0,0,0,0.4),inset 0 0 0 1px rgba(255,255,255,0.8);color:${color};transition:transform 0.2s ease"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

const paths = {
  building: "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" ry=\"2\"></rect><line x1=\"9\" y1=\"22\" x2=\"9\" y2=\"22\"></line><line x1=\"13\" y1=\"22\" x2=\"13\" y2=\"22\"></line><line x1=\"4\" y1=\"6\" x2=\"20\" y2=\"6\"></line><line x1=\"4\" y1=\"10\" x2=\"20\" y2=\"10\"></line><line x1=\"4\" y1=\"14\" x2=\"20\" y2=\"14\"></line><line x1=\"4\" y1=\"18\" x2=\"20\" y2=\"18\"></line>",
  hospital: "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect><path d=\"M12 7v10\"></path><path d=\"M7 12h10\"></path>",
  heart: "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\"></path>",
  users: "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path>",
  briefcase: "<rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\"></rect><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"></path>",
  book: "<path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"></path><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"></path>",
  landmark: "<line x1=\"2\" y1=\"20\" x2=\"22\" y2=\"20\"></line><path d=\"M7 11v8\"></path><path d=\"M12 11v8\"></path><path d=\"M17 11v8\"></path><path d=\"M2 11h20\"></path><path d=\"M12 2 2 7h20L12 2z\"></path>",
  user: "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle>",
};

const iconConfigs = {
  SuperCADE: { color: "#2563eb", path: paths.building },
  Salud: { color: "#ef4444", path: paths.hospital },
  "Integraci\u00f3n Social": { color: "#f97316", path: paths.users },
  "Desarrollo Local": { color: "#8b5cf6", path: paths.briefcase },
  Empleo: { color: "#10b981", path: paths.user },
  Educaci\u00f3n: { color: "#f59e0b", path: paths.book },
  Administraci\u00f3n: { color: "#64748b", path: paths.landmark },
  default: { color: "#475569", path: paths.building }
};

const iconsByType = Object.keys(iconConfigs).reduce((acc, type) => {
  acc[type] = createIcon(iconConfigs[type].color, iconConfigs[type].path);
  return acc;
}, {});

const createUpzLabelIcon = (name, isSelected, zoomLevel) => {
  let sizeClass = "";
  let factor = 0.7;
  if (zoomLevel >= 15) { sizeClass = " size-large"; factor = 1; }
  else if (zoomLevel >= 13) { factor = 0.85; }
  else { sizeClass = " size-small"; factor = 0.7; }
  const width = 110 * factor;
  const height = 22 * factor;
  return L.divIcon({
    className: "upz-label",
    html: `<div class="upz-label-inner${sizeClass}${isSelected ? " is-selected" : ""}">${name}</div>`,
    iconSize: [width, 0],
    iconAnchor: [width / 2, 0],
  });
};

export {
  escapeHtml,
  normalizeUpzCode,
  featureContainsPoint,
  kennedyBounds,
  iconsByType,
  createUpzLabelIcon,
  iconConfigs,
};

const FitToSelection = ({ selectedUpz, upzFeatures }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (!upzFeatures || upzFeatures.length === 0) {
      map.fitBounds(kennedyBounds);
      map.setMaxBounds(kennedyBounds);
      map.setMinZoom(12);
      map.setMaxZoom(18);
      return;
    }
    if (!selectedUpz || selectedUpz === "all") {
      const bounds = L.geoJSON({ type: "FeatureCollection", features: upzFeatures }).getBounds();
      map.fitBounds(bounds);
      map.setMaxBounds(bounds);
      map.setMinZoom(12);
      map.setMaxZoom(18);
      return;
    }
    const feature = upzFeatures.find((f) => String(f.properties.UPlCodigo) === String(selectedUpz));
    if (feature) {
      const bounds = L.geoJSON(feature).getBounds();
      map.fitBounds(bounds);
    }
  }, [map, selectedUpz, upzFeatures]);
  return null;
};

const ZoomWatcher = ({ onZoomChange }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    onZoomChange(map.getZoom());
    const handle = () => onZoomChange(map.getZoom());
    map.on("zoomend", handle);
    return () => { map.off("zoomend", handle); };
  }, [map, onZoomChange]);
  return null;
};

export { FitToSelection, ZoomWatcher };

const formatPercent = (value) => `${Math.round(value * 100)}%`;

export { formatPercent };
