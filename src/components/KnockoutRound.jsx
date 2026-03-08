import { useEffect, useState } from "react";
import api from "../api/api";

export default function KnockoutRound({ round, fixtures }) {

  const [selected, setSelected] = useState({});

  useEffect(() => {

    const loadPredictions = async () => {

      try {

        const res = await api.get(`/knockout-predictions/${round}`);

        const map = {};

        res.data.forEach((p) => {
          map[p.matchKey] = p.winnerTeamId;
        });

        setSelected(map);

      } catch (err) {
        console.error(`${round} prediction load error`, err);
      }

    };

    loadPredictions();

  }, [round]);


  const pickWinner = async (matchKey, home, away, winner) => {

    try {

      await api.post("/knockout-predictions", {
        round,
        matchKey,
        homeTeamId: home.teamId,
        awayTeamId: away.teamId,
        winnerTeamId: winner.teamId
      });

      setSelected((prev) => ({
        ...prev,
        [matchKey]: winner.teamId
      }));

      window.dispatchEvent(new Event("knockout-updated"));

    } catch (err) {

      console.error(`${round} pick winner error`, err);

    }

  };

  if (!fixtures || fixtures.length === 0) return null;

  return (
    <div>

      <h2>{round}</h2>

      {fixtures.map((m, i) => {

        const matchKey = `${round}_${i + 1}`;

        return (

          <div
            key={matchKey}
            style={{
              marginBottom: "10px",
              padding: "8px",
              borderBottom: "1px solid #eee"
            }}
          >

            <button
              style={{
                background:
                  selected[matchKey] === m.homeTeam?.teamId
                    ? "#d4f8d4"
                    : ""
              }}
              onClick={() =>
                pickWinner(matchKey, m.homeTeam, m.awayTeam, m.homeTeam)
              }
            >
              {m.homeTeam?.teamName || "TBD"}
            </button>

            <span style={{ margin: "0 8px" }}>vs</span>

            <button
              style={{
                background:
                  selected[matchKey] === m.awayTeam?.teamId
                    ? "#d4f8d4"
                    : ""
              }}
              onClick={() =>
                pickWinner(matchKey, m.homeTeam, m.awayTeam, m.awayTeam)
              }
            >
              {m.awayTeam?.teamName || "TBD"}
            </button>

          </div>

        );

      })}

    </div>
  );

}