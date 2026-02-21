import { useEffect, useState } from "react";
import api from "../api/api";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = () => {
      api.get("/leaderboard")
      .then((res) => {setRows(res.data)
      .finally(() => setLoading(false));  
    });
  };

    fetchLeaderboard();

    const interval = setInterval(fetchLeaderboard, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p>Loading…</p>;
  }

  return (
    <div>
      <h1>Leaderboard</h1>

      <table border="1" cellPadding="8">
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
              style={{
                background:
                  r.username === localStorage.getItem("username")
                    ? "#e6f7ff"
                    : "transparent",
              }}
            >
              <td>{r.rank}</td>
              <td>{r.username}</td>
              <td>{r.groupStage}</td>
              <td>{r.knockoutStage}</td>
              <td><strong>{r.total}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
