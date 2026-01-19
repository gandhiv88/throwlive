"use client";

import Header from '../../../components/Header';
import { useParams } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";

export default function SharePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0] ?? "";
  const viewerUrl = `/m/${slug}`;
  const adminUrl = `/m/${slug}/admin`;
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(text: string, label: string) {
    navigator.clipboard.writeText(window.location.origin + text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-bold mb-4">Share Match: {params.slug}</h2>
        <div className="mb-6 text-center text-gray-700 dark:text-gray-300">
          <div className="mb-2">
            <span className="font-semibold">Viewer Link:</span>
            <span className="ml-2 font-mono text-blue-700 dark:text-blue-300">{viewerUrl}</span>
          </div>
          <button
            type="button"
            className="w-full rounded bg-blue-600 text-white px-4 py-2 font-semibold shadow mb-4"
            onClick={() => handleCopy(viewerUrl, "viewer")}
          >
            Copy Viewer Link
          </button>
          <div className="mb-2">
            <span className="font-semibold">Admin Link:</span>
            <span className="ml-2 font-mono text-pink-700 dark:text-pink-300">{adminUrl}</span>
          </div>
          <button
            type="button"
            className="w-full rounded bg-pink-600 text-white px-4 py-2 font-semibold shadow mb-4"
            onClick={() => handleCopy(adminUrl, "admin")}
          >
            Copy Admin Link
          </button>
          {copied && (
            <div className="text-green-600 dark:text-green-400 text-sm mt-2">Copied {copied} link!</div>
          )}
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded p-4 text-sm text-center">
          <strong>Note:</strong> The admin token is stored only on the scorer device. To score, use the device that created the match.
        </div>
      </main>
    </div>
  );
}
