export const dynamic = "force-dynamic";

import React from "react";

export default function SlugLayout({ children, params }: { children: React.ReactNode; params: { slug?: string } }) {
  if (!params?.slug) {
    return (
      <main className="min-h-screen bg-yellow-50 dark:bg-yellow-900 flex items-center justify-center">
        <pre className="bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded p-4 text-left text-xs max-w-lg overflow-x-auto">
          {JSON.stringify({ params, pathname: typeof window !== "undefined" ? window.location.pathname : null }, null, 2)}
        </pre>
      </main>
    );
  }
  return <>{children}</>;
}
