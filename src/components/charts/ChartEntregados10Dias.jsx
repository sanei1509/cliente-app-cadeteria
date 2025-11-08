import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function toKey(d) {
  // clave YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function toLabel(d) {
  // etiqueta dd/MM
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function ChartEntregados10Dias({ envios = [], isLoading, alto = 180 }) {
  const { labels, values } = useMemo(() => {
    // últimos 10 días (incluye hoy) en orden cronológico
    const days = Array.from({ length: 10 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (9 - i));
      return d;
    });

    const indexByKey = new Map(days.map((d, i) => [toKey(d), i]));
    const counts = Array(10).fill(0);

    // contar entregados por día
    envios.forEach((e) => {
      if (e.estado !== "entregado") return;
      const fecha = new Date(e.fechaActualizacion || e.fechaCreacion);
      fecha.setHours(0, 0, 0, 0);
      const idx = indexByKey.get(toKey(fecha));
      if (idx != null) counts[idx] += 1;
    });

    return {
      labels: days.map(toLabel),
      values: counts,
    };
  }, [envios]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "ENTREGADOS (ÚLTIMOS 10 DÍAS)",
        align: "center",
        font: { size: 14, weight: "700" },
        color: "#7f8c8d",
      },
      tooltip: { intersect: false, mode: "index" },
    },
    scales: {
      x: {
        grid: { display: false },          // ✨ sin líneas verticales
        ticks: {
          autoSkip: false,                 // mostrar los 10
          maxRotation: 90,                 // ✨ “de costado”
          minRotation: 90,
        },
        offset: true,
      },
      y: {
        beginAtZero: true,
        grid: { drawBorder: false },
        ticks: { precision: 0, stepSize: 1 },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Entregados",
        data: values,
        backgroundColor: "rgba(26, 161, 229, 0.45)", // podés cambiarlo por tu --accent-color
        borderWidth: 0,
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
    ],
  };

  return (
    <div style={{ height: alto }}>
      {isLoading ? <div style={{ padding: 12 }}>Cargando…</div> : <Bar options={options} data={data} />}
    </div>
  );
}
