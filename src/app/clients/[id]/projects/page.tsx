import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { KanbanSquare, CalendarClock } from "lucide-react";
import { formatDateAr } from "@/lib/utils";
import { NewProjectButton } from "@/components/clients/new-project-button";
import { PROJECT_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ClientProjectsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projects: {
        orderBy: { updatedAt: "desc" },
        include: {
          _count: { select: { tasks: true } },
          tasks: {
            select: { status: true },
          },
        },
      },
    },
  });
  if (!client) notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">مشاريع الجهة</h2>
          <p className="text-xs text-muted-foreground">
            {client.projects.length} مشروع
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/projects?clientId=${id}`}
            className="btn btn-outline btn-sm"
          >
            <KanbanSquare className="h-3.5 w-3.5" />
            عرض Kanban
          </Link>
          <NewProjectButton clientId={id} />
        </div>
      </div>

      {client.projects.length === 0 ? (
        <div className="card p-12 text-center">
          <KanbanSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-3 text-base font-semibold">لا توجد مشاريع</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            ابدأ بإنشاء مشروع لتنظيم محتوى الجهة.
          </p>
          <div className="mt-5 inline-block">
            <NewProjectButton clientId={id} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {client.projects.map((project) => {
            const published = project.tasks.filter(
              (t) => t.status === "PUBLISHED"
            ).length;
            const status = PROJECT_STATUSES.find(
              (s) => s.value === project.status
            );
            const progress =
              project._count.tasks > 0
                ? Math.round((published / project._count.tasks) * 100)
                : 0;
            return (
              <div key={project.id} className="card p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{project.title}</h3>
                    {project.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <span className="badge border-border bg-muted text-muted-foreground">
                    {status?.labelAr}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>التقدم</span>
                    <span>
                      {published} / {project._count.tasks}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {project.endDate && (
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <CalendarClock className="h-3 w-3" />
                    ينتهي {formatDateAr(project.endDate)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
