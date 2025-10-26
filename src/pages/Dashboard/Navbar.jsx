import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (

        <div className="navbar-content">
            <div className="navbar-brand">
                <div className="navbar-brand-icon">
                    {/* Ícono simple */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M3 6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
                    </svg>
                </div>
                CadeteríaApp
            </div>

            <div className="navbar-menu">
            </div>

            <div className="navbar-user" /*onClick={aca la logica de solicitar cambiar de plan}*/ >
                <span className="plan-badge" title="Pasar a plan Premium" style={{ cursor: 'pointer' }}>
                    <svg viewBox="0 0 24 24"><path d="M12 2l4 4-4 4-4-4 4-4z" /></svg>
                    Plan Plus
                </span>
                <div className="navbar-avatar">CM</div>
                <button className="btn btn-ghost" onClick={logout}>Salir</button>
            </div>
        </div>
    )
}

export default Navbar;
