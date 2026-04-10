import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ClipboardList, CheckCircle, AlertTriangle, Sparkles, Palette } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tasks, clients as mockClients, statusLabels, statusColors, serviceTypeLabels } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type ClientWithBrand = Tables<"clients"> & {
  brand_guides: { primary_color: string | null; secondary_color: string | null } | null;
};

const Dashboard = () => {
  const [dbClients, setDbClients] = useState<ClientWithBrand[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("clients")
        .select("*, brand_guides(primary_color, secondary_color)")
        .eq("status", "ACTIVE")
        .order("updated_at", { ascending: false })
        .limit(5);
      if (data) {
        const mapped = data.map((row) => {
          const brandRaw = (row as unknown as { brand_guides: unknown }).brand_guides;
          const brand = Array.isArray(brandRaw) ? brandRaw[0] ?? null : brandRaw;
          return { ...(row as Tables<"clients">), brand_guides: brand } as ClientWithBrand;
        });
        setDbClients(mapped);
      }
    })();
  }, []);

  const activeTasks = tasks.filter(t => t.status !== 'completed').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length;
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground text-sm mt-1">نظرة عامة على أعمالك</p>
        </div>
        <Button asChild>
          <Link to="/clients/new">
            <Users className="h-4 w-4" />
            إضافة جهة جديدة
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="العملاء" value={mockClients.length + dbClients.length} icon={Users} color="bg-primary/10 text-primary" />
        <StatCard title="المهام النشطة" value={activeTasks} icon={ClipboardList} color="bg-warning/10 text-warning" />
        <StatCard title="مكتملة" value={completedTasks} icon={CheckCircle} color="bg-success/10 text-success" />
        <StatCard title="متأخرة" value={overdueTasks} icon={AlertTriangle} color="bg-destructive/10 text-destructive" />
      </div>

      {/* AI feature highlight */}
      <Card className="overflow-hidden bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">توليد محتوى أذكى بدليل الجهة</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                ادخل لصفحة أي جهة واختر تبويب "سياق الذكاء الاصطناعي" لتحصل على Prompt كامل جاهز للنسخ.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/clients">استكشف الجهات</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">آخر المهام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.clientName} • {serviceTypeLabels[task.serviceType]}</p>
                </div>
                <Badge variant="secondary" className={`${statusColors[task.status]} border-0 text-xs shrink-0 mr-3`}>
                  {statusLabels[task.status]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Supabase clients with brand colors */}
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-lg">الجهات والهويات</CardTitle>
            <Link to="/clients" className="text-xs text-primary hover:underline">الكل</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {dbClients.length === 0 ? (
              <div className="text-center py-6">
                <Palette className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">لا توجد جهات بعد</p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link to="/clients/new">إضافة جهة</Link>
                </Button>
              </div>
            ) : (
              dbClients.map((c) => {
                const primary = c.brand_guides?.primary_color ?? "#0F766E";
                return (
                  <Link
                    key={c.id}
                    to={`/clients/${c.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: primary }}
                      >
                        {c.name_ar.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{c.name_ar}</p>
                        <p className="text-xs text-muted-foreground">{c.industry ?? c.name_en ?? ""}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </Badge>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
