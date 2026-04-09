import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { taskSchema } from "@/lib/validations";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = taskSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(d.title !== undefined && { title: d.title }),
      ...(d.description !== undefined && { description: d.description }),
      ...(d.status !== undefined && { status: d.status }),
      ...(d.priority !== undefined && { priority: d.priority }),
      ...(d.assigneeId !== undefined && { assigneeId: d.assigneeId }),
      ...(d.platform !== undefined && { platform: d.platform }),
      ...(d.contentType !== undefined && { contentType: d.contentType }),
      ...(d.contentBody !== undefined && { contentBody: d.contentBody }),
      ...(d.dueDate !== undefined && {
        dueDate: d.dueDate ? new Date(d.dueDate) : null,
      }),
      ...(d.publishDate !== undefined && {
        publishDate: d.publishDate ? new Date(d.publishDate) : null,
      }),
    },
  });
  return NextResponse.json(task);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
