import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  PremiumStarIcon,
} from "../../components/icons";
import { selectUserPlan } from "../../features/userSlice";
import UpgradePlanModal from "../../components/UpgradePlanModal";

const KPIs = () => {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Obtener datos de Redux
  const envios = useSelector((state) => state.envios.envios);
  const userPlan = useSelector(selectUserPlan);
  const plan = userPlan?.toLowerCase() || "plus";

  // Calcular estadísticas desde los envíos
  const stats = useMemo(() => {
    if (!Array.isArray(envios)) {
      return {
        total: 0,
        enTransito: 0,
        entregadosSemana: 0,
        pendientes: 0,
      };
    }

    const ahora = new Date();
    const unaSemanaAtras = new Date(ahora);
    unaSemanaAtras.setDate(ahora.getDate() - 7);

    return {
      total: envios.length,
      enTransito: envios.filter(e => e.estado === 'en_ruta').length,
      entregadosSemana: envios.filter(e => {
        if (e.estado !== 'entregado') return false;
        const fechaEnvio = new Date(e.fechaActualizacion || e.fechaCreacion);
        return fechaEnvio >= unaSemanaAtras;
      }).length,
      pendientes: envios.filter(e => e.estado === 'pendiente').length,
    };
  }, [envios]);

  // Límite de envíos pendientes según plan
  const maxPendientes = plan === 'premium' ? null : 5;
  const porcentajePendientes = maxPendientes 
    ? Math.round((stats.pendientes / maxPendientes) * 100) 
    : 0;

  const handleUpgradeSuccess = () => {
    setUpgradeModalOpen(false);
  };

  return (
    <>
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Envíos totales</span>
          <div className="stat-icon stat-icon-primary">
            <PackageIcon />
          </div>
        </div>
        <div className="stat-value">{stats.total}</div>
        <div className="stat-change">
          {stats.entregadosSemana} entregados esta semana
        </div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">En tránsito</span>
          <div className="stat-icon stat-icon-info">
            <TruckIcon width={20} height={20} />
          </div>
        </div>
        <div className="stat-value">{stats.enTransito}</div>
        <div className="stat-change">En camino a destino</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Entregados (semana)</span>
          <div className="stat-icon stat-icon-success">
            <CheckCircleIcon />
          </div>
        </div>
        <div className="stat-value">{stats.entregadosSemana}</div>
        <div className="stat-change">Últimos 7 días</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Envíos pendientes</span>
          <div className="stat-icon stat-icon-warning">
            <ClockIcon />
          </div>
        </div>
        <div className="stat-value">{stats.pendientes}</div>
        
        {/* Mostrar solo si el plan es PLUS */}
        {plan === "plus" && (
          <>
            <div className="stat-change" style={{ marginBottom: "0.5rem" }}>
              Plan Plus ({stats.pendientes}/{maxPendientes} pendientes)
            </div>

            {/* Barra de progreso */}
            {maxPendientes && (
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: 'var(--background)', 
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '0.75rem'
              }}>
                <div style={{
                  width: `${Math.min(porcentajePendientes, 100)}%`,
                  height: '100%',
                  backgroundColor: porcentajePendientes >= 80 ? '#f59e0b' : '#3b82f6',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            )}

            <div
              className="plan-badge-premium"
              style={{ marginTop: "0.5rem", width: "100%", cursor: "pointer" }}
              onClick={() => setUpgradeModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && setUpgradeModalOpen(true)}
            >
              <PremiumStarIcon />
              <div className="plan-badge-text">
                <span className="plan-badge-title">Actualizar a Premium</span>
                <span className="plan-badge-subtitle">
                  *sin límite de envíos pendientes
                </span>
              </div>
            </div>
          </>
        )}

        {/* Mostrar si es Premium */}
        {plan === "premium" && (
          <div className="stat-change" style={{ color: 'var(--success-color)' }}>
            Plan Premium - Sin límites ✨
          </div>
        )}
      </article>
    </>
  );
};

export default KPIs;