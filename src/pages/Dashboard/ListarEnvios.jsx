import EditarEnvioModal from "./EditarEnvioModal";
import { API_CESAR } from "../../api/config";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEnvios, setEnviosLoading, updateEnvio } from "../../features/enviosSlice";
import { useNavigate } from "react-router-dom";
import Filtros from "./Filtros";
import { Spinner } from "../../components/Spinner";
import { toast } from 'react-toastify';


const ListarEnvios = () => {
  // Estado para controlar el modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEnvioId, setSelectedEnvioId] = useState(null);
  const [error, setError] = useState(null);
  const [cancelingIds, setCancelingIds] = useState(new Set());
  // Estados de filtros (cliente)
  const [filtroFecha, setFiltroFecha] = useState('historico'); // 'historico' | 'semana' | 'mes'
  const [filtroEstado, setFiltroEstado] = useState('todos');     // 'todos' | 'pendiente' | 'en_ruta' | 'entregado' | 'cancelado'
  const limpiarFiltros = () => {
    setFiltroFecha('historico');
    setFiltroEstado('todos');
  };


  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Obtener datos de Redux
  const allEnvios = useSelector((s) => s.envios.allEnvios);
  const isLoading = useSelector((s) => s.envios.areEnviosLoading);

  // Cargar TODOS los envíos solo una vez al montar el componente
  useEffect(() => {
    cargarTodosLosEnvios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarTodosLosEnvios = () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    dispatch(setEnviosLoading(true));
    // Cargar TODOS los envíos sin filtros
    fetch(`${API_CESAR}/v1/envios`, {
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

  const cargarEnvios = () => {
    cargarTodosLosEnvios();
  };


  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const d = parseLocalDateOnly(fecha);
    return d.toLocaleDateString("es-UY");
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
    toast.success("Envío cancelado exitosamente");

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
      .catch(() => {
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

  // Aplicar filtros del lado del cliente
  // const enviosFiltrados = allEnvios.filter((e) => {
  //   // Filtro por estado
  //   if (filtroEstado !== 'todos' && e.estado !== filtroEstado) {
  //     return false;
  //   }

  //   // Filtro por fecha
  //   if (filtroFecha !== 'historico') {
  //     const fechaEnvio = new Date(e.fechaRetiro || e.fecha || e.createdAt);
  //     const ahora = new Date();

  //     if (filtroFecha === 'semana') {
  //       const unaSemanaAtras = new Date(ahora);
  //       unaSemanaAtras.setDate(ahora.getDate() - 7);
  //       if (fechaEnvio < unaSemanaAtras) return false;
  //     } else if (filtroFecha === 'mes') {
  //       const unMesAtras = new Date(ahora);
  //       unMesAtras.setMonth(ahora.getMonth() - 1);
  //       if (fechaEnvio < unMesAtras) return false;
  //     }
  //   }

  //   return true;
  // });

  // // Ordenar por fecha (más futura arriba). Usa fechaRetiro > fecha > createdAt.
  // const getDate = (e) => new Date(e.fechaRetiro || e.fecha || e.createdAt || 0);
  // const sortedEnvios = enviosFiltrados.slice().sort((a, b) => getDate(b) - getDate(a));

  const sortedEnvios = useMemo(() => {
    const ahora = new Date();

    // 1) Prioridad de estados (menor = más arriba)
    const STATUS_RANK = {
      pendiente: 1,
      en_ruta: 2,
      entregado: 3,
      cancelado: 4,
    };
    const rank = (s) => STATUS_RANK[s] ?? 99;

    // 2) Filtro por rango de fechas
    const dentroDeRango = (fechaStr) => {
      if (filtroFecha === "historico") return true;

      const fechaEnvio = parseLocalDateOnly(fechaStr || "");
      if (Number.isNaN(fechaEnvio?.getTime?.())) return false;

      if (filtroFecha === "semana") {
        const unaSemanaAtras = new Date(ahora);
        unaSemanaAtras.setDate(ahora.getDate() - 7);
        return fechaEnvio >= unaSemanaAtras;
      }

      if (filtroFecha === "mes") {
        const unMesAtras = new Date(ahora);
        unMesAtras.setMonth(ahora.getMonth() - 1);
        return fechaEnvio >= unMesAtras;
      }

      return true;
    };

    // 3) Filtrar por estado + fecha
    const fil = (allEnvios || []).filter((e) => {
      if (filtroEstado !== "todos" && e.estado !== filtroEstado) return false;
      const baseFecha = e.fechaRetiro || e.fecha || e.createdAt;
      return dentroDeRango(baseFecha);
    });

    // 4) Fecha segura (para ordenar dentro del mismo estado)
    const getTime = (e) => {
      const d = parseLocalDateOnly(e.fechaRetiro || e.fecha || e.createdAt || 0);
      const t = d?.getTime?.();
      // Si no hay fecha válida, mandalo bien abajo dentro de su grupo
      return Number.isFinite(t) ? t : -Infinity;
    };

    // 5) Orden: estado (según rank) y dentro del estado, fecha desc
    return fil.slice().sort((a, b) => {
      const ra = rank(a.estado);
      const rb = rank(b.estado);
      if (ra !== rb) return ra - rb;          // primero por estado
      return getTime(b) - getTime(a);         // luego por fecha (más futura arriba)
    });
  }, [allEnvios, filtroEstado, filtroFecha]);


  return (
    <>
      <Filtros
        filtroFecha={filtroFecha}
        filtroEstado={filtroEstado}
        onChangeFecha={setFiltroFecha}
        onChangeEstado={setFiltroEstado}
        onClear={() => { setFiltroFecha('historico'); setFiltroEstado('todos'); }}
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


function isEnvioEditable(fechaEnvio) {
  if (!fechaEnvio) return false;
  const envio = startOfLocalDay(parseLocalDateOnly(fechaEnvio));
  const today = startOfLocalDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return envio.getTime() >= tomorrow.getTime();
}

export default ListarEnvios;