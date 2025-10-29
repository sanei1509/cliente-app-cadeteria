// src/pages/Dashboard.jsx
import Envios from "./Envios";
import Navbar from "./Navbar";
import KPIs from "./KPIs";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <nav className="navbar">
        <Navbar />
      </nav>

      {/* Contenido principal */}
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Bienvenido ${name}!</h1>
          <p className="dashboard-subtitle">
            Aqui tienes un resumen de tus pedidos y métricas principales.
          </p>
        </div>

        {/* KPIs */}
        <section className="stats-grid">
          <KPIs />
        </section>

        {/* Envíos */}
        <section className="card">
          <Envios />
        </section>
      </div>
    </div>
  );
}
