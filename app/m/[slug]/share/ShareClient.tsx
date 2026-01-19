"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function ShareClient({ slug }: { slug: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  const viewerUrl = `${window.location.origin}/m/${slug}`;
  const adminUrl = `${window.location.origin}/m/${slug}/admin`;

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1200);
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <ThemeToggle />
          <span className="text-xs text-gray-400">Share Match</span>
        </div>
        <div className="mb-6">
          <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Viewer Link</div>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-100"
              value={viewerUrl}
              readOnly
              onFocus={e => e.target.select()}
            />
            <button
              className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold"
              onClick={() => copy(viewerUrl, "viewer")}
            >Copy</button>
          </div>
          {copied === "viewer" && <span className="text-green-600 text-xs">Copied!</span>}
        </div>
        <div className="mb-6">
          <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Admin Link</div>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-100"
              value={adminUrl}
              readOnly
              onFocus={e => e.target.select()}
            />
            <button
              className="px-2 py-1 rounded bg-pink-600 text-white text-xs font-semibold"
              onClick={() => copy(adminUrl, "admin")}
            >Copy</button>
          </div>
          {copied === "admin" && <span className="text-green-600 text-xs">Copied!</span>}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          <b>Note:</b> The admin link only works on the scorer device (token stored in localStorage).
        </div>
      </div>
    </main>
  );
}
