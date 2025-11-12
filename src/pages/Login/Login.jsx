import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/userSlice";
import Logo from "./Logo";
import { API_CESAR } from "../../api/config";
import { useForm } from "react-hook-form";
import { Spinner } from "../../components/Spinner";
import Button from "../../components/Button";
import { EyeIcon } from "../../components/icons";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

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

        localStorage.clear();

        const token = data.token?.token || data.token || data.accessToken;

        if (!token) {
          setError("Error al procesar el inicio de sesión");
          return;
        }

        localStorage.setItem("token", token);

        const user = data.token?.user || data.user;
        if (user) {
          dispatch(setUser(user));
        }

        const role = user?.role;
        if (role === "admin") {
          navigate("/dashboardAdmin");
        } else {
          navigate("/dashboard");
        }
        reset();
      } else {
        await response.json().catch(() => ({}));
        setError("Credenciales incorrectas");
      }
    } catch {
      setError("Error de conexión. Por favor, intenta nuevamente.");
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
                <EyeIcon isOpen={!showPassword} />
              </button>
            </div>{" "}
            {errors.password && (
              <div
                style={{
                  backgroundColor: "rgba(242, 242, 242, 0)",
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

          {error && (
            <div
              style={{
                backgroundColor: "rgba(242, 242, 242, 0)",
                borderRadius: "var(--radius-md)",
                color: "#dc2626",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            value="Iniciar Sesión"
            loadingContent={
              <>
                <Spinner color="text-light" size="spinner-border-sm" />
                <span style={{ marginLeft: "0.5rem" }}>Ingresando...</span>
              </>
            }
          />
        </form>

        <p className="text-center text-muted mt-md">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
