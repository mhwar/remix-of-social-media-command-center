import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clientSchema } from "@/lib/validations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      brandGuide: true,
      projects: { include: { _count: { select: { tasks: true } } } },
    },
  });
  if (!client) {
    return NextResponse.json({ error: "الجهة غير موجودة" }, { status: 404 });
  }
  return NextResponse.json(client);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = clientSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = await prisma.client.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(client);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
