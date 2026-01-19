export const dynamic = "force-dynamic";

"use client";

import React from "react";

export default function DebugPage({ params }: { params: { slug: string } }) {
  const [pathname, setPathname] = React.useState<string | null>(null);
  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);
  const slug = params.slug;
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="bg-white dark:bg-gray-800 rounded shadow p-6 w-full max-w-md">
        <h1 className="text-lg font-bold mb-4">Debug Page</h1>
        <div className="mb-2"><b>slug:</b> <span className="font-mono">{slug ?? "(undefined)"}</span></div>
        <div className="mb-2"><b>window.location.pathname:</b> <span className="font-mono">{pathname}</span></div>
        <div className="mt-4 flex flex-col gap-2">
          <a href={`/m/${slug}/admin`} className="text-blue-600 underline">Go to /m/{slug}/admin</a>
          <a href={`/m/${slug}`} className="text-blue-600 underline">Go to /m/{slug}</a>
        </div>
      </div>
    </main>
  );
}
