import { toast } from "react-toastify";
import { reauth } from "./reauthUtils";

export const manejarError = (error, navigate, mensaje = "Ocurrió un error") => {
  if (error.message === "UNAUTHORIZED") {
    reauth(navigate);
    return;
  }

  toast.error(error.message || mensaje);
};
