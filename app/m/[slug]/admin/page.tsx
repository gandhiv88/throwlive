export const dynamic = "force-dynamic";

import AdminClient from "./AdminClient";

export default function AdminScorerPage({ params }: { params: { slug: string } }) {
  return <AdminClient slug={params.slug} />;
}
