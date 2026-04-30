"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/date";
import { fetchJSON } from "@/lib/api";

interface Food {
  id: string;
  name: string;
  caloriesPerUnit: number;
  unitName: string;
  servingSizes: string;
}

interface ServingSize {
  label: string;
  multiplier: number;
}

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export default function AddPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servings, setServings] = useState<ServingSize[]>([]);
  const [selectedServing, setSelectedServing] = useState<ServingSize | null>(null);
  const [customQty, setCustomQty] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [mealType, setMealType] = useState("lunch");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const data = await fetchJSON<Food[]>(`/api/foods?q=${encodeURIComponent(query)}`);
      setResults(data);
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  const selectFood = (food: Food) => {
    setSelectedFood(food);
    try {
      const parsed: ServingSize[] = JSON.parse(food.servingSizes);
      setServings(parsed);
      setSelectedServing(parsed[0] || null);
    } catch {
      setServings([{ label: `1 ${food.unitName}`, multiplier: 1 }]);
      setSelectedServing({ label: `1 ${food.unitName}`, multiplier: 1 });
    }
    setIsCustom(false);
    setCustomQty("");
  };

  const backToSearch = () => {
    setSelectedFood(null);
    setSelectedServing(null);
    setIsCustom(false);
    setQuery("");
  };

  const totalCals =
    selectedFood && selectedServing
      ? Math.round(selectedFood.caloriesPerUnit * selectedServing.multiplier)
      : 0;

  const submit = async () => {
    if (!selectedFood || !selectedServing) return;
    setSubmitting(true);
    const date = formatDate(new Date());
    await fetchJSON("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        foodId: selectedFood.id,
        quantity: selectedServing.multiplier,
        mealType,
        date,
      }),
    });
    setSubmitting(false);
    router.push("/?added=1");
  };

  useEffect(() => {
    if (ready) {
      setTimeout(() => {
        document.getElementById("meal-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
      setReady(false);
    }
  }, [ready]);

  return (
    <div className="px-4 pt-6">
      <h1 className="text-lg font-semibold mb-4">Add Food</h1>

      {!selectedFood ? (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search food (e.g. idli, dosa, chapati...)"
              className="w-full bg-gray-100 rounded-xl px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              enterKeyHint="search"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setResults([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-1">
              {results.map((food) => (
                <button
                  key={food.id}
                  onClick={() => { selectFood(food); setReady(true); }}
                  className="w-full text-left bg-gray-50 rounded-xl px-4 py-3 active:bg-gray-100 transition-colors"
                >
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-gray-500">
                    {food.caloriesPerUnit} cal / {food.unitName}
                  </div>
                </button>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="text-center text-gray-400 py-4">No foods found</div>
          )}

          {/* Custom food creation */}
          {query && (
            <CustomFoodForm
              presetName={query}
              onCreated={(food: Food) => { selectFood(food); setReady(true); }}
            />
          )}
        </>
      ) : (
        <>
          {/* Back button */}
          <button
            onClick={backToSearch}
            className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back to search
          </button>

          {/* Selected food */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
            <div className="font-medium text-lg">{selectedFood.name}</div>
            <div className="text-sm text-gray-500">
              {selectedFood.caloriesPerUnit} cal / {selectedFood.unitName}
            </div>
          </div>

          {/* Serving sizes */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-500 block mb-2">
              Serving Size
            </label>
            <div className="flex flex-wrap gap-2">
              {servings.map((s) => (
                <button
                  key={s.label}
                  onClick={() => { setSelectedServing(s); setIsCustom(false); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedServing === s && !isCustom
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 active:bg-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={() => { setIsCustom(true); setCustomQty(""); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isCustom
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 active:bg-gray-200"
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Custom quantity */}
          {isCustom && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-500 block mb-2">
                How many {selectedFood.unitName}s?
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={customQty}
                onChange={(e) => {
                  setCustomQty(e.target.value);
                  const n = parseFloat(e.target.value);
                  if (!isNaN(n) && n > 0) {
                    setSelectedServing({
                      label: `${n} ${selectedFood.unitName}${n > 1 ? "s" : ""}`,
                      multiplier: n,
                    });
                  }
                }}
                placeholder="1.5"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
            </div>
          )}

          {/* Total */}
          <div className="bg-green-50 rounded-xl px-4 py-3 mb-4" id="meal-selector">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-xl font-bold">{totalCals} cal</span>
            </div>
          </div>

          {/* Meal type */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-500 block mb-2">
              Meal Type
            </label>
            <div className="flex gap-2">
              {MEAL_TYPES.map((mt) => (
                <button
                  key={mt.value}
                  onClick={() => setMealType(mt.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    mealType === mt.value
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 active:bg-gray-200"
                  }`}
                >
                  {mt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={submit}
            disabled={!selectedServing || submitting}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-base active:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {submitting ? "Adding..." : `Add to ${MEAL_TYPES.find((m) => m.value === mealType)?.label}`}
          </button>
        </>
      )}
    </div>
  );
}

function CustomFoodForm({
  presetName,
  onCreated,
}: {
  presetName: string;
  onCreated: (food: Food) => void;
}) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [unit, setUnit] = useState("serving");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setName(presetName);
  }, [presetName]);

  const create = async () => {
    if (!name || !calories) return;
    setCreating(true);
    const food = await fetchJSON<Food>("/api/foods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        caloriesPerUnit: parseFloat(calories),
        unitName: unit,
        category: "custom",
      }),
    });
    setCreating(false);
    onCreated(food);
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-full text-left bg-gray-50 rounded-xl px-4 py-3 text-primary font-medium text-sm active:bg-gray-100 transition-colors mt-2"
      >
        + Create &ldquo;{presetName}&rdquo; as custom food
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl px-4 py-4 mt-2 space-y-3">
      <div className="text-sm font-medium text-gray-600">Create Custom Food</div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Food name"
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      />
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="Calories"
          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Unit (e.g. piece, bowl)"
          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShow(false)}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-500 bg-white border border-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={create}
          disabled={!name || !calories || creating}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-primary active:bg-primary-dark disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}
