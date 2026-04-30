"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate, formatDisplayDate, addDays } from "@/lib/date";
import { fetchJSON } from "@/lib/api";
import { UserMenu } from "@/components/UserMenu";

interface Food {
  id: string;
  name: string;
  caloriesPerUnit: number;
  unitName: string;
  servingSizes: string;
}

interface FoodEntry {
  id: string;
  foodId: string;
  food: Food;
  quantity: number;
  mealType: string;
  date: string;
}

interface Settings {
  dailyCalorieGoal: number;
}

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack"];
const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snacks",
};

function HomeInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramDate = searchParams.get("date");

  const [date, setDate] = useState<string>("");
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [goal, setGoal] = useState(2000);
  const [recentFoods, setRecentFoods] = useState<Food[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setDate(paramDate || formatDate(new Date()));
  }, [paramDate]);

  const fetchData = useCallback(async (d: string, isInitial: boolean) => {
    if (isInitial) {
      setInitialLoading(true);
    } else {
      setRefreshing(true);
    }
    const [entriesData, settingsData, foodsData] = await Promise.all([
      fetchJSON<FoodEntry[]>(`/api/entries?date=${d}`),
      fetchJSON<Settings>("/api/settings"),
      fetchJSON<Food[]>("/api/foods?q=&limit=6"),
    ]);
    setEntries(entriesData);
    setGoal(settingsData.dailyCalorieGoal);
    setRecentFoods(foodsData);
    setInitialLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!date) return;
    const isInitial = entries.length === 0;
    fetchData(date, isInitial);
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeDate = (d: string) => {
    setDate(d);
    router.replace(`/?date=${d}`, { scroll: false });
  };

  const totalCalories = entries.reduce(
    (sum, e) => sum + e.food.caloriesPerUnit * e.quantity,
    0
  );
  const progress = Math.min((totalCalories / goal) * 100, 100);
  const overGoal = totalCalories > goal;

  const groupedEntries = MEAL_ORDER
    .map((meal) => ({
      meal,
      label: MEAL_LABELS[meal],
      entries: entries.filter((e) => e.mealType === meal),
    }))
    .filter((g) => g.entries.length > 0);

  const deleteEntry = async (id: string) => {
    const prev = entries;
    setEntries((p) => p.filter((e) => e.id !== id));
    try {
      await fetchJSON(`/api/entries/${id}`, { method: "DELETE" });
    } catch {
      setEntries(prev);
    }
  };

  const quickAdd = async (food: Food) => {
    const servingSizes = JSON.parse(food.servingSizes || '[{"label":"1","multiplier":1}]');
    const defaultServing = servingSizes[0]?.multiplier || 1;
    const optimisticId = `opt-${Date.now()}`;
    const optimisticEntry: FoodEntry = {
      id: optimisticId,
      foodId: food.id,
      food,
      quantity: defaultServing,
      mealType: "snack",
      date,
    };
    setEntries((p) => [...p, optimisticEntry]);
    try {
      await fetchJSON("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodId: food.id,
          quantity: defaultServing,
          mealType: "snack",
          date,
        }),
      });
    } catch {
      setEntries((p) => p.filter((e) => e.id !== optimisticId));
    }
    // Refresh quietly in background for correct data
    fetchData(date, false);
  };

  if (!date) return null;

  const todayStr = formatDate(new Date());
  const isToday = date === todayStr;

  return (
    <div className="px-4 pt-6">
      {/* Date navigation */}
      <div className="flex items-center justify-between mb-6">
        <UserMenu />
        <button
          onClick={() => changeDate(addDays(date, -1))}
          className="p-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{formatDisplayDate(date)}</h1>
          {isToday && (
            <Link href="/settings" className="text-gray-400 hover:text-gray-600 p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          )}
        </div>
        <button
          onClick={() => changeDate(addDays(date, 1))}
          className="p-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Calorie progress */}
      <div className="bg-green-50 rounded-2xl p-5 mb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-3xl font-bold">{totalCalories}</div>
            <div className="text-sm text-gray-500">of {goal} cal</div>
          </div>
          <div className={`text-sm font-medium ${overGoal ? "text-red-500" : "text-primary"}`}>
            {overGoal ? `${totalCalories - goal} over` : `${goal - totalCalories} left`}
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overGoal ? "bg-red-500" : "bg-primary"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quick add recent foods */}
      {recentFoods.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-500">Quick Add</h2>
            {refreshing && (
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 quick-add-scroll">
            {recentFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => quickAdd(food)}
                className="flex-shrink-0 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium active:bg-gray-200 transition-colors"
              >
                + {food.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Entries grouped by meal */}
      {initialLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-gray-100 rounded-xl" />
          <div className="h-20 bg-gray-100 rounded-xl" />
          <div className="h-20 bg-gray-100 rounded-xl" />
        </div>
      ) : groupedEntries.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p className="text-lg mb-1">No entries yet</p>
          <p className="text-sm">Tap + to add food</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedEntries.map((group) => {
            const mealCal = group.entries.reduce(
              (s, e) => s + e.food.caloriesPerUnit * e.quantity,
              0
            );
            return (
              <div key={group.meal}>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase">
                    {group.label}
                  </h2>
                  <span className="text-sm text-gray-400">{mealCal} cal</span>
                </div>
                <div className="space-y-2">
                  {group.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 group ${
                        entry.id.startsWith("opt-") ? "opacity-60" : ""
                      }`}
                    >
                      <div>
                        <div className="font-medium">{entry.food.name}</div>
                        <div className="text-sm text-gray-500">
                          {entry.quantity} {entry.food.unitName}
                          {entry.quantity > 1 ? "s" : ""} &middot;{" "}
                          {Math.round(entry.food.caloriesPerUnit * entry.quantity)} cal
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-400 hover:text-red-500 transition-all p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="space-y-4 animate-pulse px-4 pt-6"><div className="h-20 bg-gray-100 rounded-xl" /><div className="h-20 bg-gray-100 rounded-xl" /></div>}>
      <HomeInner />
    </Suspense>
  );
}
