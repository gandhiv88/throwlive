export const dynamic = "force-dynamic";

import AdminClient from "./AdminClient";

export default async function AdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AdminClient slug={slug} />;
}
