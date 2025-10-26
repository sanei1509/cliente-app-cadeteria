// src/components/admin/AdminKPIs.jsx

const AdminKPIs = () => {
  return (
    <section className="stats-grid">
      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total de envíos</span>
          <div className="stat-icon stat-icon-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 6h13l4 4v8a2 2 0 0 1-2 2H3z" />
            </svg>
          </div>
        </div>
        <div className="stat-value">156</div>
        <div className="stat-change positive">+8% este mes</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">En ruta</span>
          <div className="stat-icon stat-icon-info">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 12h20M12 2v20" />
            </svg>
          </div>
        </div>
        <div className="stat-value">42</div>
        <div className="stat-change">Actualizado hace 2 min</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Usuarios activos</span>
          <div className="stat-icon stat-icon-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            </svg>
          </div>
        </div>
        <div className="stat-value">28</div>
        <div className="stat-change positive">3 nuevos esta semana</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Pendientes</span>
          <div className="stat-icon stat-icon-warning">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </div>
        </div>
        <div className="stat-value">18</div>
        <div className="stat-change">Requieren asignación</div>
      </article>
    </section>
  );
}

export default AdminKPIs;