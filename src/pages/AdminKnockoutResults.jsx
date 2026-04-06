import { useState } from "react";
import api from "../api/api";

export default function KnockoutResults() {
  const [round, setRound] = useState("R16");
  const [matchKey, setMatchKey] = useState("");
  const [winnerTeamId, setWinnerTeamId] = useState("");
  const [saving, setSaving] = useState(false);

  const submitResult = async () => {
    if (!window.confirm("Are you sure this result is correct?")) return;

    try {
      setSaving(true);

      await api.post("/knockout-results", {
        round,
        matchKey,
        actualWinnerTeamId: Number(winnerTeamId),
      });

      alert("Result saved");

      setMatchKey("");
      setWinnerTeamId("");

    } catch (err) {
      console.error(err);
      alert("Failed to save result");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <select value={round} onChange={(e) => setRound(e.target.value)}>
        <option value="R16">Round of 16</option>
        <option value="QF">Quarter Final</option>
        <option value="SF">Semi Final</option>
        <option value="F">Final</option>
      </select>

      <input
        placeholder="Match Key (e.g. R16-1)"
        value={matchKey}
        onChange={(e) => setMatchKey(e.target.value)}
      />

      <input
        placeholder="Winner Team ID"
        value={winnerTeamId}
        onChange={(e) => setWinnerTeamId(e.target.value)}
      />

      <button onClick={submitResult} disabled={saving}>
        {saving ? "Saving..." : "Save Knockout Result"}
      </button>
    </div>
  );
}