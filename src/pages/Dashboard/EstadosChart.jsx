import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Spinner } from "../../components/Spinner";

const EstadosChart = () => {
  const allEnvios = useSelector((state) => state.envios.allEnvios);
  const isLoading = useSelector((state) => state.envios.areEnviosLoading);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="card-title">Distribución por Estado</h3>
        <div style={{ padding: "2rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", height: "300px" }}>
          <Spinner color={"text-primary"} size={"spinner-border-md"} />
          <span>Cargando datos...</span>
        </div>
      </div>
    );
  }

  // Contar envíos por estado
  const estadosCounts = allEnvios.reduce((acc, envio) => {
    const estado = envio.estado || "sin_estado";
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  // Preparar datos para el gráfico
  const data = [
    { name: "Pendiente", value: estadosCounts.pendiente || 0, color: "#f59e0b" },
    { name: "En Ruta", value: estadosCounts.en_ruta || 0, color: "#3b82f6" },
    { name: "Entregado", value: estadosCounts.entregado || 0, color: "#10b981" },
    { name: "Cancelado", value: estadosCounts.cancelado || 0, color: "#6b7280" },
  ].filter((item) => item.value > 0); // Solo mostrar estados con envíos

  // Si no hay datos
  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="card-title">Distribución por Estado</h3>
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
          <p style={{ margin: 0, fontWeight: 600, color: data.payload.color }}>
            {data.name}
          </p>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem" }}>
            {data.value} envíos ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="card-title">Distribución por Estado</h3>
      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry) => (
                <span style={{ color: "var(--text-primary)", fontSize: "0.875rem" }}>
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EstadosChart;
