import { useState, useEffect } from "react";
import EditarEnvioModal from "./EditarEnvioModal";
import { API_SANTI } from "../../api/config";

const ListarEnvios = () => {
  // Estado para controlar el modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEnvioId, setSelectedEnvioId] = useState(null);
  const [envios, setEnvios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar envíos desde la API
  useEffect(() => {
    cargarEnvios();
  }, []);

  const cargarEnvios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_SANTI}/v1/envios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEnvios(data);
      } else {
        setError("Error al cargar los envíos");
      }
    } catch (error) {
      console.error("Error al cargar envíos:", error);
      setError("Error de conexión. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
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
            {envios.map((envio) => (
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
                          console.log(selectedEnvioId);
                          setEditModalOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.5rem",
                          width: "70px",
                        }}
                        onClick={() => {
                          if (
                            window.confirm(
                              "¿Estás seguro de cancelar este envío?"
                            )
                          ) {
                            // TODO: Implementar cancelación
                            console.log("Cancelando envío:", envio.id);
                          }
                        }}
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
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

export default ListarEnvios;
