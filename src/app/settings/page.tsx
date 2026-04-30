"use client";

import { useEffect, useState } from "react";
import { fetchJSON } from "@/lib/api";

export default function SettingsPage() {
  const [goal, setGoal] = useState(2000);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJSON<{ dailyCalorieGoal: number }>("/api/settings").then((data) => {
      setGoal(data.dailyCalorieGoal);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    await fetchJSON("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dailyCalorieGoal: goal }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <h1 className="text-lg font-semibold mb-4">Settings</h1>
        <div className="text-center text-gray-400 py-8 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="text-lg font-semibold mb-6">Settings</h1>

      <div className="bg-gray-50 rounded-2xl p-5">
        <label className="text-sm font-semibold text-gray-500 uppercase block mb-2">
          Daily Calorie Goal
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value) || 0)}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={save}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold active:bg-primary-dark transition-colors"
          >
            {saved ? "Saved!" : "Save"}
          </button>
        </div>

        {/* Quick presets */}
        <div className="flex gap-2 mt-3">
          {[1500, 1800, 2000, 2500].map((preset) => (
            <button
              key={preset}
              onClick={() => setGoal(preset)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                goal === preset
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-gray-600 active:bg-gray-100"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
