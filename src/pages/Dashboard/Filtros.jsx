


const Filtros = () => {
    return(
        <>
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
        </>
    )
}

export default Filtros;