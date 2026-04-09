import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BrandGuideEditor } from "@/components/brand/brand-guide-editor";
import { parseJson } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BrandGuidePage({
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

  const g = client.brandGuide;
  const initial = {
    primaryColor: g?.primaryColor ?? "#0f766e",
    secondaryColor: g?.secondaryColor ?? "#f59e0b",
    accentColors: parseJson<string[]>(g?.accentColors, []),
    fontArabic: g?.fontArabic ?? "",
    fontLatin: g?.fontLatin ?? "",
    toneOfVoice: g?.toneOfVoice ?? "",
    brandPersona: g?.brandPersona ?? "",
    preferredTerms: parseJson<string[]>(g?.preferredTerms, []),
    forbiddenTerms: parseJson<string[]>(g?.forbiddenTerms, []),
    languages: parseJson<string[]>(g?.languages, ["ar"]),
    targetAudience: g?.targetAudience ?? "",
    platforms: parseJson<string[]>(g?.platforms, []),
    mediaPolicy: g?.mediaPolicy ?? "",
    legalNotes: g?.legalNotes ?? "",
    hashtagStrategy: g?.hashtagStrategy ?? "",
    sampleContent: parseJson<string[]>(g?.sampleContent, []),
    referenceLinks: parseJson<string[]>(g?.referenceLinks, []),
  };

  return (
    <BrandGuideEditor
      clientId={id}
      clientNameAr={client.nameAr}
      initial={initial}
    />
  );
}
