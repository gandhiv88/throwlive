import { supabase } from "./supabase";

/**
 * Subscribe to realtime updates for a match and its sets by matchId.
 * Calls onUpdate() when a relevant change occurs.
 * Returns an unsubscribe function.
 */
export function subscribeToMatchById(matchId: string, onUpdate: () => void) {
  if (!matchId) {
    console.log("subscribeToMatchById: No matchId provided");
    return () => {};
  }
  const channel = supabase.channel(`match-${matchId}`);

  // Listen for changes in matches table (by id)
  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "matches",
      filter: `id=eq.${matchId}`,
    },
    (payload) => {
      console.log("[realtime] matches change", payload);
      onUpdate();
    }
  );

  // Listen for changes in match_sets table (by match_id)
  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "match_sets",
      filter: `match_id=eq.${matchId}`,
    },
    (payload) => {
      console.log("[realtime] match_sets change", payload);
      onUpdate();
    }
  );

  channel.subscribe((status) => {
    console.log(`[realtime] Channel status for match ${matchId}:`, status);
  });

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
    console.log(`[realtime] Unsubscribed from match ${matchId}`);
  };
}
