import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TruckIcon, LayersIcon, ChevronIcon, LogoutIcon } from "../../components/icons";
import { getUserInfo } from "../../components/UserInfo"

const Navbar = () => {
    const navigate = useNavigate();
       


//traigo la info del usuario desde un componente
    const user = getUserInfo();

    const userName = user?.name || user?.username || "Usuario";
    const userPlan = user?.plan || "Plus";

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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

   
    return (
    <div className="navbar-content">
      <div className="navbar-brand">
        <div className="navbar-brand-icon">
          <TruckIcon />
        </div>
        <span>CadeteriaApp</span>
      </div>

      <div className="navbar-user">
        <span className="plan-badge" title="Plan actual">
          <LayersIcon />
          Plan {userPlan}
        </span>

        <div className="navbar-user-info">
          <div className="navbar-avatar">{userInitials}</div>
          <span className="navbar-username">{userName}</span>

          {/* 👇 Botón de cerrar sesión al lado del nombre */}
          <button
            type="button"
            className="icon-button logout-btn"
            onClick={logout}
            title="Cerrar sesión"          // tooltip nativo
            aria-label="Cerrar sesión"     // accesibilidad
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
