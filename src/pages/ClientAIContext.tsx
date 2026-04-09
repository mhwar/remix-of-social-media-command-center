import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
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
import {
  Copy,
  Check,
  Download,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { buildSystemPrompt, type PromptOptions } from "@/lib/ai-prompt-builder";
import { PLATFORMS, CONTENT_TYPES } from "@/lib/brand-constants";
import { toast } from "sonner";

type ContextValue = {
  client: Tables<"clients_brands"> & {
    brand_guides: Tables<"brand_guides"> | null;
  };
};

export default function ClientAIContext() {
  const { client } = useOutletContext<ContextValue>();
  const [opts, setOpts] = useState<PromptOptions>({
    contentType: "",
    platform: "",
    length: "",
    task: "",
    language: "ar",
  });
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(
    () => buildSystemPrompt(client, client.brand_guides, opts),
    [client, opts]
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success("تم نسخ السياق للحافظة");
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
    a.download = `${client.name_ar}-ai-context.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const brandReady = Boolean(client.brand_guides && client.brand_guides.tone_of_voice);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Options panel */}
      <div className="space-y-5 lg:col-span-2">
        <Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <CardContent className="p-5">
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
          </CardContent>
        </Card>

        {!brandReady && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            ⚠️ دليل الجهة غير مكتمل — املأ نبرة الصوت والسياسة الإعلامية للحصول
            على أفضل نتيجة.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">خيارات المهمة</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              اختيارية — لتخصيص الـ Prompt لطلب محدد
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>نوع المحتوى</Label>
              <Select
                value={opts.contentType || "none"}
                onValueChange={(v) =>
                  setOpts({ ...opts, contentType: v === "none" ? "" : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="— بدون تحديد —" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— بدون تحديد —</SelectItem>
                  {CONTENT_TYPES.map((c) => (
                    <SelectItem key={c.value} value={c.labelAr}>
                      {c.labelAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>المنصة</Label>
              <Select
                value={opts.platform || "none"}
                onValueChange={(v) => setOpts({ ...opts, platform: v === "none" ? "" : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="— بدون تحديد —" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— بدون تحديد —</SelectItem>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.labelAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>الطول التقريبي</Label>
              <Input
                value={opts.length ?? ""}
                onChange={(e) => setOpts({ ...opts, length: e.target.value })}
                placeholder="280 حرف، 150 كلمة، فقرة قصيرة..."
              />
            </div>

            <div className="space-y-1.5">
              <Label>موضوع / تفاصيل المحتوى</Label>
              <Textarea
                rows={3}
                value={opts.task ?? ""}
                onChange={(e) => setOpts({ ...opts, task: e.target.value })}
                placeholder="مثال: إعلان عن إطلاق المنتج الجديد يوم الخميس القادم..."
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() =>
                setOpts({
                  contentType: "",
                  platform: "",
                  length: "",
                  task: "",
                  language: "ar",
                })
              }
            >
              <RefreshCw className="h-3.5 w-3.5" />
              إعادة تعيين
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="text-xs font-semibold text-muted-foreground">
              فتح مباشر في:
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  ChatGPT
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://claude.ai" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  Claude
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://gemini.google.com" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  Gemini
                </a>
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              انسخ السياق أولاً ثم الصقه في بداية المحادثة.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prompt viewer */}
      <div className="lg:col-span-3">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              System Prompt — {client.name_ar}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={download}>
                <Download className="h-3.5 w-3.5" />
                تنزيل
              </Button>
              <Button size="sm" onClick={copy}>
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
              </Button>
            </div>
          </div>
          <pre
            className="max-h-[70vh] overflow-auto whitespace-pre-wrap bg-slate-950 p-5 text-xs leading-relaxed text-slate-100"
            dir="rtl"
          >
            {prompt}
          </pre>
        </Card>

        <div className="mt-4 rounded-md border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
          <strong>نصيحة:</strong> انسخ هذا النص كاملاً والصقه كأول رسالة في
          المحادثة مع نموذج الذكاء الاصطناعي. بعدها اطلب أي محتوى (منشور، مقال،
          ثريد...) وسيراعي النموذج كل التعليمات تلقائياً.
        </div>
      </div>
    </div>
  );
}
