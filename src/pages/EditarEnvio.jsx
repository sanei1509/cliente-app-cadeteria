// src/pages/EditarEnvio.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarEnvio = () => {
    const navigate = useNavigate();
    const { id } = useParams();

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
        estado: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fechaOriginal, setFechaOriginal] = useState("");

    // Cargar datos del envío
    useEffect(() => {
        const cargarEnvio = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `https://api-cadeteria-ghq490feg-cesars-projects-2539e6a6.vercel.app/v1/envios/${id}`,
                    {
                        headers: { "Authorization": `Bearer ${token}` }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        origenCalle: data.origen.calle,
                        origenNumero: data.origen.numero || "",
                        origenCiudad: data.origen.ciudad,
                        origenReferencia: data.origen.referencia || "",
                        destinoCalle: data.destino.calle,
                        destinoNumero: data.destino.numero || "",
                        destinoCiudad: data.destino.ciudad,
                        destinoReferencia: data.destino.referencia || "",
                        fechaRetiro: data.fechaRetiro.split('T')[0],
                        horaRetiroAprox: data.horaRetiroAprox || "",
                        tamanoPaquete: data.tamanoPaquete,
                        notas: data.notas || "",
                        categoriaNombre: data.categoria.nombre,
                        categoriaDescripcion: data.categoria.descripcion || "",
                        estado: data.estado
                    });
                    setFechaOriginal(data.fechaRetiro.split('T')[0]);
                }
            } catch (error) {
                console.error("Error al cargar envío:", error);
                alert("Error al cargar los datos del envío");
            }
        };

        cargarEnvio();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");

            // Solo incluir campos que tengan valor
            const payload = {};

            // Origen - solo si hay al menos un campo
            if (formData.origenCalle || formData.origenNumero || formData.origenCiudad || formData.origenReferencia) {
                payload.origen = {};
                if (formData.origenCalle) payload.origen.calle = formData.origenCalle;
                if (formData.origenNumero) payload.origen.numero = formData.origenNumero;
                if (formData.origenCiudad) payload.origen.ciudad = formData.origenCiudad;
                if (formData.origenReferencia) payload.origen.referencia = formData.origenReferencia;
            }

            // Destino - solo si hay al menos un campo
            if (formData.destinoCalle || formData.destinoNumero || formData.destinoCiudad || formData.destinoReferencia) {
                payload.destino = {};
                if (formData.destinoCalle) payload.destino.calle = formData.destinoCalle;
                if (formData.destinoNumero) payload.destino.numero = formData.destinoNumero;
                if (formData.destinoCiudad) payload.destino.ciudad = formData.destinoCiudad;
                if (formData.destinoReferencia) payload.destino.referencia = formData.destinoReferencia;
            }

            // Otros campos opcionales
            if (formData.fechaRetiro) payload.fechaRetiro = formData.fechaRetiro;
            if (formData.horaRetiroAprox) payload.horaRetiroAprox = formData.horaRetiroAprox;
            if (formData.tamanoPaquete) payload.tamanoPaquete = formData.tamanoPaquete;
            if (formData.notas) payload.notas = formData.notas;
            if (formData.estado) payload.estado = formData.estado;

            // Categoría - solo si hay al menos un campo
            if (formData.categoriaNombre || formData.categoriaDescripcion) {
                payload.categoria = {};
                if (formData.categoriaNombre) payload.categoria.nombre = formData.categoriaNombre;
                if (formData.categoriaDescripcion) payload.categoria.descripcion = formData.categoriaDescripcion;
            }

            const response = await fetch(
                `https://api-cadeteria-ghq490feg-cesars-projects-2539e6a6.vercel.app/v1/envios/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (response.ok) {
                navigate("/dashboard");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "No se pudo actualizar el envío"}`);
            }
        } catch (error) {
            console.error("Error al actualizar envío:", error);
            alert("Error de conexión. Por favor, intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dashboard">
            {/* Navbar simple */}
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <div className="navbar-brand-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M3 6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
                            </svg>
                        </div>
                        CadeteríaApp
                    </div>

                    <div className="navbar-menu"></div>

                    <div className="navbar-user">
                        <span className="plan-badge premium">💎 Plan Plus</span>
                        <button className="btn btn-ghost" onClick={() => navigate("/dashboard")}>
                            Volver
                        </button>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Editar envío #{id}</h1>
                    <p className="dashboard-subtitle">
                        Modifica solo los campos que desees actualizar. Los campos vacíos no se modificarán.
                    </p>
                </div>

                <section className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <form onSubmit={handleSubmit}>
                        {/* Sección Estado */}
                        <div style={{ marginBottom: "2rem", padding: "1rem", background: "var(--background)", borderRadius: "var(--radius-md)" }}>
                            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "600", color: "var(--primary-color)" }}>
                                ⚡ Estado del Envío
                            </h3>
                            <div>
                                <label className="form-label">Estado</label>
                                <select
                                    name="estado"
                                    className="form-input"
                                    value={formData.estado}
                                    onChange={handleChange}
                                >
                                    <option value="">-- No modificar --</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="en_ruta">En Ruta</option>
                                    <option value="entregado">Entregado</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>

                        {/* Sección Origen */}
                        <div style={{ marginBottom: "2rem" }}>
                            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "600" }}>📍 Dirección de Origen</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div>
                                    <label className="form-label">Calle</label>
                                    <input
                                        type="text"
                                        name="origenCalle"
                                        className="form-input"
                                        value={formData.origenCalle}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Número</label>
                                    <input
                                        type="text"
                                        name="origenNumero"
                                        className="form-input"
                                        value={formData.origenNumero}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Ciudad</label>
                                    <input
                                        type="text"
                                        name="origenCiudad"
                                        className="form-input"
                                        value={formData.origenCiudad}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
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

                        {/* Sección Destino */}
                        <div style={{ marginBottom: "2rem" }}>
                            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "600" }}>📦 Dirección de Destino</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div>
                                    <label className="form-label">Calle</label>
                                    <input
                                        type="text"
                                        name="destinoCalle"
                                        className="form-input"
                                        value={formData.destinoCalle}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Número</label>
                                    <input
                                        type="text"
                                        name="destinoNumero"
                                        className="form-input"
                                        value={formData.destinoNumero}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Ciudad</label>
                                    <input
                                        type="text"
                                        name="destinoCiudad"
                                        className="form-input"
                                        value={formData.destinoCiudad}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
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

                        {/* Sección Detalles del Envío */}
                        <div style={{ marginBottom: "2rem" }}>
                            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "600" }}>📋 Detalles del Envío</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div>
                                    <label className="form-label">Fecha de Retiro</label>
                                    <input
                                        type="date"
                                        name="fechaRetiro"
                                        className="form-input"
                                        value={formData.fechaRetiro}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Hora Aproximada</label>
                                    <input
                                        type="time"
                                        name="horaRetiroAprox"
                                        className="form-input"
                                        value={formData.horaRetiroAprox}
                                        onChange={handleChange}
                                        step="900"
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Tamaño del Paquete</label>
                                    <select
                                        name="tamanoPaquete"
                                        className="form-input"
                                        value={formData.tamanoPaquete}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- No modificar --</option>
                                        <option value="chico">Chico</option>
                                        <option value="mediano">Mediano</option>
                                        <option value="grande">Grande</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="form-label">Categoría</label>
                                    <input
                                        type="text"
                                        name="categoriaNombre"
                                        className="form-input"
                                        value={formData.categoriaNombre}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label className="form-label">Descripción de Categoría</label>
                                    <input
                                        type="text"
                                        name="categoriaDescripcion"
                                        className="form-input"
                                        value={formData.categoriaDescripcion}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label className="form-label">Notas (máx. 500 caracteres)</label>
                                    <textarea
                                        name="notas"
                                        className="form-input"
                                        rows="3"
                                        value={formData.notas}
                                        onChange={handleChange}
                                        maxLength="500"
                                    />
                                    <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                                        {formData.notas.length}/500 caracteres
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => navigate("/dashboard")}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                                style={{ minWidth: "150px" }}
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default EditarEnvio;