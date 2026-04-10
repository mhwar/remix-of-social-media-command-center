import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Sparkles, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { CLIENT_STATUSES } from "@/lib/brand-constants";

type ClientWithBrand = Tables<"clients"> & {
  brand_guides: Tables<"brand_guides"> | null;
  project_count: number;
};

const Clients = () => {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<ClientWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*, brand_guides(primary_color, secondary_color), projects(id)")
        .order("updated_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        setError(
          "لم يتم العثور على جدول clients. تأكد من تشغيل migration الخاص بـ supabase/migrations/."
        );
        setLoading(false);
        return;
      }

      const mapped: ClientWithBrand[] = (data ?? []).map((row) => {
        const brandRaw = (row as unknown as { brand_guides: unknown }).brand_guides;
        const brand = Array.isArray(brandRaw)
          ? (brandRaw[0] as Tables<"brand_guides"> | undefined) ?? null
          : (brandRaw as Tables<"brand_guides"> | null);
        const projects = (row as unknown as { projects: unknown[] }).projects;
        return {
          ...(row as Tables<"clients">),
          brand_guides: brand,
          project_count: Array.isArray(projects) ? projects.length : 0,
        };
      });
      setClients(mapped);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.name_ar.includes(search) ||
      (c.name_en ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (c.industry ?? "").includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">العملاء والجهات</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {clients.length} جهة — كل جهة لها دليل هوية وسياق AI جاهز
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
            />
          </div>
          <Button asChild>
            <Link to="/clients/new">
              <Plus className="h-4 w-4" />
              جهة جديدة
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold mb-1">⚠️ تحذير: الجداول غير موجودة</div>
          <p>{error}</p>
          <p className="mt-2 text-xs">
            لتفعيل الميزة، افتح Supabase SQL Editor ونفّذ ملف الـ migration في
            <code className="mx-1 rounded bg-amber-100 px-1">supabase/migrations/20260410120000_content_studio_schema.sql</code>.
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">جارٍ التحميل...</div>
      ) : filtered.length === 0 && !error ? (
        <Card className="p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">لا توجد جهات بعد</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            ابدأ بإضافة أول جهة عميل وأنشئ دليل الهوية الخاص بها.
          </p>
          <Button asChild className="mt-6">
            <Link to="/clients/new">
              <Plus className="h-4 w-4" />
              إضافة جهة
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => {
            const status = CLIENT_STATUSES.find((s) => s.value === client.status);
            const primary = client.brand_guides?.primary_color ?? "#0F766E";
            const secondary = client.brand_guides?.secondary_color ?? "#F59E0B";
            return (
              <Link key={client.id} to={`/clients/${client.id}`} className="group block">
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div
                    className="h-20 w-full"
                    style={{
                      background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
                    }}
                  />
                  <CardContent className="px-5 pb-5">
                    <div
                      className="-mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-card text-xl font-bold text-white shadow-sm"
                      style={{ backgroundColor: primary }}
                    >
                      {client.name_ar.charAt(0)}
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{client.name_ar}</h3>
                        {client.name_en && (
                          <p className="truncate text-xs text-muted-foreground" dir="ltr">
                            {client.name_en}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {status?.labelAr}
                      </Badge>
                    </div>
                    {client.industry && (
                      <p className="mt-2 text-xs text-muted-foreground">{client.industry}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                      <span>{client.project_count} مشاريع</span>
                      <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        <Sparkles className="h-3 w-3" />
                        AI Context
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Clients;
