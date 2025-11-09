import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateEnvio, deleteEnvio } from "../../features/enviosSlice";
import { API_CESAR } from "../../api/config";
import { toast } from 'react-toastify';
import ConfirmModal from "../../components/ConfirmModal";
import { reauth } from "../../utils/reauthUtils";
import { Spinner } from "../../components/Spinner";

function getUserIdFromEnvio(envio) {
  if (!envio) return "";
  const u = envio.user;
  if (typeof u === "string") return u;
  if (u && typeof u === "object") return u._id || u.id || "";
  return envio.userId || "";
}

const AdminTablaEnvio = ({ envio }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({});
  const [pendingEstadoChange, setPendingEstadoChange] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getBadgeClass = (estado) => {
    const estados = {
      pendiente: "badge-warning",
      en_ruta: "badge-info",
      entregado: "badge-success",
      cancelado: "badge-secondary",
    };
    return estados[estado] || "badge-secondary";
  };

  const formatearEstado = (estado) => {
    const estados = {
      pendiente: "Pendiente",
      en_ruta: "En ruta",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return estados[estado] || estado;
  };

  function parseLocalDateOnly(value) {
  if (typeof value === "string") {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const [_, y, mo, d] = m;
      return new Date(Number(y), Number(mo) - 1, Number(d)); // LOCAL
    }
  }
  return new Date(value);
}

const formatearFecha = (fecha) => {
  if (!fecha) return "-";
  const d = parseLocalDateOnly(fecha);
  return isNaN(d) ? "-" : d.toLocaleDateString("es-UY");
};


  const handleCambiarEstado = (e) => {
    const nuevoEstado = e.target.value;
    if (nuevoEstado === envio.estado) return; // No hacer nada si es el mismo estado

    // Guardar el cambio pendiente y abrir modal
    setPendingEstadoChange({ nuevoEstado, selectElement: e.target });
    setConfirmModalData({
      title: "Cambiar Estado",
      message: `¿Cambiar estado a "${formatearEstado(nuevoEstado)}"?`,
      confirmText: "Cambiar",
      cancelText: "Cancelar",
      type: "primary",
      onConfirm: () => confirmarCambioEstado(nuevoEstado, e.target),
    });
    setConfirmModalOpen(true);
  };

  const confirmarCambioEstado = (nuevoEstado, selectElement) => {
    setConfirmModalOpen(false);
    setIsUpdating(true);
    const token = localStorage.getItem("token");

    fetch(`${API_CESAR}/v1/envios/${envio.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) throw new Error("UNAUTHORIZED");
          return response
            .json()
            .then((err) => {
              toast.error(`Error: ${err?.message || response.statusText}`);
              throw new Error(err?.message || response.statusText);
            })
            .catch(() => {
              toast.error(`Error: ${response.statusText}`);
              throw new Error(response.statusText);
            });
        }
        return response.json();
      })
      .then((data) => {
        dispatch(updateEnvio({ id: data.id, updatedEnvio: data }));
        toast.success(`Estado cambiado a "${formatearEstado(data.estado)}" exitosamente`);
      })
      .catch((error) => {
        if (error.message === "UNAUTHORIZED") {
          reauth(navigate);
        } else {
          console.error("Error al cambiar estado:", error);
          if (selectElement) selectElement.value = envio.estado; // Restaurar valor en caso de error
        }
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const handleEliminar = () => {
    setConfirmModalData({
      title: "Eliminar Envío",
      message: "¿Estás seguro de eliminar este envío? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      type: "danger",
      onConfirm: confirmarEliminarEnvio,
    });
    setConfirmModalOpen(true);
  };

  const confirmarEliminarEnvio = () => {
    setConfirmModalOpen(false);
    setIsUpdating(true);
    const token = localStorage.getItem("token");

    fetch(`${API_CESAR}/v1/envios/${envio.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) throw new Error("UNAUTHORIZED");
          return response
            .json()
            .then((err) => {
              toast.error(`Error: ${err?.message || response.statusText}`);
              throw new Error(err?.message || response.statusText);
            })
            .catch(() => {
              toast.error(`Error: ${response.statusText}`);
              throw new Error(response.statusText);
            });
        }
        // Eliminar del store Redux
        dispatch(deleteEnvio(envio.id));
        toast.success("Envío eliminado exitosamente");
      })
      .catch((error) => {
        if (error.message === "UNAUTHORIZED") {
          reauth(navigate);
        } else {
          console.error("Error al eliminar envío:", error);
        }
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const userId = getUserIdFromEnvio(envio);
  const shortUserId = userId ? userId.substring(0, 8) : "-";

  const copyUserId = async () => {
    if (!userId) return;
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("No se pudo copiar el ID de usuario:", e);
    }
  };

  return (
    <>
    <tr>
      <td>{envio.codigoSeguimiento || envio.id?.substring(0, 8) || "-"}</td>

      {/* Usuario: ID + icono a la derecha */}
      <td title={userId || "-"}>
        <div className="user-inline">
          <span className="user-code">{shortUserId}</span>
          {userId && (
            <button
              type="button"
              className={`icon-btn ${copied ? "ok" : ""}`}
              onClick={copyUserId}
              aria-label="Copiar ID de usuario"
              title={copied ? "Copiado" : "Copiar ID completo"}
            >
              <svg
                className="icon-clipboard"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M9 4.5h6M9.75 3h4.5a.75.75 0 0 1 .75.75V6a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9.75 6V3.75A.75.75 0 0 1 10.5 3z" />
                <path d="M8 6.75H7.5A2.5 2.5 0 0 0 5 9.25v9.25A2.5 2.5 0 0 0 7.5 21h9A2.5 2.5 0 0 0 19 18.5V9.25a2.5 2.5 0 0 0-2.5-2.5H16" />
              </svg>
            </button>
          )}
        </div>
      </td>

      {/* Cliente (lo mantenemos) */}
      <td>
        {envio.user
          ? `${envio.user?.nombre || ""} ${
              envio.user?.apellido || ""
            }`.trim() || "-"
          : "-"}
      </td>

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

      <td>
        {envio.categoria?.nombre ||
          envio.categoria ||
          envio.category?.name ||
          envio.category ||
          "-"}
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

      <td className="col-notas">
        <span className="note-tooltip" data-tip={envio.notas || ""}>
          <span className="note-clip">{envio.notas || "-"}</span>
        </span>
      </td>

      <td>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {/* Selector de estado */}
          <select
            className="form-input"
            style={{
              fontSize: "0.85rem",
              padding: "0.3rem 0.5rem",
              minWidth: "110px",
            }}
            value={envio.estado}
            onChange={handleCambiarEstado}
            disabled={isUpdating}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_ruta">En ruta</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          {/* Botón eliminar con icono de papelera */}
          <button
            className="btn btn-sm btn-danger"
            style={{
              fontSize: "0.7rem",
              padding: "0.4rem 0.6rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "32px",
            }}
            onClick={handleEliminar}
            disabled={isUpdating}
            title={isUpdating ? "Eliminando..." : "Eliminar envío"}
          >
            {isUpdating ? (
              <Spinner color={"text-light"} size={"spinner-border-sm"} />
            ) : (
              // Ícono de papelera
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            )}
          </button>
        </div>
      </td>
    </tr>

    <ConfirmModal
      isOpen={confirmModalOpen}
      onClose={() => {
        setConfirmModalOpen(false);
        // Restaurar valor del select si se cancela el cambio de estado
        if (pendingEstadoChange?.selectElement) {
          pendingEstadoChange.selectElement.value = envio.estado;
        }
        setPendingEstadoChange(null);
      }}
      onConfirm={confirmModalData.onConfirm}
      title={confirmModalData.title}
      message={confirmModalData.message}
      confirmText={confirmModalData.confirmText}
      cancelText={confirmModalData.cancelText}
      type={confirmModalData.type}
      isLoading={isUpdating}
    />
    </>
  );
};

export default AdminTablaEnvio;
