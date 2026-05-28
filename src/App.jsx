import React, { lazy, Suspense } from 'react';

// Code-split: Leaflet + react-leaflet + cluster (~400 KiB) load only after
// the initial paint, eliminating them from the critical JS path.
const MapaKennedy = lazy(() =>
  import('./MapaKennedy.jsx').then((m) => ({ default: m.MapaKennedy }))
);

const LoadingScreen = () => (
  <div
    role="status"
    aria-label="Cargando aplicación"
    style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
    }}
  >
    <div
      style={{
        border: '4px solid #cbd5e1',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        marginBottom: '15px',
      }}
    />
    <p style={{ color: '#0f172a', margin: 0, fontSize: '1rem', fontWeight: 600 }}>
      Cargando cartografía…
    </p>
    <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
  </div>
);

const App = () => (
  <Suspense fallback={<LoadingScreen />}>
    <MapaKennedy />
  </Suspense>
);

export default App;
