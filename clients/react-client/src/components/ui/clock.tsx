import { useEffect, useState } from "react";

function App() {
  const date = Temporal.Now.plainDateISO();
  const [time, setTime] = useState(Temporal.Now.plainTimeISO());

  const [year, setYear] = useState(date.year);
  const [month, setMonth] = useState(
    date.toLocaleString("en-US", { month: "short" }),
  );
  const [day, setDay] = useState(date.day);

  function prep(value: number) {
    return value.toString().padStart(2, "0");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const date = Temporal.Now.plainDateISO();
      setTime(Temporal.Now.plainTimeISO());

      setYear(date.year);

      setMonth(date.toLocaleString("en-US", { month: "short" }));

      setDay(date.day);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span>
        {day} {month} {year}
      </span>
      <span>{time.toString({ smallestUnit: "seconds" })}</span>
    </div>
  );
}

export default App;
