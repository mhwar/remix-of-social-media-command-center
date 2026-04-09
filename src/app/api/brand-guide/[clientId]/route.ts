import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { brandGuideSchema } from "@/lib/validations";
import { stringifyJson } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const body = await req.json();
  const parsed = brandGuideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const payload = {
    primaryColor: d.primaryColor ?? null,
    secondaryColor: d.secondaryColor ?? null,
    accentColors: stringifyJson(d.accentColors),
    fontArabic: d.fontArabic ?? null,
    fontLatin: d.fontLatin ?? null,
    toneOfVoice: d.toneOfVoice ?? null,
    brandPersona: d.brandPersona ?? null,
    preferredTerms: stringifyJson(d.preferredTerms),
    forbiddenTerms: stringifyJson(d.forbiddenTerms),
    languages: stringifyJson(d.languages),
    targetAudience: d.targetAudience ?? null,
    personas: stringifyJson(d.personas),
    platforms: stringifyJson(d.platforms),
    postingSchedule: stringifyJson(d.postingSchedule),
    mediaPolicy: d.mediaPolicy ?? null,
    legalNotes: d.legalNotes ?? null,
    hashtagStrategy: d.hashtagStrategy ?? null,
    sampleContent: stringifyJson(d.sampleContent),
    referenceLinks: stringifyJson(d.referenceLinks),
  };

  const existing = await prisma.brandGuide.findUnique({ where: { clientId } });
  const brandGuide = existing
    ? await prisma.brandGuide.update({ where: { clientId }, data: payload })
    : await prisma.brandGuide.create({ data: { clientId, ...payload } });

  return NextResponse.json(brandGuide);
}
