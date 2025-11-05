// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/userSlice";
import { API_CESAR } from "../../api/config";
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",  
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    // opcional: normalizar email a minúsculas
    const v = name === "email" ? value.trim().toLowerCase() : value;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : v }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Por favor ingresa tu nombre completo";
    if (!form.username.trim() || form.username.length < 3)
      e.username = "El nombre de usuario debe tener al menos 3 caracteres";

    // validación de email
    if (!form.email.trim()) {
      e.email = "Por favor ingresa tu email";
    } else {
      // chequeo simple de formato
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(form.email)) e.email = "Formato de email inválido";
    }

    if (!form.phone.trim()) e.phone = "Por favor ingresa un teléfono válido";
    if (!form.password || form.password.length < 6)
      e.password = "La contraseña debe tener al menos 6 caracteres";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Las contraseñas no coinciden";
    if (!form.terms) e.terms = "Debes aceptar los términos y condiciones";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Separar nombre y apellido
    const [nombre, ...resto] = form.fullName.trim().split(" ");
    const apellido = resto.length ? resto.join(" ") : "-";

    try {
      const res = await fetch(`${API_CESAR}/public/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          nombre,
          apellido,
          email: form.email,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(`Error de registro: ${err.message || res.statusText}`);
        return;
      }

      const data = await res.json();

      // Intentar extraer token y usuario de diferentes estructuras posibles
      let tokenStr, userObj;

      // Caso 1: { token: { token: "...", user: {...} } }
      if (data?.token?.token && data?.token?.user) {
        tokenStr = data.token.token;
        userObj = data.token.user;
      }
      // Caso 2: Respuesta directa del usuario (sin token) - hacer login manual
      else if (data?.id && data?.username) {
        
        try {
          const loginRes = await fetch(`${API_CESAR}/public/v1/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: form.username,
              password: form.password,
            }),
          });

          if (!loginRes.ok) {
            toast.success("Registro exitoso. Por favor, inicia sesión manualmente.");
            navigate("/login");
            return;
          }

          const loginData = await loginRes.json();

          tokenStr = loginData?.token?.token;
          userObj = loginData?.token?.user;
        } catch (loginError) {
          toast.success("Registro exitoso. Por favor, inicia sesión manualmente.");
          navigate("/login");
          return;
        }
      }

      if (tokenStr && userObj) {
        // Limpiar localStorage antes de guardar nuevos datos
        localStorage.clear();

        // Guardar token
        localStorage.setItem("token", tokenStr);

        // Guardar usuario usando Redux (automáticamente sincroniza con localStorage)
        dispatch(setUser(userObj));

        toast.success("¡Cuenta creada exitosamente! Bienvenido");
        navigate("/dashboard");
      } else {
        toast.success("Registro exitoso. Por favor, inicia sesión manualmente.");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Error de conexión. Intentá nuevamente.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo & Branding */}
        <div className="logo">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
          <h1>Crear Cuenta</h1>
          <p>Únete a la red de mensajería más rápida</p>
        </div>

        {/* Registration Form */}
        <form id="registerForm" className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Nombre Completo</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              placeholder="Juan Pérez"
              required
              autoComplete="name"
              value={form.fullName}
              onChange={onChange}
            />
            <span className="form-error">{errors.fullName}</span>
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              placeholder="tu_usuario"
              required
              autoComplete="username"
              minLength={3}
              value={form.username}
              onChange={onChange}
            />
            <span className="form-error">{errors.username}</span>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="tu@email.com"
              required
              autoComplete="email"
              value={form.email}
              onChange={onChange}
            />
            <span className="form-error">{errors.email}</span>
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="+54 11 1234-5678"
              required
              autoComplete="tel"
              value={form.phone}
              onChange={onChange}
            />
            <span className="form-error">{errors.phone}</span>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
              minLength={6}
              value={form.password}
              onChange={onChange}
            />
            <span className="form-error">{errors.password}</span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              placeholder="Repite tu contraseña"
              required
              autoComplete="new-password"
              minLength={6}
              value={form.confirmPassword}
              onChange={onChange}
            />
            <span className="form-error">{errors.confirmPassword}</span>
          </div>

          <div className="form-group">
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={form.terms}
                onChange={onChange}
                required
              />
              <label htmlFor="terms">
                Acepto los <a href="#" target="_blank" rel="noreferrer">Términos y Condiciones</a>
                {" y la "}
                <a href="#" target="_blank" rel="noreferrer">Política de Privacidad</a>
              </label>
            </div>
            <span className="form-error">{errors.terms}</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={!form.password || !form.confirmPassword || form.password !== form.confirmPassword}
          >
            Crear Cuenta
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-muted mt-md">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}