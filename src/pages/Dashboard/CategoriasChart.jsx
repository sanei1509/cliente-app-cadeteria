import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Spinner } from "../../components/Spinner";

const CategoriasChart = () => {
  const allEnvios = useSelector((state) => state.envios.allEnvios);
  const isLoading = useSelector((state) => state.envios.areEnviosLoading);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="card-title">Distribución por Categoría</h3>
        <div style={{ padding: "2rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", height: "300px" }}>
          <Spinner color={"text-primary"} size={"spinner-border-md"} />
          <span>Cargando datos...</span>
        </div>
      </div>
    );
  }

  // Contar envíos por categoría
  const categoriasCounts = allEnvios.reduce((acc, envio) => {
    const categoria = envio.categoria?.nombre || envio.category?.name || "Sin categoría";
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {});

  // Preparar datos para el gráfico y ordenar por cantidad descendente
  const data = [];
  for (const nombre in categoriasCounts) {
    data.push({
      nombre: nombre,
      cantidad: categoriasCounts[nombre]
    });
  }
  data.sort((a, b) => b.cantidad - a.cantidad);

  // Colores para las barras
  const COLORS = ["#ff6b35", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];

  // Si no hay datos
  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="card-title">Distribución por Categoría</h3>
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
          No hay datos disponibles
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = allEnvios.length;
      const percentage = ((data.value / total) * 100).toFixed(1);

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
            {data.payload.nombre}
          </p>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {data.value} envíos ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="card-title">Distribución por Categoría</h3>
      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="nombre"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
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

export default CategoriasChart;
