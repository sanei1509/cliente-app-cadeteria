import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUserPlan } from "../features/userSlice";
import { API_CESAR } from "../api/config";
import "./UpgradePlanModal.css";
import { toast } from "react-toastify";
import { manejarError } from "../utils/errorHandler";

const UpgradePlanModal = ({ isOpen, onClose, onUpgradeSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    fetch(`${API_CESAR}/v1/users/upgrade-plan`, {
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
        throw new Error("Error al actualizar el plan");
      })
      .then((updatedUser) => {
        // Actualizar plan en Redux (automáticamente sincroniza con localStorage)
        dispatch(updateUserPlan(updatedUser.plan));
        toast.success("¡Plan actualizado a Premium exitosamente!");
        // Notificar al componente padre del éxito
        if (onUpgradeSuccess) {
          onUpgradeSuccess();
        }
        onClose();
      })
      .catch((e) => {
        setError(e.message);
        manejarError(e, navigate, "Error al actualizar el plan");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upgrade a Plan Premium</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="plan-comparison">
            <div className="plan-feature">
              <span className="feature-icon">&#10003;</span>
              <span>Envíos ilimitados</span>
            </div>
            <div className="plan-feature">
              <span className="feature-icon">&#10003;</span>
              <span>Sin restricciones de envíos pendientes</span>
            </div>
            <div className="plan-feature">
              <span className="feature-icon">&#10003;</span>
              <span>Soporte prioritario</span>
            </div>
          </div>

          <div className="payment-info">
            <h3>Confirmación de Pago</h3>
            <p>
              Al confirmar, tu cuenta será actualizada a{" "}
              <strong>Plan Premium</strong>.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={isLoading}>
            Cancelar
          </button>
          <button
            className="btn-confirm"
            onClick={handleUpgrade}
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Confirmar Cambio de Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlanModal;
