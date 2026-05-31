import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const StatsCharts = ({ selectedFeature }) => {
  const sisbenRef = useRef(null);
  const youthRef = useRef(null);
  const radarRef = useRef(null);
  const sisbenChart = useRef(null);
  const youthChart = useRef(null);
  const radarChart = useRef(null);

  useEffect(() => {
    if (selectedFeature && selectedFeature.isUpz) {
      if (!radarRef.current) return;
      const radarCtx = radarRef.current.getContext("2d");
      if (radarChart.current) radarChart.current.destroy();
      const upzMetrics = [
        selectedFeature.pobrezaMultidimensional * 100,
        selectedFeature.pobrezaMonetaria * 100,
        selectedFeature.empleoInformal * 100,
        selectedFeature.tasaDesempleo * 100,
      ];
      const avgMetrics = [31, 25, 56, 14];
      radarChart.current = new Chart(radarCtx, {
        type: "radar",
        data: {
          labels: ["Pobreza Multid.", "Pobreza Monetaria", "Empleo Informal", "Tasa Desempleo"],
          datasets: [
            { label: `${selectedFeature.name}`, data: upzMetrics, backgroundColor: "rgba(54, 162, 235, 0.2)", borderColor: "rgb(54, 162, 235)", pointBackgroundColor: "rgb(54, 162, 235)" },
            { label: "Promedio Localidad", data: avgMetrics, backgroundColor: "rgba(255, 99, 132, 0.2)", borderColor: "rgb(255, 99, 132)", pointBackgroundColor: "rgb(255, 99, 132)" }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 80, ticks: { stepSize: 20 } } }, plugins: { title: { display: true, text: "Comparativa Socioeconomica (%)" } } }
      });
    } else {
      if (!sisbenRef.current) return;
      const sisbenCtx = sisbenRef.current.getContext("2d");
      if (sisbenChart.current) sisbenChart.current.destroy();
      sisbenChart.current = new Chart(sisbenCtx, {
        type: "doughnut",
        data: {
          labels: ["Grupo A (Extrema)", "Grupo B (Moderada)", "Grupo C (Vulnerabilidad)", "Grupo D (No pobres)"],
          datasets: [{ data: [6.0, 27.1, 46.7, 20.2], backgroundColor: ["#d73027", "#fc8d59", "#fee090", "#74add1"], borderWidth: 1 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } }, title: { display: true, text: "Distribucion Sisben IV (Mar 2025)", font: { size: 12 } } } }
      });
      if (!youthRef.current) return;
      const youthCtx = youthRef.current.getContext("2d");
      if (youthChart.current) youthChart.current.destroy();
      youthChart.current = new Chart(youthCtx, {
        type: "bar",
        data: {
          labels: ["Informal", "Formal", "Sin U.", "Con U."],
          datasets: [{ label: "Porcentaje (%)", data: [63.3, 36.7, 78.7, 21.3], backgroundColor: ["#d73027", "#1a9850", "#f46d43", "#74add1"] }]
        },
        options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, scales: { x: { max: 100, ticks: { font: { size: 9 } } }, y: { ticks: { font: { size: 9 } } } }, plugins: { legend: { display: false }, title: { display: true, text: "Empleo/Edu Jovenes", font: { size: 12 } } } }
      });
    }
    return () => {
      if (sisbenChart.current) sisbenChart.current.destroy();
      if (youthChart.current) youthChart.current.destroy();
      if (radarChart.current) radarChart.current.destroy();
    };
  }, [selectedFeature]);

  return (
    <div className="stats-charts-container">
      {selectedFeature && selectedFeature.isUpz ? (
        <div className="chart-wrapper" style={{ height: "300px", marginBottom: "20px" }}>
          <canvas ref={radarRef}></canvas>
          <p className="chart-source" style={{ fontSize: "0.75rem", textAlign: "center", marginTop: "5px" }}>Fuente: SDDE 2024</p>
        </div>
      ) : (
        <>
          <div className="chart-wrapper" style={{ height: "220px", marginBottom: "20px" }}>
            <canvas ref={sisbenRef}></canvas>
            <p className="chart-source" style={{ fontSize: "0.75rem", textAlign: "center", marginTop: "5px" }}>Fuente: Sisben IV, DNP</p>
          </div>
          <div className="chart-wrapper" style={{ height: "200px" }}>
            <canvas ref={youthRef}></canvas>
            <p className="chart-source" style={{ fontSize: "0.75rem", textAlign: "center", marginTop: "5px" }}>Fuente: SDDE, 2024</p>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsCharts;
