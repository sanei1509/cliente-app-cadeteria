import { useState } from "react";
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
import { Spinner } from "../../components/Spinner";
import ChartEntregados10Dias from "../../components/charts/ChartEntregados10Dias";

const KPIs = () => {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Obtener datos de Redux - usar allEnvios para que no cambien con filtros
  const allEnvios = useSelector((state) => state.envios.allEnvios);
  const isLoading = useSelector((state) => state.envios.areEnviosLoading);
  const userPlan = useSelector(selectUserPlan);
  const plan = userPlan?.toLowerCase() || "plus";

  // Calcular estadísticas desde TODOS los envíos (sin filtros)
  const ahora = new Date();
  const unaSemanaAtras = new Date(ahora);
  unaSemanaAtras.setDate(ahora.getDate() - 7);

  const total = allEnvios.length;
  const enTransito = allEnvios.filter((e) => e.estado === "en_ruta").length;
  const entregadosSemana = allEnvios.filter((e) => {
    if (e.estado !== "entregado") return false;
    const fechaEnvio = new Date(e.fechaActualizacion || e.fechaCreacion);
    return fechaEnvio >= unaSemanaAtras;
  }).length;
  const pendientes = allEnvios.filter((e) => e.estado === "pendiente").length;

  const stats = {
    total,
    enTransito,
    entregadosSemana,
    pendientes,
  };

  // Límite de envíos pendientes según plan
  const maxPendientes = plan === "premium" ? null : 5;
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

    {/* Contenedor de las tarjetas */}
    <section className="kpis-grid">
      {/* 1 */}
      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Envíos totales</span>
          <div className="stat-icon stat-icon-primary">
            <PackageIcon />
          </div>
        </div>
        <div className="stat-value">
          {isLoading ? (
            <Spinner color={"text-primary"} size={"spinner-border-md"} />
          ) : (
            stats.total
          )}
        </div>
        <div className="stat-change" />
      </article>

      {/* 2 */}
      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">En tránsito</span>
          <div className="stat-icon stat-icon-info">
            <TruckIcon width={20} height={20} />
          </div>
        </div>
        <div className="stat-value">
          {isLoading ? (
            <Spinner color={"text-primary"} size={"spinner-border-md"} />
          ) : (
            stats.enTransito
          )}
        </div>
        <div className="stat-change">En camino a destino</div>
      </article>

      {/* 3 */}
      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Entregados (semana)</span>
          <div className="stat-icon stat-icon-success">
            <CheckCircleIcon />
          </div>
        </div>
        <div className="stat-value">
          {isLoading ? (
            <Spinner color={"text-primary"} size={"spinner-border-md"} />
          ) : (
            stats.entregadosSemana
          )}
        </div>
        <div className="stat-change">Últimos 7 días</div>
      </article>

      {/* 4 */}
      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Envíos pendientes</span>
          <div className="stat-icon stat-icon-warning">
            <ClockIcon />
          </div>
        </div>
        <div className="stat-value">
          {isLoading ? (
            <Spinner color={"text-primary"} size={"spinner-border-md"} />
          ) : (
            stats.pendientes
          )}
        </div>

        {plan === "plus" && (
          <>
            <div className="stat-change" style={{ marginBottom: "0.5rem" }}>
              Plan Plus ({stats.pendientes}/{maxPendientes} pendientes)
            </div>

            {maxPendientes && (
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "var(--background)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(porcentajePendientes, 100)}%`,
                    height: "100%",
                    backgroundColor:
                      porcentajePendientes >= 80 ? "#f59e0b" : "#3b82f6",
                    transition: "width 0.3s ease",
                  }}
                />
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

        {plan === "premium" && (
          <div className="stat-change" style={{ color: "var(--success-color)" }}>
            Plan Premium - Sin límites ✨
          </div>
        )}
      </article>

      {/* 5: Tarjeta con el gráfico (zoomable) */}
{/* 5: Tarjeta con el gráfico (zoom grande) */}
<article className="stat-card stat-card--wide stat-card--hover-zoom">
  <div className="stat-header">
    <span
      className="stat-label"
      style={{ display: "block", width: "100%", textAlign: "center" }}
    >
      
    </span>
  </div>
  <div className="stat-value" style={{ fontSize: "0.9rem" }} />
  
  {/* WRAPPER para aplicar el zoom interno */}
  <div className="chart-zoom">
    <div className="chart-zoom__inner">
      <ChartEntregados10Dias
        envios={allEnvios}
        isLoading={isLoading}
        alto={220}
      />
    </div>
  </div>
</article>

    </section>
  </>
);


};

export default KPIs;
