import { useState } from "react";
import api from "../api/api";

export default function KnockoutResults() {
  const [round, setRound] = useState("R16");
  const [matchKey, setMatchKey] = useState("");
  const [winnerTeamId, setWinnerTeamId] = useState("");

  const submitResult = () => {
    if (!window.confirm("Are you sure this result is correct?")) return;
    api.post("/knockout-results", {
      round,
      matchKey,
      actualWinnerTeamId: Number(winnerTeamId),
    });
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

      <p style={{ fontSize: "12px", color: "#666", margin: "4px 0" }}>
        Examples: R16-1, R16-2, QF-1, SF-1, F-1
      </p>
      
      <input
        placeholder="Winner Team ID"
        value={winnerTeamId}
        onChange={(e) => setWinnerTeamId(e.target.value)}
      />

      <button onClick={submitResult}>Save Knockout Result</button>
    </div>
  );
}
