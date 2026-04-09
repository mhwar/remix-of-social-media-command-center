import { prisma } from "@/lib/db";
import { KanbanBoard } from "@/components/kanban/kanban-board";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const sp = await searchParams;

  const [tasks, clients] = await Promise.all([
    prisma.task.findMany({
      where: sp.clientId ? { project: { clientId: sp.clientId } } : undefined,
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
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
    }),
    prisma.client.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        nameAr: true,
        brandGuide: { select: { primaryColor: true } },
        projects: {
          select: { id: true, title: true },
          where: { status: { in: ["PLANNING", "ACTIVE"] } },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">المشاريع والمهام</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          لوحة Kanban لإدارة دورة حياة كل قطعة محتوى — من الفكرة إلى النشر
        </p>
      </div>

      <KanbanBoard
        initialTasks={tasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          platform: t.platform,
          contentType: t.contentType,
          dueDate: t.dueDate ? t.dueDate.toISOString() : null,
          assigneeName: t.assignee?.name ?? null,
          clientName: t.project.client.nameAr,
          clientColor: t.project.client.brandGuide?.primaryColor ?? "#0f766e",
          projectTitle: t.project.title,
        }))}
        clients={clients.map((c) => ({
          id: c.id,
          nameAr: c.nameAr,
          primaryColor: c.brandGuide?.primaryColor ?? "#0f766e",
          projects: c.projects,
        }))}
        activeClientId={sp.clientId ?? null}
      />
    </div>
  );
}
