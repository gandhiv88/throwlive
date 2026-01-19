"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DebugPage() {
  const [out, setOut] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const keyOk = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await supabase
        .from("matches")
        .select("slug,is_public,team_a_name,team_b_name,status")
        .eq("slug", "demo1234");

      setOut({ url, keyOk, res });
    })();
  }, []);

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-xl font-bold">Debug</h1>
      <pre className="mt-4 whitespace-pre-wrap rounded bg-gray-100 p-3 text-xs">
        {JSON.stringify(out, null, 2)}
      </pre>
    </main>
  );
}
