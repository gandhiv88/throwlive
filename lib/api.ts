// /lib/api.ts
import { supabase } from './supabase';
import type { Match, MatchSet } from '../types/db';

export async function listLiveMatches(): Promise<any[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('id, slug, team_a_name, team_b_name, status, created_at, updated_at')
    .eq('status', 'live')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function listRecentMatches(): Promise<any[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('id, slug, team_a, team_b, status, updated_at')
    .eq('status', 'finished')
    .order('updated_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data || [];
}

export async function listRecentMatchesWithLive(): Promise<any[]> {
  // Get matches from last 7 days, any status, ordered by created_at desc, limit 20
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('matches')
    .select('id, slug, team_a_name, team_b_name, status, created_at, updated_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}

export async function getMatchBundle(slug: string) {
  // 1) Fetch match by slug (use .maybeSingle() with clear error)
  const { data: match, error: matchErr } = await supabase
    .from("matches")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (matchErr) {
    throw new Error(`Match lookup failed for slug=\"${slug}\": ${matchErr.message}`);
  }
  if (!match) {
    throw new Error("Match not found");
  }

  // 2) Fetch sets for match_id
  const { data: sets, error: setsErr } = await supabase
    .from("match_sets")
    .select("*")
    .eq("match_id", match.id)
    .order("set_number", { ascending: true });

  if (setsErr) {
    throw new Error(`Set lookup failed: ${setsErr.message}`);
  }

  return { match: match as Match, sets: (sets ?? []) as MatchSet[] };
}

function randomString(len: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function createMatchViaRpc({
  teamA,
  teamB,
  setsToWin,
  pointsPerSet,
  slug: inputSlug,
  adminToken: inputAdminToken,
}: {
  teamA: string;
  teamB: string;
  setsToWin: 1 | 3 | 5;
  pointsPerSet: number;
  slug?: string;
  adminToken?: string;
}): Promise<{ slug: string; adminToken: string; bundle: any; }> {
  const slug = inputSlug || randomString(8);
  const adminToken = inputAdminToken || randomString(32);
  const { data, error } = await supabase.rpc("create_match", {
    p_slug: slug,
    p_team_a_name: teamA,
    p_team_b_name: teamB,
    p_sets_to_win: setsToWin,
    p_points_per_set: pointsPerSet,
    p_admin_token: adminToken,
  });
  console.log("createMatchViaRpc RPC result", { data, error });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("create_match returned no data");
  const matchObj = data.match || data;
  if (!matchObj || !matchObj.id || !matchObj.slug) {
    throw new Error("create_match returned no match; insert may not have happened");
  }
  return { slug: matchObj.slug, adminToken, bundle: data };
}

export async function applyScore(
  slug: string,
  adminToken: string,
  team: "A" | "B",
  delta: 1 | -1
): Promise<{ match: any; sets: any[] }> {
  const { data, error } = await supabase.rpc("apply_score", {
    p_slug: slug,
    p_admin_token: adminToken,
    p_team: team,
    p_delta: delta,
  });
  if (error) throw new Error(error.message);
  return data;
}
