import { useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Spinner } from "../../components/Spinner";

const TendenciaEnvios = () => {
  const allEnvios = useSelector((state) => state.envios.allEnvios);
  const isLoading = useSelector((state) => state.envios.areEnviosLoading);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="card">
        <h3 className="card-title">Tendencia de Envíos (Último Mes)</h3>
        <div style={{ padding: "2rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", height: "350px" }}>
          <Spinner color={"text-primary"} size={"spinner-border-md"} />
          <span>Cargando datos...</span>
        </div>
      </div>
    );
  }

  // Función para parsear fechas localmente
  const parseLocalDateOnly = (value) => {
    if (typeof value === "string") {
      const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (m) {
        const [_, y, mo, d] = m;
        return new Date(Number(y), Number(mo) - 1, Number(d));
      }
    }
    return new Date(value);
  };

  // Función para normalizar fecha a inicio del día
  const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Obtener fecha de hace 30 días
  const hoy = startOfDay(new Date());
  const hace30Dias = new Date(hoy);
  hace30Dias.setDate(hoy.getDate() - 30);

  // Filtrar envíos del último mes
  const enviosUltimoMes = allEnvios.filter((envio) => {
    const fechaEnvio = parseLocalDateOnly(envio.fechaRetiro || envio.fechaCreacion || envio.createdAt);
    const fechaNormalizada = startOfDay(fechaEnvio);
    return fechaNormalizada >= hace30Dias && fechaNormalizada <= hoy;
  });

  // Agrupar envíos por fecha
  const enviosPorFecha = {};

  // Inicializar todos los días del último mes con 0
  for (let i = 0; i <= 30; i++) {
    const fecha = new Date(hace30Dias);
    fecha.setDate(hace30Dias.getDate() + i);
    const fechaKey = fecha.toISOString().split('T')[0];
    enviosPorFecha[fechaKey] = {
      total: 0,
      entregados: 0,
      cancelados: 0,
      pendientes: 0,
      en_ruta: 0,
    };
  }

  // Contar envíos por fecha y estado
  enviosUltimoMes.forEach((envio) => {
    const fechaEnvio = parseLocalDateOnly(envio.fechaRetiro || envio.fechaCreacion || envio.createdAt);
    const fechaKey = fechaEnvio.toISOString().split('T')[0];

    if (enviosPorFecha[fechaKey]) {
      enviosPorFecha[fechaKey].total++;
      if (envio.estado === "entregado") enviosPorFecha[fechaKey].entregados++;
      else if (envio.estado === "cancelado") enviosPorFecha[fechaKey].cancelados++;
      else if (envio.estado === "pendiente") enviosPorFecha[fechaKey].pendientes++;
      else if (envio.estado === "en_ruta") enviosPorFecha[fechaKey].en_ruta++;
    }
  });

  // Preparar datos para el gráfico
  const data = [];
  for (const fecha in enviosPorFecha) {
    const counts = enviosPorFecha[fecha];
    const dateObj = new Date(fecha + 'T00:00:00');
    data.push({
      fecha: dateObj.toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit" }),
      fechaCompleta: dateObj.toLocaleDateString("es-UY"),
      total: counts.total,
      entregados: counts.entregados,
      cancelados: counts.cancelados
    });
  }
  // Ordenar por fecha
  data.sort((a, b) => {
    const dateA = a.fecha.split('/').reverse().join('');
    const dateB = b.fecha.split('/').reverse().join('');
    return dateA.localeCompare(dateB);
  });

  // Si no hay datos
  if (data.length === 0 || enviosUltimoMes.length === 0) {
    return (
      <div className="card">
        <h3 className="card-title">Tendencia de Envíos (Último Mes)</h3>
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
          No hay envíos en el último mes
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
          <p style={{ margin: 0, fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            {payload[0]?.payload?.fechaCompleta || label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: "0.25rem 0", fontSize: "0.875rem", color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="card-title">Tendencia de Envíos (Último Mes)</h3>
      <div style={{ width: "100%", height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Total"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="entregados"
              stroke="#10b981"
              strokeWidth={2}
              name="Entregados"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="cancelados"
              stroke="#ef4444"
              strokeWidth={2}
              name="Cancelados"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TendenciaEnvios;
