const BASE = "";

export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, init);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
