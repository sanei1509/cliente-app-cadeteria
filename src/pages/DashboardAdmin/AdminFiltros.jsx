const AdminFiltros = ({ 
  filtroFecha, 
  filtroEstado, 
  filtroTamano,
  filtroUsuarioId,            // << NUEVO
  onChangeFecha, 
  onChangeEstado,
  onChangeTamano,
  onChangeUsuarioId           // << NUEVO
}) => (
  <>
    <div className="filters-container">
      <span className="filter-label">Filtrar por fecha:</span>
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filtroFecha === 'historico' ? 'active' : ''}`} 
          onClick={() => onChangeFecha('historico')}
        >
          Histórico
        </button>
        <button 
          className={`filter-btn ${filtroFecha === 'semana' ? 'active' : ''}`} 
          onClick={() => onChangeFecha('semana')}
        >
          Última semana
        </button>
        <button 
          className={`filter-btn ${filtroFecha === 'mes' ? 'active' : ''}`} 
          onClick={() => onChangeFecha('mes')}
        >
          Último mes
        </button>
      </div>
    </div>

    <div className="filters-container" style={{ marginTop: '1rem' }}>
      <span className="filter-label">Filtrar por estado:</span>
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filtroEstado === 'todos' ? 'active' : ''}`} 
          onClick={() => onChangeEstado('todos')}
        >
          Todos
        </button>
        <button 
          className={`filter-btn ${filtroEstado === 'pendiente' ? 'active' : ''}`} 
          onClick={() => onChangeEstado('pendiente')}
        >
          Pendientes
        </button>
        <button 
          className={`filter-btn ${filtroEstado === 'en_ruta' ? 'active' : ''}`} 
          onClick={() => onChangeEstado('en_ruta')}
        >
          En ruta
        </button>
        <button 
          className={`filter-btn ${filtroEstado === 'entregado' ? 'active' : ''}`} 
          onClick={() => onChangeEstado('entregado')}
        >
          Entregados
        </button>
        <button 
          className={`filter-btn ${filtroEstado === 'cancelado' ? 'active' : ''}`} 
          onClick={() => onChangeEstado('cancelado')}
        >
          Cancelados
        </button>
      </div>
    </div>

    <div className="filters-container" style={{ marginTop: '1rem' }}>
      <span className="filter-label">Filtrar por tamaño:</span>
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filtroTamano === 'todos' ? 'active' : ''}`} 
          onClick={() => onChangeTamano('todos')}
        >
          Todos
        </button>
        <button 
          className={`filter-btn ${filtroTamano === 'chico' ? 'active' : ''}`} 
          onClick={() => onChangeTamano('chico')}
        >
          Chico
        </button>
        <button 
          className={`filter-btn ${filtroTamano === 'mediano' ? 'active' : ''}`} 
          onClick={() => onChangeTamano('mediano')}
        >
          Mediano
        </button>
        <button 
          className={`filter-btn ${filtroTamano === 'grande' ? 'active' : ''}`} 
          onClick={() => onChangeTamano('grande')}
        >
          Grande
        </button>
      </div>
    </div>

    {/* NUEVO: filtro por ID de usuario */}
    <div className="filters-container" style={{ marginTop: '1rem' }}>
      <span className="filter-label">Filtrar por usuario (ID):</span>
      <div className="filter-input">
        <input
          type="text"
          value={filtroUsuarioId}
          onChange={(e) => onChangeUsuarioId(e.target.value)}
          placeholder="(podés pegar los 8 primeros caracteres)"
          style={{ padding: '0.5rem', minWidth: 260 }}
        />
        {filtroUsuarioId && (
          <button
            className="filter-btn"
            style={{ marginLeft: '0.5rem' }}
            onClick={() => onChangeUsuarioId('')}
            title="Limpiar filtro de usuario"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  </>
);

export default AdminFiltros;
