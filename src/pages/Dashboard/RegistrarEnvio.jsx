// src/pages/RegistrarEnvio.jsx
import { useNavigate } from "react-router-dom";

const RegistrarEnvio = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    const payload = {
      origen: {
        calle: formData.get("origenCalle"),
        numero: formData.get("origenNumero"),
        ciudad: formData.get("origenCiudad"),
        referencia: formData.get("origenReferencia")
      },
      destino: {
        calle: formData.get("destinoCalle"),
        numero: formData.get("destinoNumero"),
        ciudad: formData.get("destinoCiudad"),
        referencia: formData.get("destinoReferencia")
      },
      fechaRetiro: formData.get("fechaRetiro"),
      horaRetiroAprox: formData.get("horaRetiroAprox"),
      tamanoPaquete: formData.get("tamanoPaquete"),
      notas: formData.get("notas"),
      categoria: {
        nombre: formData.get("categoriaNombre"),
        descripcion: formData.get("categoriaDescripcion")
      }
    };

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("https://api-cadeteria-ghq490feg-cesars-projects-2539e6a6.vercel.app/v1/envios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "No se pudo crear el envío"}`);
      }
    } catch (error) {
      console.error("Error al crear envío:", error);
      alert("Error de conexión. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "700px" }}>
        <div className="logo">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
          <h1>Registrar Envío</h1>
          <p>Complete los datos del nuevo envío</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Origen */}
          <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem", fontSize: "1rem" }}>📍 Origen</h3>
          
          <div className="form-group">
            <label className="form-label">Calle *</label>
            <input name="origenCalle" className="form-input" placeholder="Ej: Av. 18 de Julio" required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Número</label>
              <input name="origenNumero" className="form-input" placeholder="1234" />
            </div>
            <div className="form-group">
              <label className="form-label">Ciudad *</label>
              <input name="origenCiudad" className="form-input" placeholder="Montevideo" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Referencia</label>
            <input name="origenReferencia" className="form-input" placeholder="Ej: Frente a la plaza" />
          </div>

          {/* Destino */}
          <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem", fontSize: "1rem" }}>📦 Destino</h3>
          
          <div className="form-group">
            <label className="form-label">Calle *</label>
            <input name="destinoCalle" className="form-input" placeholder="Ej: Av. Italia" required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Número</label>
              <input name="destinoNumero" className="form-input" placeholder="5678" />
            </div>
            <div className="form-group">
              <label className="form-label">Ciudad *</label>
              <input name="destinoCiudad" className="form-input" placeholder="Punta del Este" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Referencia</label>
            <input name="destinoReferencia" className="form-input" placeholder="Ej: Apartamento 302" />
          </div>

          {/* Detalles del Envío */}
          <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem", fontSize: "1rem" }}>📋 Detalles</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Fecha de Retiro *</label>
              <input type="date" name="fechaRetiro" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Hora aproximada (HH:MM)</label>
              <input name="horaRetiroAprox" className="form-input" placeholder="14:30" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Tamaño *</label>
              <select name="tamanoPaquete" className="form-input" defaultValue="mediano" required>
                <option value="chico">Chico</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <input name="categoriaNombre" className="form-input" placeholder="Documentos" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción Categoría</label>
            <input name="categoriaDescripcion" className="form-input" placeholder="Opcional" />
          </div>

          <div className="form-group">
            <label className="form-label">Notas</label>
            <textarea name="notas" className="form-input" rows="3" placeholder="Instrucciones especiales..." maxLength="500"></textarea>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
            <button type="button" className="btn btn-ghost btn-full" onClick={() => navigate("/dashboard")}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-full">
              Registrar Envío
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrarEnvio;