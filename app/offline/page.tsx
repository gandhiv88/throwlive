export const dynamic = "force-static";
import AppShell, { cardClass } from "@/components/AppShell";

export default function OfflinePage() {
  return (
    <AppShell>
      <div className={cardClass + " max-w-md w-full text-center"}>
        <svg width="64" height="64" fill="none" className="mx-auto mb-6" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="32" fill="#0b1220" opacity="0.08"/>
          <path d="M20 44h24M32 20v16M32 36v8" stroke="#0b1220" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Offline</h1>
        <p className="text-gray-300 mb-6">
          You are currently offline.<br />
          Please check your internet connection.
        </p>
        <p className="text-xs text-gray-500">
          ThrowLive works best with an active connection.
        </p>
      </div>
    </AppShell>
  );
}
