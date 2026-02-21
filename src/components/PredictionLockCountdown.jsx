import { useEffect, useState } from "react";
import { TOURNAMENT_START } from "../config/tournament.js";

export default function PredictionLockCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const now = new Date();
    const diff = TOURNAMENT_START - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div
        style={{
          padding: "10px",
          background: "#ffe6e6",
          border: "1px solid #ff4d4f",
          borderRadius: "6px",
        }}
      >
        🔒 <strong>Predictions are locked</strong>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "10px",
        background: "#fffbe6",
        border: "1px solid #ffe58f",
        borderRadius: "6px",
      }}
    >
      ⏳ Predictions lock in{" "}
      <strong>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </strong>
    </div>
  );
}
