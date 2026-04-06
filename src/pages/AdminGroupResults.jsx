import { useEffect, useState } from "react";
import api from "../api/api";

export default function GroupResults() {
  const [matches, setMatches] = useState([]);
  const [scores, setScores] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    api.get("/matches/group").then((res) => {
      setMatches(res.data);

      // Preload existing scores
      const initialScores = {};
      res.data.forEach((m) => {
        if (m.homeScore !== null && m.awayScore !== null) {
          initialScores[m.id] = {
            homeScore: m.homeScore,
            awayScore: m.awayScore,
          };
        }
      });
      setScores(initialScores);
    });
  }, []);

  const updateScore = (matchId, field, value) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: Number(value),
      },
    }));
  };

  const submitResult = async (matchId) => {
    const matchScores = scores[matchId];
    if (
      matchScores?.homeScore === undefined ||
      matchScores?.awayScore === undefined
    ) {
      alert("Please enter both scores");
      return;
    }

    try {
      setSaving(matchId);

      await api.post("/matches/result", {
        matchId,
        homeScore: matchScores.homeScore,
        awayScore: matchScores.awayScore,
      });

      // Refresh match list
      const refreshed = await api.get("/matches/group");
      setMatches(refreshed.data);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      {matches.map((m) => {
        const isSaved = m.homeScore !== null && m.awayScore !== null;

        return (
          <div
            key={m.id}
            style={{
              marginBottom: "12px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              background: isSaved ? "#f6fff6" : "#fff",
            }}
          >
            <strong>
              {m.homeTeam.name} vs {m.awayTeam.name}
            </strong>

            <div style={{ marginTop: "6px" }}>
              <input
                type="number"
                placeholder="Home"
                disabled={isSaved}
                value={scores[m.id]?.homeScore ?? m.homeScore ?? ""}
                onChange={(e) =>
                  updateScore(m.id, "homeScore", e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Away"
                disabled={isSaved}
                value={scores[m.id]?.awayScore ?? m.awayScore ?? ""}
                onChange={(e) =>
                  updateScore(m.id, "awayScore", e.target.value)
                }
              />

              <button
                disabled={isSaved || saving === m.id}
                onClick={() => submitResult(m.id)}
                style={{ marginLeft: "8px" }}
              >
                {isSaved ? "Saved" : saving === m.id ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
