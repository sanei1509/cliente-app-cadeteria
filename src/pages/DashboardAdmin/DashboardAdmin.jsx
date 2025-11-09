import AdminNavbar from './AdminNavbar';
import AdminKPIs from './AdminKPIs';
import AdminListaEnvios from './AdminListaEnvios';
import EnviosPorUsuario from './EnviosPorUsuario';
import TasaExito from './TasaExito';

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
}

export default DashboardAdmin;






`{/*

import { Link, useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* Navbar superior */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="navbar-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M3 6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
              </svg>
            </div>
            CadeteríaApp
          </div>

          <div className="navbar-menu">
          </div>

          <div className="navbar-user">
            <span className="plan-badge" style={{ background: '#dc2626' }}>
              <svg viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" /></svg>
              Admin
            </span>
            <div className="navbar-avatar">AD</div>
            <button className="btn btn-ghost" onClick={logout}>Salir</button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel de Administración</h1>
          <p className="dashboard-subtitle">
            Gestión global de envíos y usuarios
          </p>
        </div>

        {/* KPIs Globales */}
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

        {/* Tabla de todos los envíos */}
        <section className="table-container">
          <div className="card-header flex-between">
            <div>
              <h3 className="card-title">Todos los envíos</h3>
            </div>
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

          <div className="filters-container" style={{ marginTop: '1rem' }}>
            <span className="filter-label">Filtrar por tamaño:</span>
            <div className="filter-buttons">
              <button className="filter-btn active">Todos</button>
              <button className="filter-btn">Chico</button>
              <button className="filter-btn">Mediano</button>
              <button className="filter-btn">Grande</button>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Código seguimiento</th>
                <th>Usuario</th>
                <th>Cliente</th>
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
                <td>usuario1</td>
                <td>Juan Pérez</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Montevideo</div>
                    <div><strong>Destino:</strong> Canelones</div>
                  </div>
                </td>
                <td>Documentos</td>
                <td>Chico</td>
                <td>
                  <select className="badge badge-warning" style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_ruta">En ruta</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
                <td>25/10/2025</td>
                <td>14:00 - 16:00</td>
                <td>Documentos importantes</td>
                <td>
                  <button className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}>Editar</button>
                  <button className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}>Eliminar</button>
                </td>
              </tr>
              <tr>
                <td>TRK-002-2025</td>
                <td>maria_g</td>
                <td>María González</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Montevideo</div>
                    <div><strong>Destino:</strong> Punta del Este</div>
                  </div>
                </td>
                <td>Electrónicos</td>
                <td>Mediano</td>
                <td>
                  <select className="badge badge-info" style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_ruta" selected>En ruta</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
                <td>25/10/2025</td>
                <td>10:00 - 12:00</td>
                <td>Frágil - manejar con cuidado</td>
                <td>
                  <button className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}>Editar</button>
                  <button className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}>Eliminar</button>
                </td>
              </tr>
              <tr>
                <td>TRK-003-2025</td>
                <td>carlos_r</td>
                <td>Carlos Rodríguez</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Maldonado</div>
                    <div><strong>Destino:</strong> Montevideo</div>
                  </div>
                </td>
                <td>Paquetería</td>
                <td>Grande</td>
                <td>
                  <select className="badge badge-success" style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_ruta">En ruta</option>
                    <option value="entregado" selected>Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
                <td>24/10/2025</td>
                <td>09:00 - 11:00</td>
                <td>-</td>
                <td>
                  <button className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}>Editar</button>
                  <button className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}>Eliminar</button>
                </td>
              </tr>
              <tr>
                <td>TRK-004-2025</td>
                <td>ana_m</td>
                <td>Ana Martínez</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Colonia</div>
                    <div><strong>Destino:</strong> Montevideo</div>
                  </div>
                </td>
                <td>Documentos</td>
                <td>Chico</td>
                <td>
                  <select className="badge badge-info" style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_ruta" selected>En ruta</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
                <td>25/10/2025</td>
                <td>15:00 - 17:00</td>
                <td>Llamar antes de entregar</td>
                <td>
                  <button className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}>Editar</button>
                  <button className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}>Eliminar</button>
                </td>
              </tr>
              <tr>
                <td>TRK-005-2025</td>
                <td>roberto_s</td>
                <td>Roberto Silva</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Montevideo</div>
                    <div><strong>Destino:</strong> Salto</div>
                  </div>
                </td>
                <td>Paquetería</td>
                <td>Mediano</td>
                <td>
                  <select className="badge badge-warning" style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                    <option value="pendiente" selected>Pendiente</option>
                    <option value="en_ruta">En ruta</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
                <td>26/10/2025</td>
                <td>13:00 - 15:00</td>
                <td>Dirección difícil de encontrar</td>
                <td>
                  <button className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}>Editar</button>
                  <button className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}>Eliminar</button>
                </td>
              </tr>
              <tr>
                <td>TRK-006-2025</td>
                <td>laura_f</td>
                <td>Laura Fernández</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Paysandú</div>
                    <div><strong>Destino:</strong> Montevideo</div>
                  </div>
                </td>
                <td>Documentos</td>
                <td>Chico</td>
                <td>
                  <select className="badge badge-success" style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_ruta">En ruta</option>
                    <option value="entregado" selected>Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
                <td>24/10/2025</td>
                <td>11:00 - 13:00</td>
                <td>Firmado por portería</td>
                <td>
                  <button className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}>Editar</button>
                  <button className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}>Eliminar</button>
                </td>
              </tr>
              <tr>
                <td>TRK-007-2025</td>
                <td>diego_m</td>
                <td>Diego Martín</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div><strong>Origen:</strong> Montevideo</div>
                    <div><strong>Destino:</strong> Rivera</div>
                  </div>
                </td>
                <td>Electrónicos</td>
                <td>Grande</td>
                <td>
                  <select className="badge badge-secondary" style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_ruta">En ruta</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado" selected>Cancelado</option>
                  </select>
                </td>
                <td>25/10/2025</td>
                <td>16:00 - 18:00</td>
                <td>Cliente solicitó cancelación</td>
                <td>
                  <button className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.25rem', width: '70px' }}>Editar</button>
                  <button className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '70px' }}>Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

*/}`