// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from './Logo';
import FormularioLogin from './FormularioLogin';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = username.trim() !== "" && password.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    localStorage.setItem("token", "ok");
    navigate("/dashboard");
    setIsSubmitting(false);
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
        />

        <p className="text-center text-muted mt-md">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;