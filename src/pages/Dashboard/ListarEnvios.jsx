import EditarEnvioModal from "./EditarEnvioModal";
import { API_CESAR } from "../../api/config";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEnvios, setEnviosLoading, updateEnvio } from "../../features/enviosSlice";
import { useNavigate } from "react-router-dom";
import Filtros from "./Filtros";


const ListarEnvios = () => {
  // Estado para controlar el modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEnvioId, setSelectedEnvioId] = useState(null);
  const [error, setError] = useState(null);
  const [cancelingIds, setCancelingIds] = useState(new Set());
  // Estados de filtros (cliente)
  const [filtroFecha, setFiltroFecha] = useState('historico'); // 'historico' | 'semana' | 'mes'
  const [filtroEstado, setFiltroEstado] = useState('todos');     // 'todos' | 'pendiente' | 'en_ruta' | 'entregado' | 'cancelado'


  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Obtener datos de Redux
  const envios = useSelector((s) => s.envios.envios);
  const isLoading = useSelector((s) => s.envios.areEnviosLoading);

  // Cargar envíos al montar el componente y cuando cambia el filtro
  useEffect(() => {
    cargarEnvios({ filtroFecha, filtroEstado });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroFecha, filtroEstado]);


  const cargarEnvios = ({ filtroFecha = 'historico', filtroEstado = 'todos' } = {}) => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    const params = new URLSearchParams();
    if (filtroEstado !== 'todos') params.set('estado', filtroEstado);
    if (filtroFecha === 'semana') params.set('ultimos', 'semana');
    if (filtroFecha === 'mes') params.set('ultimos', 'mes');

    dispatch(setEnviosLoading(true));
    fetch(`${API_CESAR}/v1/envios?${params.toString()}`, {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.ok) return r.json();
        if (r.status === 401) throw new Error("UNAUTHORIZED");
        throw new Error("Error al cargar envíos");
      })
      .then((data) => dispatch(setEnvios(data)))
      .catch((e) => {
        if (e.message === "UNAUTHORIZED") { localStorage.clear(); navigate("/login"); }
        else setError(e.message || "Error de conexión");
      })
      .finally(() => dispatch(setEnviosLoading(false)));
  };


  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-UY");
  };

  // Función para obtener clase del badge según estado
  const getBadgeClass = (estado) => {
    const estados = {
      pendiente: "badge-warning",
      en_ruta: "badge-info",
      entregado: "badge-success",
      cancelado: "badge-secondary",
    };
    return estados[estado] || "badge-secondary";
  };

  // Función para formatear nombre del estado
  const formatearEstado = (estado) => {
    const estados = {
      pendiente: "Pendiente",
      en_ruta: "En ruta",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return estados[estado] || estado;
  };

  const handleCancelar = (id) => {
    if (!window.confirm("¿Estás seguro de cancelar este envío?")) return;

    setCancelingIds((prev) => new Set(prev).add(id));
    const token = localStorage.getItem("token");

    fetch(`${API_CESAR}/v1/envios/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: "cancelado" }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          alert(`No se pudo cancelar: ${err?.message || res.statusText}`);
          return;
        }

        // Si tu API devuelve el envío actualizado:
        const data = await res.json().catch(() => null);

        if (data && data.id) {
          // usar el objeto devuelto
          dispatch(updateEnvio({ id: data.id, updatedEnvio: data }));
        } else {
          // fallback optimista: al menos marcar estado cancelado
          dispatch(updateEnvio({ id, updatedEnvio: { estado: "cancelado" } }));
        }
      })
      .catch((error) => {
        console.error("Error al cancelar envío:", error);
        alert("Error de conexión. Intentá nuevamente.");
      })
      .finally(() => {
        setCancelingIds((prev) => {
          const copy = new Set(prev);
          copy.delete(id);
          return copy;
        });
      });
  };

  // Logica para ordenar los envios, para que se vean primero los pendientes de fechas hoy o futuras
  // Ordenar por fecha (más futura arriba). Usa fechaRetiro > fecha > createdAt.
  const sortedEnvios = useMemo(() => {
    if (!Array.isArray(envios)) return [];
    const getDate = (e) => new Date(e.fechaRetiro || e.fecha || e.createdAt || 0);
    return envios.slice().sort((a, b) => getDate(b) - getDate(a)); // futuro primero
  }, [envios]);


  return (
    <>
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

      <Filtros
        filtroFecha={filtroFecha}
        filtroEstado={filtroEstado}
        onChangeFecha={setFiltroFecha}
        onChangeEstado={setFiltroEstado}
      />

      {!isLoading && !error && sortedEnvios.length === 0 && (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--text-secondary)",
          }}
        >
          <p>No tienes envíos registrados aún.</p>
        </div>
      )}

      {!isLoading && !error && sortedEnvios.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Código seguimiento</th>
              <th>Origen / Destino</th>
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
              <tr key={`row-${envio.id}`}>
                <td>{envio.codigoSeguimiento || (envio.id ? envio.id.substring(0, 8) : "-")}</td>
                <td>
                  <div style={{ fontSize: "0.85rem" }}>
                    <div>
                      <strong>Origen:</strong> {envio.origen?.ciudad || "-"}
                    </div>
                    <div>
                      <strong>Destino:</strong> {envio.destino?.ciudad || "-"}
                    </div>
                  </div>
                </td>
                <td style={{ textTransform: "capitalize" }}>{envio.tamanoPaquete || "-"}</td>
                <td>
                  <span className={`badge ${getBadgeClass(envio.estado)}`}>
                    {formatearEstado(envio.estado)}
                  </span>
                </td>
                <td>{formatearFecha(envio.fechaRetiro)}</td>
                <td>{envio.horaRetiroAprox || "-"}</td>
                <td>{envio.notas || "-"}</td>
                <td>
                  {envio.estado === "pendiente" && (
                    <>
                      {isEnvioEditable(envio.fechaRetiro) && (
                        <button
                          className="btn btn-sm btn-primary"
                          style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", marginRight: "0.25rem", width: "70px" }}
                          onClick={() => {
                            setSelectedEnvioId(envio.id);
                            setEditModalOpen(true);
                          }}
                        >
                          Editar
                        </button>
                      )}
                      {isEnvioEditable(envio.fechaRetiro) && (
                        <button
                          className="btn btn-sm btn-danger"
                          style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", width: "70px" }}
                          disabled={cancelingIds.has(envio.id)}
                          title={cancelingIds.has(envio.id) ? "Cancelando..." : ""}
                          onClick={() => handleCancelar(envio.id)}
                        >
                          {cancelingIds.has(envio.id) ? "..." : "Cancelar"}
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>


        </table>
      )}

      <EditarEnvioModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        envioId={selectedEnvioId}
        onSuccess={() => {
          setEditModalOpen(false);
          cargarEnvios();
        }}
      />
    </>
  );
};

// Funciones auxiliares
function startOfLocalDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function parseLocalDateOnly(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

function isEnvioEditable(fechaEnvio) {
  if (!fechaEnvio) return false;
  const envio = startOfLocalDay(parseLocalDateOnly(fechaEnvio));
  const today = startOfLocalDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return envio >= tomorrow;
}

function parseHoraToMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== "string") return Number.MAX_SAFE_INTEGER;
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  const hh = Number(m[1]), mm = Number(m[2]);
  return hh * 60 + mm;
}

export default ListarEnvios;