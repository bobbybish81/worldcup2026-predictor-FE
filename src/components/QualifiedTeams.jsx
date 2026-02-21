export default function QualifiedTeams({ tables }) {
  if (!tables || Object.keys(tables).length === 0) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Qualified Teams (Live)</h2>

      {Object.entries(tables).map(([group, teams]) => {
        const qualified = teams.slice(0, 2);

        return (
          <div
            key={group}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <h4 style={{ marginBottom: "8px" }}>Group {group}</h4>

            {qualified.map((team, i) => (
              <div
                key={team.teamId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <span>{i === 0 ? "🥇" : "🥈"}</span>
                <span>{team.teamName}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

