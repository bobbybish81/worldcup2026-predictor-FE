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

      const requests = Object.entries(predictions).map(
        ([matchId, p]) =>
          api.post("/predictions", {
            matchId: Number(matchId),
            homeScore: Number(p.homeScore),
            awayScore: Number(p.awayScore),
          })
      );
      
      window.dispatchEvent(new Event("predictions-updated"));

      await Promise.all(requests);

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
    <div style={{ paddingBottom: "90px" }}>
      <h1>Group Stage</h1>

      <PredictionLockCountdown />

      {locked && (
        <p style={{ color: "red", marginBottom: "1rem" }}>
          Predictions are locked. The tournament has started.
        </p>
      )}

      {/* TWO-COLUMN LAYOUT */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SIDE — MATCHES */}
        <div style={{ flex: 2, minWidth: "500px" }}>
          {matches.map((m) => (
            <div
              key={m.id}
              style={{
                marginBottom: "12px",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      {/* Home team */}
      <span style={{ minWidth: "140px", textAlign: "right" }}>
        {m.homeTeam.name}
      </span>

      {/* Home score */}
      <input
        type="number"
        min="0"
        disabled={locked}
        value={predictions[m.id]?.homeScore ?? ""}
        onChange={(e) =>
          updatePredictionField(m.id, "homeScore", e.target.value)
        }
        style={{
          width: "30px",
          textAlign: "center",
        }}
      />

      <span style={{ fontWeight: "bold" }}>vs</span>

      {/* Away score */}
      <input
        type="number"
        min="0"
        disabled={locked}
        value={predictions[m.id]?.awayScore ?? ""}
        onChange={(e) =>
          updatePredictionField(m.id, "awayScore", e.target.value)
        }
        style={{
          width: "30px",
          textAlign: "center",
        }}
      />

      {/* Away team */}
      <span style={{ minWidth: "140px" }}>
        {m.awayTeam.name}
      </span>
    </div>
  </div>
))}

        </div>

        {/* RIGHT SIDE — GROUP TABLES */}
        <div
          style={{
            flex: 1,
            minWidth: "320px",
            position: "sticky",
            top: "80px",
            alignSelf: "flex-start",
          }}
        >
        <GroupTables
          matches={matches}
          predictions={predictions}
        />
        </div>
      </div>

      {/* STICKY SAVE BAR */}
      {!locked && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#fff",
            borderTop: "1px solid #ddd",
            padding: "12px 16px",
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
            zIndex: 100,
          }}
        >
          <button
            onClick={saveAllPredictions}
            disabled={!dirty || saving}
            style={{
              padding: "10px 18px",
              fontWeight: "bold",
              cursor: !dirty || saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save All Predictions"}
          </button>

          {saved && <span style={{ color: "green" }}>Saved ✓</span>}
        </div>
      )}
    </div>
  );
}
