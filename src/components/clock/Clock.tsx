import { useState, useEffect } from "react";

function Clock({ darkMode }: { darkMode: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = time.toLocaleTimeString();
  return (
    <p
      className="clock"
      style={{
        color: darkMode === "darkmode" ? "rgba(255, 255, 255, 0.84)" : "",
      }}
    >
      {formattedTime}
    </p>
  );
}

export default Clock;
