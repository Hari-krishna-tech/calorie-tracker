"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDate, formatDisplayDate, addDays } from "@/lib/date";
import { fetchJSON } from "@/lib/api";

interface Food {
  caloriesPerUnit: number;
}

interface FoodEntry {
  id: string;
  quantity: number;
  date: string;
  food: Food;
}

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

interface Settings {
  dailyCalorieGoal: number;
}

interface DaySummary {
  date: string;
  calories: number;
  goal: number;
}

export default function HistoryPage() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [daySummaries, setDaySummaries] = useState<DaySummary[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [goal, setGoal] = useState(2000);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const today = formatDate(new Date());
    const sevenDaysAgo = addDays(today, -7);

    const [weightsData, settingsData] = await Promise.all([
      fetchJSON<WeightEntry[]>("/api/weight"),
      fetchJSON<Settings>("/api/settings"),
    ]);

    setWeights(weightsData);
    setGoal(settingsData.dailyCalorieGoal);

    // Fetch all 7 days at once via batch endpoint
    const dates: string[] = [];
    for (let i = 0; i <= 7; i++) {
      dates.push(addDays(today, -i));
    }
    const grouped = await fetchJSON<Record<string, FoodEntry[]>>(
      `/api/entries/batch?dates=${dates.join(",")}`
    );

    const summaries: DaySummary[] = dates.map((d) => {
      const entries = grouped[d] || [];
      const calories = entries.reduce(
        (s, e) => s + e.food.caloriesPerUnit * e.quantity,
        0
      );
      return { date: d, calories, goal: settingsData.dailyCalorieGoal };
    });
    setDaySummaries(summaries.reverse());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const logWeight = async () => {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w <= 0) return;
    const today = formatDate(new Date());
    await fetchJSON("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight: w, date: today }),
    });
    setWeightInput("");
    fetchData();
  };

  const latestWeight = weights.length > 0 ? weights[weights.length - 1].weight : null;
  const prevWeight = weights.length > 1 ? weights[weights.length - 2].weight : null;
  const weightChange = latestWeight && prevWeight ? latestWeight - prevWeight : null;

  // Compute max for bar chart scaling
  const maxCal = Math.max(...daySummaries.map((d) => Math.max(d.calories, d.goal)), 1);

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <h1 className="text-lg font-semibold mb-4">History</h1>
        <div className="text-center text-gray-400 py-8 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="text-lg font-semibold mb-6">History</h1>

      {/* Weight Section */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Weight</h2>

        {latestWeight ? (
          <div className="flex items-end gap-3 mb-3">
            <div className="text-3xl font-bold">{latestWeight}</div>
            <div className="text-gray-500 text-sm mb-1">kg</div>
            {weightChange !== null && (
              <div
                className={`text-sm font-medium mb-1 ${
                  weightChange < 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {weightChange > 0 ? "+" : ""}
                {weightChange.toFixed(1)} kg
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm mb-3">No weight logged yet</p>
        )}

        {/* Weight sparkline */}
        {weights.length > 1 && (
          <div className="flex items-end gap-1 h-10 mb-3">
            {weights.slice(-14).map((w, i) => {
              const minW = Math.min(...weights.slice(-14).map((x) => x.weight));
              const maxW = Math.max(...weights.slice(-14).map((x) => x.weight));
              const range = maxW - minW || 1;
              const height = ((w.weight - minW) / range) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-primary/60 rounded-t"
                  style={{ height: `${Math.max(height, 8)}%` }}
                  title={`${w.date}: ${w.weight} kg`}
                />
              );
            })}
          </div>
        )}

        {/* Weight input */}
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="Today's weight (kg)"
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={logWeight}
            className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold active:bg-primary-dark transition-colors"
          >
            Log
          </button>
        </div>
      </div>

      {/* Calorie History */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Calories (Last 7 Days)</h2>

      <div className="space-y-2 mb-6">
        {daySummaries.map((day) => {
          const overGoal = day.calories > day.goal;
          const barWidth = Math.min((day.calories / maxCal) * 100, 100);
          return (
            <Link
              key={day.date}
              href={`/?date=${day.date}`}
              className="flex items-center gap-3 py-2 px-1 active:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-20 text-sm text-gray-600">
                {formatDisplayDate(day.date)}
              </div>
              <div className="flex-1 h-7 bg-gray-100 rounded-md overflow-hidden relative">
                <div
                  className={`h-full rounded-md transition-all ${
                    overGoal ? "bg-red-400" : "bg-primary"
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
                {/* Goal marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
                  style={{ left: `${(day.goal / maxCal) * 100}%` }}
                />
              </div>
              <div className="w-14 text-right text-sm font-medium">
                {day.calories}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
