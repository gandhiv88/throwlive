"use client";

import { useEffect, useState } from "react";
import { getMatchBundle } from "@/lib/api";
import { subscribeToMatchById } from "@/lib/realtime";
import AppShell, { cardClass } from "@/components/AppShell";
import StatusBadge, { MatchStatus } from "@/components/StatusBadge";
import AnimatedScore from "@/components/AnimatedScore";

export default function ViewerClient({ slug }: { slug: string }) {
  const [bundle, setBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMatchBundle(slug);
        setBundle(data);
        unsub = subscribeToMatchById(slug, async () => {
          const updated = await getMatchBundle(slug);
          setBundle(updated);
        });
      } catch (err: any) {
        setError(err.message || "Failed to load match");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      if (unsub) unsub();
    };
  }, [slug]);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
    <AppShell>
      <div className={cardClass}>
        <div className="w-full max-w-md mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              className="rounded px-3 py-1 bg-blue-600 text-white font-semibold shadow disabled:opacity-50"
              onClick={() => window.location.reload()}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
          <h1 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            {match.team_a_name} vs {match.team_b_name}
          </h1>
          <div className="flex items-center gap-3 mb-2">
            <StatusBadge status={match.status as MatchStatus} />
            <span className="text-xs text-gray-500">
              {formatDate(match.created_at)}
            </span>
          </div>
          <div className="text-center text-gray-700 dark:text-gray-300 mb-4">
            <span className="font-semibold">Set {match.current_set_number} ({setStatus})</span>
          </div>
          {match.rotation_enabled && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Server:</span>
              <span className={`font-bold ${match.server_team === "A" ? "text-blue-500" : "text-pink-500"}`}>
                {match.server_team === "A" ? match.team_a_name : match.team_b_name}
              </span>
              <span className="text-lg">🏐</span>
            </div>
          )}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
              <div className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-300">{match.team_a_name}</div>
              <div className="text-4xl font-extrabold mb-2">
                <AnimatedScore value={currentSet?.team_a_score ?? 0} />
              </div>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
              <div className="text-lg font-bold mb-2 text-pink-700 dark:text-pink-300">{match.team_b_name}</div>
              <div className="text-4xl font-extrabold mb-2">
                <AnimatedScore value={currentSet?.team_b_score ?? 0} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
