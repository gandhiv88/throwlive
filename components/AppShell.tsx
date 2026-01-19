import Link from "next/link";
import React from "react";

export default function AppShell({
  children,
  title,
  rightSlot,
}: {
  children: React.ReactNode;
  title?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-transparent">
      <div className="w-full max-w-md px-4 py-6 mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Link href="/" className="font-bold text-lg text-blue-700 dark:text-blue-300 select-none flex items-center gap-2">Home</Link>
          <div className="flex-1 text-center font-semibold text-base text-gray-900 dark:text-gray-100">
            {title}
          </div>
          <div>{rightSlot}</div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

export const cardClass =
  "rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900";
