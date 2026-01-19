"use client";

import { useEffect, useState } from "react";
import { getMatchBundle, applyScore } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminClient({ slug }: { slug: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [bundle, setBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scoreLoading, setScoreLoading] = useState<"A"|"B"|null>(null);
  const [matchEnded, setMatchEnded] = useState(false);
  const [setTransitionMsg, setSetTransitionMsg] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(`throwlive:token:${slug}`));
  }, [slug]);

  async function loadBundle() {
    setLoading(true);
    setError(null);
    try {
      const data = await getMatchBundle(slug);
      setBundle(data);
    } catch (err: any) {
      setError(err.message || "Failed to load match");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBundle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function handleScore(team: "A"|"B", delta: 1|-1) {
    if (!token) return;
    setScoreLoading(team);
    setError(null);
    setSetTransitionMsg(null);
    try {
      const prevMatch = bundle?.match;
      const prevSet = bundle?.sets?.find((s: any) => s.set_number === prevMatch?.current_set_number);
      const data = await applyScore(slug, token, team, delta);
      setBundle(data);
      if (data.match?.status === 'ended') {
        setMatchEnded(true);
      }
      if (
        prevSet && prevSet.status === 'ended' &&
        data.match?.current_set_number > prevMatch?.current_set_number
      ) {
        setSetTransitionMsg(`Set ended. Starting Set ${data.match.current_set_number}`);
      }
    } catch (err: any) {
      if (err.message && err.message.includes("match_ended")) {
        setMatchEnded(true);
      }
      setError(err.message || "Failed to update score");
    } finally {
      setScoreLoading(null);
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-4 py-8">
          <div className="flex justify-end mb-4"><ThemeToggle /></div>
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded p-4 text-center">
            Admin token not found on this device.<br />Use the scorer device.
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-700 dark:text-gray-200">Loading…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded p-4 text-center">
          {error}
        </div>
      </main>
    );
  }

  const { match, sets } = bundle || {};
  const currentSet = sets?.find((s: any) => s.set_number === match.current_set_number) || sets?.[0];
  const setStatus = currentSet?.status === 'ended' ? 'ENDED' : 'LIVE';

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <ThemeToggle />
          <button
            type="button"
            className="rounded px-3 py-1 bg-blue-600 text-white font-semibold shadow disabled:opacity-50"
            onClick={loadBundle}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
        {matchEnded && (
          <div className="bg-yellow-200 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded p-3 mb-4 text-center font-semibold">
            Match ended{match?.status === 'ended' ? ' (Final)' : ''}
          </div>
        )}
        {setTransitionMsg && (
          <div className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded p-2 mb-2 text-center text-sm">
            {setTransitionMsg}
          </div>
        )}
        <h1 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
          {match.team_a_name} vs {match.team_b_name}
        </h1>
        <div className="text-center text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-semibold">Match status:</span> {match.status}
        </div>
        <div className="text-center text-gray-700 dark:text-gray-300 mb-4">
          <span className="font-semibold">Set {match.current_set_number} ({setStatus})</span>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
            <div className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-300">{match.team_a_name}</div>
            <div className="text-4xl font-extrabold mb-2">{currentSet?.team_a_score ?? 0}</div>
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-gray-200 dark:bg-gray-700 text-lg rounded px-4 py-2 font-bold"
                onClick={() => handleScore("A", -1)}
                disabled={scoreLoading === "A" || matchEnded || match?.status === 'ended'}
              >-1</button>
              <button
                type="button"
                className="bg-blue-600 text-white text-lg rounded px-4 py-2 font-bold"
                onClick={() => handleScore("A", 1)}
                disabled={scoreLoading === "A" || matchEnded || match?.status === 'ended'}
              >+1</button>
            </div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
            <div className="text-lg font-bold mb-2 text-pink-700 dark:text-pink-300">{match.team_b_name}</div>
            <div className="text-4xl font-extrabold mb-2">{currentSet?.team_b_score ?? 0}</div>
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-gray-200 dark:bg-gray-700 text-lg rounded px-4 py-2 font-bold"
                onClick={() => handleScore("B", -1)}
                disabled={scoreLoading === "B" || matchEnded || match?.status === 'ended'}
              >-1</button>
              <button
                type="button"
                className="bg-pink-600 text-white text-lg rounded px-4 py-2 font-bold"
                onClick={() => handleScore("B", 1)}
                disabled={scoreLoading === "B" || matchEnded || match?.status === 'ended'}
              >+1</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
