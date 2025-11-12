import AdminNavbar from "./AdminNavbar";
import AdminKPIs from "./AdminKPIs";
import AdminListaEnvios from "./AdminListaEnvios";
import EnviosPorUsuario from "./EnviosPorUsuario";
import TasaExito from "./TasaExito";

const DashboardAdmin = () => {
  return (
    <div className="dashboard">
      <AdminNavbar />

      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel de Administración</h1>
          <p className="dashboard-subtitle">
            Gestión global de envíos y usuarios
          </p>
        </div>

        <AdminKPIs />

        {/* Gráficas */}
        <div className="charts-grid">
          <EnviosPorUsuario />
          <TasaExito />
        </div>

        <AdminListaEnvios />
      </div>
    </div>
  );
};

export default DashboardAdmin;
