import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { selectUser, selectUserPlan, clearUser } from "../../features/userSlice";
import { TruckIcon, LayersIcon, LogoutIcon } from "../../components/icons";
import CancelPlanModal from "../../components/CancelPlanModal";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cancelPlanModalOpen, setCancelPlanModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  // Obtener datos del usuario desde Redux
  const user = useSelector(selectUser);
  const userPlan = useSelector(selectUserPlan);

  const userName = user?.nombre || user?.username || "Usuario";
  const userEmail = user?.email || "";
  const planDisplay = userPlan || "Plus";
  const userImage = user?.imageUrl || null;
  const hasImage = Boolean(userImage) && !imageError;


  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Reset imageError cuando cambia la imagen
  useEffect(() => {
    setImageError(false);
  }, [userImage]);

  // Generar iniciales del nombre (primeras letras de nombre y apellido)
  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userInitials = getInitials(userName);

  const logout = () => {
    // Limpiar usuario de Redux (automáticamente limpia localStorage)
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className="navbar-content">
      <div className="navbar-brand">
        <div className="navbar-brand-icon">
          <TruckIcon />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>CadeteriaApp</span>
          {user?.empresa && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: '400'
            }}>
              {user.empresa}
            </span>
          )}
        </div>
      </div>

      <div className="navbar-user">
        <span
          className={`plan-badge ${planDisplay.toLowerCase() === 'premium' ? 'plan-badge-premium-yellow' : ''}`}
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
            {/* flechita */}
            <svg className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              {userPlan.toLowerCase() === 'premium' && (
                <>
                  <button
                    className="navbar-dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      setCancelPlanModalOpen(true);
                    }}
                  >
                    <span>Cancelar Plan Premium</span>
                  </button>
                  <div className="dropdown-divider"></div>
                </>
              )}
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

      <CancelPlanModal
        isOpen={cancelPlanModalOpen}
        onClose={() => setCancelPlanModalOpen(false)}
      />
    </div>
  );
};

export default Navbar;