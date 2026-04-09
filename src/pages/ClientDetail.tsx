import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { ArrowRight, Info, Palette, Sparkles, FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { CLIENT_STATUSES } from "@/lib/brand-constants";
import { cn } from "@/lib/utils";

type Client = Tables<"clients_brands"> & {
  brand_guides: Tables<"brand_guides"> | null;
};

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("clients_brands")
        .select("*, brand_guides(*)")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setClient(null);
      } else {
        const brand = Array.isArray(data.brand_guides)
          ? data.brand_guides[0] ?? null
          : (data.brand_guides as Tables<"brand_guides"> | null);
        setClient({ ...data, brand_guides: brand } as Client);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, location.pathname]);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">جارٍ التحميل...</div>;
  }
  if (!client) {
    return (
      <div className="space-y-4">
        <Link to="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-4 w-4" />
          العودة للعملاء
        </Link>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="font-semibold">الجهة غير موجودة</h3>
          <p className="text-sm text-muted-foreground mt-1">
            ربما تم حذفها أو المعرّف غير صحيح.
          </p>
        </div>
      </div>
    );
  }

  const primary = client.brand_guides?.primary_color || "#0F766E";
  const secondary = client.brand_guides?.secondary_color || "#F59E0B";
  const status = CLIENT_STATUSES.find((s) => s.value === client.status);

  const tabs = [
    { to: `/clients/${id}`, labelAr: "نظرة عامة", icon: Info, end: true },
    { to: `/clients/${id}/brand`, labelAr: "دليل الجهة", icon: Palette, end: false },
    { to: `/clients/${id}/projects`, labelAr: "المشاريع", icon: FolderKanban, end: false },
    {
      to: `/clients/${id}/ai-context`,
      labelAr: "سياق الذكاء الاصطناعي",
      icon: Sparkles,
      end: false,
      highlight: true,
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        to="/clients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        العودة للعملاء
      </Link>

      {/* Header */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div
          className="h-24 w-full"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
          }}
        />
        <div className="flex flex-wrap items-start gap-4 p-6">
          <div
            className="-mt-14 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-sm"
            style={{ backgroundColor: primary }}
          >
            {client.name_ar.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{client.name_ar}</h1>
              <Badge variant="secondary">{status?.labelAr}</Badge>
            </div>
            {client.name_en && (
              <p className="mt-0.5 text-sm text-muted-foreground">{client.name_en}</p>
            )}
            {client.industry && (
              <p className="mt-1 text-sm text-muted-foreground">{client.industry}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.end
              ? location.pathname === tab.to
              : location.pathname.startsWith(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                  tab.highlight && !active && "text-primary/80"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.labelAr}
                {tab.highlight && !active && (
                  <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    جديد
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <Outlet context={{ client }} />
    </div>
  );
}
