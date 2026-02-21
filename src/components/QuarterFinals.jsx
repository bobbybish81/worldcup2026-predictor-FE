import { useEffect, useState } from "react";
import api from "../api/api";

export default function QuarterFinals() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/knockout/quarter-finals").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data || data.status === "INCOMPLETE") {
    return <p>{data?.message}</p>;
  }

  return (
    <div>
      <h1>Quarter Finals</h1>

      {data.fixtures.map((m) => (
        <div key={m.matchKey}>
          {m.homeTeam.name} vs {m.awayTeam.name}
        </div>
      ))}
    </div>
  );
}
