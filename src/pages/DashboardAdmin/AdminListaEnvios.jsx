import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEnvios, setEnviosLoading } from '../../features/enviosSlice';
import { API_CESAR } from '../../api/config';
import AdminFiltros from './AdminFiltros';
import AdminTablaEnvio from './AdminTablaEnvio';
import { Spinner } from "../../components/Spinner";
import { reauth } from '../../utils/reauthUtils';
import ComprobanteModal from '../../components/ComprobanteModal';

function getUserIdFromEnvio(envio) {
  if (!envio) return "";
  const u = envio.user;
  if (typeof u === "string") return u;
  if (u && typeof u === "object") return u._id || u.id || "";
  return envio.userId || "";
}

const AdminListaEnvios = () => {
  const [error, setError] = useState(null);

  // Estados de filtros
  const [filtroFecha, setFiltroFecha] = useState('historico');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTamano, setFiltroTamano] = useState('todos');
  const [filtroUsuarioId, setFiltroUsuarioId] = useState('');
  const [fechaEspecifica, setFechaEspecifica] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Estados para modal de comprobante
  const [comprobanteModalOpen, setComprobanteModalOpen] = useState(false);
  const [selectedComprobanteUrl, setSelectedComprobanteUrl] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allEnvios = useSelector((s) => s.envios.allEnvios);
  const isLoading = useSelector((s) => s.envios.areEnviosLoading);

  // Cargar envíos cuando se monta el componente
  useEffect(() => {
    cargarEnvios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar cuando cambian los filtros de fecha/estado/tamaño (backend)
  useEffect(() => {
    cargarEnvios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroFecha, filtroEstado, filtroTamano, fechaEspecifica, fechaDesde, fechaHasta]);

  const limpiarFiltros = () => {
    setFiltroFecha('historico');
    setFiltroEstado('todos');
    setFiltroTamano('todos');
    setFiltroUsuarioId('');
    setFechaEspecifica('');
    setFechaDesde('');
    setFechaHasta('');
  };

  const cargarEnvios = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(setEnviosLoading(true));
    setError(null);

    // Construir query params para el backend
    const qs = buildQueryFromFilters({
      filtroFecha,
      filtroEstado,
      filtroTamano,
      fechaEspecifica,
      fechaDesde,
      fechaHasta,
    });

    const url = `${API_CESAR}/v1/envios${qs ? `?${qs}` : ""}`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        if (response.status === 401) throw new Error("UNAUTHORIZED");
        throw new Error("Error al cargar envíos");
      })
      .then((data) => {
        dispatch(setEnvios(data));
      })
      .catch((e) => {
        if (e.message === "UNAUTHORIZED") {
          reauth(navigate);
        } else {
          setError(e.message || "Error de conexión");
        }
      })
      .finally(() => dispatch(setEnviosLoading(false)));
  };

  // Construir query string para el backend
function buildQueryFromFilters({ filtroFecha, filtroEstado, filtroTamano, fechaEspecifica, fechaDesde, fechaHasta }) {
  const qs = new URLSearchParams();

  // Estado
  if (filtroEstado && filtroEstado !== 'todos') {
    qs.set('estado', filtroEstado);
  }

  // Tamaño
  if (filtroTamano && filtroTamano !== 'todos') {
    qs.set('tamanoPaquete', filtroTamano);
  }

  // Fechas (misma lógica que Cliente)
  if (fechaEspecifica) {
    qs.set('fecha', fechaEspecifica); // <-- ESTO ES LO QUE IMPORTA
  } else if (fechaDesde || fechaHasta) {
    if (fechaDesde) qs.set('fechaDesde', fechaDesde);
    if (fechaHasta) qs.set('fechaHasta', fechaHasta);
  } else if (filtroFecha && filtroFecha !== 'historico') {
    qs.set('ultimos', filtroFecha);
  }

  return qs.toString();
}





  // Filtrar por usuario SOLO del lado del cliente (no lo soporta el backend)
  const enviosFiltrados = allEnvios.filter((e) => {
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
  //const getDate = (e) => new Date(e.fechaRetiro || e.fechaCreacion || e.createdAt || 0);
  const getDate = (e) => parseLocalDateOnly(e.fechaRetiro || e.fecha || e.fechaCreacion || e.createdAt || 0);
  const sortedEnvios = enviosFiltrados.slice().sort((a, b) => getDate(b) - getDate(a));


  function formatearFecha(fecha) {
    if (!fecha) return "-";
    const d = parseLocalDateOnly(fecha);
    return isNaN(d) ? "-" : d.toLocaleDateString("es-UY");
  }

  const handleVerComprobante = (url) => {
    setSelectedComprobanteUrl(url);
    setComprobanteModalOpen(true);
  };


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
                <th style={{ textAlign: "center" }}>Código seguimiento</th>
                <th style={{ textAlign: "center" }}>Usuario</th>
                <th>Cliente</th>
                <th>Origen / Destino</th>
                <th style={{ textAlign: "center" }}>Categoría</th>
                <th style={{ textAlign: "center" }}>Tamaño</th>
                <th style={{ textAlign: "center" }}>Estado</th>
                <th style={{ textAlign: "center" }}>Fecha de retiro</th>
                <th style={{ textAlign: "center" }}>Hora aproximada</th>
                <th>Notas</th>
                <th style={{ textAlign: "center" }}>Comprobante</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedEnvios.map((envio) => (
                <AdminTablaEnvio
                  key={envio.id}
                  envio={envio}
                  onVerComprobante={handleVerComprobante}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ComprobanteModal
        isOpen={comprobanteModalOpen}
        onClose={() => {
          setComprobanteModalOpen(false);
          setSelectedComprobanteUrl('');
        }}
        imageUrl={selectedComprobanteUrl}
      />
    </section>
  );
};

function parseLocalDateOnly(value) {
  if (typeof value === "string") {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const [_, y, mo, d] = m;
      return new Date(Number(y), Number(mo) - 1, Number(d));
    }
  }
  return new Date(value);
}


export default AdminListaEnvios;