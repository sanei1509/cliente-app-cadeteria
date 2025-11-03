import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUserPlan, clearUser } from "../features/userSlice";
import { API_CESAR } from "../api/config";
import "./UpgradePlanModal.css";
import { toast } from 'react-toastify';

const CancelPlanModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCancel = () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    fetch(`${API_CESAR}/v1/users/downgrade-plan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          throw new Error("UNAUTHORIZED");
        }
        throw new Error("Error al cancelar el plan");
      })
      .then((updatedUser) => {
        // Actualizar plan en Redux (automáticamente sincroniza con localStorage)
        dispatch(updateUserPlan(updatedUser.plan));
        toast.success("Plan cancelado. Has vuelto al Plan Plus");
        onClose();
      })
      .catch((e) => {
        if (e.message === "UNAUTHORIZED") {
          // Limpiar usuario de Redux (automáticamente limpia localStorage)
          dispatch(clearUser());
          toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.");
          navigate("/login");
        } else {
          setError(e.message);
          toast.error(e.message || "Error al cancelar el plan");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Cancelar Plan Premium</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p>
            ¿Estás seguro que deseas cancelar tu plan Premium y volver al{" "}
            <strong>Plan Plus</strong>?
          </p>
          <div className="plan-comparison" style={{ marginTop: "1rem" }}>
            <div className="plan-feature">
              <span className="feature-icon">⚠️</span>
              <span>Volverás a tener un máximo de 10 envíos pendientes</span>
            </div>
            <div className="plan-feature">
              <span className="feature-icon">⚠️</span>
              <span>Perderás el acceso a funciones premium</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={isLoading}>
            No, mantener Premium
          </button>
          <button
            className="btn-confirm"
            onClick={handleCancel}
            disabled={isLoading}
            style={{ background: "#e74c3c" }}
          >
            {isLoading ? "Procesando..." : "Sí, cancelar plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPlanModal;
