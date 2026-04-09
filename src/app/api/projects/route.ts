import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { projectSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  const projects = await prisma.project.findMany({
    where: clientId ? { clientId } : undefined,
    orderBy: { updatedAt: "desc" },
    include: {
      client: {
        select: {
          id: true,
          nameAr: true,
          brandGuide: { select: { primaryColor: true } },
        },
      },
      _count: { select: { tasks: true } },
    },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const project = await prisma.project.create({
    data: {
      clientId: d.clientId,
      title: d.title,
      description: d.description || null,
      status: d.status,
      startDate: d.startDate ? new Date(d.startDate) : null,
      endDate: d.endDate ? new Date(d.endDate) : null,
    },
  });
  return NextResponse.json(project, { status: 201 });
}
