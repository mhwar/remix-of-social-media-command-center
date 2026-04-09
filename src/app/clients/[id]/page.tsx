import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Globe, Mail, Phone, Calendar, KanbanSquare, Palette, Sparkles } from "lucide-react";
import { formatDateAr } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClientOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      _count: { select: { projects: true } },
      projects: {
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { tasks: true } } },
      },
      brandGuide: true,
    },
  });

  if (!client) notFound();

  const infoItems = [
    { icon: Globe, label: "الموقع", value: client.website, dir: "ltr" },
    { icon: Mail, label: "البريد", value: client.contactEmail, dir: "ltr" },
    { icon: Phone, label: "الهاتف", value: client.contactPhone, dir: "ltr" },
    { icon: Calendar, label: "تاريخ الإضافة", value: formatDateAr(client.createdAt) },
  ];

  const brandReady =
    client.brandGuide &&
    (client.brandGuide.primaryColor ||
      client.brandGuide.toneOfVoice ||
      client.brandGuide.brandPersona);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">نظرة عامة</div>
          </div>
          <div className="card-content space-y-5">
            {client.description ? (
              <p className="leading-relaxed text-foreground/90">
                {client.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                لا يوجد وصف بعد.
              </p>
            )}

            <div className="grid gap-3 border-t pt-5 sm:grid-cols-2">
              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">
                        {item.label}
                      </div>
                      <div
                        className="truncate text-sm font-medium"
                        dir={item.dir as "ltr" | undefined}
                      >
                        {item.value || "—"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex-row items-center justify-between">
            <div className="card-title">آخر المشاريع</div>
            <Link
              href={`/clients/${id}/projects`}
              className="btn btn-outline btn-sm"
            >
              الكل
            </Link>
          </div>
          <div className="card-content">
            {client.projects.length === 0 ? (
              <div className="py-8 text-center">
                <KanbanSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  لا توجد مشاريع بعد
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {client.projects.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {project._count.tasks} مهام
                      </div>
                    </div>
                    <span className="badge border-border bg-muted text-muted-foreground">
                      {project.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Brand guide status card */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="card-title">دليل الجهة</span>
            </div>
          </div>
          <div className="card-content space-y-4">
            {brandReady ? (
              <>
                <div className="flex items-center gap-2">
                  {client.brandGuide?.primaryColor && (
                    <div
                      className="h-10 w-10 rounded-lg border shadow-sm"
                      style={{
                        backgroundColor: client.brandGuide.primaryColor,
                      }}
                      title="اللون الأساسي"
                    />
                  )}
                  {client.brandGuide?.secondaryColor && (
                    <div
                      className="h-10 w-10 rounded-lg border shadow-sm"
                      style={{
                        backgroundColor: client.brandGuide.secondaryColor,
                      }}
                      title="اللون الثانوي"
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  تم إعداد دليل الهوية. يمكنك تعديله أو تصديره كسياق للذكاء
                  الاصطناعي.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                لم يتم إعداد دليل الجهة بعد. ابدأ بإضافة الألوان ونبرة الصوت.
              </p>
            )}
            <Link
              href={`/clients/${id}/brand`}
              className="btn btn-primary w-full"
            >
              {brandReady ? "تعديل الدليل" : "إنشاء الدليل"}
            </Link>
          </div>
        </div>

        {/* AI context shortcut */}
        <div className="card overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-base font-semibold">سياق للذكاء الاصطناعي</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              صدّر كامل تعريف الجهة كـ Prompt جاهز لـ ChatGPT أو Claude.
            </p>
            <Link
              href={`/clients/${id}/ai-context`}
              className="btn btn-primary mt-4 w-full"
            >
              توليد السياق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
