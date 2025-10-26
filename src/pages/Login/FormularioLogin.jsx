// src/components/auth/FormularioLogin.jsx

const FormularioLogin = ({ 
  username, 
  setUsername, 
  password, 
  setPassword, 
  showPassword, 
  setShowPassword,
  handleSubmit,
  isValid,
  isSubmitting 
}) => {
  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username" className="form-label">Nombre de Usuario</label>
        <input
          id="username"
          className="form-input"
          placeholder="Usuario"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group password-field">
        <label htmlFor="password" className="form-label">Contraseña</label>

        <input
          id="password"
          type={showPassword ? "text" : "password"}
          className="form-input password-input"
          placeholder="Contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3l18 18" />
              <path d="M10.58 10.58A3 3 0 0 0 13.42 13.4" />
              <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.4 19.4 0 0 1-4.15 5.35" />
              <path d="M6.1 6.1A19.4 19.4 0 0 0 1 12s4 8 11 8c1.13 0 2.21-.18 3.23-.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
};

export default FormularioLogin;