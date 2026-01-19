import Link from "next/link";
import React from "react";

export const cardClass =
  "rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-sm";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-md px-4 py-6 mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-blue-300 select-none"
          >
            <span role="img" aria-label="volleyball">🏐</span> ThrowLive
          </Link>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
