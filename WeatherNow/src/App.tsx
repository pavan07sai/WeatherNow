import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import LiveDateTime from "./components/LiveDateTime";
import WeatherCard from "./components/WeatherCard";
import ForecastStrip from "./components/ForecastStrip";
import Tips from "./components/Tips";
import History from "./components/History";

interface Weather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  apparent_temperature?: number;
  humidity?: number;
  pressure?: number;
  sunrise?: string;
  sunset?: string;
  name?: string;
  country?: string;
}

interface ForecastDay {
  date: string;
  temperature_max: number;
  temperature_min: number;
  weathercode: number;
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [searched, setSearched] = useState(false);
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ---- Fetch weather by coordinates ----
  const getWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset&timezone=auto`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.reason);

      setWeather({
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
        apparent_temperature: data.hourly?.apparent_temperature?.[0] ?? null,
        humidity: data.hourly?.relativehumidity_2m?.[0] ?? null,
        pressure: data.hourly?.pressure_msl?.[0] ?? null,
        sunrise: data.daily?.sunrise?.[0] ?? "N/A",
        sunset: data.daily?.sunset?.[0] ?? "N/A",
      });

      const forecastData = data.daily.time.map((date: string, i: number) => ({
        date,
        temperature_max: data.daily.temperature_2m_max[i],
        temperature_min: data.daily.temperature_2m_min[i],
        weathercode: data.daily.weathercode[i],
      }));
      setForecast(forecastData.slice(0, 6));
    } catch (err) {
      console.error("Error fetching weather by coordinates:", err);
    }
  };

  // ---- Fetch weather by city ----
  const getWeatherByCity = async (cityName: string) => {
    try {
      setLoading(true);
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`
      );
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0)
        throw new Error("City not found");

      const { latitude, longitude, name, country } = geoData.results[0];
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset&timezone=auto`
      );
      const weatherData = await weatherRes.json();
      if (weatherData.error) throw new Error(weatherData.reason);

      const formattedWeather: Weather = {
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        weathercode: weatherData.current_weather.weathercode,
        apparent_temperature:
          weatherData.hourly?.apparent_temperature?.[0] ?? null,
        humidity: weatherData.hourly?.relativehumidity_2m?.[0] ?? null,
        pressure: weatherData.hourly?.pressure_msl?.[0] ?? null,
        sunrise: weatherData.daily?.sunrise?.[0] ?? "N/A",
        sunset: weatherData.daily?.sunset?.[0] ?? "N/A",
        name,
        country,
      };

      setWeather(formattedWeather);

      const forecastData = weatherData.daily.time.map(
        (date: string, i: number) => ({
          date,
          temperature_max: weatherData.daily.temperature_2m_max[i],
          temperature_min: weatherData.daily.temperature_2m_min[i],
          weathercode: weatherData.daily.weathercode[i],
        })
      );
      setForecast(forecastData.slice(0, 6));

      return formattedWeather;
    } catch (err) {
      console.error("Error fetching weather by city:", err);
      alert("Could not fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Handle search ----
  const handleSearch = async () => {
    if (!city.trim()) return;
    const newWeather = await getWeatherByCity(city);
    if (!newWeather) return;

    setSearched(true);
    setActiveTab("home");
    setCity("");

    const prevHistory = JSON.parse(localStorage.getItem("history") || "[]");
    const newEntry = {
      ...newWeather,
      time: new Date().toISOString(),
    };
    const updatedHistory = [
      newEntry,
      ...prevHistory.filter((item: any) => item.name !== newEntry.name),
    ].slice(0, 5);

    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };

  // ---- On mount ----
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
    const stored = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(stored);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationGranted(true);
        getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => setLocationGranted(false)
    );
  }, []);

  // ---- Dark mode toggle ----
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ---- Layout ----
  return (
    <div
      className={`relative w-screen min-h-screen flex flex-col overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-sky-100 via-sky-200 to-sky-300 text-gray-900"
      }`}
    >
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-blue-400/10 via-transparent to-transparent dark:from-gray-700/20"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content */}
      <main className="relative flex-1 p-6 overflow-y-auto z-10">
        {activeTab === "home" && (
          <>
            {/* Search bar */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              <input
                type="text"
                placeholder="Search for a city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full sm:w-80 md:w-96 lg:w-[420px] px-4 py-2 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                  ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                      : "bg-white text-gray-800 border-gray-300 placeholder-gray-500 shadow-sm focus:border-blue-500"
                  }`}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !city.trim()}
                className={`px-5 py-2.5 rounded-lg font-medium transition active:scale-95 ${
                  loading || !city.trim()
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                }`}
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>

            <LiveDateTime />

            {!searched && locationGranted === false && <Tips />}

            {!searched && locationGranted === true && weather && (
              <>
                <WeatherCard weather={weather} title="📍 Your Location" />
                {forecast.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ForecastStrip forecast={forecast} />
                  </motion.div>
                )}
              </>
            )}

            {searched && weather && (
              <>
                <WeatherCard
                  weather={weather}
                  title={`📍 ${weather.name}, ${weather.country}`}
                />
                {forecast.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ForecastStrip forecast={forecast} />
                  </motion.div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "history" && (
          <History history={history} onCityClick={(c) => getWeatherByCity(c)} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 opacity-70 text-sm z-10">
        © {new Date().getFullYear()} Weather Now | Built using React + Tailwind
        + Open-Meteo
      </footer>
    </div>
  );
}

export default App;
