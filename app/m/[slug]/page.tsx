// app/m/[slug]/page.tsx
'use client';

import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { getMatchBundle } from '../../../lib/api';
import { subscribeToMatchById } from '../../../lib/realtime';
import type { Match, MatchSet } from '../../../types/db';
import { useParams, useRouter } from 'next/navigation';

export default function ViewerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0];
  const [bundle, setBundle] = useState<{ match: Match | null; sets: MatchSet[] } | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("Viewer slug param:", slug);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getMatchBundle(slug)
      .then((data) => {
        setBundle(data);
        // Save to history
        if (window && data.match) {
          const history = JSON.parse(localStorage.getItem('viewedMatches') || '[]');
          const exists = history.find((h: any) => h.id === data.match!.id);
          if (!exists) {
            history.unshift({ id: data.match.id, name: data.match.name });
            localStorage.setItem('viewedMatches', JSON.stringify(history.slice(0, 10)));
          }
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Subscribe to realtime updates by matchId after match is loaded
  useEffect(() => {
    if (!bundle?.match?.id) return;
    let timeout: NodeJS.Timeout | null = null;
    const unsubscribe = subscribeToMatchById(bundle.match.id, () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        getMatchBundle(slug).then((data) => setBundle(data));
      }, 150);
    });
    return () => {
      if (timeout) clearTimeout(timeout);
      unsubscribe();
    };
  }, [bundle?.match?.id, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">Loading...</main>
      </div>
    );
  }

  if (!bundle?.match) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center text-red-600">
          Match not found.
        </main>
      </div>
    );
  }

  const { match, sets } = bundle;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-6">
        <h2 className="text-xl font-bold mb-2">{match.name}</h2>
        <div className="mb-4 text-gray-700 dark:text-gray-200">
          {match.team_a} vs {match.team_b}
        </div>
        <div className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <div className="flex justify-between font-semibold text-lg mb-2">
            <span>{match.team_a}</span>
            <span>{match.team_b}</span>
          </div>
          {sets.map((set) => (
            <div
              key={set.id}
              className={`flex justify-between py-2 px-2 rounded ${
                set.finished ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'
              } mb-2`}
            >
              <span>Set {set.set_number}</span>
              <span>
                {set.team_a_score} - {set.team_b_score}
              </span>
            </div>
          ))}
        </div>
        {/* Refresh button removed: updates are now realtime */}
      </main>
    </div>
  );
}
