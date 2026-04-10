import { Link, useOutletContext, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Mail, Phone, Calendar, Palette, Sparkles } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ContextValue = {
  client: Tables<"clients"> & {
    brand_guides: Tables<"brand_guides"> | null;
  };
};

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default function ClientOverview() {
  const { id } = useParams<{ id: string }>();
  const { client } = useOutletContext<ContextValue>();
  const brand = client.brand_guides;
  const brandReady = Boolean(brand && (brand.primary_color || brand.tone_of_voice));

  const infoItems = [
    { icon: Globe, label: "الموقع", value: client.website, dir: "ltr" as const },
    { icon: Mail, label: "البريد", value: client.contact_email, dir: "ltr" as const },
    { icon: Phone, label: "الهاتف", value: client.contact_phone, dir: "ltr" as const },
    { icon: Calendar, label: "تاريخ الإضافة", value: formatDate(client.created_at), dir: undefined },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">نظرة عامة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {client.description ? (
              <p className="leading-relaxed text-foreground/90">{client.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground">لا يوجد وصف بعد.</p>
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
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="truncate text-sm font-medium" dir={item.dir}>
                        {item.value || "—"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />
              دليل الجهة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {brandReady ? (
              <>
                <div className="flex items-center gap-2">
                  {brand?.primary_color && (
                    <div
                      className="h-10 w-10 rounded-lg border shadow-sm"
                      style={{ backgroundColor: brand.primary_color }}
                      title="اللون الأساسي"
                    />
                  )}
                  {brand?.secondary_color && (
                    <div
                      className="h-10 w-10 rounded-lg border shadow-sm"
                      style={{ backgroundColor: brand.secondary_color }}
                      title="اللون الثانوي"
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  تم إعداد دليل الهوية. يمكنك تعديله أو تصديره كسياق للذكاء الاصطناعي.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                لم يتم إعداد دليل الجهة بعد. ابدأ بإضافة الألوان ونبرة الصوت.
              </p>
            )}
            <Button asChild className="w-full">
              <Link to={`/clients/${id}/brand`}>
                {brandReady ? "تعديل الدليل" : "إنشاء الدليل"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-base font-semibold">سياق للذكاء الاصطناعي</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              صدّر كامل تعريف الجهة كـ Prompt جاهز لـ ChatGPT أو Claude.
            </p>
            <Button asChild className="mt-4 w-full">
              <Link to={`/clients/${id}/ai-context`}>توليد السياق</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
