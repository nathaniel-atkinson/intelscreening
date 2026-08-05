import { useEffect, useState } from "react";

function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function monthify(month: number): string {
    const gift: string = months[month]!;

    return gift;
  }

  function getTime(): string {
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  function getDate(): string {
    return `${now.getDate()} ${monthify(now.getMonth())} ${now.getFullYear()}`;
  }

  function getFullDate(): string {
    return `${getDate()} [${getTime()}]`;
  }

  const calendar = {
    getTime,
    getDate,
    getFullDate,
  };

  return (
    <div id="clock">
      <span>{calendar.getDate()}</span>
      <span>{calendar.getTime()}</span>
    </div>
  );
}

export default Clock;
