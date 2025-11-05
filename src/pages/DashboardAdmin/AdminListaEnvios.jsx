import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEnvios, setEnviosLoading } from '../../features/enviosSlice';
import { API_CESAR } from '../../api/config';
import AdminFiltros from './AdminFiltros';
import AdminTablaEnvio from './AdminTablaEnvio';

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const envios = useSelector((s) => s.envios.envios);
  const isLoading = useSelector((s) => s.envios.areEnviosLoading);

  // Cargar envíos cuando cambian los filtros
  useEffect(() => {
    cargarEnvios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroFecha, filtroEstado, filtroTamano, filtroUsuarioId]);

  const cargarEnvios = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const params = new URLSearchParams();

    // Filtro de estado
    if (filtroEstado !== 'todos') {
      params.set('estado', filtroEstado);
    }
    // Filtro de tamaño
    if (filtroTamano !== 'todos') {
      params.set('tamanoPaquete', filtroTamano);
    }
    // Filtro de fecha
    if (filtroFecha === 'semana') {
      params.set('ultimos', 'semana');
    } else if (filtroFecha === 'mes') {
      params.set('ultimos', 'mes');
    }
    // Filtro por usuario (server-side si tu API lo soporta)
    const userIdTrim = filtroUsuarioId.trim();
    if (userIdTrim) {
      // Pongo ambos por compatibilidad (tu back usa "user" en el modelo)
      params.set('userId', userIdTrim);
      params.set('user', userIdTrim);
    }

    dispatch(setEnviosLoading(true));
    setError(null);

    fetch(`${API_CESAR}/v1/envios?${params.toString()}`, {
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
        dispatch(setEnvios(data));
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

  // Pre-filtrado por ID o nombre de usuario (client-side fallback si el back no filtra)
  const preFiltrados = useMemo(() => {
    if (!Array.isArray(envios)) return [];
    const needle = (filtroUsuarioId || "").trim().toLowerCase();
    if (!needle) return envios;

    return envios.filter((e) => {
      const uid = getUserIdFromEnvio(e).toLowerCase();
      // Buscar por ID (incluye los primeros 8 caracteres)
      if (uid.includes(needle)) return true;

      // Buscar por nombre o apellido del usuario
      if (e.user && typeof e.user === 'object') {
        const nombre = (e.user.nombre || '').toLowerCase();
        const apellido = (e.user.apellido || '').toLowerCase();
        const username = (e.user.username || '').toLowerCase();
        const nombreCompleto = `${nombre} ${apellido}`.trim();

        return nombre.includes(needle) ||
               apellido.includes(needle) ||
               username.includes(needle) ||
               nombreCompleto.includes(needle);
      }

      return false;
    });
  }, [envios, filtroUsuarioId]);

  // Ordenar envíos: más recientes primero
  const sortedEnvios = useMemo(() => {
    const getDate = (e) => new Date(e.fechaRetiro || e.fechaCreacion || e.createdAt || 0);
    return preFiltrados.slice().sort((a, b) => getDate(b) - getDate(a));
  }, [preFiltrados]);

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
        filtroUsuarioId={filtroUsuarioId}            // << NUEVO
        onChangeFecha={setFiltroFecha}
        onChangeEstado={setFiltroEstado}
        onChangeTamano={setFiltroTamano}
        onChangeUsuarioId={setFiltroUsuarioId}       // << NUEVO
      />

      {isLoading && (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Cargando envíos...</p>
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

export default AdminListaEnvios;
