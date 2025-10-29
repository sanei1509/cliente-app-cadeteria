// src/components/admin/AdminNavbar.jsx
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { TruckIcon, StarIcon, ChevronIcon, LogoutIcon } from "../../components/icons";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Obtener información del usuario desde localStorage
  const getUserInfo = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error al parsear user:", error);
      return null;
    }
  };

  const user = getUserInfo();
  const userName = user?.name || user?.username || "Admin";

  // Generar iniciales del nombre
  const getInitials = (name) => {
    const nombreDividido = name.trim().split(" ");
    if (nombreDividido.length >= 2) {
      return (nombreDividido[0][0] + nombreDividido[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userInitials = getInitials(userName);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">
            <TruckIcon />
          </div>
          CadeteríaApp
        </div>

        <div className="navbar-menu"></div>

        <div className="navbar-user" ref={dropdownRef}>
          <span className="plan-badge" style={{ background: "#dc2626" }}>
            <StarIcon />
            Admin
          </span>
          <div
            className="navbar-user-info"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="navbar-avatar">{userInitials}</div>
            <span className="navbar-username">{userName}</span>
            <ChevronIcon
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </div>

          {dropdownOpen && (
            <div className="navbar-dropdown">
              <button className="navbar-dropdown-item" onClick={logout}>
                <LogoutIcon />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
