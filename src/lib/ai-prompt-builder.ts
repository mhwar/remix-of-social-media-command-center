/**
 * AI Prompt Builder — the core feature.
 *
 * Transforms a Client + BrandGuide record into a polished, ready-to-paste
 * system prompt that primes ChatGPT / Claude / any LLM with the full brand
 * context. The goal is that a content writer can paste the output once and
 * then simply ask "write a twitter post about X" and get on-brand output.
 */

import { parseJson } from "./utils";
import { getPlatformLabel } from "./constants";

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

type ClientRecord = {
  nameAr: string;
  nameEn: string | null;
  industry: string | null;
  description: string | null;
  website: string | null;
  brandGuide: BrandGuideRecord;
};

export type PromptOptions = {
  /** Optional content type to request (e.g., "post", "article"). */
  contentType?: string;
  /** Optional target platform (e.g., "twitter"). */
  platform?: string;
  /** Optional length hint in characters/words. */
  length?: string;
  /** Free-form additional task description. */
  task?: string;
  /** Language for the generated content. */
  language?: string;
};

const TONE_LABELS: Record<string, string> = {
  formal: "رسمي — لغة محترفة وجدية",
  professional: "احترافي — متوازن بين الجدية والمرونة",
  friendly: "ودود — قريب من القارئ ومحفّز",
  casual: "عفوي — لغة يومية وبسيطة",
  authoritative: "موثوق — واثق ومتخصص",
  inspirational: "ملهم — يحفّز الفعل والطموح",
};

export function buildSystemPrompt(
  client: ClientRecord,
  options: PromptOptions = {}
): string {
  const g = client.brandGuide;
  const lines: string[] = [];

  // --- Header ---
  lines.push("# سياق العلامة التجارية للمحتوى");
  lines.push("");
  lines.push(
    `أنت الآن تكتب محتوى باسم **${client.nameAr}**${client.nameEn ? ` (${client.nameEn})` : ""}.`
  );
  lines.push(
    "التزم بكل التعليمات التالية بدقة — هذه المعلومات تمثل هوية الجهة الرسمية."
  );
  lines.push("");

  // --- About the brand ---
  lines.push("## عن الجهة");
  if (client.industry) lines.push(`- **القطاع:** ${client.industry}`);
  if (client.description) lines.push(`- **الوصف:** ${client.description}`);
  if (client.website) lines.push(`- **الموقع:** ${client.website}`);
  lines.push("");

  if (!g) {
    lines.push("> ⚠️ لم يتم إعداد دليل الهوية بعد. الرجاء إضافة التفاصيل من صفحة الجهة.");
    return lines.join("\n");
  }

  // --- Voice & Persona ---
  const tone = g.toneOfVoice ? TONE_LABELS[g.toneOfVoice] ?? g.toneOfVoice : null;
  if (tone || g.brandPersona) {
    lines.push("## نبرة الصوت والشخصية");
    if (tone) lines.push(`- **النبرة:** ${tone}`);
    if (g.brandPersona) lines.push(`- **الشخصية:** ${g.brandPersona}`);
    lines.push("");
  }

  // --- Terminology ---
  const preferred = parseJson<string[]>(g.preferredTerms, []);
  const forbidden = parseJson<string[]>(g.forbiddenTerms, []);
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

  // --- Languages ---
  const languages = parseJson<string[]>(g.languages, []);
  if (languages.length) {
    const labeled = languages
      .map((l) => (l === "ar" ? "العربية" : l === "en" ? "الإنجليزية" : l))
      .join("، ");
    lines.push(`**اللغات المعتمدة:** ${labeled}`);
    lines.push("");
  }

  // --- Audience ---
  if (g.targetAudience) {
    lines.push("## الجمهور المستهدف");
    lines.push(g.targetAudience);
    lines.push("");
  }

  // --- Platforms ---
  const platforms = parseJson<string[]>(g.platforms, []);
  if (platforms.length) {
    const labeled = platforms.map(getPlatformLabel).join("، ");
    lines.push(`**المنصات النشطة:** ${labeled}`);
    lines.push("");
  }

  // --- Media policy ---
  if (g.mediaPolicy) {
    lines.push("## السياسة الإعلامية (ملزمة)");
    lines.push(g.mediaPolicy);
    lines.push("");
  }
  if (g.legalNotes) {
    lines.push("### ملاحظات قانونية");
    lines.push(g.legalNotes);
    lines.push("");
  }

  // --- Hashtag strategy ---
  if (g.hashtagStrategy) {
    lines.push("## استراتيجية الهاشتاق");
    lines.push(g.hashtagStrategy);
    lines.push("");
  }

  // --- Visual identity (reference) ---
  if (g.primaryColor || g.secondaryColor) {
    lines.push("## الهوية البصرية (للرجوع فقط عند الإشارة للتصميم)");
    if (g.primaryColor) lines.push(`- اللون الأساسي: ${g.primaryColor}`);
    if (g.secondaryColor) lines.push(`- اللون الثانوي: ${g.secondaryColor}`);
    if (g.fontArabic) lines.push(`- الخط العربي: ${g.fontArabic}`);
    if (g.fontLatin) lines.push(`- الخط اللاتيني: ${g.fontLatin}`);
    lines.push("");
  }

  // --- Sample content ---
  const samples = parseJson<string[]>(g.sampleContent, []);
  if (samples.length) {
    lines.push("## أمثلة محتوى معتمدة سابقاً");
    lines.push("استلهم منها الأسلوب والنبرة دون النسخ الحرفي:");
    samples.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push("");
  }

  // --- Reference links ---
  const refs = parseJson<string[]>(g.referenceLinks, []);
  if (refs.length) {
    lines.push("## مراجع");
    refs.forEach((r) => lines.push(`- ${r}`));
    lines.push("");
  }

  // --- The task ---
  lines.push("---");
  lines.push("");
  lines.push("## المهمة الآن");

  const taskParts: string[] = [];
  if (options.contentType) taskParts.push(`اكتب **${options.contentType}**`);
  else taskParts.push("اكتب محتوى");

  if (options.platform) taskParts.push(`لمنصة **${getPlatformLabel(options.platform)}**`);
  if (options.language)
    taskParts.push(`باللغة **${options.language === "ar" ? "العربية" : options.language}**`);
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
