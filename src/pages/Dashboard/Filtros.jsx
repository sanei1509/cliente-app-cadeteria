const Filtros = ({ filtroFecha, filtroEstado, onChangeFecha, onChangeEstado }) => (
  <>
    <div className="filters-container">
      <span className="filter-label">Filtrar por fecha:</span>
      <div className="filter-buttons">
        <button className={`filter-btn ${filtroFecha==='historico'?'active':''}`} onClick={() => onChangeFecha('historico')}>Histórico</button>
        <button className={`filter-btn ${filtroFecha==='semana'?'active':''}`}    onClick={() => onChangeFecha('semana')}>Última semana</button>
        <button className={`filter-btn ${filtroFecha==='mes'?'active':''}`}       onClick={() => onChangeFecha('mes')}>Último mes</button>
      </div>
    </div>

    <div className="filters-container" style={{ marginTop: '1rem' }}>
      <span className="filter-label">Filtrar por estado:</span>
      <div className="filter-buttons">
        <button className={`filter-btn ${filtroEstado==='todos'?'active':''}`}      onClick={() => onChangeEstado('todos')}>Todos</button>
        <button className={`filter-btn ${filtroEstado==='pendiente'?'active':''}`}  onClick={() => onChangeEstado('pendiente')}>Pendientes</button>
        <button className={`filter-btn ${filtroEstado==='en_ruta'?'active':''}`}    onClick={() => onChangeEstado('en_ruta')}>En ruta</button>
        <button className={`filter-btn ${filtroEstado==='entregado'?'active':''}`}  onClick={() => onChangeEstado('entregado')}>Entregados</button>
        <button className={`filter-btn ${filtroEstado==='cancelado'?'active':''}`}  onClick={() => onChangeEstado('cancelado')}>Cancelados</button>
      </div>
    </div>
  </>
);
export default Filtros;