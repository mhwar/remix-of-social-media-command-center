import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { taskSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  const projectId = searchParams.get("projectId");

  const tasks = await prisma.task.findMany({
    where: {
      ...(projectId ? { projectId } : {}),
      ...(clientId ? { project: { clientId } } : {}),
    },
    orderBy: [{ status: "asc" }, { order: "asc" }, { updatedAt: "desc" }],
    include: {
      project: {
        include: {
          client: {
            select: {
              id: true,
              nameAr: true,
              brandGuide: { select: { primaryColor: true } },
            },
          },
        },
      },
      assignee: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = taskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const task = await prisma.task.create({
    data: {
      projectId: d.projectId,
      title: d.title,
      description: d.description || null,
      status: d.status,
      priority: d.priority,
      assigneeId: d.assigneeId || null,
      dueDate: d.dueDate ? new Date(d.dueDate) : null,
      publishDate: d.publishDate ? new Date(d.publishDate) : null,
      platform: d.platform || null,
      contentType: d.contentType || null,
      contentBody: d.contentBody || null,
    },
    include: {
      project: { include: { client: true } },
      assignee: true,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
