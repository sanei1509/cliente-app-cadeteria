// src/pages/Dashboard.jsx
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import Envios from "./Envios";
import Navbar from "./Navbar";
import KPIs from "./KPIs";
import EstadosChart from "./EstadosChart";
import CategoriasChart from "./CategoriasChart";
import Ultimos10DiasChart from "./Ultimos10DiasChart";

export default function Dashboard() {
  // Obtener usuario desde Redux
  const user = useSelector(selectUser);

  return (
    <div className="dashboard">
      <nav className="navbar">
        <Navbar />
      </nav>

      {/* Contenido principal */}
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title" style={{ textTransform: "none" }}>
            Bienvenido{" "}
            <span style={{ textTransform: "capitalize" }}>{user?.nombre}</span>!
          </h1>
          <p className="dashboard-subtitle">
            Aqui tienes un resumen de tus pedidos y métricas principales.
          </p>
        </div>

        {/* KPIs */}
        <section className="stats-grid">
          <KPIs />
        </section>

        {/* Gráficos */}
        <section className="charts-grid">
          <EstadosChart />
          <CategoriasChart />
          <Ultimos10DiasChart />
        </section>

        {/* Envíos */}
        <section className="card">
          <Envios />
        </section>
      </div>
    </div>
  );
}
