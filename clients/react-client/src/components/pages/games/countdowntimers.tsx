import { useEffect, useRef, useState } from "react";

const durations = [2, 3, 4, 5, 10];

interface CountdownTimerProps {
  gameId: number;
  enabled: boolean;
  onExpire: () => void;
}

function CountdownTimer({ gameId, enabled, onExpire }: CountdownTimerProps) {
  const [step, setStep] = useState(0);
  const [remaining, setRemaining] = useState(durations[0]! * 60);
  const [deadline, setDeadline] = useState<number | null>(null);

  const duration = durations[step]!;
  const durationRef = useRef(duration);
  const onExpireRef = useRef(onExpire);
  const expiredRef = useRef(false);

  durationRef.current = duration;
  onExpireRef.current = onExpire;

  // Start each new game using the previously selected duration.
  useEffect(() => {
    const seconds = durationRef.current * 60;

    expiredRef.current = false;
    setRemaining(seconds);
    setDeadline(Date.now() + seconds * 1000);
  }, [gameId]);

  useEffect(() => {
    if (deadline === null) return;

    const tick = () => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

      setRemaining(next);

      if (next === 0 && !expiredRef.current) {
        expiredRef.current = true;
        setDeadline(null);
        onExpireRef.current();
      }
    };

    tick();

    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [deadline]);

  function changeDuration(value: number) {
    setStep(value);
    setDeadline(null);
    setRemaining(durations[value]! * 60);
  }

  function toggleTimer() {
    if (deadline !== null) {
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
      setDeadline(null);
    } else if (remaining > 0) {
      setDeadline(Date.now() + remaining * 1000);
    }
  }

  function resetTimer() {
    setDeadline(null);
    expiredRef.current = false;

    const seconds = duration * 60;
    setRemaining(seconds);
    setDeadline(Date.now() + seconds * 1000);
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <section className="countdown-timer">
      <h2>Game Timer</h2>

      <label htmlFor="timer-duration">Duration: {duration} minutes</label>

      <input
        id="timer-duration"
        type="range"
        min={0}
        max={4}
        step={1}
        value={step}
        onChange={(e) => changeDuration(Number(e.target.value))}
        disabled={deadline !== null}
      />

      <p className="timer-display" role="timer">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>

      <div className="timer-controls">
        <button onClick={toggleTimer} disabled={remaining === 0}>
          {deadline !== null ? "Pause" : "Start"}
        </button>

        <button onClick={resetTimer}>Reset and Start</button>
      </div>
    </section>
  );
}

export default CountdownTimer;
