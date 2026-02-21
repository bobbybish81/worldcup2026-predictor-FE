import { useEffect, useState } from "react";
import api from "../api/api";

export default function SemiFinals() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/knockout/semi-finals").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data || data.status === "INCOMPLETE") {
    return <p>{data?.message}</p>;
  }

  return (
    <div>
      {data.fixtures.map((m) => (
        <div key={m.matchKey}>
          {m.homeTeam.name} vs {m.awayTeam.name}
        </div>
      ))}
    </div>
  );
}
