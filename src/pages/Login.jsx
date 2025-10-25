import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();                 // no recargar la página
    localStorage.setItem("token", "ok"); // <<< token “dummy” SIEMPRE
    navigate("/dashboard");              // ir al dashboard
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
          <h1>Bienvenido</h1>
          <p>Ingresa a tu cuenta de CadeteriaApp</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Nombre de Usuario</label>
            <input id="username" className="form-input" placeholder="cualquier cosa" autoComplete="username" />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input id="password" type="password" className="form-input" placeholder="cualquier cosa" autoComplete="current-password" />
          </div>

          <button type="submit" className="btn btn-primary btn-full">Iniciar Sesión</button>
        </form>

        <p className="text-center text-muted mt-md">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
