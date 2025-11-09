const AdminFiltros = ({
  filtroFecha,
  filtroEstado,
  filtroTamano,
  filtroUsuarioId,
  fechaEspecifica,
  fechaDesde,
  fechaHasta,
  onChangeFecha,
  onChangeEstado,
  onChangeTamano,
  onChangeUsuarioId,
  onChangeFechaEspecifica,
  onChangeFechaDesde,
  onChangeFechaHasta,
  onClear,
}) => {
  const hayCambios = !(
    filtroFecha === 'historico' &&
    filtroEstado === 'todos' &&
    filtroTamano === 'todos' &&
    !filtroUsuarioId &&
    !fechaEspecifica &&
    !fechaDesde &&
    !fechaHasta
  );

  const handleClearDates = () => {
    onChangeFechaEspecifica('');
    onChangeFechaDesde('');
    onChangeFechaHasta('');
  };

  return (
    <>
      <div className="filters-container">
        <span className="filter-label">Filtrar por fecha:</span>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${
              filtroFecha === "historico" ? "active" : ""
            }`}
            onClick={() => onChangeFecha("historico")}
          >
            Histórico
          </button>
          <button
            className={`filter-btn ${filtroFecha === "semana" ? "active" : ""}`}
            onClick={() => onChangeFecha("semana")}
          >
            Última semana
          </button>
          <button
            className={`filter-btn ${filtroFecha === "mes" ? "active" : ""}`}
            onClick={() => onChangeFecha("mes")}
          >
            Último mes
          </button>
        </div>
      </div>

      {/* Fila: filtros de fecha específicos */}
      <div className="filters-container" style={{ marginTop: "1rem" }}>
        <span className="filter-label">Filtros avanzados:</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor="fechaEspecificaAdmin" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Fecha específica:
            </label>
            <input
              id="fechaEspecificaAdmin"
              type="date"
              value={fechaEspecifica}
              onChange={(e) => onChangeFechaEspecifica(e.target.value)}
              className="form-input"
              style={{ padding: '0.5rem', minWidth: '150px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor="fechaDesdeAdmin" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Desde:
            </label>
            <input
              id="fechaDesdeAdmin"
              type="date"
              value={fechaDesde}
              onChange={(e) => onChangeFechaDesde(e.target.value)}
              className="form-input"
              style={{ padding: '0.5rem', minWidth: '150px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor="fechaHastaAdmin" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Hasta:
            </label>
            <input
              id="fechaHastaAdmin"
              type="date"
              value={fechaHasta}
              onChange={(e) => onChangeFechaHasta(e.target.value)}
              className="form-input"
              style={{ padding: '0.5rem', minWidth: '150px' }}
            />
          </div>

          {(fechaEspecifica || fechaDesde || fechaHasta) && (
            <button
              type="button"
              className="filter-btn"
              onClick={handleClearDates}
              style={{ alignSelf: 'flex-end', marginBottom: '0.25rem' }}
              title="Limpiar fechas"
            >
              Limpiar fechas
            </button>
          )}
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
            className={`filter-btn ${filtroEstado === "todos" ? "active" : ""}`}
            onClick={() => onChangeEstado("todos")}
          >
            Todos
          </button>
          <button
            type="button"
            className={`filter-btn ${
              filtroEstado === "pendiente" ? "active" : ""
            }`}
            onClick={() => onChangeEstado("pendiente")}
          >
            Pendientes
          </button>
          <button
            type="button"
            className={`filter-btn ${filtroEstado === "en_ruta" ? "active" : ""}`}
            onClick={() => onChangeEstado("en_ruta")}
          >
            En ruta
          </button>
          <button
            type="button"
            className={`filter-btn ${
              filtroEstado === "entregado" ? "active" : ""
            }`}
            onClick={() => onChangeEstado("entregado")}
          >
            Entregados
          </button>
          <button
            type="button"
            className={`filter-btn ${
              filtroEstado === "cancelado" ? "active" : ""
            }`}
            onClick={() => onChangeEstado("cancelado")}
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

    <div className="filters-container" style={{ marginTop: "1rem" }}>
      <span className="filter-label">Filtrar por tamaño:</span>
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filtroTamano === "todos" ? "active" : ""}`}
          onClick={() => onChangeTamano("todos")}
        >
          Todos
        </button>
        <button
          className={`filter-btn ${filtroTamano === "chico" ? "active" : ""}`}
          onClick={() => onChangeTamano("chico")}
        >
          Chico
        </button>
        <button
          className={`filter-btn ${filtroTamano === "mediano" ? "active" : ""}`}
          onClick={() => onChangeTamano("mediano")}
        >
          Mediano
        </button>
        <button
          className={`filter-btn ${filtroTamano === "grande" ? "active" : ""}`}
          onClick={() => onChangeTamano("grande")}
        >
          Grande
        </button>
      </div>
    </div>

    {/* NUEVO: filtro por nombre o ID de usuario */}
    <div className="filters-container" style={{ marginTop: "1rem" }}>
      <span className="filter-label">Filtrar por nombre o ID de usuario:</span>
      <div className="filter-input">
        <input
          type="text"
          value={filtroUsuarioId}
          onChange={(e) => onChangeUsuarioId(e.target.value)}
          placeholder="Ej: Cesar, Martinez, o ID de usuario"
          style={{ padding: "0.5rem", minWidth: 260 }}
        />
        {filtroUsuarioId && (
          <button
            className="filter-btn"
            style={{ marginLeft: "0.5rem" }}
            onClick={() => onChangeUsuarioId("")}
            title="Limpiar filtro de usuario"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  </>
  );
};

export default AdminFiltros;
