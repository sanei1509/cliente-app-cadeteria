import EditarEnvioModal from "./EditarEnvioModal";
import { API_CESAR, API_SANTI } from "../../api/config";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEnvios, setEnviosLoading } from "../../features/enviosSlice";
import { useNavigate } from "react-router-dom";



const ListarEnvios = () => {
  // Estado para controlar el modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEnvioId, setSelectedEnvioId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingIds, setCancelingIds] = useState(new Set());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(setEnviosLoading(true));
    fetch(`${API_CESAR}/v1/envios`,
      {
        method: "GET",
        headers: {
          "authorization": token
        }
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          throw new Error("UNAUTHORIZED");
        }
      })
      .then(data => {
        dispatch(setEnvios(data))

      })
      .catch(e => {
        if (e.message === "UNAUTHORIZED") {
          reauth(navigate)
        }
      })
      .finally(() => dispatch(setEnviosLoading(false)));
  }, [])


  // Cargar envíos desde la API
  // useEffect(() => {
  //   cargarEnvios();
  // }, []);

  // const cargarEnvios = async () => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(`${API_CESAR}/v1/envios`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       dispatch(setEnvios(data));
  //     } else {
  //       setError("Error al cargar los envíos");
  //     }
  //   } catch (error) {
  //     console.error("Error al cargar envíos:", error);
  //     setError("Error de conexión. Por favor, intenta nuevamente.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok || res.status === 204) {
          // Eliminado en servidor → quitar de la lista local
          dispatch(setEnvios((prev) => prev.filter((e) => e.id !== id)));
        } else {
          return res.json().then((err) => {
            alert(`No se pudo cancelar: ${err?.message || res.statusText}`);
          });
        }
      })
      .catch((error) => {
        console.error("Error al cancelar envío:", error);
        alert("Error de conexión. Intentá nuevamente.");
      })
      .finally(() => {
        // liberar el botón
        setCancelingIds((prev) => {
          const copy = new Set(prev);
          copy.delete(id);
          return copy;
        });
      });
  };


  // //Logica para ordenar los envios, para que se vean primero los pendientes de fechas hoy o futuras
  // const sortedEnvios = useMemo(() => {
  //   const today = startOfLocalDay(new Date());

  //   const getDate = (e) => {
  //     const f = e.fechaRetiro || e.fecha || e.createdAt || null;
  //     return f ? startOfLocalDay(parseLocalDateOnly(f)) : null;
  //   };

  //   const priority = (e) => {
  //     const d = getDate(e);
  //     const isPending = e.estado === "pendiente";
  //     const isTodayFuture = d ? d >= today : false;
  //     // Grupo 0: pendientes con fecha hoy/futura. Grupo 1: resto.
  //     return isPending && isTodayFuture ? 0 : 1;
  //   };

  //   return envios.slice().sort((a, b) => {
  //     const pa = priority(a), pb = priority(b);
  //     if (pa !== pb) return pa - pb;

  //     const da = getDate(a), db = getDate(b);

  //     // Grupo 0: ascendente por fecha, luego por hora
  //     if (pa === 0) {
  //       if (da && db && da.getTime() !== db.getTime()) return da - db;
  //       const ha = parseHoraToMinutes(a.horaRetiroAprox);
  //       const hb = parseHoraToMinutes(b.horaRetiroAprox);
  //       if (ha !== hb) return ha - hb;
  //       return (a.codigoSeguimiento || a.id).localeCompare(b.codigoSeguimiento || b.id);
  //     }

  //     // Grupo 1 (resto): descendente por fecha (más recientes primero)
  //     if (da && db && da.getTime() !== db.getTime()) return db - da;
  //     return (a.codigoSeguimiento || a.id).localeCompare(b.codigoSeguimiento || b.id);
  //   });
  // }, [envios]);

  // // Función helper para determinar prioridad (para el divider)
  // const getPriority = (envio) => {
  //   const today = startOfLocalDay(new Date());
  //   const fecha = envio.fechaRetiro || envio.fecha || envio.createdAt || null;
  //   const d = fecha ? startOfLocalDay(parseLocalDateOnly(fecha)) : null;
  //   const isPending = envio.estado === "pendiente";
  //   const isTodayFuture = d ? d >= today : false;
  //   return isPending && isTodayFuture ? 0 : 1;
  // };

  const envios = useSelector((s) => s.envios.envios);
  //const loading = useSelector(state => state.envios.areEnviosLoading);
  console.log(envios);
  return (
    <>
      {/* {loading && (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Cargando envíos...</p>
        </div>
      )} */}

      {error && (
        <div style={{ padding: "1rem", color: "#dc2626", textAlign: "center" }}>
          {error}
        </div>
      )}

      {!isLoading && !error && envios.length === 0 && (
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

      {!isLoading && !error && envios.length > 0 && (
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
            {envios.map((envio, index) => {
              // Detectar cambio de grupo
              // const prevEnvio = sortedEnvios[index - 1];
              // const currentPriority = getPriority(envio);
              // const prevPriority = prevEnvio ? getPriority(prevEnvio) : null;
              // const showDivider = prevPriority !== null && currentPriority !== prevPriority;

              return (
                <>
                  {/* {showDivider && (
                    <tr key={`divider-${envio.id}`} style={{ backgroundColor: 'transparent' }}>
                      <td colSpan="8" style={{ padding: '1rem 0', border: 'none' }}>
                        <div style={{
                          height: '3px',
                          background: 'linear-gradient(to right, transparent, var(--primary-color), transparent)',
                          opacity: 0.5,
                          margin: '0.5rem 0',
                          borderRadius: '2px'
                        }} />
                      </td>
                    </tr>
                  )} */}
                  <tr key={envio.id}>
                    <td>{envio.codigoSeguimiento || envio.id.substring(0, 8)}</td>
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
                    <td style={{ textTransform: "capitalize" }}>
                      {envio.tamanoPaquete || "-"}
                    </td>
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
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.5rem",
                                marginRight: "0.25rem",
                                width: "70px",
                              }}
                              onClick={() => {
                                setSelectedEnvioId(envio.id);
                                console.log("Editando envío:", envio.id);
                                setEditModalOpen(true);
                              }}
                            >
                              Editar
                            </button>
                          )}

                          {envio.estado === "pendiente" && isEnvioEditable(envio.fechaRetiro) && (
                            <button
                              className="btn btn-sm btn-danger"
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.5rem",
                                width: "70px",
                              }}
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
                </>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Modal para editar envío */}
      <EditarEnvioModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        envioId={selectedEnvioId}
        onSuccess={() => {
          setEditModalOpen(false);
          cargarEnvios(); // Recargar lista después de editar
        }}
      />
    </>
  );
};


// Normaliza a medianoche local
function startOfLocalDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Si viene "YYYY-MM-DD" lo parseo como fecha local; sino, uso Date normal
function parseLocalDateOnly(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d); // local
  }
  return new Date(value);
}

// Solo editable si fecha >= mañana (local)
function isEnvioEditable(fechaEnvio) {
  if (!fechaEnvio) return false;
  const envio = startOfLocalDay(parseLocalDateOnly(fechaEnvio));
  const today = startOfLocalDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return envio >= tomorrow;
}

// "HH:mm" -> minutos desde 00:00 (para ordenar por hora)
function parseHoraToMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== "string") return Number.MAX_SAFE_INTEGER; // si no hay hora, va al final
  const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  const hh = Number(m[1]), mm = Number(m[2]);
  return hh * 60 + mm;
}

export default ListarEnvios;