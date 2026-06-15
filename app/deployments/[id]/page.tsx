import { DEPLOYMENTS } from "@/lib/deployments-data";
import DeploymentDetailClient from "./DeploymentDetailClient";

/* Tell Next.js static export which deployment IDs to pre-render */
export function generateStaticParams() {
  return DEPLOYMENTS.map(d => ({ id: d.id }));
}

export default async function DeploymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DeploymentDetailClient id={id} />;
}
