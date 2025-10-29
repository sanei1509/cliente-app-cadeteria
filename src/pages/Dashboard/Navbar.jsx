import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { TruckIcon, LayersIcon, ChevronIcon, LogoutIcon } from "../../components/icons";

const Navbar = () => {
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
    const userName = user?.name || user?.username || "Usuario";
    const userPlan = user?.plan || "Free";

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
        <div className="navbar-content">
            <div className="navbar-brand">
                <div className="navbar-brand-icon">
                    <TruckIcon />
                </div>
                <span>CadeteriaApp</span>
            </div>

            <div className="navbar-user" ref={dropdownRef}>
                <span className="plan-badge" title="Plan actual">
                    <LayersIcon />
                    Plan {userPlan}
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
    );
};

export default Navbar;
