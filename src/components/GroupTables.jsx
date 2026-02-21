import { useMemo, useEffect } from "react";

export default function GroupTables({
  matches,
  predictions,
  onTablesUpdate,
}) {
  /**
   * Build group tables live from predictions
   */
  const tables = useMemo(() => {
    const groups = {};

    matches.forEach((m) => {
      const group = m.homeTeam.group;

      if (!groups[group]) groups[group] = {};

      const home = m.homeTeam;
      const away = m.awayTeam;

      // initialise team rows
      [home, away].forEach((team) => {
        if (!groups[group][team.id]) {
          groups[group][team.id] = {
            teamId: team.id,
            teamName: team.name,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalDiff: 0,
            points: 0,
          };
        }
      });

      const p = predictions[m.id];

      // skip incomplete predictions
      if (
        !p ||
        p.homeScore === "" ||
        p.awayScore === "" ||
        p.homeScore === undefined ||
        p.awayScore === undefined
      )
        return;

      const homeScore = Number(p.homeScore);
      const awayScore = Number(p.awayScore);

      const h = groups[group][home.id];
      const a = groups[group][away.id];

      h.played++;
      a.played++;

      h.goalDiff += homeScore - awayScore;
      a.goalDiff += awayScore - homeScore;

      if (homeScore > awayScore) {
        h.won++;
        a.lost++;
        h.points += 3;
      } else if (homeScore < awayScore) {
        a.won++;
        h.lost++;
        a.points += 3;
      } else {
        h.drawn++;
        a.drawn++;
        h.points++;
        a.points++;
      }
    });

    // sort teams within each group
    const result = {};

    for (const group in groups) {
      result[group] = Object.values(groups[group]).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.goalDiff - a.goalDiff;
      });
    }

    return result;
  }, [matches, predictions]);

  /**
   * Notify parent (optional)
   */
  useEffect(() => {
    if (onTablesUpdate) {
      onTablesUpdate(tables);
    }
  }, [tables, onTablesUpdate]);

  /**
   * Check whether all 6 matches in a group have predictions
   */
  const isGroupComplete = (group) => {
    const groupMatches = matches.filter(
      (m) => m.homeTeam.group === group
    );

    if (groupMatches.length !== 6) return false;

    return groupMatches.every((m) => {
      const p = predictions[m.id];
      return (
        p &&
        p.homeScore !== "" &&
        p.awayScore !== "" &&
        p.homeScore !== undefined &&
        p.awayScore !== undefined
      );
    });
  };

  return (
    <div>
      <h2>Predicted Group Tables</h2>

      {Object.entries(tables).map(([group, teams]) => (
        <div key={group} style={{ marginBottom: "1.5rem" }}>
          <h3>Group {group}</h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Team</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>

            <tbody>
              {teams.map((t, i) => (
                <tr
                  key={t.teamId}
                  style={{
                    background: i < 2 ? "#e8ffe8" : "transparent",
                    fontWeight: i < 2 ? "bold" : "normal",
                  }}
                >
                  <td>{t.teamName}</td>
                  <td>{t.played}</td>
                  <td>{t.won}</td>
                  <td>{t.drawn}</td>
                  <td>{t.lost}</td>
                  <td>{t.goalDiff}</td>
                  <td>{t.points}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ⭐ Only show when group complete */}
          {isGroupComplete(group) && (
            <div
              style={{
                marginTop: "8px",
                padding: "8px",
                background: "#f7f7f7",
                borderRadius: "6px",
              }}
            >
              <strong>Qualified:</strong>
              <div>🥇 {teams[0]?.teamName}</div>
              <div>🥈 {teams[1]?.teamName}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

