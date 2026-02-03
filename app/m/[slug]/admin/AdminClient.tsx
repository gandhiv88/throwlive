"use client";

import { useEffect, useState } from "react";
import { getMatchBundle, applyScore, endMatch, switchServer } from "@/lib/api";
import AppShell, { cardClass } from "@/components/AppShell";
import StatusBadge, { MatchStatus } from "@/components/StatusBadge";
import AnimatedScore from "@/components/AnimatedScore";

export default function AdminClient({ slug }: { slug: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [bundle, setBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scoreLoading, setScoreLoading] = useState<"A"|"B"|null>(null);
  const [matchEnded, setMatchEnded] = useState(false);
  const [setTransitionMsg, setSetTransitionMsg] = useState<string | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [endReason, setEndReason] = useState("");
  const [endWinner, setEndWinner] = useState<"A" | "B" | null>(null);
  const [endingMatch, setEndingMatch] = useState(false);
  const [switchingServer, setSwitchingServer] = useState(false);

  async function loadBundle() {
    setLoading(true);
    setError(null);
    try {
      const data = await getMatchBundle(slug);
      console.log('AdminClient: loadBundle', { slug, data }); // Debug log
      setBundle(data);
    } catch (err: any) {
      setError(err.message || "Failed to load match");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBundle();
  }, [slug]);

  useEffect(() => {
    // Debug log for bundle and token
    console.log('AdminClient: useEffect', { slug, bundle, token });
    // Always sync token from match bundle if available
    if (bundle?.match?.admin_token) {
      localStorage.setItem(`throwlive:token:${slug}`, bundle.match.admin_token);
      setToken(bundle.match.admin_token);
    } else {
      setToken(localStorage.getItem(`throwlive:token:${slug}`));
    }
  }, [slug, bundle]);

  useEffect(() => {
    // If bundle is null after loading, treat as error
    if (!loading && (!bundle || !bundle.match)) {
      setError("Match not found or failed to load.");
    }
  }, [loading, bundle]);

  async function handleScore(team: "A"|"B", delta: 1|-1) {
    if (!token) return;
    setScoreLoading(team);
    setError(null);
    setSetTransitionMsg(null);
    try {
      const prevMatch = bundle?.match;
      const prevSet = bundle?.sets?.find((s: any) => s.set_number === prevMatch?.current_set_number);
      // Call applyScore with correct argument order: slug, adminToken, team, delta
      const data = await applyScore(slug, token, team, delta);
      console.log('AdminClient: handleScore result', { slug, token, team, delta, data }); // Debug log
      const nextBundle =
        data?.match && Array.isArray(data?.sets)
          ? { match: data.match, sets: data.sets }
          : await getMatchBundle(slug);
      setBundle(nextBundle);
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

  async function handleEndMatch() {
    if (!token || !endReason.trim()) return;
    setEndingMatch(true);
    setError(null);
    try {
      const data = await endMatch(slug, token, endReason, endWinner);
      setBundle(data);
      setMatchEnded(true);
      setShowEndModal(false);
      setEndReason("");
      setEndWinner(null);
    } catch (err: any) {
      setError(err.message || "Failed to end match");
    } finally {
      setEndingMatch(false);
    }
  }

  async function handleSwitchServer() {
    if (!token) return;
    setSwitchingServer(true);
    setError(null);
    try {
      const newServer = bundle?.match?.server_team === "A" ? "B" : "A";
      const data = await switchServer(slug, token, newServer);
      setBundle(data);
    } catch (err: any) {
      setError(err.message || "Failed to switch server");
    } finally {
      setSwitchingServer(false);
    }
  }

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

  if (!token) {
    return (
      <AppShell>
        <div className={cardClass}>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
            <div className="w-full max-w-md px-4 py-8">
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded p-4 text-center">
                Admin token not found on this device.<br />Use the scorer device.
              </div>
            </div>
          </main>
        </div>
      </AppShell>
    );
  }

  if (loading) {
    return (
      <AppShell>
        <div className={cardClass}>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-lg text-gray-700 dark:text-gray-200">Loading…</div>
          </main>
        </div>
      </AppShell>
    );
  }

  if (!bundle || !bundle.match) {
    return (
      <AppShell>
        <div className={cardClass}>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded p-4 text-center">
              Match not found or failed to load.
            </div>
          </main>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className={cardClass}>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded p-4 text-center">
              {error}
            </div>
          </main>
        </div>
      </AppShell>
    );
  }

  const { match, sets } = bundle || {};
  const currentSet = sets?.find((s: any) => s.set_number === match.current_set_number) || sets?.[0];
  const setStatus = currentSet?.status === 'ended' ? 'ENDED' : 'LIVE';

  return (
    <AppShell>
      <div className={cardClass}>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-md mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
              <button
                type="button"
                className="rounded px-3 py-1 bg-blue-600 text-white font-semibold shadow disabled:opacity-50"
                onClick={loadBundle}
                disabled={loading}
              >
                Refresh
              </button>
              {match?.status !== 'ended' && (
                <button
                  type="button"
                  className="rounded px-3 py-1 bg-red-600 text-white font-semibold shadow disabled:opacity-50"
                  onClick={() => setShowEndModal(true)}
                >
                  End Match
                </button>
              )}
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
            {match.rotation_enabled && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Server:</span>
                <div className="flex items-center gap-1">
                  <span className={`font-bold ${match.server_team === "A" ? "text-blue-500" : "text-pink-500"}`}>
                    {match.server_team === "A" ? match.team_a_name : match.team_b_name}
                  </span>
                  <span className="text-lg">🏐</span>
                </div>
                {match?.status !== 'ended' && (
                  <button
                    type="button"
                    className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded px-2 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => handleSwitchServer()}
                    disabled={scoreLoading !== null}
                  >
                    Switch
                  </button>
                )}
              </div>
            )}
            <div className="text-center text-gray-700 dark:text-gray-300 mb-4">
              <span className="font-semibold">Set {match.current_set_number} ({setStatus})</span>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
                <div className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-300">{match.team_a_name}</div>
                <div className="text-4xl font-extrabold mb-2">
                  <AnimatedScore value={currentSet?.team_a_score ?? 0} />
                </div>
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
                <div className="text-4xl font-extrabold mb-2">
                  <AnimatedScore value={currentSet?.team_b_score ?? 0} />
                </div>
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

            {/* End Match Modal */}
            {showEndModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">End Match</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reason for ending
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="e.g., Team withdrew, Weather, etc."
                      value={endReason}
                      onChange={(e) => setEndReason(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Declare Winner (optional)
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`flex-1 rounded p-2 font-semibold ${
                          endWinner === "A"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => setEndWinner(endWinner === "A" ? null : "A")}
                      >
                        {match.team_a_name}
                      </button>
                      <button
                        type="button"
                        className={`flex-1 rounded p-2 font-semibold ${
                          endWinner === "B"
                            ? "bg-pink-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => setEndWinner(endWinner === "B" ? null : "B")}
                      >
                        {match.team_b_name}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave unselected to determine by sets won
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold"
                      onClick={() => {
                        setShowEndModal(false);
                        setEndReason("");
                        setEndWinner(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded p-2 bg-red-600 text-white font-semibold disabled:opacity-50"
                      onClick={handleEndMatch}
                      disabled={!endReason.trim() || endingMatch}
                    >
                      {endingMatch ? "Ending..." : "End Match"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AppShell>
  );
}
