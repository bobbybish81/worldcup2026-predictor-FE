import { useEffect, useState } from "react";
import { TOURNAMENT_START } from "../config/tournament";
import PredictionLockCountdown from "../components/PredictionLockCountdown";
import GroupTables from "../components/GroupTables";
import api from "../api/api";

export default function GroupStage() {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const locked = new Date() >= TOURNAMENT_START;

  useEffect(() => {
    async function loadData() {
      const [matchesRes, predsRes] = await Promise.all([
        api.get("/matches/group"),
        api.get("/predictions/me"),
      ]);

      setMatches(matchesRes.data);

      const map = {};
      predsRes.data.forEach((p) => {
        map[p.matchId] = {
          homeScore: p.homeScore,
          awayScore: p.awayScore,
          pointsAwarded: p.pointsAwarded || 0,
        };
      });

      setPredictions(map);
    }

    loadData();
  }, []);

  const updatePredictionField = (matchId, field, value) => {
    const safeValue = Math.max(0, Number(value));

    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: safeValue,
      },
    }));

    setDirty(true);
    setSaved(false);
  };

  const saveAllPredictions = async () => {
    try {
      setSaving(true);

      const requests = Object.entries(predictions).map(([matchId, p]) =>
        api.post("/predictions", {
          matchId: Number(matchId),
          homeScore: Number(p.homeScore),
          awayScore: Number(p.awayScore),
        })
      );

      await Promise.all(requests);

      window.dispatchEvent(new Event("predictions-updated"));

      setSaving(false);
      setSaved(true);
      setDirty(false);

      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("SAVE ALL ERROR:", err);
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h1>Group Stage</h1>

      <PredictionLockCountdown />

      {locked && (
        <p className="lock-warning">
          Predictions are locked. The tournament has started.
        </p>
      )}

      <div className="layout">
        {/* MATCHES */}
        <div className="matches">

          {matches.map((m) => {
            const prediction = predictions[m.id];

            return (
              <div key={m.id} className="match-row">

                <span className="team team-home">
                  {m.homeTeam.name}
                </span>

                <input
                  className="score-input"
                  type="number"
                  min="0"
                  disabled={locked}
                  value={prediction?.homeScore ?? ""}
                  onChange={(e) =>
                    updatePredictionField(m.id, "homeScore", e.target.value)
                  }
                />

                <span className="vs">vs</span>

                <input
                  className="score-input"
                  type="number"
                  min="0"
                  disabled={locked}
                  value={prediction?.awayScore ?? ""}
                  onChange={(e) =>
                    updatePredictionField(m.id, "awayScore", e.target.value)
                  }
                />

                <span className="team team-away">
                  {m.awayTeam.name}
                </span>

                {/* ACTUAL RESULT */}
                {m.homeScore !== null && (
                  <div className="match-result">
                    Result: <strong>{m.homeScore} - {m.awayScore}</strong>
                  </div>
                )}

                {/* POINTS */}
                {prediction && (
                  <div className={`points points-${prediction.pointsAwarded}`}>
                    {prediction.pointsAwarded} pts
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* GROUP TABLES */}
        <div className="tables">
          <GroupTables matches={matches} predictions={predictions} />
        </div>

      </div>

      {!locked && (
        <div className="save-bar">

          <button
            onClick={saveAllPredictions}
            disabled={!dirty || saving}
          >
            {saving ? "Saving..." : "Save All Predictions"}
          </button>

          {saved && <span className="saved">Saved ✓</span>}

        </div>
      )}
    </div>
  );
}