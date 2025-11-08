// Filtros.jsx
const Filtros = ({
  filtroFecha,
  filtroEstado,
  onChangeFecha,
  onChangeEstado,
  onClear, // se recibe por props
}) => {
  const hayCambios = !(filtroFecha === 'historico' && filtroEstado === 'todos');

  return (
    <>
      {/* Fila: filtros por fecha */}
      <div className="filters-container">
        <span className="filter-label">Filtrar por fecha:</span>
        <div className="filter-buttons">
          <button
            type="button"
            className={`filter-btn ${filtroFecha === 'historico' ? 'active' : ''}`}
            onClick={() => onChangeFecha('historico')}
          >
            Histórico
          </button>
          <button
            type="button"
            className={`filter-btn ${filtroFecha === 'semana' ? 'active' : ''}`}
            onClick={() => onChangeFecha('semana')}
          >
            Última semana
          </button>
          <button
            type="button"
            className={`filter-btn ${filtroFecha === 'mes' ? 'active' : ''}`}
            onClick={() => onChangeFecha('mes')}
          >
            Último mes
          </button>
        </div>
      </div>

      {/* Fila: filtros por estado + botón limpiar a la derecha */}
      <div
        className="filters-container"
        style={{
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap', // mobile-friendly
        }}
      >
        {/* Bloque izquierda: label + botones de estado */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <span className="filter-label">Filtrar por estado:</span>
          <div className="filter-buttons">
            <button
              type="button"
              className={`filter-btn ${filtroEstado === 'todos' ? 'active' : ''}`}
              onClick={() => onChangeEstado('todos')}
            >
              Todos
            </button>
            <button
              type="button"
              className={`filter-btn ${filtroEstado === 'pendiente' ? 'active' : ''}`}
              onClick={() => onChangeEstado('pendiente')}
            >
              Pendientes
            </button>
            <button
              type="button"
              className={`filter-btn ${filtroEstado === 'en_ruta' ? 'active' : ''}`}
              onClick={() => onChangeEstado('en_ruta')}
            >
              En ruta
            </button>
            <button
              type="button"
              className={`filter-btn ${filtroEstado === 'entregado' ? 'active' : ''}`}
              onClick={() => onChangeEstado('entregado')}
            >
              Entregados
            </button>
            <button
              type="button"
              className={`filter-btn ${filtroEstado === 'cancelado' ? 'active' : ''}`}
              onClick={() => onChangeEstado('cancelado')}
            >
              Cancelados
            </button>
          </div>
        </div>

        {/* Bloque derecha: botón limpiar */}
        <button
          type="button"
          className={`btn-clear ${hayCambios ? '' : 'is-disabled'}`}
          onClick={onClear}
          disabled={!hayCambios}
          title={hayCambios ? 'Restablecer filtros' : 'No hay cambios para limpiar'}
          aria-label="Limpiar filtros"
        >
          Limpiar filtros
        </button>
      </div>
    </>
  );
};

export default Filtros;
