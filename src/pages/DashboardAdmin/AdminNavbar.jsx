// src/components/admin/AdminNavbar.jsx
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M3 6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
            </svg>
          </div>
          CadeteríaApp
        </div>

        <div className="navbar-menu"></div>

        <div className="navbar-user">
          <span className="plan-badge" style={{ background: '#dc2626' }}>
            <svg viewBox="0 0 24 24">
              <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
            </svg>
            Admin
          </span>
          <div className="navbar-avatar">AD</div>
          <button className="btn btn-ghost" onClick={logout}>Salir</button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;

