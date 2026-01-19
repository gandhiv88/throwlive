export const dynamic = "force-dynamic";

import ShareClient from "./ShareClient";

export default async function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ShareClient slug={slug} />;
}
