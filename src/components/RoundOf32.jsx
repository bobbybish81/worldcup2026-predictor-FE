import { useEffect, useState } from "react";
import api from "../api/api";

export default function RoundOf32() {
  const [data, setData] = useState(null);

  const loadRoundOf32 = async () => {
    try {
      const res = await api.get("/knockout/round-of-32");
      setData(res.data);
    } catch (err) {
      console.error("ROUND OF 32 LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    // initial load
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRoundOf32();

    // 🔥 refresh when predictions are saved
    const handleUpdate = () => {
      loadRoundOf32();
    };

    window.addEventListener("predictions-updated", handleUpdate);

    return () => {
      window.removeEventListener("predictions-updated", handleUpdate);
    };
  }, []);

  const pickWinner = async (matchKey, home, away, winner) => {
    try {
      await api.post("/knockout-predictions", {
        round: "R32",
        matchKey,
        homeTeamId: home.teamId,
        awayTeamId: away.teamId,
        winnerTeamId: winner.teamId,
      });
    } catch (err) {
      console.error("PICK WINNER ERROR:", err);
    }
  };

  if (!data || data.status === "INCOMPLETE") {
    return <p>{data?.message || "Loading..."}</p>;
  }

  return (
    <div>
      <h2>Round of 32</h2>

      {data.fixtures.map((m, i) => (
        <div
          key={i}
          style={{
            marginBottom: "10px",
            padding: "8px",
            borderBottom: "1px solid #eee",
          }}
        >
          <button
            onClick={() =>
              pickWinner(`R32-${i + 1}`, m.homeTeam, m.awayTeam, m.homeTeam)
            }
          >
            {m.homeTeam.teamName}
          </button>

          <span style={{ margin: "0 8px" }}>vs</span>

          <button
            onClick={() =>
              pickWinner(`R32-${i + 1}`, m.homeTeam, m.awayTeam, m.awayTeam)
            }
          >
            {m.awayTeam.teamName}
          </button>
        </div>
      ))}
    </div>
  );
}

