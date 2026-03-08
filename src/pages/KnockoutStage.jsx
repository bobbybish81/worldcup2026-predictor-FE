import { useEffect, useState } from "react";
import api from "../api/api";
import PredictionLockCountdown from "../components/PredictionLockCountdown";
import KnockoutRound from "../components/KnockoutRound";
import KnockoutBracket from "../components/KnockoutBracket";

export default function KnockoutStage() {

  const [r32Ready, setR32Ready] = useState(false);
  const [r16Ready, setR16Ready] = useState(false);
  const [qfReady, setQfReady] = useState(false);
  const [sfReady, setSfReady] = useState(false); 
  const [r32, setR32] = useState([]);
  const [r16, setR16] = useState([]);
  const [qf, setQf] = useState([]);
  const [sf, setSf] = useState([]);
  const [finalMatch, setFinalMatch] = useState([]);

useEffect(() => {
  api.get("/knockout/R32").then((res) => {
    setR32(res.data.fixtures || []);
    setR32Ready(res.data.status === "READY");
  });

    api.get("/knockout/R16").then((res) => {
    setR16(res.data.fixtures || []);
    setR16Ready(res.data.status === "READY");
  });

  api.get("/knockout/QF").then((res) => {
    setQf(res.data.fixtures || []);
    setQfReady(res.data.status === "READY");
  });

  api.get("/knockout/SF").then((res) => {
    setSf(res.data.fixtures || []);
    setSfReady(res.data.status === "READY");
  });

  api.get("/knockout/F").then((res) => {
    setFinalMatch(res.data.fixtures || []);
  });


}, []);

    return (
    <div>
      <h1>Knockout Stage</h1>
      <div>
        <PredictionLockCountdown />
      </div>
      <section>
        <KnockoutRound round="R32" fixtures={r32}/>
      </section>

      <section>
        <h2>Round Of 16</h2>
        {!r32Ready ? (
          <p>Complete Round of 32 to unlock</p>
        ) : (
          <KnockoutRound round="R16" fixtures={r16} />
        )}
      </section>

      <section>
        <h2>Quarter Finals</h2>
        {!r16Ready ? (
          <p>Complete Round of 16 to unlock</p>
        ) : (
          <KnockoutRound round="QF" fixtures={qf} />
        )}
      </section>

      <section>
        <h2>Semi Finals</h2>
        {!qfReady ? (
          <p>Complete Quarter Finals to unlock</p>
        ) : (
          <KnockoutRound round="SF" fixtures={sf} />
        )}
      </section>

      <section>
        <h2>Final</h2>
        {!sfReady ? (
          <p>Complete Semi Finals to unlock</p>
        ) : (
          <KnockoutRound round="F" fixtures={finalMatch} />
        )}
      </section>

      <div>
        <KnockoutBracket r32={r32} r16={r16} qf={qf} sf={sf} final={finalMatch}/>
      </div>

    </div>
  );
}
