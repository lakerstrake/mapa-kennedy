import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AccessibilityContext = createContext();
const STORAGE_KEY = "mapa-kennedy-a11y";

const getDefaults = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { fontSize: 100, highContrast: false, reduceMotion: false };
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(getDefaults);
  useEffect(() => {
    const html = document.documentElement;
    html.style.fontSize = `${settings.fontSize}%`;
    html.classList.toggle("high-contrast", settings.highContrast);
    html.classList.toggle("reduce-motion", settings.reduceMotion);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);
  const updateSetting = useCallback((key, value) => setSettings(prev => ({ ...prev, [key]: value })), []);
  return (
    <AccessibilityContext.Provider value={{ ...settings, updateSetting }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
};
