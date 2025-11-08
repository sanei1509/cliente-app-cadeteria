import Modal from "./Modal";
import { API_CESAR } from "../../api/config";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { addEnvio } from "../../features/enviosSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { Spinner } from "../../components/Spinner";

const AgregarEnvio = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isValid },
    } = useForm({ mode: "onChange" });

    const [categorias, setCategorias] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const [catError, setCatError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Obtener usuario y envíos desde Redux
    const user = useSelector((state) => state.user.user);
    const envios = useSelector((state) => state.envios.envios);

    const notasValue = watch("notas", "");

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                setCatLoading(true);
                setCatError(null);
                const res = await fetch(`${API_CESAR}/public/v1/categories`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setCategorias(Array.isArray(data) ? data : []);
            } catch (err) {
                setCatError("No se pudieron cargar las categorías.");
            } finally {
                setCatLoading(false);
            }
        };
        fetchCategorias();
    }, []);

    const onSubmit = (formData) => {
        setIsSubmitting(true);

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Tu sesión expiró. Iniciá sesión nuevamente.");
            navigate("/login");
            setIsSubmitting(false);
            return;
        }

        // Obtener la categoría seleccionada por ID
        const categoriaId = formData.categoriaId;
        const categoriaSeleccionada = categorias.find(c => c.id === categoriaId);
        if (!categoriaSeleccionada) {
            toast.error("Seleccioná una categoría válida.");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            origen: {
                calle: formData.origenCalle,
                numero: formData.origenNumero,
                ciudad: formData.origenCiudad,
                referencia: formData.origenReferencia || ""
            },
            destino: {
                calle: formData.destinoCalle,
                numero: formData.destinoNumero,
                ciudad: formData.destinoCiudad,
                referencia: formData.destinoReferencia || ""
            },
            fechaRetiro: formData.fechaRetiro,
            horaRetiroAprox: formData.horaRetiroAprox,
            tamanoPaquete: formData.tamanoPaquete,
            notas: formData.notas || "",
            categoria: {
                nombre: categoriaSeleccionada.name
            }
        };

        if (formData.categoriaDescripcion) {
            payload.categoria.descripcion = formData.categoriaDescripcion;
        }

        fetch(`${API_CESAR}/v1/envios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().catch(() => ({})).then((err) => {
                        const msg = err?.message || res.statusText || "No se pudo crear el envío";
                        throw new Error(msg);
                    });
                }
                return res.json();
            })
            .then((nuevoEnvio) => {
                dispatch(addEnvio(nuevoEnvio));
                reset();
                setIsModalOpen(false);
                toast.success("Envío registrado exitosamente");
            })
            .catch((error) => {
                toast.error(`Error: ${error.message || "Error de conexión. Intentá nuevamente."}`);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <>
            <div>
                <h3 className="card-title">Envíos</h3>
            </div>

            <button
                className="btn btn-primary"
                onClick={() => {
                    if (user?.plan === "plus") {
                        const enviosPendientes = envios.filter(e => e.estado === "pendiente").length;
                        if (enviosPendientes >= 10) {
                            toast.warning("Has alcanzado el límite de 10 envíos pendientes del Plan Plus. Actualiza a Plan Premium para envíos ilimitados.");
                            return;
                        }
                    }
                    setIsModalOpen(true);
                }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Nuevo Envío
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="modal-header">
                    <h2 className="modal-title">Registrar Envío</h2>
                    <p className="modal-subtitle">Complete los datos del nuevo envío</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Origen */}
                    <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem", fontSize: "1rem" }}>📍 Origen</h3>

                    <div className="form-group">
                        <label className="form-label">Calle *</label>
                        <input
                            className={`form-input ${errors.origenCalle ? 'is-invalid' : ''}`}
                            placeholder="Ej: Av. 18 de Julio"
                            {...register("origenCalle", {
                                required: "⚠️ La calle de origen es requerida",
                                minLength: {
                                    value: 3,
                                    message: "⚠️ La calle debe tener al menos 3 caracteres",
                                },
                            })}
                            style={errors.origenCalle ? { borderColor: '#dc2626' } : {}}
                        />
                        {errors.origenCalle && (
                            <div style={{ 
                                color: '#dc2626', 
                                fontSize: '0.875rem', 
                                marginTop: '0.25rem',
                                fontWeight: '500'
                            }}>
                                {errors.origenCalle.message}
                            </div>
                        )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Número *</label>
                            <input
                                className={`form-input ${errors.origenNumero ? 'is-invalid' : ''}`}
                                placeholder="1234"
                                {...register("origenNumero", {
                                    required: "⚠️ El número es requerido",
                                })}
                                style={errors.origenNumero ? { borderColor: '#dc2626' } : {}}
                            />
                            {errors.origenNumero && (
                                <div style={{ 
                                    color: '#dc2626', 
                                    fontSize: '0.875rem', 
                                    marginTop: '0.25rem',
                                    fontWeight: '500'
                                }}>
                                    {errors.origenNumero.message}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Ciudad *</label>
                            <input
                                className={`form-input ${errors.origenCiudad ? 'is-invalid' : ''}`}
                                placeholder="Montevideo"
                                {...register("origenCiudad", {
                                    required: "⚠️ La ciudad es requerida",
                                    minLength: {
                                        value: 3,
                                        message: "⚠️ La ciudad debe tener al menos 3 caracteres",
                                    },
                                })}
                                style={errors.origenCiudad ? { borderColor: '#dc2626' } : {}}
                            />
                            {errors.origenCiudad && (
                                <div style={{ 
                                    color: '#dc2626', 
                                    fontSize: '0.875rem', 
                                    marginTop: '0.25rem',
                                    fontWeight: '500'
                                }}>
                                    {errors.origenCiudad.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Referencia</label>
                        <input
                            className="form-input"
                            placeholder="Ej: Frente a la plaza"
                            {...register("origenReferencia")}
                        />
                    </div>

                    {/* Destino */}
                    <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem", fontSize: "1rem" }}>📦 Destino</h3>

                    <div className="form-group">
                        <label className="form-label">Calle *</label>
                        <input
                            className={`form-input ${errors.destinoCalle ? 'is-invalid' : ''}`}
                            placeholder="Ej: Av. Italia"
                            {...register("destinoCalle", {
                                required: "⚠️ La calle de destino es requerida",
                                minLength: {
                                    value: 3,
                                    message: "⚠️ La calle debe tener al menos 3 caracteres",
                                },
                            })}
                            style={errors.destinoCalle ? { borderColor: '#dc2626' } : {}}
                        />
                        {errors.destinoCalle && (
                            <div style={{ 
                                color: '#dc2626', 
                                fontSize: '0.875rem', 
                                marginTop: '0.25rem',
                                fontWeight: '500'
                            }}>
                                {errors.destinoCalle.message}
                            </div>
                        )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Número *</label>
                            <input
                                className={`form-input ${errors.destinoNumero ? 'is-invalid' : ''}`}
                                placeholder="5678"
                                {...register("destinoNumero", {
                                    required: "⚠️ El número es requerido",
                                })}
                                style={errors.destinoNumero ? { borderColor: '#dc2626' } : {}}
                            />
                            {errors.destinoNumero && (
                                <div style={{ 
                                    color: '#dc2626', 
                                    fontSize: '0.875rem', 
                                    marginTop: '0.25rem',
                                    fontWeight: '500'
                                }}>
                                    {errors.destinoNumero.message}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Ciudad *</label>
                            <input
                                className={`form-input ${errors.destinoCiudad ? 'is-invalid' : ''}`}
                                placeholder="Punta del Este"
                                {...register("destinoCiudad", {
                                    required: "⚠️ La ciudad es requerida",
                                    minLength: {
                                        value: 3,
                                        message: "⚠️ La ciudad debe tener al menos 3 caracteres",
                                    },
                                })}
                                style={errors.destinoCiudad ? { borderColor: '#dc2626' } : {}}
                            />
                            {errors.destinoCiudad && (
                                <div style={{ 
                                    color: '#dc2626', 
                                    fontSize: '0.875rem', 
                                    marginTop: '0.25rem',
                                    fontWeight: '500'
                                }}>
                                    {errors.destinoCiudad.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Referencia</label>
                        <input
                            className="form-input"
                            placeholder="Ej: Apartamento 302"
                            {...register("destinoReferencia")}
                        />
                    </div>

                    {/* Detalles del Envío */}
                    <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem", fontSize: "1rem" }}>📋 Detalles</h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Fecha de Retiro *</label>
                            <input
                                type="date"
                                className={`form-input ${errors.fechaRetiro ? 'is-invalid' : ''}`}
                                {...register("fechaRetiro", {
                                    required: "La fecha de retiro es requerida",
                                    validate: {
                                        notPast: (value) => {
                                            if (!value) return true;
                                            const selected = new Date(value + "T00:00:00");
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            const tomorrow = new Date(today);
                                            tomorrow.setDate(tomorrow.getDate() + 1);
                                            
                                            if (selected < tomorrow) {
                                                return "⚠️ La fecha de retiro debe ser a partir de mañana";
                                            }
                                            return true;
                                        },
                                    },
                                })}
                                style={errors.fechaRetiro ? { borderColor: '#dc2626' } : {}}
                            />
                            {errors.fechaRetiro && (
                                <div style={{ 
                                    color: '#dc2626', 
                                    fontSize: '0.875rem', 
                                    marginTop: '0.25rem',
                                    fontWeight: '500'
                                }}>
                                    {errors.fechaRetiro.message}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Hora aproximada (HH:MM) *</label>
                            <input
                                className={`form-input ${errors.horaRetiroAprox ? 'is-invalid' : ''}`}
                                placeholder="14:30"
                                {...register("horaRetiroAprox", {
                                    required: "⚠️ La hora aproximada es requerida",
                                    pattern: {
                                        value: /^([01]\d|2[0-3]):[0-5]\d$/,
                                        message: "⚠️ Formato inválido. Usa HH:mm (ejemplo: 14:30)",
                                    },
                                })}
                                style={errors.horaRetiroAprox ? { borderColor: '#dc2626' } : {}}
                            />
                            {errors.horaRetiroAprox && (
                                <div style={{ 
                                    color: '#dc2626', 
                                    fontSize: '0.875rem', 
                                    marginTop: '0.25rem',
                                    fontWeight: '500'
                                }}>
                                    {errors.horaRetiroAprox.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Tamaño *</label>
                            <select
                                className={`form-input ${errors.tamanoPaquete ? 'is-invalid' : ''}`}
                                defaultValue=""
                                {...register("tamanoPaquete", {
                                    required: "⚠️ Selecciona un tamaño de paquete",
                                })}
                                style={errors.tamanoPaquete ? { borderColor: '#dc2626' } : {}}
                            >
                                <option value="">-- Seleccionar --</option>
                                <option value="chico">Chico</option>
                                <option value="mediano">Mediano</option>
                                <option value="grande">Grande</option>
                            </select>
                            {errors.tamanoPaquete && (
                                <div style={{ 
                                    color: '#dc2626', 
                                    fontSize: '0.875rem', 
                                    marginTop: '0.25rem',
                                    fontWeight: '500'
                                }}>
                                    {errors.tamanoPaquete.message}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Categoría *</label>

                            {catError && (
                                <div style={{ color: "var(--error-color)", fontSize: ".9rem", marginBottom: ".25rem" }}>
                                    {catError}
                                </div>
                            )}

                            <select
                                className={`form-input ${errors.categoriaId ? 'is-invalid' : ''}`}
                                disabled={catLoading || categorias.length === 0}
                                {...register("categoriaId", {
                                    required: "⚠️ Selecciona una categoría",
                                })}
                                style={errors.categoriaId ? { borderColor: '#dc2626' } : {}}
                            >
                                <option value="">
                                    {catLoading ? "Cargando..." : "Seleccionar categoría"}
                                </option>
                                {categorias.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.categoriaId && (
                                <div style={{ 
                                    color: '#dc2626', 
                                    fontSize: '0.875rem', 
                                    marginTop: '0.25rem',
                                    fontWeight: '500'
                                }}>
                                    {errors.categoriaId.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Descripción Categoría</label>
                        <input
                            className="form-input"
                            placeholder="Opcional"
                            {...register("categoriaDescripcion")}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Notas</label>
                        <textarea
                            className={`form-input ${errors.notas ? 'is-invalid' : ''}`}
                            rows="3"
                            placeholder="Instrucciones especiales..."
                            maxLength="100"
                            {...register("notas", {
                                maxLength: {
                                    value: 100,
                                    message: "Las notas no pueden superar los 100 caracteres",
                                },
                            })}
                        ></textarea>
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
                            <div className="form-error">{errors.notas.message}</div>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
                        <button
                            type="button"
                            className="btn btn-ghost btn-full"
                            onClick={() => {
                                reset();
                                setIsModalOpen(false);
                            }}
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
                                    <span style={{ marginLeft: "0.5rem" }}>Registrando...</span>
                                </>
                            ) : (
                                "Registrar Envío"
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default AgregarEnvio;