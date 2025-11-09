import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { API_CESAR } from "../../api/config";
import { useDispatch } from "react-redux";
import { updateEnvio } from "../../features/enviosSlice";
import { toast } from "react-toastify";
import { Spinner } from "../../components/Spinner";
import { reauth } from "../../utils/reauthUtils";

/**
 * Modal para editar un envío existente
 *
 * Props:
 * - isOpen (boolean): Controla si el modal está visible
 * - onClose (function): Función para cerrar el modal
 * - envioId (string): ID del envío a editar
 * - onSuccess (function): Callback opcional cuando se guarda exitosamente
 */

const EditarEnvioModal = ({ isOpen, onClose, envioId, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const notasValue = watch("notas", "");

  // Cargar categorías al montar
  useEffect(() => {
    fetch(`${API_CESAR}/public/v1/categories`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  // Cargar datos del envío cuando se abre el modal
  useEffect(() => {
    if (isOpen && envioId) {
      cargarEnvio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, envioId]);

  const cargarEnvio = () => {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    fetch(`${API_CESAR}/v1/envios/${envioId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) throw new Error("UNAUTHORIZED");
          throw new Error("Error al cargar los datos del envío");
        }
        return response.json();
      })
      .then((data) => {
        // Extraer el ID de la categoría
        let catId = "";
        if (data.category) {
          catId =
            typeof data.category === "object"
              ? data.category._id || data.category.id || ""
              : data.category;
        }

        // Usar reset() para cargar los datos en el formulario
        reset({
          origenCalle: data.origen?.calle || "",
          origenNumero: data.origen?.numero || "",
          origenCiudad: data.origen?.ciudad || "",
          origenReferencia: data.origen?.referencia || "",
          destinoCalle: data.destino?.calle || "",
          destinoNumero: data.destino?.numero || "",
          destinoCiudad: data.destino?.ciudad || "",
          destinoReferencia: data.destino?.referencia || "",
          fechaRetiro: data.fechaRetiro ? data.fechaRetiro.split("T")[0] : "",
          horaRetiroAprox: data.horaRetiroAprox || "",
          tamanoPaquete: data.tamanoPaquete || "",
          notas: data.notas || "",
          categoryId: catId,
        });
      })
      .catch((error) => {
        if (error.message === "UNAUTHORIZED") {
          reauth(navigate);
        } else {
          toast.error(error.message || "Error de conexión al cargar el envío");
          onClose();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = (formData) => {
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    // Solo incluir campos que tengan valor
    const payload = {};

    // Origen
    if (
      formData.origenCalle ||
      formData.origenNumero ||
      formData.origenCiudad ||
      formData.origenReferencia
    ) {
      payload.origen = {};
      if (formData.origenCalle)
        payload.origen.calle = formData.origenCalle.trim();
      if (formData.origenNumero)
        payload.origen.numero = formData.origenNumero.trim();
      if (formData.origenCiudad)
        payload.origen.ciudad = formData.origenCiudad.trim();
      if (formData.origenReferencia)
        payload.origen.referencia = formData.origenReferencia.trim();
    }

    // Destino
    if (
      formData.destinoCalle ||
      formData.destinoNumero ||
      formData.destinoCiudad ||
      formData.destinoReferencia
    ) {
      payload.destino = {};
      if (formData.destinoCalle)
        payload.destino.calle = formData.destinoCalle.trim();
      if (formData.destinoNumero)
        payload.destino.numero = formData.destinoNumero.trim();
      if (formData.destinoCiudad)
        payload.destino.ciudad = formData.destinoCiudad.trim();
      if (formData.destinoReferencia)
        payload.destino.referencia = formData.destinoReferencia.trim();
    }

    // Otros campos
    if (formData.fechaRetiro) payload.fechaRetiro = formData.fechaRetiro;
    if (formData.horaRetiroAprox)
      payload.horaRetiroAprox = formData.horaRetiroAprox.trim();
    if (formData.tamanoPaquete) payload.tamanoPaquete = formData.tamanoPaquete;
    if (formData.notas) payload.notas = formData.notas.trim();

    // Categoría
    if (formData.categoryId) {
      payload.categoryId = formData.categoryId;
    }

    fetch(`${API_CESAR}/v1/envios/${envioId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) throw new Error("UNAUTHORIZED");
          return response
            .json()
            .catch(() => ({}))
            .then((err) => {
              throw new Error(err?.message || "No se pudo actualizar el envío");
            });
        }
        // Si la API devuelve 204 No Content, no intentes parsear JSON
        if (response.status === 204) return null;
        return response.json();
      })
      .then((data) => {
        // Si el backend devolvió el envío actualizado, úsalo; si no, usamos lo enviado
        const updatedEnvio = data ?? payload;

        // Actualizar el store global para re-render inmediato en la lista
        dispatch(updateEnvio({ id: envioId, updatedEnvio }));

        toast.success("Envío actualizado exitosamente");

        onClose();

        // Opcional: si querés además refrescar desde el server
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        if (error.message === "UNAUTHORIZED") {
          reauth(navigate);
        } else {
          toast.error(
            error.message || "Error de conexión. Por favor, intenta nuevamente."
          );
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-header">
        <h2 className="modal-title">Editar Envío</h2>
        <p className="modal-subtitle">ID: {envioId}</p>
      </div>

      {isLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <Spinner color={"text-primary"} size={"spinner-border-md"} />
          <p>Cargando datos del envío...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Origen */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                marginBottom: "0.75rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              📍 Origen
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Calle *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register("origenCalle", {
                    required: "La calle de origen es requerida",
                    minLength: {
                      value: 3,
                      message: "La calle debe tener al menos 3 caracteres",
                    },
                  })}
                />
                {errors.origenCalle && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.origenCalle.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Número *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register("origenNumero", {
                    required: "El número de origen es requerido",
                  })}
                />
                {errors.origenNumero && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.origenNumero.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register("origenCiudad", {
                    required: "La ciudad de origen es requerida",
                    minLength: {
                      value: 3,
                      message: "La ciudad debe tener al menos 3 caracteres",
                    },
                  })}
                />
                {errors.origenCiudad && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.origenCiudad.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Referencia</label>
                <input
                  type="text"
                  className="form-input"
                  {...register("origenReferencia")}
                />
              </div>
            </div>
          </div>

          {/* Destino */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                marginBottom: "0.75rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              📦 Destino
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Calle *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register("destinoCalle", {
                    required: "La calle de destino es requerida",
                    minLength: {
                      value: 3,
                      message: "La calle debe tener al menos 3 caracteres",
                    },
                  })}
                />
                {errors.destinoCalle && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.destinoCalle.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Número *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register("destinoNumero", {
                    required: "El número de destino es requerido",
                  })}
                />
                {errors.destinoNumero && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.destinoNumero.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register("destinoCiudad", {
                    required: "La ciudad de destino es requerida",
                    minLength: {
                      value: 3,
                      message: "La ciudad debe tener al menos 3 caracteres",
                    },
                  })}
                />
                {errors.destinoCiudad && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.destinoCiudad.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Referencia</label>
                <input
                  type="text"
                  className="form-input"
                  {...register("destinoReferencia")}
                />
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                marginBottom: "0.75rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              📋 Detalles
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Fecha de Retiro *</label>
                <input
                  type="date"
                  className="form-input"
                  {...register("fechaRetiro", {
                    required: "La fecha de retiro es requerida",
                    validate: {
                      future: (value) => {
                        if (!value) return true;
                        const selected = new Date(value);
                        const now = new Date();
                        now.setHours(0, 0, 0, 0);
                        return (
                          selected >= now ||
                          "La fecha de retiro debe ser una fecha futura"
                        );
                      },
                    },
                  })}
                />
                {errors.fechaRetiro && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.fechaRetiro.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Hora Aproximada *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="14:30"
                  {...register("horaRetiroAprox", {
                    required: "La hora aproximada es requerida",
                    pattern: {
                      value: /^([01]\d|2[0-3]):[0-5]\d$/,
                      message: "Hora inválida (formato HH:mm)",
                    },
                  })}
                />
                {errors.horaRetiroAprox && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.horaRetiroAprox.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Tamaño *</label>
                <select
                  className="form-input"
                  {...register("tamanoPaquete", {
                    required: "El tamaño del paquete es requerido",
                  })}
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="chico">Chico</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
                {errors.tamanoPaquete && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.tamanoPaquete.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-input" {...register("categoryId")}>
                  <option value="">-- Seleccionar --</option>
                  {categories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Notas</label>
                <textarea
                  className="form-input"
                  rows="3"
                  maxLength="100"
                  {...register("notas", {
                    maxLength: {
                      value: 100,
                      message: "Las notas no pueden superar los 100 caracteres",
                    },
                  })}
                />
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: errors.notas ? "#dc2626" : "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  {notasValue.length}/100 caracteres
                </div>
                {errors.notas && (
                  <div
                    style={{
                      color: "#dc2626",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.notas.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
            <button
              type="button"
              className="btn btn-ghost btn-full"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner color={"text-light"} size={"spinner-border-sm"} />
                  <span style={{ marginLeft: "0.5rem" }}>Guardando...</span>
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditarEnvioModal;
