import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Spinner } from "../../components/Spinner";

const DestinosChart = () => {
  const allEnvios = useSelector((state) => state.envios.allEnvios);
  const isLoading = useSelector((state) => state.envios.areEnviosLoading);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="card-title">Top 5 Destinos Frecuentes</h3>
        <div style={{ padding: "2rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", height: "300px" }}>
          <Spinner color={"text-primary"} size={"spinner-border-md"} />
          <span>Cargando datos...</span>
        </div>
      </div>
    );
  }

  // Contar envíos por ciudad destino
  const destinosCounts = allEnvios.reduce((acc, envio) => {
    const ciudad = envio.destino?.ciudad || "Sin destino";
    acc[ciudad] = (acc[ciudad] || 0) + 1;
    return acc;
  }, {});

  // Preparar datos para el gráfico, ordenar y tomar top 5
  const data = [];
  for (const ciudad in destinosCounts) {
    data.push({
      ciudad: ciudad,
      cantidad: destinosCounts[ciudad]
    });
  }
  data.sort((a, b) => b.cantidad - a.cantidad);
  // Tomar solo los primeros 5
  const top5Data = [];
  for (let i = 0; i < 5 && i < data.length; i++) {
    top5Data.push(data[i]);
  }
  // Gradiente de colores de naranja a azul
  const COLORS = ["#ff6b35", "#ff8c5a", "#ffa87e", "#3b82f6", "#60a5fa"];

  // Si no hay datos
  if (top5Data.length === 0) {
    return (
      <div className="card">
        <h3 className="card-title">Top 5 Destinos Frecuentes</h3>
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
            {data.payload.ciudad}
          </p>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {data.value} envíos ({percentage}% del total)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="card-title">Top 5 Destinos Frecuentes</h3>
      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={top5Data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              type="number"
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="ciudad"
              tick={{ fill: "var(--text-primary)", fontSize: 13 }}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
            <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
              {top5Data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DestinosChart;
