import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin.jsx";

// Componente para proteger rutas privadas
const Private = ({ children }) => {
  const isAuth = !!localStorage.getItem("token");
  return isAuth ? children : <Navigate to="/login" replace />;
};

// Componente para proteger rutas de admin
const PrivateAdmin = ({ children }) => {
  const isAuth = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Si está autenticado pero no es admin, redirigir a dashboard normal
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout principal con navegación
function Layout() {
  return (
    <div>
      {/* nav mínima para probar */}
      <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/login">Login</Link>{" | "}
        <Link to="/register">Register</Link>{" | "}
        <Link to="/dashboard">Dashboard</Link>{" | "}
        <Link to="/dashboardAdmin">DashboardAdmin</Link>
      </nav>
      <Outlet />
    </div>
  );
}

// Componente principal con todas las rutas
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Rutas Privadas */}
          <Route path="dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="dashboardAdmin" element={<PrivateAdmin><DashboardAdmin /></PrivateAdmin>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
