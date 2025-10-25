// src/pages/Dashboard.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* Navbar superior (usa tus clases .navbar, .navbar-content, etc.) */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="navbar-brand-icon">
              {/* Ícono simple */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M3 6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
              </svg>
            </div>
            CadeteríaApp
          </div>

          <div className="navbar-menu">
          </div>

          <div className="navbar-user" /*onClick={aca la logica de solicitar cambiar de plan}*/ >
            <span className="plan-badge" title="Pasar a plan Premium" style={{ cursor: 'pointer' }}>
              <svg viewBox="0 0 24 24"><path d="M12 2l4 4-4 4-4-4 4-4z" /></svg>
              Plan Plus
            </span>
            <div className="navbar-avatar">CM</div>
            <button className="btn btn-ghost" onClick={logout}>Salir</button>
          </div>
        </div>
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
          <article className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Envíos pendientes</span>
              <div className="stat-icon stat-icon-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 6h13l4 4v8a2 2 0 0 1-2 2H3z" />
                </svg>
              </div>
            </div>
            <div className="stat-value">24</div>
            <div className="stat-change positive">+12% vs ayer</div>
          </article>

          <article className="stat-card">
            <div className="stat-header">
              <span className="stat-label">En tránsito</span>
              <div className="stat-icon stat-icon-info">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 12h20M12 2v20" />
                </svg>
              </div>
            </div>
            <div className="stat-value">42</div>
            <div className="stat-change">Actualizado hace 5 min</div>
          </article>

          <article className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Entregados (semana)</span>
              <div className="stat-icon stat-icon-success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>
            <div className="stat-value">128</div>
            <div className="stat-change positive">+6% semanal</div>
          </article>

          <article className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Envíos pendientes</span>
              <div className="stat-icon stat-icon-warning">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l4 4-4 4-4-4 4-4z" />
                </svg>
              </div>
            </div>
            <div className="stat-value">2</div>
            <div className="stat-change" style={{ marginBottom: '0.5rem' }}>Plan Plus (máx. 5 pendientes)</div>
            <button 
              className="btn btn-primary" 
              style={{ 
                fontSize: '0.75rem', 
                padding: '0.4rem 0.8rem', 
                marginTop: '0.5rem',
                width: '100%'
              }}
              title="Envíos pendientes ilimitados"
            >
              Pasate a Premium
            </button>
          </article>
        </section>

        {/* Layout principal}
        {/* Envíos recientes a todo el ancho */}
        <section className="table-container">
          <div className="card-header flex-between">
            <div>
              <h3 className="card-title">Envíos</h3>
            </div>

            <button
              className="btn btn-primary"
              style={{ minWidth: '250px' }}
              onClick={() => {
                // TODO: navegar o abrir modal de alta
                // navigate("/envios/nuevo")
              }}
            >
              Registrar envío
            </button>
          </div>

          <div className="filters-container">
            <span className="filter-label">Filtrar por fecha:</span>
            <div className="filter-buttons">
              <button className="filter-btn active">Histórico</button>
              <button className="filter-btn">Última semana</button>
              <button className="filter-btn">Último mes</button>
            </div>
          </div>

          <div className="filters-container" style={{ marginTop: '1rem' }}>
            <span className="filter-label">Filtrar por estado:</span>
            <div className="filter-buttons">
              <button className="filter-btn active">Todos</button>
              <button className="filter-btn">Pendientes</button>
              <button className="filter-btn">En ruta</button>
              <button className="filter-btn">Entregados</button>
              <button className="filter-btn">Cancelados</button>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Código seguimiento</th>
                <th>Origen / Destino</th>
                <th>Categoría</th>
                <th>Tamaño</th>
                <th>Estado</th>
                <th>Fecha de retiro</th>
                <th>Hora aproximada</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TRK-001-2025</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Montevideo</div>
                    <div><strong>Destino:</strong> Canelones</div>
                  </div>
                </td>
                <td>Documentos</td>
                <td>Chico</td>
                <td><span className="badge badge-warning">Pendiente</span></td>
                <td>25/10/2025</td>
                <td>14:00 - 16:00</td>
                <td>Documentos importantes</td>
                <td>
                  <button className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}>Cancelar</button>
                </td>
              </tr>
              <tr>
                <td>TRK-002-2025</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Montevideo</div>
                    <div><strong>Destino:</strong> Punta del Este</div>
                  </div>
                </td>
                <td>Electrónicos</td>
                <td>Mediano</td>
                <td><span className="badge badge-info" style={{ whiteSpace: 'nowrap' }}>En ruta</span></td>
                <td>25/10/2025</td>
                <td>10:00 - 12:00</td>
                <td>Frágil - manejar con cuidado</td>
                <td></td>
              </tr>
              <tr>
                <td>TRK-003-2025</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Maldonado</div>
                    <div><strong>Destino:</strong> Montevideo</div>
                  </div>
                </td>
                <td>Paquetería</td>
                <td>Grande</td>
                <td><span className="badge badge-success">Entregado</span></td>
                <td>24/10/2025</td>
                <td>09:00 - 11:00</td>
                <td>-</td>
                <td></td>
              </tr>
              <tr>
                <td>TRK-004-2025</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Colonia</div>
                    <div><strong>Destino:</strong> Montevideo</div>
                  </div>
                </td>
                <td>Documentos</td>
                <td>Chico</td>
                <td><span className="badge badge-info" style={{ whiteSpace: 'nowrap' }}>En ruta</span></td>
                <td>25/10/2025</td>
                <td>15:00 - 17:00</td>
                <td>Llamar antes de entregar</td>
                <td></td>
              </tr>
              <tr>
                <td>TRK-005-2025</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Montevideo</div>
                    <div><strong>Destino:</strong> Salto</div>
                  </div>
                </td>
                <td>Paquetería</td>
                <td>Mediano</td>
                <td><span className="badge badge-warning">Pendiente</span></td>
                <td>26/10/2025</td>
                <td>13:00 - 15:00</td>
                <td>Dirección difícil de encontrar</td>
                <td>
                  <button className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}>Editar</button>
                  <button className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}>Cancelar</button>
                </td>
              </tr>
              <tr>
                <td>TRK-006-2025</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Paysandú</div>
                    <div><strong>Destino:</strong> Montevideo</div>
                  </div>
                </td>
                <td>Documentos</td>
                <td>Chico</td>
                <td><span className="badge badge-success">Entregado</span></td>
                <td>24/10/2025</td>
                <td>11:00 - 13:00</td>
                <td>Firmado por portería</td>
                <td></td>
              </tr>
              <tr>
                <td>TRK-007-2025</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Montevideo</div>
                    <div><strong>Destino:</strong> Rivera</div>
                  </div>
                </td>
                <td>Electrónicos</td>
                <td>Grande</td>
                <td><span className="badge badge-secondary">Cancelado</span></td>
                <td>25/10/2025</td>
                <td>16:00 - 18:00</td>
                <td>Cliente solicitó cancelación</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}