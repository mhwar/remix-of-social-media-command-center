/**
 * AI Prompt Builder — the core feature.
 *
 * Transforms a client profile + brand guide record into a polished,
 * ready-to-paste system prompt that primes ChatGPT / Claude / any LLM
 * with the full brand context. A content writer can paste the output
 * once and then simply ask "write a twitter post about X" and get
 * on-brand output from the first message.
 */

import type { Tables } from "@/integrations/supabase/types";
import { getPlatformLabel, getToneLabel } from "./brand-constants";

type ClientRow = Tables<"clients">;
type BrandGuideRow = Tables<"brand_guides">;

export type PromptOptions = {
  contentType?: string;
  platform?: string;
  length?: string;
  task?: string;
  language?: string;
};

function toArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v));
  return [];
}

export function buildSystemPrompt(
  client: ClientRow,
  brandGuide: BrandGuideRow | null,
  options: PromptOptions = {}
): string {
  const lines: string[] = [];

  // Header
  lines.push("# سياق العلامة التجارية للمحتوى");
  lines.push("");
  lines.push(
    `أنت الآن تكتب محتوى باسم **${client.name_ar}**${client.name_en ? ` (${client.name_en})` : ""}.`
  );
  lines.push("التزم بكل التعليمات التالية بدقة — هذه المعلومات تمثل هوية الجهة الرسمية.");
  lines.push("");

  // About the brand
  lines.push("## عن الجهة");
  if (client.industry) lines.push(`- **القطاع:** ${client.industry}`);
  if (client.description) lines.push(`- **الوصف:** ${client.description}`);
  if (client.website) lines.push(`- **الموقع:** ${client.website}`);
  lines.push("");

  if (!brandGuide) {
    lines.push(
      "> ⚠️ لم يتم إعداد دليل الهوية بعد. الرجاء إضافة التفاصيل من صفحة الجهة."
    );
    return lines.join("\n");
  }

  // Voice & persona
  const toneLabel = brandGuide.tone_of_voice ? getToneLabel(brandGuide.tone_of_voice) : null;
  if (toneLabel || brandGuide.brand_persona) {
    lines.push("## نبرة الصوت والشخصية");
    if (toneLabel) lines.push(`- **النبرة:** ${toneLabel}`);
    if (brandGuide.brand_persona) lines.push(`- **الشخصية:** ${brandGuide.brand_persona}`);
    lines.push("");
  }

  // Terminology
  const preferred = toArray(brandGuide.preferred_terms);
  const forbidden = toArray(brandGuide.forbidden_terms);
  if (preferred.length || forbidden.length) {
    lines.push("## المصطلحات");
    if (preferred.length) {
      lines.push("**✓ استخدم هذه المصطلحات:**");
      preferred.forEach((t) => lines.push(`- ${t}`));
    }
    if (forbidden.length) {
      lines.push("");
      lines.push("**✗ تجنب هذه المصطلحات تماماً:**");
      forbidden.forEach((t) => lines.push(`- ${t}`));
    }
    lines.push("");
  }

  // Languages
  const languages = toArray(brandGuide.languages);
  if (languages.length) {
    const labeled = languages
      .map((l) => (l === "ar" ? "العربية" : l === "en" ? "الإنجليزية" : l))
      .join("، ");
    lines.push(`**اللغات المعتمدة:** ${labeled}`);
    lines.push("");
  }

  // Audience
  if (brandGuide.target_audience) {
    lines.push("## الجمهور المستهدف");
    lines.push(brandGuide.target_audience);
    lines.push("");
  }

  // Platforms
  const platforms = toArray(brandGuide.platforms);
  if (platforms.length) {
    const labeled = platforms.map(getPlatformLabel).join("، ");
    lines.push(`**المنصات النشطة:** ${labeled}`);
    lines.push("");
  }

  // Media policy
  if (brandGuide.media_policy) {
    lines.push("## السياسة الإعلامية (ملزمة)");
    lines.push(brandGuide.media_policy);
    lines.push("");
  }
  if (brandGuide.legal_notes) {
    lines.push("### ملاحظات قانونية");
    lines.push(brandGuide.legal_notes);
    lines.push("");
  }

  // Hashtag strategy
  if (brandGuide.hashtag_strategy) {
    lines.push("## استراتيجية الهاشتاق");
    lines.push(brandGuide.hashtag_strategy);
    lines.push("");
  }

  // Visual identity (reference)
  if (brandGuide.primary_color || brandGuide.secondary_color) {
    lines.push("## الهوية البصرية (للرجوع فقط عند الإشارة للتصميم)");
    if (brandGuide.primary_color) lines.push(`- اللون الأساسي: ${brandGuide.primary_color}`);
    if (brandGuide.secondary_color) lines.push(`- اللون الثانوي: ${brandGuide.secondary_color}`);
    if (brandGuide.font_arabic) lines.push(`- الخط العربي: ${brandGuide.font_arabic}`);
    if (brandGuide.font_latin) lines.push(`- الخط اللاتيني: ${brandGuide.font_latin}`);
    lines.push("");
  }

  // Samples
  const samples = toArray(brandGuide.sample_content);
  if (samples.length) {
    lines.push("## أمثلة محتوى معتمدة سابقاً");
    lines.push("استلهم منها الأسلوب والنبرة دون النسخ الحرفي:");
    samples.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push("");
  }

  // References
  const refs = toArray(brandGuide.reference_links);
  if (refs.length) {
    lines.push("## مراجع");
    refs.forEach((r) => lines.push(`- ${r}`));
    lines.push("");
  }

  // Task
  lines.push("---");
  lines.push("");
  lines.push("## المهمة الآن");

  const taskParts: string[] = [];
  if (options.contentType) taskParts.push(`اكتب **${options.contentType}**`);
  else taskParts.push("اكتب محتوى");

  if (options.platform) taskParts.push(`لمنصة **${getPlatformLabel(options.platform)}**`);
  if (options.language)
    taskParts.push(
      `باللغة **${options.language === "ar" ? "العربية" : options.language}**`
    );
  if (options.length) taskParts.push(`بطول تقريبي **${options.length}**`);

  lines.push(taskParts.join(" ") + ".");

  if (options.task) {
    lines.push("");
    lines.push(`**الموضوع/التفاصيل:** ${options.task}`);
  } else {
    lines.push("");
    lines.push("**استبدل هذا السطر بموضوع/تفاصيل المحتوى الذي تريده.**");
  }

  lines.push("");
  lines.push("### المتطلبات النهائية:");
  lines.push("- التزم التام بنبرة الصوت والشخصية أعلاه.");
  lines.push("- تجنب المصطلحات المحظورة تماماً واستخدم المفضلة عند المناسبة.");
  lines.push("- احترم السياسة الإعلامية والملاحظات القانونية.");
  lines.push("- قدّم النتيجة كمحتوى جاهز للنشر، بدون شروحات إضافية.");

  return lines.join("\n");
}
