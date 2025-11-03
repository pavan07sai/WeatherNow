import React from "react";

interface WeatherData {
  name: string;
  country?: string;
  temperature: number;
  windspeed: number;
  weathercode: number;
  apparent_temperature: number | null;
  humidity: number | null;
  pressure: number | null;
  sunrise: string;
  sunset: string;
  time: string;
}

interface HistoryProps {
  history: WeatherData[];
  onCityClick: (city: string) => void;
}

function getWeatherIcon(code: number): string {
  if ([0, 1].includes(code)) return "☀️ Sunny";
  if ([2, 3].includes(code)) return "⛅ Cloudy";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "🌧️ Rainy";
  if ([71, 73, 75, 77].includes(code)) return "❄️ Snowy";
  return "🌫️ Unknown";
}

export default function History({ history, onCityClick }: HistoryProps) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-5 text-center">
        Previously Searched
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-400 text-center">
          No previous searches yet. Try searching on the Home tab.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => {
            const [icon, desc] = getWeatherIcon(item.weathercode).split(" ");
            return (
              <div
                key={item.name}
                onClick={() => onCityClick(item.name)}
                className="cursor-pointer rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/70 hover:shadow-lg transition-transform hover:scale-105 backdrop-blur-md"
              >
                {/* City and Country */}
                <div className="text-lg font-semibold mb-2 text-center">
                  📍 {item.name}, {item.country ?? ""}
                </div>

                {/* Temperature and icon */}
                <div className="flex justify-center items-center gap-2 mb-3">
                  <span className="text-4xl">{icon}</span>
                  <span className="text-3xl font-bold">
                    {item.temperature}°C
                  </span>
                </div>

                {/* Weather description */}
                <p className="text-center text-sm opacity-80 mb-3">{desc}</p>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-2 text-xs opacity-80">
                  <div>💨 {item.windspeed} km/h</div>
                  <div>💧 {item.humidity ?? "-"}%</div>
                  <div>🌡️ Feels: {item.apparent_temperature ?? "-"}°C</div>
                  <div>📈 {item.pressure ?? "-"} hPa</div>
                </div>

                {/* Last updated */}
                <p className="text-xs text-center mt-3 opacity-70">
                  Last updated:{" "}
                  {new Date(item.time).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
