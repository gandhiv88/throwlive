// app/m/[slug]/page.tsx
export const dynamic = "force-dynamic";

import ViewerClient from "./ViewerClient";

export default async function ViewerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ViewerClient slug={slug} />;
}
