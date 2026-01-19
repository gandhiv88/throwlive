"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

function randomString(len: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function DebugRpcPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function handleCall() {
    setLoading(true);
    setResult(null);
    const slug = randomString(8);
    const adminToken = randomString(32);
    const params = {
      p_slug: slug,
      p_team_a_name: "DebugA",
      p_team_b_name: "DebugB",
      p_sets_to_win: 3,
      p_points_per_set: 15,
      p_admin_token: adminToken,
    };
    const { data, error, status } = await supabase.rpc("create_match", params);
    setResult({ data, error, status, params });
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold mb-4">Debug create_match RPC</h1>
      <div className="mb-2 text-sm">
        <div>Env URL: <span className="font-mono">{envUrl || "(not set)"}</span></div>
        <div>Anon Key: <span className="font-mono">{envKey ? "(exists)" : "(not set)"}</span></div>
      </div>
      <button
        onClick={handleCall}
        disabled={loading}
        className="rounded bg-blue-600 text-white px-4 py-2 font-semibold disabled:opacity-50 mb-4"
      >
        {loading ? "Calling..." : "Call create_match"}
      </button>
      <div>
        <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">
          {result ? JSON.stringify(result, null, 2) : "(no result yet)"}
        </pre>
      </div>
    </main>
  );
}
