import React from "react";

export default function Tips() {
  const tips = [
    "☂️ Carry an umbrella — weather changes fast!",
    "☀️ Stay hydrated in sunny conditions.",
    "🌬️ Strong winds? Avoid loose clothing.",
    "🌡️ Dress in layers for temperature shifts.",
    "❄️ Check forecasts before long trips.",
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
      {tips
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map((tip, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center font-medium"
          >
            {tip}
          </div>
        ))}
    </div>
  );
}
