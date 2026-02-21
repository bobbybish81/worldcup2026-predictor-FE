import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {

  const { user } = useAuth();

  return (
    <div>
      <h1>World Cup Predictor 2026</h1>

      <p>
        Predict match results, climb the leaderboard, and prove you know football.
      </p>

      {!user ? (
        <>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register">
            <button style={{ marginLeft: "8px" }}>Register</button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/group">
            <button>Group Stage Predictions</button>
          </Link>
          <Link to="/knockout">
            <button style={{ marginLeft: "8px" }}>
              Knockout Predictions
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

