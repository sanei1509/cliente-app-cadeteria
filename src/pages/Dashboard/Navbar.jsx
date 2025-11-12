import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { selectUser, selectUserPlan, clearUser, setUser } from "../../features/userSlice";
import { TruckIcon, LayersIcon, LogoutIcon } from "../../components/icons";
import CancelPlanModal from "../../components/CancelPlanModal";
import { API_CESAR } from "../../api/config";
import { toast } from "react-toastify";

const MAX_PLAN_PLUS = 10;


const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dvu1wtvuq/image/upload";
const CLOUDINARY_PRESET = "Cadeteria";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cancelPlanModalOpen, setCancelPlanModalOpen] = useState(false);

  // Obtener envíos desde Redux
  const allEnvios = useSelector((state) => state.envios.allEnvios);

  // Modal para subir foto
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dropdownRef = useRef(null);

  const user = useSelector(selectUser);
  const userPlan = useSelector(selectUserPlan);

  const userName = user?.nombre || user?.username || "Usuario";
  const userEmail = user?.email || "";
  const planDisplay = userPlan || "Plus";
  const userImage = user?.imageUrl || null;
  const hasImage = Boolean(userImage) && !imageError;

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => setImageError(false), [userImage]);

  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };
  const userInitials = getInitials(userName);

  const logout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  // ---- Modal subir foto: handlers ----
  const openPhotoModal = () => {
    setFile(null);
    setPreview("");
    setPhotoModalOpen(true);
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Validaciones
    const maxMB = 5;
    if (f.size > maxMB * 1024 * 1024) {
      toast.error(`La imagen supera ${maxMB}MB`);
      e.target.value = "";
      return;
    }
    if (!/^image\/(png|jpe?g|webp|gif)$/i.test(f.type)) {
      toast.error("Formato no soportado (usa JPG, PNG, WEBP o GIF)");
      e.target.value = "";
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleCancelPlanClick = () => {
    // Validar cantidad de envíos pendientes antes de abrir el modal
    const enviosPendientes = allEnvios.filter((e) => e.estado === "pendiente").length;

    if (enviosPendientes > MAX_PLAN_PLUS) {
      toast.error("No puedes cancelar el plan, tu cantidad de envíos pendientes supera la versión plus");
      setDropdownOpen(false);
      return;
    }

    setDropdownOpen(false);
    setCancelPlanModalOpen(true);
  };

  const uploadAndSave = async () => {
    if (!file) {
      toast.info("Elegí una imagen primero");
      return;
    }

    setIsUploading(true);
    try {
      // 1) Subir a Cloudinary
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", CLOUDINARY_PRESET);

      const cloudRes = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: fd,
      });
      if (!cloudRes.ok) throw new Error("Falló la subida a Cloudinary");

      const cloudData = await cloudRes.json();
      const secureUrl = cloudData.secure_url || cloudData.url;
      if (!secureUrl) throw new Error("Cloudinary no devolvió secure_url");

      // 2) Actualizar la API con { imageUrl }
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        user?.token ||
        "";

      const apiRes = await fetch(`${API_CESAR}/v1/users/me/image`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: secureUrl }),
      });

      if (!apiRes.ok) {
        const errJson = await apiRes.json().catch(() => ({}));
        throw new Error(errJson?.error || "No se pudo actualizar la foto");
      }

      const updatedUser = await apiRes.json();
      dispatch(setUser(updatedUser));
      toast.success("Foto actualizada");
      setPhotoModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error subiendo la foto");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="navbar-content">
      <div className="navbar-brand">
        <div className="navbar-brand-icon">
          <TruckIcon />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>CadeteriaApp</span>
          {user?.empresa && (
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "400" }}>
              {user.empresa}
            </span>
          )}
        </div>
      </div>

      <div className="navbar-user">
        <span
          className={`plan-badge ${planDisplay.toLowerCase() === "premium" ? "plan-badge-premium-yellow" : ""}`}
          title="Plan actual"
        >
          <LayersIcon />
          Plan {planDisplay}
        </span>

        <div className="navbar-user-info" ref={dropdownRef}>
          <button
            className="user-dropdown-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            {hasImage ? (
              <img
                src={userImage}
                alt={userName}
                className="navbar-avatar-image navbar-avatar-image--large"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="navbar-avatar">{userInitials}</div>
            )}

            <span className="navbar-username">{userName}</span>
            <svg className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="navbar-dropdown">
              <div className="dropdown-user-info">
                <div className="dropdown-user-name">{userName}</div>
                <div className="dropdown-user-email">{userEmail}</div>
              </div>

              <div className="dropdown-divider"></div>

              {/* Botón: Abrir modal subir/cambiar foto */}
              <button
                className="navbar-dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  openPhotoModal();
                }}
                disabled={isUploading}
                title="Subir o cambiar tu foto"
              >
                {isUploading ? "Subiendo..." : (hasImage ? "Cambiar foto" : "Subir foto")}
              </button>

              {userPlan?.toLowerCase() === "premium" && (
                <>
                  <div className="dropdown-divider"></div>
                  <button
                    className="navbar-dropdown-item"
                    onClick={handleCancelPlanClick}
                  >
                    <span>Cancelar Plan Premium</span>
                  </button>
                </>
              )}

              <div className="dropdown-divider"></div>

              <button
                className="navbar-dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
              >
                <LogoutIcon />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <CancelPlanModal isOpen={cancelPlanModalOpen} onClose={() => setCancelPlanModalOpen(false)} />

      {/* ===== Modal chiquito inline para subir foto ===== */}
      {photoModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => !isUploading && setPhotoModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(92vw, 420px)",
              background: "var(--surface, #fff)",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,.2)",
            }}
          >
            <h3 style={{ marginBottom: 8 }}>Foto de perfil</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>
              Subí una imagen (JPG/PNG/WEBP/GIF) hasta 5MB.
            </p>

            <div style={{ marginTop: 12 }}>
              <input type="file" accept="image/*" onChange={onFileChange} disabled={isUploading} />
            </div>

            {preview && (
              <div style={{ marginTop: 12 }}>
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "50%", border: "1px solid #eee" }}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
              <button
                className="btn btn-ghost"
                onClick={() => setPhotoModalOpen(false)}
                disabled={isUploading}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={uploadAndSave}
                disabled={!file || isUploading}
              >
                {isUploading ? "Subiendo..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
