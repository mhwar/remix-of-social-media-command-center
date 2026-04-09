"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TagsInput } from "@/components/ui/tags-input";
import { TONE_OF_VOICE, PLATFORMS } from "@/lib/constants";
import { Loader2, Save, Check, Palette, MessageSquare, Users2, Shield, FileCheck2 } from "lucide-react";
import { BrandPreview } from "@/components/brand/brand-preview";

type BrandGuideFormValues = {
  primaryColor: string;
  secondaryColor: string;
  accentColors: string[];
  fontArabic: string;
  fontLatin: string;
  toneOfVoice: string;
  brandPersona: string;
  preferredTerms: string[];
  forbiddenTerms: string[];
  languages: string[];
  targetAudience: string;
  platforms: string[];
  mediaPolicy: string;
  legalNotes: string;
  hashtagStrategy: string;
  sampleContent: string[];
  referenceLinks: string[];
};

type Props = {
  clientId: string;
  clientNameAr: string;
  initial: BrandGuideFormValues;
};

export function BrandGuideEditor({ clientId, clientNameAr, initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<BrandGuideFormValues>(initial);
  const [saved, setSaved] = useState(false);
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof BrandGuideFormValues>(
    key: K,
    val: BrandGuideFormValues[K]
  ) {
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
    setError(null);
    startSaving(async () => {
      const res = await fetch(`/api/brand-guide/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "حدث خطأ أثناء الحفظ");
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-5 xl:col-span-2">
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Visual identity */}
        <Section
          icon={Palette}
          title="الهوية البصرية"
          description="الألوان والخطوط التي تمثل هوية الجهة"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              label="اللون الأساسي"
              value={values.primaryColor}
              onChange={(v) => update("primaryColor", v)}
            />
            <ColorField
              label="اللون الثانوي"
              value={values.secondaryColor}
              onChange={(v) => update("secondaryColor", v)}
            />
          </div>

          <div>
            <label className="label">ألوان إضافية (Accents)</label>
            <TagsInput
              value={values.accentColors}
              onChange={(v) => update("accentColors", v)}
              placeholder="#1E293B"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              أدخل كود اللون بصيغة HEX (مثال: #1E293B)
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">الخط العربي</label>
              <input
                type="text"
                className="input"
                value={values.fontArabic}
                onChange={(e) => update("fontArabic", e.target.value)}
                placeholder="IBM Plex Arabic، Cairo، Tajawal..."
              />
            </div>
            <div>
              <label className="label">الخط اللاتيني</label>
              <input
                type="text"
                className="input"
                value={values.fontLatin}
                onChange={(e) => update("fontLatin", e.target.value)}
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
          <div>
            <label className="label">نبرة الصوت</label>
            <select
              className="input"
              value={values.toneOfVoice}
              onChange={(e) => update("toneOfVoice", e.target.value)}
            >
              <option value="">اختر...</option>
              {TONE_OF_VOICE.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.labelAr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">شخصية العلامة (Brand Persona)</label>
            <textarea
              className="textarea"
              rows={3}
              value={values.brandPersona}
              onChange={(e) => update("brandPersona", e.target.value)}
              placeholder="مثال: نتحدث كخبير تقني ودود يبسّط المفاهيم المعقدة..."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">مصطلحات مفضلة ✓</label>
              <TagsInput
                value={values.preferredTerms}
                onChange={(v) => update("preferredTerms", v)}
                placeholder="التحول الرقمي..."
              />
            </div>
            <div>
              <label className="label">مصطلحات محظورة ✗</label>
              <TagsInput
                value={values.forbiddenTerms}
                onChange={(v) => update("forbiddenTerms", v)}
                placeholder="رخيص..."
              />
            </div>
          </div>
          <div>
            <label className="label">اللغات المعتمدة</label>
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
          <div>
            <label className="label">وصف الجمهور المستهدف</label>
            <textarea
              className="textarea"
              rows={3}
              value={values.targetAudience}
              onChange={(e) => update("targetAudience", e.target.value)}
              placeholder="الفئة العمرية، الاهتمامات، الموقع الجغرافي، المهنة..."
            />
          </div>
          <div>
            <label className="label">المنصات النشطة</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const active = values.platforms.includes(p.value);
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => togglePlatform(p.value)}
                    className={`badge border px-3 py-1.5 text-xs transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
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
          <div>
            <label className="label">السياسة الإعلامية</label>
            <textarea
              className="textarea"
              rows={4}
              value={values.mediaPolicy}
              onChange={(e) => update("mediaPolicy", e.target.value)}
              placeholder="القواعد العامة، المحظورات، اللغة المسموحة..."
            />
          </div>
          <div>
            <label className="label">ملاحظات قانونية</label>
            <textarea
              className="textarea"
              rows={2}
              value={values.legalNotes}
              onChange={(e) => update("legalNotes", e.target.value)}
              placeholder="حقوق الصور، ذكر العملاء، الإقرارات القانونية..."
            />
          </div>
          <div>
            <label className="label">استراتيجية الهاشتاق</label>
            <textarea
              className="textarea"
              rows={2}
              value={values.hashtagStrategy}
              onChange={(e) => update("hashtagStrategy", e.target.value)}
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
          <div>
            <label className="label">أمثلة محتوى مقبولة</label>
            <TagsInput
              value={values.sampleContent}
              onChange={(v) => update("sampleContent", v)}
              placeholder="أضف نص منشور مقبول..."
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              كل عنصر = مثال منشور كامل
            </p>
          </div>
          <div>
            <label className="label">روابط مرجعية</label>
            <TagsInput
              value={values.referenceLinks}
              onChange={(v) => update("referenceLinks", v)}
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
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            حفظ دليل الجهة
          </button>
        </div>
      </div>

      {/* Live preview */}
      <div className="xl:col-span-1">
        <div className="sticky top-20">
          <BrandPreview
            clientNameAr={clientNameAr}
            primary={values.primaryColor}
            secondary={values.secondaryColor}
            accents={values.accentColors}
            fontArabic={values.fontArabic}
            brandPersona={values.brandPersona}
            toneOfVoice={values.toneOfVoice}
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
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="card-title">{title}</div>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="card-content space-y-4">{children}</div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-md border border-input bg-background p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="ltr"
          className="input flex-1 font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
