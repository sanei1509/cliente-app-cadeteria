// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { setUser } from "../../features/userSlice";
import { API_CESAR } from "../../api/config";
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const handleUploadFile = (evt) => {
    const selectedFile = evt.target.files[0];
    if (selectedFile) {
      // Validar tamaño (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB");
        evt.target.value = null;
        return;
      }
      // Validar tipo
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Solo se permiten archivos de imagen");
        evt.target.value = null;
        return;
      }
      setFile(selectedFile);
    }
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    // Separar nombre y apellido
    const [nombre, ...resto] = formData.fullName.trim().split(" ");
    const apellido = resto.length ? resto.join(" ") : "-";

    let imageUrl;

    // Subir la imagen a Cloudinary si existe
    if (file) {
      const data = new FormData();
      data.append("upload_preset", "Cadeteria");
      data.append("file", file);
      
      const cloudinaryURL = "https://api.cloudinary.com/v1_1/dvu1wtvuq/image/upload";

      try {
        toast.info("Subiendo imagen...");
        const response = await fetch(cloudinaryURL, {
          method: "POST",
          body: data,
        });

        if (response.ok) {
          const cloudData = await response.json();
          imageUrl = cloudData.secure_url || cloudData.url;
          console.log("Imagen subida a Cloudinary:", imageUrl);
        } else {
          toast.error("Error al subir la imagen");
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.error("Error al subir imagen:", error);
        toast.error("Error al subir la imagen");
        setIsSubmitting(false);
        return;
      }
    }

    // Preparar payload con validación explícita
    const payload = {
      username: formData.username,
      password: formData.password,
      nombre,
      apellido,
      email: formData.email,
    };
    if (imageUrl) payload.imageUrl = imageUrl; // solo si existe

    console.log("Payload a enviar:", payload);
    console.log("Tipo de imageUrl:", typeof payload.imageUrl);

    try {
      const res = await fetch(`${API_CESAR}/public/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(`Error de registro: ${err.message || res.statusText}`);
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();

      let tokenStr, userObj;

      if (data?.token?.token && data?.token?.user) {
        tokenStr = data.token.token;
        userObj = data.token.user;
      } else if (data?.id && data?.username) {
        try {
          const loginRes = await fetch(`${API_CESAR}/public/v1/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
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
        localStorage.clear();
        localStorage.setItem("token", tokenStr);
        dispatch(setUser(userObj));
        toast.success("¡Cuenta creada exitosamente! Bienvenido");
        navigate("/dashboard");
      } else {
        toast.success("Registro exitoso. Por favor, inicia sesión manualmente.");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Error de conexión. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
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
        <form id="registerForm" className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Nombre Completo *</label>
            <input
              type="text"
              id="fullName"
              className={`form-input ${errors.fullName ? 'is-invalid' : ''}`}
              placeholder="Juan Pérez"
              autoComplete="name"
              {...register("fullName", {
                required: "⚠️ Por favor ingresa tu nombre completo",
                minLength: {
                  value: 3,
                  message: "⚠️ El nombre debe tener al menos 3 caracteres",
                },
              })}
              style={errors.fullName ? { borderColor: '#dc2626' } : {}}
            />
            {errors.fullName && (
              <span style={{ 
                color: '#dc2626', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem',
                display: 'block',
                fontWeight: '500'
              }}>
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Nombre de Usuario *</label>
            <input
              type="text"
              id="username"
              className={`form-input ${errors.username ? 'is-invalid' : ''}`}
              placeholder="tu_usuario"
              autoComplete="username"
              {...register("username", {
                required: "⚠️ El nombre de usuario es obligatorio",
                minLength: {
                  value: 2,
                  message: "⚠️ El usuario debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "⚠️ El usuario debe tener como máximo 50 caracteres",
                },
              })}
              style={errors.username ? { borderColor: '#dc2626' } : {}}
            />
            {errors.username && (
              <span style={{ 
                color: '#dc2626', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem',
                display: 'block',
                fontWeight: '500'
              }}>
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Imagen (opcional) */}
          <div className="form-group">
            <label htmlFor="imageFile" className="form-label">
              Imagen o Logo (opcional)
              {file && <span style={{ marginLeft: '0.5rem', color: 'var(--success-color)', fontSize: '0.85rem' }}>✓ {file.name}</span>}
            </label>
            <input
              type="file"
              id="imageFile"
              className="form-input"
              accept="image/*"
              onChange={handleUploadFile}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Máximo 5MB - JPG, PNG, GIF
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? 'is-invalid' : ''}`}
              placeholder="tu@email.com"
              autoComplete="email"
              {...register("email", {
                required: "⚠️ Por favor ingresa tu email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "⚠️ Formato de email inválido",
                },
              })}
              style={errors.email ? { borderColor: '#dc2626' } : {}}
            />
            {errors.email && (
              <span style={{ 
                color: '#dc2626', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem',
                display: 'block',
                fontWeight: '500'
              }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Teléfono *</label>
            <input
              type="tel"
              id="phone"
              className={`form-input ${errors.phone ? 'is-invalid' : ''}`}
              placeholder="+54 11 1234-5678"
              autoComplete="tel"
              {...register("phone", {
                required: "⚠️ Por favor ingresa un teléfono válido",
                minLength: {
                  value: 8,
                  message: "⚠️ El teléfono debe tener al menos 8 dígitos",
                },
              })}
              style={errors.phone ? { borderColor: '#dc2626' } : {}}
            />
            {errors.phone && (
              <span style={{ 
                color: '#dc2626', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem',
                display: 'block',
                fontWeight: '500'
              }}>
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña *</label>
            <input
              type="password"
              id="password"
              className={`form-input ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Mínimo 4 caracteres"
              autoComplete="new-password"
              {...register("password", {
                required: "⚠️ La contraseña es obligatoria",
                minLength: {
                  value: 4,
                  message: "⚠️ La contraseña debe tener al menos 4 caracteres",
                },
              })}
              style={errors.password ? { borderColor: '#dc2626' } : {}}
            />
            {errors.password && (
              <span style={{ 
                color: '#dc2626', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem',
                display: 'block',
                fontWeight: '500'
              }}>
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña *</label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "⚠️ Debes confirmar tu contraseña",
                validate: (value) =>
                  value === password || "⚠️ Las contraseñas no coinciden",
              })}
              style={errors.confirmPassword ? { borderColor: '#dc2626' } : {}}
            />
            {errors.confirmPassword && (
              <span style={{ 
                color: '#dc2626', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem',
                display: 'block',
                fontWeight: '500'
              }}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", {
                  required: "⚠️ Debes aceptar los términos y condiciones",
                })}
              />
              <label htmlFor="terms">
                Acepto los <a href="#" target="_blank" rel="noreferrer">Términos y Condiciones</a>
                {" y la "}
                <a href="#" target="_blank" rel="noreferrer">Política de Privacidad</a>
              </label>
            </div>
            {errors.terms && (
              <span style={{ 
                color: '#dc2626', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem',
                display: 'block',
                fontWeight: '500'
              }}>
                {errors.terms.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={!isValid || !password || !confirmPassword || password !== confirmPassword || isSubmitting}
          >
            {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
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