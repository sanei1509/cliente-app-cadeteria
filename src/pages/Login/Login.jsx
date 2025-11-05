// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/userSlice";
import Logo from "./Logo";
import FormularioLogin from "./FormularioLogin";
import { API_SANTI } from "../../api/config";
import { API_CESAR } from "../../api/config";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const response = await fetch(`${API_CESAR}/public/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
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
      } else {
        // Manejar errores de autenticación
        const errorData = await response.json();
        const errorMsg = errorData.message || "Credenciales incorrectas";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
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
