"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  Check,
  Download,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  buildSystemPrompt,
  type PromptOptions,
} from "@/lib/ai-prompt-builder";
import { PLATFORMS, CONTENT_TYPES } from "@/lib/constants";

type BrandGuideRecord = {
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColors: string | null;
  fontArabic: string | null;
  fontLatin: string | null;
  toneOfVoice: string | null;
  brandPersona: string | null;
  preferredTerms: string | null;
  forbiddenTerms: string | null;
  languages: string | null;
  targetAudience: string | null;
  platforms: string | null;
  mediaPolicy: string | null;
  legalNotes: string | null;
  hashtagStrategy: string | null;
  sampleContent: string | null;
  referenceLinks: string | null;
} | null;

type Props = {
  client: {
    nameAr: string;
    nameEn: string | null;
    industry: string | null;
    description: string | null;
    website: string | null;
    brandGuide: BrandGuideRecord;
  };
};

export function AiContextViewer({ client }: Props) {
  const [opts, setOpts] = useState<PromptOptions>({
    contentType: "",
    platform: "",
    length: "",
    task: "",
    language: "ar",
  });
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => buildSystemPrompt(client, opts), [client, opts]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may fail in insecure contexts
      const ta = document.createElement("textarea");
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function download() {
    const blob = new Blob([prompt], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${client.nameAr}-ai-context.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const brandReady = client.brandGuide && client.brandGuide.toneOfVoice;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Options panel */}
      <div className="space-y-5 lg:col-span-2">
        <div className="card overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <div className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-lg font-semibold">
              سياق ذكي جاهز للذكاء الاصطناعي
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              يتم بناء Prompt كامل تلقائياً من دليل الجهة. اختر التفاصيل على
              اليسار وانسخ النتيجة للصقها في ChatGPT أو Claude.
            </p>
          </div>
        </div>

        {!brandReady && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            ⚠️ دليل الجهة غير مكتمل — املأ نبرة الصوت والسياسة الإعلامية للحصول
            على أفضل نتيجة.
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div className="card-title text-base">خيارات المهمة</div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              اختيارية — لتخصيص الـ Prompt لطلب محدد
            </p>
          </div>
          <div className="card-content space-y-4">
            <div>
              <label className="label">نوع المحتوى</label>
              <select
                className="input"
                value={opts.contentType ?? ""}
                onChange={(e) => setOpts({ ...opts, contentType: e.target.value })}
              >
                <option value="">— بدون تحديد —</option>
                {CONTENT_TYPES.map((c) => (
                  <option key={c.value} value={c.labelAr}>
                    {c.labelAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">المنصة</label>
              <select
                className="input"
                value={opts.platform ?? ""}
                onChange={(e) => setOpts({ ...opts, platform: e.target.value })}
              >
                <option value="">— بدون تحديد —</option>
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.labelAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">الطول التقريبي</label>
              <input
                className="input"
                type="text"
                value={opts.length ?? ""}
                onChange={(e) => setOpts({ ...opts, length: e.target.value })}
                placeholder="280 حرف، 150 كلمة، فقرة قصيرة..."
              />
            </div>

            <div>
              <label className="label">موضوع/تفاصيل المحتوى</label>
              <textarea
                className="textarea"
                rows={3}
                value={opts.task ?? ""}
                onChange={(e) => setOpts({ ...opts, task: e.target.value })}
                placeholder="مثال: إعلان عن إطلاق المنتج الجديد يوم الخميس القادم..."
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setOpts({
                  contentType: "",
                  platform: "",
                  length: "",
                  task: "",
                  language: "ar",
                })
              }
              className="btn btn-ghost w-full text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              إعادة تعيين
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-content py-4">
            <div className="text-xs font-semibold text-muted-foreground">
              فتح مباشر في:
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href="https://chat.openai.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                <ExternalLink className="h-3 w-3" />
                ChatGPT
              </a>
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                <ExternalLink className="h-3 w-3" />
                Claude
              </a>
              <a
                href="https://gemini.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                <ExternalLink className="h-3 w-3" />
                Gemini
              </a>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              انسخ السياق أولاً ثم الصقه في بداية المحادثة.
            </p>
          </div>
        </div>
      </div>

      {/* Prompt viewer */}
      <div className="lg:col-span-3">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              System Prompt — {client.nameAr}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={download}
                className="btn btn-outline btn-sm"
                title="تنزيل كملف Markdown"
              >
                <Download className="h-3.5 w-3.5" />
                تنزيل
              </button>
              <button
                type="button"
                onClick={copy}
                className="btn btn-primary btn-sm"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    نسخ السياق
                  </>
                )}
              </button>
            </div>
          </div>
          <pre
            className="max-h-[70vh] overflow-auto whitespace-pre-wrap bg-slate-950 p-5 text-xs leading-relaxed text-slate-100"
            dir="rtl"
          >
            {prompt}
          </pre>
        </div>

        <div className="mt-4 rounded-md border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
          <strong>نصيحة:</strong> انسخ هذا النص كاملاً والصقه كأول رسالة في
          المحادثة مع نموذج الذكاء الاصطناعي. بعدها اطلب أي محتوى (منشور، مقال،
          ثريد...) وسيراعي النموذج كل التعليمات تلقائياً.
        </div>
      </div>
    </div>
  );
}
