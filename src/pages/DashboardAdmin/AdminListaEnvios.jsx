import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEnvios, setEnviosLoading } from '../../features/enviosSlice';
import { API_CESAR } from '../../api/config';
import AdminFiltros from './AdminFiltros';
import AdminTablaEnvio from './AdminTablaEnvio';
import { Spinner } from "../../components/Spinner";

function getUserIdFromEnvio(envio) {
  // Puede venir como string o como objeto con _id/id, o campo userId
  if (!envio) return "";
  const u = envio.user;
  if (typeof u === "string") return u;
  if (u && typeof u === "object") return u._id || u.id || "";
  return envio.userId || "";
}

const AdminListaEnvios = () => {
  const [error, setError] = useState(null);
  const [filtroFecha, setFiltroFecha] = useState('historico');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTamano, setFiltroTamano] = useState('todos');
  const [filtroUsuarioId, setFiltroUsuarioId] = useState(''); // << NUEVO
  const [fechaEspecifica, setFechaEspecifica] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const limpiarFiltros = () => {
    setFiltroFecha('historico');
    setFiltroEstado('todos');
    setFiltroTamano('todos');
    setFiltroUsuarioId('');
    setFechaEspecifica('');
    setFechaDesde('');
    setFechaHasta('');
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allEnvios = useSelector((s) => s.envios.allEnvios);
  const isLoading = useSelector((s) => s.envios.areEnviosLoading);

  // Cargar TODOS los envíos solo una vez al montar el componente
  useEffect(() => {
    cargarTodosLosEnvios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarTodosLosEnvios = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(setEnviosLoading(true));
    setError(null);

    // Cargar TODOS los envíos sin filtros
    fetch(`${API_CESAR}/v1/envios`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        if (response.status === 401) throw new Error("UNAUTHORIZED");
        throw new Error("Error al cargar envíos");
      })
      .then((data) => {
        dispatch(setEnvios(data)); // Carga inicial: actualiza allEnvios y envios
      })
      .catch((e) => {
        if (e.message === "UNAUTHORIZED") {
          localStorage.clear();
          navigate("/login");
        } else {
          setError(e.message || "Error de conexión");
        }
      })
      .finally(() => dispatch(setEnviosLoading(false)));
  };

  // Función para filtrar por fecha con prioridad
  const cumpleFiltroFecha = (fechaStr) => {
    const ahora = new Date();
    const fechaEnvio = parseLocalDateOnly(fechaStr || "");
    if (Number.isNaN(fechaEnvio?.getTime?.())) return false;

    // Normalizar fechaEnvio al inicio del día
    const fechaEnvioNormalizada = startOfDay(fechaEnvio);

    // Prioridad 1: Filtro de fecha específica
    if (fechaEspecifica) {
      const fechaEsp = startOfDay(parseLocalDateOnly(fechaEspecifica));
      return fechaEnvioNormalizada.getTime() === fechaEsp.getTime();
    }

    // Prioridad 2: Filtro de rango desde-hasta
    if (fechaDesde || fechaHasta) {
      if (fechaDesde && fechaHasta) {
        const desde = startOfDay(parseLocalDateOnly(fechaDesde));
        const hasta = startOfDay(parseLocalDateOnly(fechaHasta));
        return fechaEnvioNormalizada >= desde && fechaEnvioNormalizada <= hasta;
      } else if (fechaDesde) {
        const desde = startOfDay(parseLocalDateOnly(fechaDesde));
        return fechaEnvioNormalizada >= desde;
      } else if (fechaHasta) {
        const hasta = startOfDay(parseLocalDateOnly(fechaHasta));
        return fechaEnvioNormalizada <= hasta;
      }
    }

    // Prioridad 3: Filtros rápidos (histórico, semana, mes)
    if (filtroFecha === "historico") return true;

    if (filtroFecha === "semana") {
      const unaSemanaAtras = new Date(ahora);
      unaSemanaAtras.setDate(ahora.getDate() - 7);
      const unaSemanaAtrasNormalizada = startOfDay(unaSemanaAtras);
      return fechaEnvioNormalizada >= unaSemanaAtrasNormalizada;
    }

    if (filtroFecha === "mes") {
      const unMesAtras = new Date(ahora);
      unMesAtras.setMonth(ahora.getMonth() - 1);
      const unMesAtrasNormalizado = startOfDay(unMesAtras);
      return fechaEnvioNormalizada >= unMesAtrasNormalizado;
    }

    return true;
  };

  // Aplicar TODOS los filtros del lado del cliente
  const enviosFiltrados = allEnvios.filter((e) => {
    // Filtro por estado
    if (filtroEstado !== 'todos' && e.estado !== filtroEstado) {
      return false;
    }

    // Filtro por tamaño
    if (filtroTamano !== 'todos' && e.tamanoPaquete !== filtroTamano) {
      return false;
    }

    // Filtro por fecha (usa la función con prioridad)
    const baseFecha = e.fechaRetiro || e.fechaCreacion || e.createdAt;
    if (!cumpleFiltroFecha(baseFecha)) {
      return false;
    }

    // Filtro por usuario (ID o nombre)
    const needle = (filtroUsuarioId || "").trim().toLowerCase();
    if (needle) {
      const uid = getUserIdFromEnvio(e).toLowerCase();

      // Buscar por ID
      if (uid.includes(needle)) return true;

      // Buscar por nombre, apellido o username
      if (e.user && typeof e.user === 'object') {
        const nombre = (e.user.nombre || '').toLowerCase();
        const apellido = (e.user.apellido || '').toLowerCase();
        const username = (e.user.username || '').toLowerCase();
        const nombreCompleto = `${nombre} ${apellido}`.trim();

        if (nombre.includes(needle) ||
            apellido.includes(needle) ||
            username.includes(needle) ||
            nombreCompleto.includes(needle)) {
          return true;
        }
      }

      return false; // No coincide con el filtro de usuario
    }

    return true;
  });

  // Ordenar envíos: más recientes primero
  const getDate = (e) => new Date(e.fechaRetiro || e.fechaCreacion || e.createdAt || 0);
  const sortedEnvios = enviosFiltrados.slice().sort((a, b) => getDate(b) - getDate(a));

  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">Todos los envíos</h3>
        <p className="card-subtitle" style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
          Total: {sortedEnvios.length} envío{sortedEnvios.length !== 1 ? 's' : ''}
        </p>
      </div>

      <AdminFiltros
        filtroFecha={filtroFecha}
        filtroEstado={filtroEstado}
        filtroTamano={filtroTamano}
        filtroUsuarioId={filtroUsuarioId}
        fechaEspecifica={fechaEspecifica}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onChangeFecha={setFiltroFecha}
        onChangeEstado={setFiltroEstado}
        onChangeTamano={setFiltroTamano}
        onChangeUsuarioId={setFiltroUsuarioId}
        onChangeFechaEspecifica={setFechaEspecifica}
        onChangeFechaDesde={setFechaDesde}
        onChangeFechaHasta={setFechaHasta}
        onClear={limpiarFiltros}
      />

      {isLoading && (
        <div style={{ padding: "2rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
          <Spinner color={"text-primary"} size={"spinner-border-md"} />
          <span>Cargando envíos...</span>
        </div>
      )}

      {error && (
        <div style={{ padding: "1rem", color: "#dc2626", textAlign: "center" }}>
          {error}
        </div>
      )}

      {!isLoading && !error && sortedEnvios.length === 0 && (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
          <p>No hay envíos que coincidan con los filtros seleccionados.</p>
        </div>
      )}

      {!isLoading && !error && sortedEnvios.length > 0 && (
        <div className="table-container table-container-no-shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Código seguimiento</th>
                <th>Usuario</th>
                <th>Cliente</th>
                <th>Origen / Destino</th>
                <th>Categoría</th>
                <th>Tamaño</th>
                <th>Estado</th>
                <th>Fecha de retiro</th>
                <th>Hora aproximada</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedEnvios.map((envio) => (
                <AdminTablaEnvio key={envio.id} envio={envio} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

// Helper function to normalize any date to start of day (midnight)
function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper function to parse dates locally without timezone issues
function parseLocalDateOnly(value) {
  // Si es string, extrae siempre YYYY-MM-DD y construye un Date local sin TZ
  if (typeof value === "string") {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const [_, y, mo, d] = m;
      return new Date(Number(y), Number(mo) - 1, Number(d));
    }
  }
  // Si ya es Date u otro formato, cae al parse normal
  return new Date(value);
}

export default AdminListaEnvios;
