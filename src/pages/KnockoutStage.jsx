import { useEffect, useState } from "react";
import api from "../api/api";
import PredictionLockCountdown from "../components/PredictionLockCountdown";
import RoundOf32 from "../components/RoundOf32";
import RoundOf16 from "../components/RoundOf16";
import QuarterFinals from "../components/QuarterFinals";
import SemiFinals from "../components/SemiFinals";
import Final from "../components/Final";
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
  api.get("/knockout/round-of-32").then((res) => {
    if (res.data.status === "READY") setR32(res.data.fixtures);
  });

    api.get("/knockout/round-of-16").then((res) => {
    if (res.data.status === "READY") setR16(res.data.fixtures);
  });

  api.get("/knockout/quarter-finals").then((res) => {
    if (res.data.status === "READY") setQf(res.data.fixtures);
  });

  api.get("/knockout/semi-finals").then((res) => {
    if (res.data.status === "READY") setSf(res.data.fixtures);
  });

  api.get("/knockout/final").then((res) => {
    if (res.data.status === "READY") setFinalMatch(res.data.fixtures);
  });
}, []);

  useEffect(() => {
    api.get("/knockout/round-of-32").then((res) => {
      setR32Ready(res.data.status === "READY");
    });

    api.get("/knockout/round-of-16").then((res) => {
      setR16Ready(res.data.status === "READY");
    });

    api.get("/knockout/quarter-finals").then((res) => {
      setQfReady(res.data.status === "READY");
    });

    api.get("/knockout/semi-finals").then((res) => {
      setSfReady(res.data.status === "READY");
    });  

    // api.get("/knockout/final").then(...)

  }, []);
    return (
    <div>
      <h1>Knockout Stage</h1>
      <div>
        <PredictionLockCountdown />
      </div>
      {/* ROUND OF 32 */}
      <section>
        <RoundOf32 />
      </section>
      {/* ROUND OF 16 */}
      <section
        style={{
          opacity: r16Ready ? 1 : 0.4,
          pointerEvents: r16Ready ? "auto" : "none",
        }}
      >
        <h2>Round Of 16</h2>
        {!r32Ready && <p>Complete Round of 32 to unlock</p>}
        <RoundOf16 />
      </section>


      {/* QUARTER FINALS */}
      <section
        style={{
          opacity: r16Ready ? 1 : 0.4,
          pointerEvents: r16Ready ? "auto" : "none",
        }}
      >
        <h2>Quarter Finals</h2>
        {!r16Ready && <p>Complete Round of 16 to unlock</p>}
        <QuarterFinals />
      </section>

      {/* SEMI FINALS */}
      <section
        style={{
          opacity: qfReady ? 1 : 0.4,
          pointerEvents: qfReady ? "auto" : "none",
        }}
      >
        <h2>Semi Finals</h2>
        {!qfReady && <p>Complete Quarter Finals to unlock</p>}
        <SemiFinals />
      </section>

      {/* FINAL */}
      <section
        style={{
          opacity: sfReady ? 1 : 0.4,
          pointerEvents: sfReady ? "auto" : "none",
        }}
      >
        <h2>Final</h2>
        {!sfReady && <p>Complete Semi Finals to unlock</p>}
        <Final />
      </section>
      <div>
        <KnockoutBracket r32={r32} r16={r16} qf={qf} sf={sf} final={finalMatch}/>
      </div>
    </div>
  );
}
