import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getToneLabel } from "@/lib/brand-constants";

type Props = {
  clientNameAr: string;
  primary: string;
  secondary: string;
  accents: string[];
  fontArabic: string;
  brandPersona: string;
  toneOfVoice: string;
};

export function BrandPreview({
  clientNameAr,
  primary,
  secondary,
  accents,
  fontArabic,
  brandPersona,
  toneOfVoice,
}: Props) {
  const tone = getToneLabel(toneOfVoice).split("—")[0]?.trim() || "—";

  return (
    <Card className="overflow-hidden">
      <div className="border-b bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground">
        معاينة مباشرة
      </div>

      <div
        className="relative p-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${primary || "#0F766E"} 0%, ${secondary || "#F59E0B"} 100%)`,
          fontFamily: fontArabic || undefined,
        }}
      >
        <div className="text-[11px] uppercase tracking-widest opacity-90">
          معاينة البطاقة
        </div>
        <h3 className="mt-1 text-xl font-bold">{clientNameAr || "اسم الجهة"}</h3>
        <p className="mt-2 text-xs leading-relaxed opacity-95">
          {brandPersona || "سيظهر هنا وصف شخصية العلامة التجارية..."}
        </p>
        <div className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] backdrop-blur-sm">
          {tone}
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div>
          <div className="mb-2 text-[11px] font-semibold text-muted-foreground">
            لوحة الألوان
          </div>
          <div className="flex flex-wrap gap-2">
            <ColorSwatch color={primary || "#0F766E"} label="أساسي" />
            <ColorSwatch color={secondary || "#F59E0B"} label="ثانوي" />
            {accents.slice(0, 4).map((c, i) => (
              <ColorSwatch key={i} color={c} label={`إضافي ${i + 1}`} />
            ))}
          </div>
        </div>

        {fontArabic && (
          <div className="border-t pt-3">
            <div className="mb-2 text-[11px] font-semibold text-muted-foreground">
              الخط
            </div>
            <div
              className="rounded-md bg-muted/40 p-3 text-base"
              style={{ fontFamily: fontArabic }}
            >
              هذا نموذج لشكل النص بخط الجهة
            </div>
            <Badge variant="secondary" className="mt-2 text-[10px]">
              {fontArabic}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="h-10 w-10 rounded-md border shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div className="mt-1 text-[9px] text-muted-foreground">{label}</div>
    </div>
  );
}
