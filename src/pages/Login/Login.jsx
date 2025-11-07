// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/userSlice";
import Logo from "./Logo";
import { API_SANTI } from "../../api/config";
import { API_CESAR } from "../../api/config";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (loginData) => {
    if (!isValid) return;

    setIsSubmitting(true);
    setError(""); // Limpiar errores anteriores

    try {
      const response = await fetch(`${API_CESAR}/public/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();

        // Limpiar localStorage antes de guardar nuevos datos
        localStorage.clear();

        // Guardar el token en localStorage
        localStorage.setItem("token", data.token?.token);

        // Guardar datos del usuario en Redux (automáticamente sincroniza con localStorage)
        if (data.token?.user) {
          dispatch(setUser(data.token?.user));
        }

        // Mostrar toast de éxito
        toast.success("¡Bienvenido! Inicio de sesión exitoso");

        // Redirigir según el rol del usuario
        const role = data.token?.user?.role;
        if (role === "admin") {
          navigate("/dashboardAdmin");
        } else {
          navigate("/dashboard");
        }
        reset();
      } else {
        // Manejar errores de autenticación
        const errorData = await response.json();
        const errorMsg = errorData.message || "Credenciales incorrectas";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.log(error);
      const errorMsg = "Error de conexión. Por favor, intenta nuevamente.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Logo />

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nombre de Usuario
            </label>
            <input
              id="username"
              className="form-input"
              placeholder="Usuario"
              autoComplete="username"
              {...register("username", {
                required: "El nombre de usuario es obligatorio",
                minLength: {
                  value: 2,
                  message: "El usuario debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El usuario debe tener como máximo 50 caracteres",
                },
              })}
            />
            {errors.username && (
              <div
                style={{
                  backgroundColor: "rgba(242, 242, 242, 0)",
                  borderRadius: "var(--radius-md)",
                  color: "#dc2626",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                {errors.username.message}
              </div>
            )}
          </div>

          <div className="form-group password-field">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input password-input"
                placeholder="Contraseña"
                autoComplete="current-password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 4,
                    message: "La contraseña debe tener al menos 4 caracteres",
                  },
                })}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                title={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A3 3 0 0 0 13.42 13.4" />
                    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.4 19.4 0 0 1-4.15 5.35" />
                    <path d="M6.1 6.1A19.4 19.4 0 0 0 1 12s4 8 11 8c1.13 0 2.21-.18 3.23-.5" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>{" "}
            {errors.password && (
              <div
                style={{
                  // padding: "0.75rem",
                  backgroundColor: "rgba(242, 242, 242, 0)",
                  // border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-md)",
                  color: "#dc2626",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Mostrar mensaje de error si existe */}
          {error && <div> {error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-center text-muted mt-md">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
