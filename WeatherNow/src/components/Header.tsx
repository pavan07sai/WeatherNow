import React from "react";
import { Sun, Moon } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
}: HeaderProps) {
  return (
    <header
      className={`w-full sticky top-0 z-50 shadow-sm border-b ${
        darkMode
          ? "bg-gray-900/90 border-gray-800 text-white"
          : "bg-white/90 border-gray-200 text-gray-800 backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-blue-300" : "text-blue-700"
          }`}
        >
          Weather Now 🌤️
        </h1>

        <nav className="flex gap-6 items-center">
          {["home", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize transition-colors ${
                activeTab === tab
                  ? darkMode
                    ? "text-blue-300 font-semibold"
                    : "text-blue-700 font-semibold underline"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              {tab}
            </button>
          ))}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
