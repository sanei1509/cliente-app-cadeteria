import { useSelector } from "react-redux";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Spinner } from "../../components/Spinner";

function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toLabel(d) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const Ultimos10DiasChart = () => {
  const allEnvios = useSelector((state) => state.envios.allEnvios);
  const isLoading = useSelector((state) => state.envios.areEnviosLoading);

  const data = useMemo(() => {
    // Últimos 10 días (incluye hoy) en orden cronológico
    const days = [];
    for (let i = 0; i < 10; i++) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (9 - i));
      days.push(d);
    }

    const indexByKey = new Map(days.map((d, i) => [toKey(d), i]));
    const counts = [];
    for (let i = 0; i < 10; i++) {
      counts.push(0);
    }

    // Contar entregados por día
    allEnvios.forEach((e) => {
      if (e.estado !== "entregado") return;
      const fecha = new Date(e.fechaActualizacion || e.fechaCreacion);
      fecha.setHours(0, 0, 0, 0);
      const idx = indexByKey.get(toKey(fecha));
      if (idx != null) counts[idx] += 1;
    });

    return days.map((d, i) => ({
      fecha: toLabel(d),
      cantidad: counts[i],
    }));
  }, [allEnvios]);

  // Gradiente de colores de azul
  const COLORS = [
    "#1aa1e5", "#2ba8e8", "#3cafeb", "#4db6ed", "#5ebdf0",
    "#6fc4f2", "#80cbf5", "#91d2f7", "#a2d9fa", "#b3e0fc"
  ];

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="card-title">Entregados (Últimos 10 Días)</h3>
        <div style={{ padding: "2rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", height: "300px" }}>
          <Spinner color={"text-primary"} size={"spinner-border-md"} />
          <span>Cargando datos...</span>
        </div>
      </div>
    );
  }

  // Si no hay datos
  const totalEntregados = data.reduce((sum, d) => sum + d.cantidad, 0);
  if (totalEntregados === 0) {
    return (
      <div className="card">
        <h3 className="card-title">Entregados (Últimos 10 Días)</h3>
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
          No hay envíos entregados en los últimos 10 días
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          style={{
            backgroundColor: "var(--surface)",
            padding: "0.75rem",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600, color: "var(--text-primary)" }}>
            {data.payload.fecha}
          </p>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {data.value} {data.value === 1 ? 'envío entregado' : 'envíos entregados'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="card-title">Entregados (Últimos 10 Días)</h3>
      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="fecha"
              tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
            <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Ultimos10DiasChart;
