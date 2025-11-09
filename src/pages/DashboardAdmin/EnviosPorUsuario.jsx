import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Spinner } from "../../components/Spinner";

const EnviosPorUsuario = () => {
  const allEnvios = useSelector((state) => state.envios.allEnvios);
  const isLoading = useSelector((state) => state.envios.areEnviosLoading);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="card-title">Top 10 Empresas Más Activas</h3>
        <div style={{ padding: "2rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", height: "350px" }}>
          <Spinner color={"text-primary"} size={"spinner-border-md"} />
          <span>Cargando datos...</span>
        </div>
      </div>
    );
  }

  // Contar envíos por empresa
  const empresasCounts = allEnvios.reduce((acc, envio) => {
    // Obtener información del usuario y su empresa
    const user = envio.user;
    let empresaName = "Sin identificar";

    if (user) {
      if (typeof user === "object") {
        // Prioridad: empresa > username > "Sin identificar"
        if (user.empresa && user.empresa.trim() !== "") {
          empresaName = user.empresa;
        } else if (user.username) {
          empresaName = user.username;
        }
      } else if (typeof user === "string") {
        empresaName = user;
      }
    }

    if (!acc[empresaName]) {
      acc[empresaName] = {
        nombre: empresaName,
        cantidad: 0,
      };
    }
    acc[empresaName].cantidad++;
    return acc;
  }, {});

  // Preparar datos para el gráfico, ordenar y tomar top 10
  const data = Object.entries(empresasCounts)
    .map(([empresaName, info]) => ({
      empresa: info.nombre,
      cantidad: info.cantidad,
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10); // Top 10

  // Gradiente de colores de naranja a azul
  const COLORS = [
    "#ff6b35", "#ff7a45", "#ff8955", "#ff9865", "#ffa775",
    "#6ba3ff", "#5b93ff", "#4b83ff", "#3b73f6", "#2b63e6"
  ];

  // Si no hay datos
  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="card-title">Top 10 Empresas Más Activas</h3>
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
            {data.payload.empresa}
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
      <h3 className="card-title">Top 10 Empresas Más Activas</h3>
      <div style={{ width: "100%", height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              type="number"
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="empresa"
              tick={{ fill: "var(--text-primary)", fontSize: 12 }}
              width={140}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
            <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
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

export default EnviosPorUsuario;
