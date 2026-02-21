import "../styles/KnockoutBracket.css";

function Match({ home, away, winner }) {
  return (
    <div className="match">
      <div className={`team ${winner === home?.id ? "winner" : ""}`}>
        {home?.name ?? "TBD"}
      </div>
      <div className={`team ${winner === away?.id ? "winner" : ""}`}>
        {away?.name ?? "TBD"}
      </div>
    </div>
  );
}

export default function KnockoutBracket({ r16, qf, sf, final }) {
  return (
    <div className="bracket">
      <div className="round">
        <h3>Round of 16</h3>
        {r16.map((m) => (
          <Match
            key={m.matchKey}
            home={m.homeTeam}
            away={m.awayTeam}
            winner={m.winnerTeamId}
          />
        ))}
      </div>

      <div className="round">
        <h3>Quarter Finals</h3>
        {qf.map((m) => (
          <Match
            key={m.matchKey}
            home={m.homeTeam}
            away={m.awayTeam}
            winner={m.winnerTeamId}
          />
        ))}
      </div>

      <div className="round">
        <h3>Semi Finals</h3>
        {sf.map((m) => (
          <Match
            key={m.matchKey}
            home={m.homeTeam}
            away={m.awayTeam}
            winner={m.winnerTeamId}
          />
        ))}
      </div>

      <div className="round">
        <h3>Final</h3>
        {final.map((m) => (
          <Match
            key={m.matchKey}
            home={m.homeTeam}
            away={m.awayTeam}
            winner={m.winnerTeamId}
          />
        ))}
      </div>
    </div>
  );
}
