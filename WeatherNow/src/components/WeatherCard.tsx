import React from "react";
import { motion } from "framer-motion";

interface WeatherProps {
  weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    humidity?: number;
    apparent_temperature?: number;
    pressure?: number;
    sunrise?: string;
    sunset?: string;
  };
  title: string;
}

export default function WeatherCard({ weather, title }: WeatherProps) {
  // Helper: choose background and icon based on weather code
  function getWeatherBackground(code: number) {
    if ([0, 1].includes(code)) {
      return {
        gradient: "from-blue-400 to-blue-600",
        emoji: "☀️",
        text: "Sunny",
      };
    } else if ([2, 3].includes(code)) {
      return {
        gradient: "from-gray-400 to-gray-600",
        emoji: "⛅",
        text: "Cloudy",
      };
    } else if ([61, 63, 65, 80, 81, 82].includes(code)) {
      return {
        gradient: "from-blue-500 to-gray-700",
        emoji: "🌧️",
        text: "Rainy",
      };
    } else if ([71, 73, 75, 77].includes(code)) {
      return {
        gradient: "from-blue-100 to-blue-300",
        emoji: "❄️",
        text: "Snowy",
      };
    } else {
      return {
        gradient: "from-gray-300 to-gray-500",
        emoji: "🌫️",
        text: "Unknown",
      };
    }
  }

  // Format sunrise/sunset
  function formatTime(isoString?: string) {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return "-";
    }
  }

  const { gradient, emoji, text } = getWeatherBackground(weather.weathercode);
  const sunrise = formatTime(weather.sunrise);
  const sunset = formatTime(weather.sunset);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="relative w-[95%] max-w-5xl mx-auto text-white overflow-hidden rounded-2xl shadow-2xl mb-12 border border-white/10 dark:border-white/5"
    >
      {/* Animated gradient background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Emoji overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 left-8 text-6xl opacity-25"
        >
          {emoji}
        </motion.div>
        <div className="absolute bottom-10 right-10 text-7xl opacity-25">
          {emoji}
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative px-12 py-8 text-center backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-3">{title}</h2>
        <p className="text-7xl font-extrabold mb-2 drop-shadow-lg">
          {weather.temperature}°C
        </p>
        <p className="text-xl font-medium mb-6 opacity-90">{text}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm md:text-base text-left mt-4">
          <div>
            💨 <strong>Wind:</strong> {weather.windspeed} km/h
          </div>
          <div>
            💧 <strong>Humidity:</strong> {weather.humidity ?? "-"}%
          </div>
          <div>
            🌡️ <strong>Feels like:</strong>{" "}
            {weather.apparent_temperature ?? "-"}°C
          </div>
          <div>
            📈 <strong>Pressure:</strong> {weather.pressure ?? "-"} hPa
          </div>
          <div>
            🌅 <strong>Sunrise:</strong> {sunrise}
          </div>
          <div>
            🌇 <strong>Sunset:</strong> {sunset}
          </div>
        </div>
      </div>

      {/* Soft overlay for dark/light blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent dark:from-black/30 rounded-2xl pointer-events-none"></div>
    </motion.div>
  );
}
