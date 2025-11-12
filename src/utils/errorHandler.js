import { toast } from "react-toastify";
import { reauth } from "./reauthUtils";

/**
 * Maneja errores de API de forma consistente
 * @param {Error} error - El error capturado
 * @param {Function} navigate - Función de navegación (de useNavigate)
 * @param {string} mensaje - Mensaje personalizado (opcional)
 */
export const manejarError = (error, navigate, mensaje = "Ocurrió un error") => {
  if (error.message === "UNAUTHORIZED") {
    reauth(navigate);
    return;
  }

  toast.error(error.message || mensaje);
};
