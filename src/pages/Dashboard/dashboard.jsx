// src/pages/Dashboard.jsx
import Envios from './Envios';
import Navbar from './Navbar';
import KPIs from './KPIs';

export default function Dashboard() {
  

  return (
    <div className="dashboard">
      
      <nav className="navbar">
        < Navbar />
      </nav>

      {/* Contenido principal */}
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel general</h1>
          <p className="dashboard-subtitle">
            Resumen de actividad
          </p>
        </div>

        {/* KPIs */}
        <section className="stats-grid">
          < KPIs />
        </section>

        <section className="table-container">

          <Envios />

        </section>



      </div>
    </div>
  );
}