import { PackageIcon, TruckIcon, CheckCircleIcon, ClockIcon, PremiumStarIcon } from "../../components/icons";

const KPIs = () => {
    return(
        <>
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
            <div className="stat-change" style={{ marginBottom: '0.5rem' }}>Plan Plus (máx. 5 pendientes)</div>
            <div className="plan-badge-premium" style={{ marginTop: '0.75rem', width: '100%' }}>
              <PremiumStarIcon />
              <div className="plan-badge-text">
                <span className="plan-badge-title">Actualizar a Premium</span>
                <span className="plan-badge-subtitle">*sin límite de envíos pendientes</span>
              </div>
            </div>
          </article>
        </>
    )
}

export default KPIs;