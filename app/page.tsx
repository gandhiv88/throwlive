"use client";
import AppShell, { cardClass } from "@/components/AppShell";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { listLiveMatches, listRecentMatchesWithLive } from "@/lib/api";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [tab, setTab] = useState<0 | 1>(0); // 0 = Live, 1 = Recent
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        if (tab === 0) {
          setLiveMatches(await listLiveMatches());
        } else {
          setRecentMatches(await listRecentMatchesWithLive());
        }
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <AppShell rightSlot={<ThemeToggle />}>
      <div className={cardClass + " mb-8 text-center"}>
        <h1 className="text-2xl font-bold mb-2">Welcome to ThrowLive</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Realtime throwball score tracking for tournaments and matches.
        </p>
        <Link
          href="/new"
          className="bg-blue-600 text-white rounded-lg px-6 py-4 text-lg font-semibold shadow-md w-full max-w-xs text-center self-center"
        >
          Create Match
        </Link>
      </div>
      <div className={cardClass + " mb-6"}>
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4">
          <button
            className={`flex-1 text-center py-2 cursor-pointer font-semibold focus:outline-none ${
              tab === 0
                ? "border-b-2 border-blue-600 text-blue-700 dark:text-blue-300"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setTab(0)}
            type="button"
          >
            Live
          </button>
          <button
            className={`flex-1 text-center py-2 cursor-pointer font-semibold focus:outline-none ${
              tab === 1
                ? "border-b-2 border-blue-600 text-blue-700 dark:text-blue-300"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setTab(1)}
            type="button"
          >
            Recent
          </button>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Loading…
          </div>
        ) : error ? (
          <div className="text-red-600 bg-red-50 rounded p-2 mb-2">
            {error}
          </div>
        ) : tab === 0 ? (
          <ul className="space-y-4">
            {liveMatches.length === 0 ? (
              <li className="text-gray-500 dark:text-gray-400">
                No live matches.
              </li>
            ) : (
              liveMatches.map((m) => (
                <li
                  key={m.slug}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
                >
                  <div className="font-semibold">
                    {m.team_a_name}{" "}
                    <span className="text-gray-400">vs</span> {m.team_b_name}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      LIVE
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(m.created_at)}
                    </span>
                    <Link
                      href={`/m/${m.slug}`}
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ul>
        ) : (
          <ul className="space-y-4">
            {recentMatches.length === 0 ? (
              <li className="text-gray-500 dark:text-gray-400">
                No recent matches.
              </li>
            ) : (
              recentMatches.map((m) => (
                <li
                  key={m.slug}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0"
                >
                  <div className="font-semibold">
                    {m.team_a_name}{" "}
                    <span className="text-gray-400">vs</span> {m.team_b_name}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        m.status === "live"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {m.status === "live" ? "LIVE" : "FINAL"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(m.created_at)}
                    </span>
                    <Link
                      href={`/m/${m.slug}`}
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
