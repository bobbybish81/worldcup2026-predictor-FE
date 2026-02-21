import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {

  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        padding: "12px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: "12px",
      }}
    >
      <Link to="/">Home</Link>

      {user && (
        <>
          <NavLink
            to="/group"
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              textDecoration: isActive ? "underline" : "none",
            })}
          >
            Group Stage
          </NavLink>

          <NavLink
            to="/knockout"
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              textDecoration: isActive ? "underline" : "none",
            })}
          >
            Knockout
          </NavLink>

          <NavLink
            to="/leaderboard"
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              textDecoration: isActive ? "underline" : "none",
            })}
          >
            Leaderboard
          </NavLink>
        </>
      )}

      {user?.isAdmin && <Link to="/admin">Admin</Link>}

      <span style={{ marginLeft: "auto" }}>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </span>
    </nav>
  );
}

