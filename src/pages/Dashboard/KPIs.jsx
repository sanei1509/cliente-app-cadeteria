const KPIs = () => {
    return(
        <>
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
        </>
    )
}

export default KPIs;