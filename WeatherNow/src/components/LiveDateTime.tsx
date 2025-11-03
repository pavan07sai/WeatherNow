import React, { useEffect, useState } from "react";

export default function LiveDateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // update every second

    return () => clearInterval(timer); // cleanup
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm opacity-80">
      <p>📅 {dateTime.toLocaleDateString()}</p>
      <p>
        🕓{" "}
        {dateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // 24-hour format
        })}
      </p>
    </div>
  );
}
