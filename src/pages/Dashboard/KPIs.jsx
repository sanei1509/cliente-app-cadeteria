import { PackageIcon, TruckIcon, CheckCircleIcon, ClockIcon, PremiumStarIcon } from "../../components/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserPlan } from "../../features/userSlice";
import UpgradePlanModal from "../../components/UpgradePlanModal";

const KPIs = () => {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Obtener plan del usuario desde Redux
  const userPlan = useSelector(selectUserPlan);
  const plan = userPlan.toLowerCase();

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
          <span className="stat-label">Envíos pendientes</span>
          <div className="stat-icon stat-icon-primary">
            <PackageIcon />
          </div>
        </div>
        <div className="stat-value">24</div>
        <div className="stat-change positive">+12% vs ayer</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">En tránsito</span>
          <div className="stat-icon stat-icon-info">
            <TruckIcon width={20} height={20} />
          </div>
        </div>
        <div className="stat-value">42</div>
        <div className="stat-change">Actualizado hace 5 min</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Entregados (semana)</span>
          <div className="stat-icon stat-icon-success">
            <CheckCircleIcon />
          </div>
        </div>
        <div className="stat-value">128</div>
        <div className="stat-change positive">+6% semanal</div>
      </article>

      <article className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Envíos pendientes</span>
          <div className="stat-icon stat-icon-warning">
            <ClockIcon />
          </div>
        </div>
        <div className="stat-value">2</div>
        {/* Mostrar solo si el plan es PLUS */}
        {plan === "plus" && (
          <>
            <div className="stat-change" style={{ marginBottom: '0.5rem' }}>
              Plan Plus (máx. 5 pendientes)
            </div>

            <div
              className="plan-badge-premium"
              style={{ marginTop: '0.75rem', width: '100%', cursor: 'pointer' }}
              onClick={() => setUpgradeModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && setUpgradeModalOpen(true)}
            >
              <PremiumStarIcon />
              <div className="plan-badge-text">
                <span className="plan-badge-title">Actualizar a Premium</span>
                <span className="plan-badge-subtitle">*sin límite de envíos pendientes</span>
              </div>
            </div>
          </>
        )}
      </article>
    </>
  )
}

export default KPIs;