import React, { Suspense } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";

const MapaKennedy = React.lazy(() => import("./MapaKennedy"));

const LoadingScreen = () => {
  const spinnerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100dvh",
    width: "100vw",
    gap: "24px",
    background: "var(--color-bg-page, #f0f2f5)",
    color: "var(--color-text-secondary, #475569)",
    fontFamily: "'Inter', system-ui, sans-serif",
  };
  const animStyle = {
    width: "40px",
    height: "40px",
    border: "3px solid var(--color-border, #e2e8f0)",
    borderTopColor: "var(--color-accent, #2563eb)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  };
  return (
    <div style={spinnerStyle}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={animStyle} />
      <div>Cargando cartografía social...</div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <Suspense fallback={<LoadingScreen />}>
          <MapaKennedy />
        </Suspense>
      </AccessibilityProvider>
    </ThemeProvider>
  );
};

export default App;
