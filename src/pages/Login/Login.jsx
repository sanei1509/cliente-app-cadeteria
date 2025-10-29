// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "./Logo";
import FormularioLogin from "./FormularioLogin";
import { API_SANTI } from "../../api/config";
import { API_CESAR } from "../../api/config";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isValid = username.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    setError(""); // Limpiar errores anteriores

    try {
      // Petición al endpoint de login
      const response = await fetch(
        // "https://apicadeteria-m0l7xry84-cesars-projects-2539e6a6.vercel.app/public/v1/login",
        `${API_SANTI}/public/v1/loginReal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Guardar el token en localStorage
        localStorage.setItem("token", data.token?.token);

        // Guardar datos del usuario
        if (data.token?.user) {
          localStorage.setItem("user", JSON.stringify(data.token?.user));
        }

        // Redirigir según el rol del usuario
        const role = data.token?.user?.role;
        if (role === "admin") {
          navigate("/dashboardAdmin");
        } else {
          navigate("/dashboard");
        }
      } else {
        // Manejar errores de autenticación
        const errorData = await response.json();
        setError(errorData.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error de conexión. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Logo />

        <FormularioLogin
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleSubmit={handleSubmit}
          isValid={isValid}
          isSubmitting={isSubmitting}
          error={error}
        />

        <p className="text-center text-muted mt-md">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
