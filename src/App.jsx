import { Outlet, Link } from "react-router-dom";

export default function App() {
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
