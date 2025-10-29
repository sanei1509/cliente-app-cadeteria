import { useState } from "react";
import Modal from "./Modal";

/**
 * Componente AgregarEnvio
 *
 * Muestra el botón "Nuevo Envío" y maneja el modal con el formulario de registro.
 * El formulario se renderiza dentro de un Modal reutilizable.
 */
const AgregarEnvio = () => {
    // Estado para controlar si el modal está abierto o cerrado
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const payload = {
            origen: {
                calle: formData.get("origenCalle"),
                numero: formData.get("origenNumero"),
                ciudad: formData.get("origenCiudad"),
                referencia: formData.get("origenReferencia")
            },
            destino: {
                calle: formData.get("destinoCalle"),
                numero: formData.get("destinoNumero"),
                ciudad: formData.get("destinoCiudad"),
                referencia: formData.get("destinoReferencia")
            },
            fechaRetiro: formData.get("fechaRetiro"),
            horaRetiroAprox: formData.get("horaRetiroAprox"),
            tamanoPaquete: formData.get("tamanoPaquete"),
            notas: formData.get("notas"),
            categoria: {
                nombre: formData.get("categoriaNombre"),
                descripcion: formData.get("categoriaDescripcion")
            }
        };

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://api-cadeteria-ghq490feg-cesars-projects-2539e6a6.vercel.app/v1/envios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setIsModalOpen(false);
                // TODO: Actualizar lista de envíos
                alert("Envío registrado exitosamente");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "No se pudo crear el envío"}`);
            }
        } catch (error) {
            console.error("Error al crear envío:", error);
            alert("Error de conexión. Por favor, intenta nuevamente.");
        }
    };

    return (
        <>
            <div>
                <h3 className="card-title">Envíos</h3>
            </div>

            <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Nuevo Envío
            </button>

            {/* Modal con el formulario de registro de envío */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="modal-header">
                    <h2 className="modal-title">Registrar Envío</h2>
                    <p className="modal-subtitle">Complete los datos del nuevo envío</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Origen */}
                    <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem", fontSize: "1rem" }}>📍 Origen</h3>

                    <div className="form-group">
                        <label className="form-label">Calle *</label>
                        <input name="origenCalle" className="form-input" placeholder="Ej: Av. 18 de Julio" required />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Número</label>
                            <input name="origenNumero" className="form-input" placeholder="1234" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Ciudad *</label>
                            <input name="origenCiudad" className="form-input" placeholder="Montevideo" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Referencia</label>
                        <input name="origenReferencia" className="form-input" placeholder="Ej: Frente a la plaza" />
                    </div>

                    {/* Destino */}
                    <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem", fontSize: "1rem" }}>📦 Destino</h3>

                    <div className="form-group">
                        <label className="form-label">Calle *</label>
                        <input name="destinoCalle" className="form-input" placeholder="Ej: Av. Italia" required />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Número</label>
                            <input name="destinoNumero" className="form-input" placeholder="5678" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Ciudad *</label>
                            <input name="destinoCiudad" className="form-input" placeholder="Punta del Este" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Referencia</label>
                        <input name="destinoReferencia" className="form-input" placeholder="Ej: Apartamento 302" />
                    </div>

                    {/* Detalles del Envío */}
                    <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem", fontSize: "1rem" }}>📋 Detalles</h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Fecha de Retiro *</label>
                            <input type="date" name="fechaRetiro" className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Hora aproximada (HH:MM)</label>
                            <input name="horaRetiroAprox" className="form-input" placeholder="14:30" />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Tamaño *</label>
                            <select name="tamanoPaquete" className="form-input" defaultValue="mediano" required>
                                <option value="chico">Chico</option>
                                <option value="mediano">Mediano</option>
                                <option value="grande">Grande</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Categoría *</label>
                            <input name="categoriaNombre" className="form-input" placeholder="Documentos" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Descripción Categoría</label>
                        <input name="categoriaDescripcion" className="form-input" placeholder="Opcional" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Notas</label>
                        <textarea name="notas" className="form-input" rows="3" placeholder="Instrucciones especiales..." maxLength="500"></textarea>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
                        <button type="button" className="btn btn-ghost btn-full" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary btn-full">
                            Registrar Envío
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default AgregarEnvio;