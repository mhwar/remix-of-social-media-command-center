import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clientSchema } from "@/lib/validations";

export async function GET() {
  const clients = await prisma.client.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      brandGuide: { select: { primaryColor: true } },
      _count: { select: { projects: true } },
    },
  });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = clientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const client = await prisma.client.create({
    data: {
      nameAr: data.nameAr,
      nameEn: data.nameEn || null,
      industry: data.industry || null,
      description: data.description || null,
      website: data.website || null,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      logoUrl: data.logoUrl || null,
      status: data.status,
      brandGuide: { create: {} }, // Empty brand guide created automatically
    },
  });

  return NextResponse.json(client, { status: 201 });
}
