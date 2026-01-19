import AppShell from "@/components/AppShell";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "./components/Header";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  let liveMatches: any[] = [];
  let liveError: string | null = null;
  try {
    const { data, error } = await supabase
      .from("matches")
      .select(
        "slug, team_a_name, team_b_name, status, is_public, updated_at, created_at"
      )
      .eq("status", "live")
      .eq("is_public", true)
      .order("updated_at", { ascending: false })
      .limit(20);
    if (error) {
      liveError = error.message;
    } else {
      liveMatches = data || [];
    }
  } catch (e: any) {
    liveError = e?.message || String(e);
  }

  return (
    <AppShell rightSlot={<ThemeToggle />}>
      <Header />
      <main className="flex-1 flex flex-col gap-8 px-4 py-6">
        <Link
          href="/new"
          className="bg-blue-600 text-white rounded-lg px-6 py-4 text-lg font-semibold shadow-md w-full max-w-xs text-center self-center mb-8"
        >
          Create Match
        </Link>

        <section>
          <h2 className="text-lg font-bold mb-2">Live Matches</h2>
          {liveError && (
            <div className="text-red-600 bg-red-50 rounded p-2 mb-2">
              {liveError}
            </div>
          )}
          <ul className="flex flex-col gap-3">
            {liveMatches.length === 0 && !liveError && (
              <li className="text-gray-500">
                No live matches found (note: only public matches are listed).
              </li>
            )}
            {liveMatches.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/m/${m.slug}`}
                  className="block bg-yellow-100 rounded-lg px-4 py-3 font-semibold text-gray-900 shadow"
                >
                  {m.team_a_name} vs {m.team_b_name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </AppShell>
  );
}
