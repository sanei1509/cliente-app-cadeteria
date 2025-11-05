import { useState, useEffect } from "react";
import Modal from "./Modal";
import { API_CESAR, API_SANTI } from "../../api/config";
import { useDispatch } from "react-redux";
import { updateEnvio } from "../../features/enviosSlice";

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

  const [formData, setFormData] = useState({
    origenCalle: "",
    origenNumero: "",
    origenCiudad: "",
    origenReferencia: "",
    destinoCalle: "",
    destinoNumero: "",
    destinoCiudad: "",
    destinoReferencia: "",
    fechaRetiro: "",
    horaRetiroAprox: "",
    tamanoPaquete: "",
    notas: "",
    categoriaNombre: "",
    categoriaDescripcion: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del envío cuando se abre el modal
  useEffect(() => {
    if (isOpen && envioId) {
      cargarEnvio();
    }
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
          throw new Error("Error al cargar los datos del envío");
        }
        return response.json();
      })
      .then((data) => {
        setFormData({
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
          categoriaNombre: data.categoria || "",
        });
      })
      .catch((error) => {
        console.error("Error al cargar envío:", error);
        alert(error.message || "Error de conexión al cargar el envío");
        onClose();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      if (formData.origenCalle) payload.origen.calle = formData.origenCalle;
      if (formData.origenNumero) payload.origen.numero = formData.origenNumero;
      if (formData.origenCiudad) payload.origen.ciudad = formData.origenCiudad;
      if (formData.origenReferencia)
        payload.origen.referencia = formData.origenReferencia;
    }

    // Destino
    if (
      formData.destinoCalle ||
      formData.destinoNumero ||
      formData.destinoCiudad ||
      formData.destinoReferencia
    ) {
      payload.destino = {};
      if (formData.destinoCalle) payload.destino.calle = formData.destinoCalle;
      if (formData.destinoNumero)
        payload.destino.numero = formData.destinoNumero;
      if (formData.destinoCiudad)
        payload.destino.ciudad = formData.destinoCiudad;
      if (formData.destinoReferencia)
        payload.destino.referencia = formData.destinoReferencia;
    }

    // Otros campos
    if (formData.fechaRetiro) payload.fechaRetiro = formData.fechaRetiro;
    if (formData.horaRetiroAprox)
      payload.horaRetiroAprox = formData.horaRetiroAprox;
    if (formData.tamanoPaquete) payload.tamanoPaquete = formData.tamanoPaquete;
    if (formData.notas) payload.notas = formData.notas;

    // Categoría
    if (formData.categoriaNombre || formData.categoriaDescripcion) {
      payload.categoria = {};
      if (formData.categoriaNombre)
        payload.categoria.nombre = formData.categoriaNombre;
      if (formData.categoriaDescripcion)
        payload.categoria.descripcion = formData.categoriaDescripcion;
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

        // 🔥 Actualizar el store global para re-render inmediato en la lista
        dispatch(updateEnvio({ id: envioId, updatedEnvio }));

        alert("Envío actualizado exitosamente");
        onClose();

        // Opcional: si querés además refrescar desde el server
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        console.error("Error al actualizar envío:", error);
        alert(
          `Error: ${
            error.message || "Error de conexión. Por favor, intenta nuevamente."
          }`
        );
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
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Cargando datos del envío...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
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
                <label className="form-label">Calle</label>
                <input
                  type="text"
                  name="origenCalle"
                  className="form-input"
                  value={formData.origenCalle}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Número</label>
                <input
                  type="text"
                  name="origenNumero"
                  className="form-input"
                  value={formData.origenNumero}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input
                  type="text"
                  name="origenCiudad"
                  className="form-input"
                  value={formData.origenCiudad}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Referencia</label>
                <input
                  type="text"
                  name="origenReferencia"
                  className="form-input"
                  value={formData.origenReferencia}
                  onChange={handleChange}
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
                <label className="form-label">Calle</label>
                <input
                  type="text"
                  name="destinoCalle"
                  className="form-input"
                  value={formData.destinoCalle}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Número</label>
                <input
                  type="text"
                  name="destinoNumero"
                  className="form-input"
                  value={formData.destinoNumero}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input
                  type="text"
                  name="destinoCiudad"
                  className="form-input"
                  value={formData.destinoCiudad}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Referencia</label>
                <input
                  type="text"
                  name="destinoReferencia"
                  className="form-input"
                  value={formData.destinoReferencia}
                  onChange={handleChange}
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
                <label className="form-label">Fecha de Retiro</label>
                <input
                  type="date"
                  name="fechaRetiro"
                  className="form-input"
                  value={formData.fechaRetiro}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hora Aproximada</label>
                <input
                  type="text"
                  name="horaRetiroAprox"
                  className="form-input"
                  value={formData.horaRetiroAprox}
                  onChange={handleChange}
                  placeholder="14:30"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tamaño</label>
                <select
                  name="tamanoPaquete"
                  className="form-input"
                  value={formData.tamanoPaquete}
                  onChange={handleChange}
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="chico">Chico</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <input
                  type="text"
                  name="categoriaNombre"
                  className="form-input"
                  value={formData.categoriaNombre}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Descripción Categoría</label>
                <input
                  type="text"
                  name="categoriaDescripcion"
                  className="form-input"
                  value={formData.categoriaDescripcion}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Notas</label>
                <textarea
                  name="notas"
                  className="form-input"
                  rows="3"
                  value={formData.notas}
                  onChange={handleChange}
                  maxLength="500"
                />
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                  }}
                >
                  {formData.notas.length}/500 caracteres
                </div>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditarEnvioModal;
