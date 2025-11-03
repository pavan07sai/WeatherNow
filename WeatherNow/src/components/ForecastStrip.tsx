import React from "react";
import { motion } from "framer-motion";

interface ForecastStripProps {
  forecast: {
    date: string;
    temperature_max: number;
    temperature_min: number;
    weathercode: number;
  }[];
}

export default function ForecastStrip({ forecast }: ForecastStripProps) {
  if (!forecast || forecast.length === 0) return null;

  function getWeatherStyle(code: number) {
    if ([0, 1].includes(code)) {
      return {
        emoji: "☀️",
        gradient:
          "from-yellow-300/90 via-yellow-400/80 to-orange-400/80 text-yellow-900",
      };
    } else if ([2, 3].includes(code)) {
      return {
        emoji: "⛅",
        gradient:
          "from-gray-300/80 via-gray-400/70 to-gray-500/70 text-gray-900",
      };
    } else if ([61, 63, 65, 80, 81, 82].includes(code)) {
      return {
        emoji: "🌧️",
        gradient:
          "from-blue-400/80 via-blue-500/70 to-blue-600/80 text-blue-50",
      };
    } else if ([71, 73, 75, 77].includes(code)) {
      return {
        emoji: "❄️",
        gradient:
          "from-blue-100/90 via-blue-200/90 to-cyan-200/90 text-sky-900",
      };
    } else {
      return {
        emoji: "🌫️",
        gradient:
          "from-gray-200/80 via-gray-300/80 to-gray-400/80 text-gray-800",
      };
    }
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-hide mt-6">
      <div className="flex justify-center gap-4 px-2 sm:px-6 pb-4 w-fit mx-auto min-w-full flex-wrap md:flex-nowrap">
        {forecast.map((day, index) => {
          const { emoji, gradient, text } = getWeatherStyle(day.weathercode);
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 150 }}
              className={`flex flex-col items-center justify-center min-w-[120px] rounded-xl shadow-lg border border-white/20 backdrop-blur-md bg-gradient-to-br ${gradient} p-4`}
            >
              <p className="text-sm font-medium opacity-90">
                {new Date(day.date).toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </p>
              <p className="text-4xl my-2 drop-shadow-sm">{emoji}</p>
              <p className="text-sm font-semibold">
                {Math.round(day.temperature_max)}° /{" "}
                {Math.round(day.temperature_min)}°
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
