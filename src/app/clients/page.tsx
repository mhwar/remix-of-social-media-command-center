import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus, Users, Sparkles, Globe, Mail } from "lucide-react";
import { CLIENT_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getClients() {
  return prisma.client.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      brandGuide: { select: { primaryColor: true, secondaryColor: true } },
      _count: { select: { projects: true } },
    },
  });
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الجهات والعملاء</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            كل جهة بدليلها الخاص وقابلة للتصدير كسياق جاهز للذكاء الاصطناعي
          </p>
        </div>
        <Link href="/clients/new" className="btn btn-primary">
          <Plus className="h-4 w-4" />
          جهة جديدة
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">لا توجد جهات بعد</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            ابدأ بإضافة أول جهة عميل وأنشئ دليل الهوية الخاص بها.
          </p>
          <Link href="/clients/new" className="btn btn-primary mt-6 inline-flex">
            <Plus className="h-4 w-4" />
            إضافة جهة
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => {
            const status = CLIENT_STATUSES.find(
              (s) => s.value === client.status
            );
            const primary = client.brandGuide?.primaryColor ?? "#0f766e";
            const secondary = client.brandGuide?.secondaryColor ?? "#f59e0b";

            return (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="card group relative overflow-hidden transition-all hover:shadow-lg"
              >
                {/* Colorful header */}
                <div
                  className="h-20 w-full"
                  style={{
                    background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
                  }}
                />
                <div className="px-5 pb-5">
                  <div
                    className="-mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-card text-xl font-bold text-white shadow-sm"
                    style={{ backgroundColor: primary }}
                  >
                    {client.nameAr.charAt(0)}
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{client.nameAr}</h3>
                      {client.nameEn && (
                        <p className="truncate text-xs text-muted-foreground">
                          {client.nameEn}
                        </p>
                      )}
                    </div>
                    <span className="badge border-emerald-300 bg-emerald-50 text-emerald-700">
                      {status?.labelAr}
                    </span>
                  </div>

                  {client.industry && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {client.industry}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                    <span>{client._count.projects} مشاريع</span>
                    <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      <Sparkles className="h-3 w-3" />
                      AI Context
                    </span>
                  </div>

                  {(client.website || client.contactEmail) && (
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                      {client.website && (
                        <span className="inline-flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          موقع
                        </span>
                      )}
                      {client.contactEmail && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          بريد
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
