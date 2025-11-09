import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Spinner } from "../../components/Spinner";

const TasaExito = () => {
  const allEnvios = useSelector((state) => state.envios.allEnvios);
  const isLoading = useSelector((state) => state.envios.areEnviosLoading);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="card-title">Tasa de Éxito de Entregas</h3>
        <div style={{ padding: "2rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", height: "350px" }}>
          <Spinner color={"text-primary"} size={"spinner-border-md"} />
          <span>Cargando datos...</span>
        </div>
      </div>
    );
  }

  // Calcular métricas
  const total = allEnvios.length;
  const entregados = allEnvios.filter((e) => e.estado === "entregado").length;
  const cancelados = allEnvios.filter((e) => e.estado === "cancelado").length;
  const enRuta = allEnvios.filter((e) => e.estado === "en_ruta").length;
  const pendientes = allEnvios.filter((e) => e.estado === "pendiente").length;

  // Calcular porcentaje de éxito (solo envíos finalizados: entregados + cancelados)
  const finalizados = entregados + cancelados;
  const tasaExito = finalizados > 0 ? ((entregados / finalizados) * 100).toFixed(1) : 0;

  // Datos para el gráfico
  const data = [
    { name: "Entregados", value: entregados, color: "#10b981" },
    { name: "Cancelados", value: cancelados, color: "#ef4444" },
    { name: "En Ruta", value: enRuta, color: "#3b82f6" },
    { name: "Pendientes", value: pendientes, color: "#f59e0b" },
  ].filter((item) => item.value > 0);

  // Si no hay datos
  if (total === 0) {
    return (
      <div className="card">
        <h3 className="card-title">Tasa de Éxito de Entregas</h3>
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
          No hay datos disponibles
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
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
            {data.name}
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
      <h3 className="card-title">Tasa de Éxito de Entregas</h3>

      {/* KPI Principal */}
      <div style={{
        textAlign: "center",
        padding: "1.5rem 1rem 0.5rem",
        borderBottom: "1px solid var(--border-color)",
        marginBottom: "1rem"
      }}>
        <div style={{
          fontSize: "3rem",
          fontWeight: "700",
          color: parseFloat(tasaExito) >= 80 ? "#10b981" : parseFloat(tasaExito) >= 60 ? "#f59e0b" : "#ef4444",
          lineHeight: 1
        }}>
          {tasaExito}%
        </div>
        <div style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          marginTop: "0.5rem"
        }}>
          Tasa de éxito
        </div>
        <div style={{
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          marginTop: "0.25rem"
        }}>
          {entregados} entregados de {finalizados} finalizados
        </div>
      </div>

      {/* Gráfico de distribución */}
      <div style={{ width: "100%", height: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={true}
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
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TasaExito;
