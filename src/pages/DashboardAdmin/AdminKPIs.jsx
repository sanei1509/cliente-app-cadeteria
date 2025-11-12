import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CESAR } from '../../api/config';
import {
  PackageIcon,
  TruckIcon,
  UsersIcon,
  ClockIcon,
} from "../../components/icons";
import KPICard from "../../components/KPICard";
import { reauth } from "../../utils/reauthUtils";

const AdminKPIs = () => {
  const allEnvios = useSelector((state) => state.envios.allEnvios);
  const isLoading = useSelector((state) => state.envios.areEnviosLoading);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const navigate = useNavigate();

  // Cargar total de usuarios
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_CESAR}/v1/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) return res.json();
        if (res.status === 401) throw new Error("UNAUTHORIZED");
        return [];
      })
      .then(data => setTotalUsuarios(Array.isArray(data) ? data.length : 0))
      .catch((error) => {
        if (error.message === "UNAUTHORIZED") {
          reauth(navigate);
        } else {
          setTotalUsuarios(0);
        }
      });
  }, [navigate]);

  // Calcular estadísticas desde TODOS los envíos (sin filtros)
  const totalEnvios = Array.isArray(allEnvios) ? allEnvios.length : 0;
  const enRuta = Array.isArray(allEnvios) ? allEnvios.filter(e => e.estado === 'en_ruta').length : 0;
  const pendientes = Array.isArray(allEnvios) ? allEnvios.filter(e => e.estado === 'pendiente').length : 0;
  const entregados = Array.isArray(allEnvios) ? allEnvios.filter(e => e.estado === 'entregado').length : 0;

  return (
    <section className="stats-grid">
      <KPICard
        label="Total de envíos"
        icon={<PackageIcon />}
        iconColor="primary"
        value={totalEnvios}
        isLoading={isLoading}
        subtitle={`${entregados} entregados`}
        subtitleLoading={isLoading}
      />

      <KPICard
        label="En ruta"
        icon={<TruckIcon width={20} height={20} />}
        iconColor="info"
        value={enRuta}
        isLoading={isLoading}
        subtitle="En camino a destino"
      />

      <KPICard
        label="Usuarios registrados"
        icon={<UsersIcon />}
        iconColor="success"
        value={totalUsuarios}
        isLoading={isLoading}
        subtitle="Total en el sistema"
      />

      <KPICard
        label="Pendientes"
        icon={<ClockIcon />}
        iconColor="warning"
        value={pendientes}
        isLoading={isLoading}
        subtitle="Por recoger"
      />
    </section>
  );
};

export default AdminKPIs;
