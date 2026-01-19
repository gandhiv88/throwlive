// app/m/[slug]/debug/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";

export default function DebugPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Debug</h1>
      <pre>{JSON.stringify({ slug }, null, 2)}</pre>

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <Link href={`/m/${slug}`}>Viewer</Link>
        <Link href={`/m/${slug}/admin`}>Admin</Link>
        <Link href={`/m/${slug}/share`}>Share</Link>
      </div>

      <p style={{ marginTop: 16, opacity: 0.7 }}>
        If slug is empty here in production, the dynamic route is not being picked up.
      </p>
    </main>
  );
}
