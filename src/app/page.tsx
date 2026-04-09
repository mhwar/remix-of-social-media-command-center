import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Users,
  KanbanSquare,
  CalendarClock,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { getTaskStatus, getPlatformLabel } from "@/lib/constants";
import { formatDateAr } from "@/lib/utils";

async function getStats() {
  const [clients, activeProjects, tasksInProgress, publishedThisMonth] =
    await Promise.all([
      prisma.client.count({ where: { status: "ACTIVE" } }),
      prisma.project.count({ where: { status: "ACTIVE" } }),
      prisma.task.count({
        where: { status: { in: ["WRITING", "REVIEW"] } },
      }),
      prisma.task.count({
        where: {
          status: "PUBLISHED",
          updatedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

  return { clients, activeProjects, tasksInProgress, publishedThisMonth };
}

async function getRecentTasks() {
  return prisma.task.findMany({
    take: 6,
    orderBy: { updatedAt: "desc" },
    include: {
      project: { include: { client: true } },
      assignee: true,
    },
  });
}

async function getRecentClients() {
  return prisma.client.findMany({
    take: 4,
    orderBy: { updatedAt: "desc" },
    include: {
      brandGuide: { select: { primaryColor: true } },
      _count: { select: { projects: true } },
    },
  });
}

export default async function DashboardPage() {
  const [stats, tasks, clients] = await Promise.all([
    getStats(),
    getRecentTasks(),
    getRecentClients(),
  ]);

  const statCards = [
    {
      label: "الجهات النشطة",
      value: stats.clients,
      icon: Users,
      href: "/clients",
      tint: "bg-teal-50 text-teal-700",
    },
    {
      label: "المشاريع الجارية",
      value: stats.activeProjects,
      icon: KanbanSquare,
      href: "/projects",
      tint: "bg-blue-50 text-blue-700",
    },
    {
      label: "مهام قيد التنفيذ",
      value: stats.tasksInProgress,
      icon: CalendarClock,
      href: "/projects",
      tint: "bg-amber-50 text-amber-700",
    },
    {
      label: "منشور هذا الشهر",
      value: stats.publishedThisMonth,
      icon: CheckCircle2,
      href: "/calendar",
      tint: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            نظرة شاملة على الجهات والمشاريع والمحتوى
          </p>
        </div>
        <Link href="/clients/new" className="btn btn-primary">
          <Users className="h-4 w-4" />
          إضافة جهة جديدة
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tint}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold">{card.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {card.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent tasks */}
        <div className="card lg:col-span-2">
          <div className="card-header flex-row items-center justify-between">
            <div>
              <div className="card-title">أحدث المهام</div>
              <p className="mt-1 text-xs text-muted-foreground">
                آخر النشاطات على مهام المحتوى
              </p>
            </div>
            <Link href="/projects" className="btn btn-outline btn-sm">
              كل المهام
            </Link>
          </div>
          <div className="card-content">
            {tasks.length === 0 ? (
              <EmptyState text="لا توجد مهام بعد. ابدأ بإنشاء جهة ومشروع." />
            ) : (
              <ul className="divide-y">
                {tasks.map((task) => {
                  const status = getTaskStatus(task.status);
                  return (
                    <li key={task.id} className="flex items-center gap-3 py-3">
                      <span
                        className={`badge border ${status.color}`}
                      >
                        {status.labelAr}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {task.title}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{task.project.client.nameAr}</span>
                          {task.platform && (
                            <>
                              <span>·</span>
                              <span>{getPlatformLabel(task.platform)}</span>
                            </>
                          )}
                          {task.assignee && (
                            <>
                              <span>·</span>
                              <span>{task.assignee.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateAr(task.updatedAt)}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Recent clients */}
        <div className="card">
          <div className="card-header flex-row items-center justify-between">
            <div className="card-title">الجهات</div>
            <Link href="/clients" className="btn btn-outline btn-sm">
              الكل
            </Link>
          </div>
          <div className="card-content space-y-3">
            {clients.length === 0 ? (
              <EmptyState text="لا توجد جهات بعد." />
            ) : (
              clients.map((c) => (
                <Link
                  key={c.id}
                  href={`/clients/${c.id}`}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{
                      backgroundColor:
                        c.brandGuide?.primaryColor ?? "#0f766e",
                    }}
                  >
                    {c.nameAr.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {c.nameAr}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c._count.projects} مشاريع
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI feature highlight */}
      <div className="card overflow-hidden bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                توليد محتوى أذكى بدليل الجهة
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                ادخل لصفحة أي جهة واختر تبويب "سياق الذكاء الاصطناعي" لتحصل على
                Prompt كامل جاهز للنسخ.
              </p>
            </div>
          </div>
          <Link href="/clients" className="btn btn-primary">
            استكشف الآن
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
