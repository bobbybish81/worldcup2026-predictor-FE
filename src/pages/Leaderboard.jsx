import { useEffect, useState } from "react";
import api from "../api/api";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard");
      setRows(res.data);
    } catch (err) {
      console.error("Failed to load leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p>Loading…</p>;
  }

  return (
    <div className="page">

      <h1>Leaderboard</h1>

      <table className="leaderboard">

        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Group</th>
            <th>Knockout</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr
              key={r.username}
              className={
                r.username === localStorage.getItem("username")
                  ? "current-user"
                  : ""
              }
            >
              <td>{r.rank}</td>
              <td>{r.username}</td>
              <td>{r.groupStage}</td>
              <td>{r.knockoutStage}</td>
              <td className="total">
                {r.total}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}