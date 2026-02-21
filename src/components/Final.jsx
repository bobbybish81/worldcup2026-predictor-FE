import { useEffect, useState } from "react";
import api from "../api/api";

export default function Final() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/knockout/final").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data || data.status === "INCOMPLETE") {
    return <p>{data?.message}</p>;
  }

  return (
    <div>
      <strong>
        {data.fixtures[0].homeTeam.name} vs{" "}
        {data.fixtures[0].awayTeam.name}
      </strong>
    </div>
  );
}
