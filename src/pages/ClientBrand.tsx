import { useEffect, useState, useTransition } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  MessageSquare,
  Users2,
  Shield,
  FileCheck2,
  Loader2,
  Save,
  Check,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, Json } from "@/integrations/supabase/types";
import { TONE_OF_VOICE, PLATFORMS } from "@/lib/brand-constants";
import { TagsInput } from "@/components/brand/TagsInput";
import { ColorField } from "@/components/brand/ColorField";
import { BrandPreview } from "@/components/brand/BrandPreview";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ContextValue = {
  client: Tables<"clients"> & {
    brand_guides: Tables<"brand_guides"> | null;
  };
};

type FormValues = {
  primary_color: string;
  secondary_color: string;
  accent_colors: string[];
  font_arabic: string;
  font_latin: string;
  tone_of_voice: string;
  brand_persona: string;
  preferred_terms: string[];
  forbidden_terms: string[];
  languages: string[];
  target_audience: string;
  platforms: string[];
  media_policy: string;
  legal_notes: string;
  hashtag_strategy: string;
  sample_content: string[];
  reference_links: string[];
};

function toArray(value: Json | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v));
  return [];
}

function valuesFromBrand(brand: Tables<"brand_guides"> | null): FormValues {
  return {
    primary_color: brand?.primary_color ?? "#0F766E",
    secondary_color: brand?.secondary_color ?? "#F59E0B",
    accent_colors: toArray(brand?.accent_colors),
    font_arabic: brand?.font_arabic ?? "",
    font_latin: brand?.font_latin ?? "",
    tone_of_voice: brand?.tone_of_voice ?? "",
    brand_persona: brand?.brand_persona ?? "",
    preferred_terms: toArray(brand?.preferred_terms),
    forbidden_terms: toArray(brand?.forbidden_terms),
    languages: toArray(brand?.languages).length ? toArray(brand?.languages) : ["ar"],
    target_audience: brand?.target_audience ?? "",
    platforms: toArray(brand?.platforms),
    media_policy: brand?.media_policy ?? "",
    legal_notes: brand?.legal_notes ?? "",
    hashtag_strategy: brand?.hashtag_strategy ?? "",
    sample_content: toArray(brand?.sample_content),
    reference_links: toArray(brand?.reference_links),
  };
}

export default function ClientBrand() {
  const { id } = useParams<{ id: string }>();
  const { client } = useOutletContext<ContextValue>();
  const [values, setValues] = useState<FormValues>(() => valuesFromBrand(client.brand_guides));
  const [saved, setSaved] = useState(false);
  const [saving, startSaving] = useTransition();

  // Reset form when client data changes
  useEffect(() => {
    setValues(valuesFromBrand(client.brand_guides));
  }, [client.brand_guides]);

  function update<K extends keyof FormValues>(key: K, val: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  }

  function togglePlatform(platform: string) {
    setSaved(false);
    setValues((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  }

  function save() {
    if (!id) return;
    startSaving(async () => {
      const payload = {
        client_id: id,
        primary_color: values.primary_color || null,
        secondary_color: values.secondary_color || null,
        accent_colors: values.accent_colors as unknown as Json,
        font_arabic: values.font_arabic || null,
        font_latin: values.font_latin || null,
        tone_of_voice: values.tone_of_voice || null,
        brand_persona: values.brand_persona || null,
        preferred_terms: values.preferred_terms as unknown as Json,
        forbidden_terms: values.forbidden_terms as unknown as Json,
        languages: values.languages as unknown as Json,
        target_audience: values.target_audience || null,
        platforms: values.platforms as unknown as Json,
        media_policy: values.media_policy || null,
        legal_notes: values.legal_notes || null,
        hashtag_strategy: values.hashtag_strategy || null,
        sample_content: values.sample_content as unknown as Json,
        reference_links: values.reference_links as unknown as Json,
      };

      const { error } = await supabase
        .from("brand_guides")
        .upsert(payload, { onConflict: "client_id" });

      if (error) {
        toast.error("حدث خطأ أثناء الحفظ: " + error.message);
        return;
      }
      setSaved(true);
      toast.success("تم حفظ دليل الجهة");
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-5 xl:col-span-2">
        {/* Visual identity */}
        <Section
          icon={Palette}
          title="الهوية البصرية"
          description="الألوان والخطوط التي تمثل هوية الجهة"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              label="اللون الأساسي"
              value={values.primary_color}
              onChange={(v) => update("primary_color", v)}
            />
            <ColorField
              label="اللون الثانوي"
              value={values.secondary_color}
              onChange={(v) => update("secondary_color", v)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>ألوان إضافية (Accents)</Label>
            <TagsInput
              value={values.accent_colors}
              onChange={(v) => update("accent_colors", v)}
              placeholder="#1E293B"
            />
            <p className="text-[11px] text-muted-foreground">
              أدخل كود اللون بصيغة HEX (مثال: #1E293B)
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>الخط العربي</Label>
              <Input
                value={values.font_arabic}
                onChange={(e) => update("font_arabic", e.target.value)}
                placeholder="IBM Plex Sans Arabic، Cairo، Tajawal..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>الخط اللاتيني</Label>
              <Input
                value={values.font_latin}
                onChange={(e) => update("font_latin", e.target.value)}
                placeholder="Inter، Poppins..."
              />
            </div>
          </div>
        </Section>

        {/* Voice */}
        <Section
          icon={MessageSquare}
          title="نبرة الصوت والشخصية"
          description="كيف تتحدث الجهة مع جمهورها"
        >
          <div className="space-y-1.5">
            <Label>نبرة الصوت</Label>
            <Select
              value={values.tone_of_voice}
              onValueChange={(v) => update("tone_of_voice", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر..." />
              </SelectTrigger>
              <SelectContent>
                {TONE_OF_VOICE.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.labelAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>شخصية العلامة (Brand Persona)</Label>
            <Textarea
              rows={3}
              value={values.brand_persona}
              onChange={(e) => update("brand_persona", e.target.value)}
              placeholder="مثال: نتحدث كخبير تقني ودود يبسّط المفاهيم المعقدة..."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>مصطلحات مفضلة ✓</Label>
              <TagsInput
                value={values.preferred_terms}
                onChange={(v) => update("preferred_terms", v)}
                placeholder="التحول الرقمي..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>مصطلحات محظورة ✗</Label>
              <TagsInput
                value={values.forbidden_terms}
                onChange={(v) => update("forbidden_terms", v)}
                placeholder="رخيص..."
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>اللغات المعتمدة</Label>
            <TagsInput
              value={values.languages}
              onChange={(v) => update("languages", v)}
              placeholder="ar, en..."
            />
          </div>
        </Section>

        {/* Audience */}
        <Section
          icon={Users2}
          title="الجمهور المستهدف والمنصات"
          description="لمن نكتب وأين ننشر"
        >
          <div className="space-y-1.5">
            <Label>وصف الجمهور المستهدف</Label>
            <Textarea
              rows={3}
              value={values.target_audience}
              onChange={(e) => update("target_audience", e.target.value)}
              placeholder="الفئة العمرية، الاهتمامات، الموقع الجغرافي، المهنة..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>المنصات النشطة</Label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const active = values.platforms.includes(p.value);
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => togglePlatform(p.value)}
                    className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    )}
                  >
                    {p.labelAr}
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Media policy */}
        <Section
          icon={Shield}
          title="السياسة الإعلامية"
          description="القواعد التي يجب الالتزام بها في كل محتوى"
        >
          <div className="space-y-1.5">
            <Label>السياسة الإعلامية</Label>
            <Textarea
              rows={4}
              value={values.media_policy}
              onChange={(e) => update("media_policy", e.target.value)}
              placeholder="القواعد العامة، المحظورات، اللغة المسموحة..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>ملاحظات قانونية</Label>
            <Textarea
              rows={2}
              value={values.legal_notes}
              onChange={(e) => update("legal_notes", e.target.value)}
              placeholder="حقوق الصور، ذكر العملاء، الإقرارات القانونية..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>استراتيجية الهاشتاق</Label>
            <Textarea
              rows={2}
              value={values.hashtag_strategy}
              onChange={(e) => update("hashtag_strategy", e.target.value)}
              placeholder="الهاشتاقات الثابتة، عدد الهاشتاقات لكل منشور..."
            />
          </div>
        </Section>

        {/* Examples */}
        <Section
          icon={FileCheck2}
          title="أمثلة ومراجع"
          description="عينات من المحتوى المعتمد ومصادر مرجعية"
        >
          <div className="space-y-1.5">
            <Label>أمثلة محتوى مقبولة</Label>
            <TagsInput
              value={values.sample_content}
              onChange={(v) => update("sample_content", v)}
              placeholder="أضف نص منشور مقبول..."
            />
            <p className="text-[11px] text-muted-foreground">
              كل عنصر = مثال منشور كامل
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>روابط مرجعية</Label>
            <TagsInput
              value={values.reference_links}
              onChange={(v) => update("reference_links", v)}
              placeholder="https://..."
            />
          </div>
        </Section>

        {/* Sticky save bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-lg">
          <div className="text-sm text-muted-foreground">
            {saved ? (
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <Check className="h-4 w-4" />
                تم الحفظ
              </span>
            ) : (
              "احفظ تعديلاتك قبل مغادرة الصفحة"
            )}
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            حفظ دليل الجهة
          </Button>
        </div>
      </div>

      {/* Live preview */}
      <div className="xl:col-span-1">
        <div className="sticky top-20">
          <BrandPreview
            clientNameAr={client.name_ar}
            primary={values.primary_color}
            secondary={values.secondary_color}
            accents={values.accent_colors}
            fontArabic={values.font_arabic}
            brandPersona={values.brand_persona}
            toneOfVoice={values.tone_of_voice}
          />
        </div>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
