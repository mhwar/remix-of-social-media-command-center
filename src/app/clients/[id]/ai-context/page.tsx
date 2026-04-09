import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AiContextViewer } from "@/components/ai/ai-context-viewer";

export const dynamic = "force-dynamic";

export default async function AiContextPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { brandGuide: true },
  });
  if (!client) notFound();

  return (
    <AiContextViewer
      client={{
        nameAr: client.nameAr,
        nameEn: client.nameEn,
        industry: client.industry,
        description: client.description,
        website: client.website,
        brandGuide: client.brandGuide,
      }}
    />
  );
}
