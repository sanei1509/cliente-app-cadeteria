import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { API_CESAR } from '../../api/config';
import {
  PackageIcon,
  TruckIcon,
  UsersIcon,
  ClockIcon,
} from "../../components/icons";
import { Spinner } from "../../components/Spinner";

const AdminKPIs = () => {
  const allEnvios = useSelector((state) => state.envios.allEnvios);
  const isLoading = useSelector((state) => state.envios.areEnviosLoading);
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  // Cargar total de usuarios
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_CESAR}/v1/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setTotalUsuarios(Array.isArray(data) ? data.length : 0))
      .catch(() => setTotalUsuarios(0));
  }, []);

  // Calcular estadísticas desde TODOS los envíos (sin filtros)
  const totalEnvios = Array.isArray(allEnvios) ? allEnvios.length : 0;
  const enRuta = Array.isArray(allEnvios) ? allEnvios.filter(e => e.estado === 'en_ruta').length : 0;
  const pendientes = Array.isArray(allEnvios) ? allEnvios.filter(e => e.estado === 'pendiente').length : 0;
  const entregados = Array.isArray(allEnvios) ? allEnvios.filter(e => e.estado === 'entregado').length : 0;

  return (
    <section className="stats-grid">
      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total de envíos</span>
          <div className="stat-icon stat-icon-primary">
            <PackageIcon />
          </div>
        </div>
        <div className="stat-value">
          {isLoading ? (
            <Spinner color={"text-primary"} size={"spinner-border-md"} />
          ) : (
            totalEnvios
          )}
        </div>
        <div className="stat-change">
          {isLoading ? (
            <Spinner color={"text-primary"} size={"spinner-border-sm"} />
          ) : (
            `${entregados} entregados`
          )}
        </div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">En ruta</span>
          <div className="stat-icon stat-icon-info">
            <TruckIcon width={20} height={20} />
          </div>
        </div>
        <div className="stat-value">
          {isLoading ? (
            <Spinner color={"text-primary"} size={"spinner-border-md"} />
          ) : (
            enRuta
          )}
        </div>
        <div className="stat-change">En camino a destino</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Usuarios registrados</span>
          <div className="stat-icon stat-icon-success">
            <UsersIcon />
          </div>
        </div>
        <div className="stat-value">
          {isLoading ? (
            <Spinner color={"text-primary"} size={"spinner-border-md"} />
          ) : (
            totalUsuarios
          )}
        </div>
        <div className="stat-change">Total en el sistema</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Pendientes</span>
          <div className="stat-icon stat-icon-warning">
            <ClockIcon />
          </div>
        </div>
        <div className="stat-value">
          {isLoading ? (
            <Spinner color={"text-primary"} size={"spinner-border-md"} />
          ) : (
            pendientes
          )}
        </div>
        <div className="stat-change">Por recoger</div>
      </article>
    </section>
  );
};

export default AdminKPIs;
