import {
  PackageIcon,
  TruckIcon,
  UsersIcon,
  ClockIcon,
} from "../../components/icons";

const AdminKPIs = () => {
  return (
    <section className="stats-grid">
      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total de envíos</span>
          <div className="stat-icon stat-icon-primary">
            <PackageIcon />
          </div>
        </div>
        <div className="stat-value">156</div>
        <div className="stat-change positive">+8% este mes</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">En ruta</span>
          <div className="stat-icon stat-icon-info">
            <TruckIcon width={20} height={20} />
          </div>
        </div>
        <div className="stat-value">42</div>
        <div className="stat-change">Actualizado hace 2 min</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Usuarios activos</span>
          <div className="stat-icon stat-icon-success">
            <UsersIcon />
          </div>
        </div>
        <div className="stat-value">28</div>
        <div className="stat-change positive">3 nuevos esta semana</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Pendientes</span>
          <div className="stat-icon stat-icon-warning">
            <ClockIcon />
          </div>
        </div>
        <div className="stat-value">18</div>
        <div className="stat-change">Requieren asignación</div>
      </article>
    </section>
  );
};

export default AdminKPIs;
