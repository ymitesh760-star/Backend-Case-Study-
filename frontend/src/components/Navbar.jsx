import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginAt");
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink className="brand" to="/dashboard">
          <span className="brand-mark">IT</span>
          <span>Asset Manager</span>
        </NavLink>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/assets">Assets</NavLink>
          <NavLink to="/assignments">Assignments</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <div className="nav-account">
          <span className="nav-user">{user.name || "Account"}</span>
          <button className="button button-quiet" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
