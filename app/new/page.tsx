"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTheme } from "next-themes";

function randomString(len: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function NewMatchPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [setsToWin, setSetsToWin] = useState<1 | 3 | 5>(3);
  const [pointsPerSet, setPointsPerSet] = useState(15);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!teamA.trim() || !teamB.trim()) {
      setError("Both team names are required");
      return;
    }
    if (teamA.trim().toLowerCase() === teamB.trim().toLowerCase()) {
      setError("Team names must be different");
      return;
    }

    setLoading(true);

    // 🔑 Generate values on client
    const slug = randomString(8);
    const adminToken = randomString(32);

    const { data, error: rpcError } = await supabase.rpc("create_match", {
      p_slug: slug,
      p_team_a_name: teamA,
      p_team_b_name: teamB,
      p_sets_to_win: setsToWin,
      p_points_per_set: pointsPerSet,
      p_admin_token: adminToken,
    });

    // Debug log
    console.log({ data, error: rpcError });

    if (rpcError) {
      setLoading(false);
      setError(rpcError.message);
      return;
    }
    if (!data) {
      setLoading(false);
      setError("RPC returned no data");
      return;
    }
    if (!(data as any).match?.id || !(data as any).match?.slug) {
      setLoading(false);
      setError("RPC returned no match; insert may not have happened");
      return;
    }

    // Only store token and redirect if valid match
    localStorage.setItem(`throwlive:token:${(data as any).match.slug}`, adminToken);
    router.push(`/m/${(data as any).match.slug}/share`);
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-md px-4 py-6">
        <div className="flex justify-end mb-2">
          <button
            type="button"
            className="rounded px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
        <h1 className="text-xl font-semibold mb-4">Create Match</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border p-3"
            placeholder="Team A name"
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
          />

          <input
            className="w-full rounded border p-3"
            placeholder="Team B name"
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              type="button"
              className={`flex-1 rounded p-2 ${
                setsToWin === 1 ? "bg-blue-600 text-white" : "bg-white border"
              }`}
              onClick={() => setSetsToWin(1)}
            >
              1 Set
            </button>
            <button
              type="button"
              className={`flex-1 rounded p-2 ${
                setsToWin === 3 ? "bg-blue-600 text-white" : "bg-white border"
              }`}
              onClick={() => setSetsToWin(3)}
            >
              3 Sets
            </button>
            <button
              type="button"
              className={`flex-1 rounded p-2 ${
                setsToWin === 5 ? "bg-blue-600 text-white" : "bg-white border"
              }`}
              onClick={() => setSetsToWin(5)}
            >
              5 Sets
            </button>
          </div>

          <select
            className="w-full rounded border p-3"
            value={pointsPerSet}
            onChange={(e) => setPointsPerSet(Number(e.target.value))}
          >
            <option value={15}>15 points</option>
            <option value={21}>21 points</option>
          </select>

          {error && (
            <div className="rounded bg-red-50 p-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 p-3 text-white font-medium disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create Match"}
          </button>
        </form>
      </div>
    </main>
  );
}
