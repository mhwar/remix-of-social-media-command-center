// Shared constants for brand guide + content tasks

export const TONE_OF_VOICE = [
  { value: "formal", labelAr: "رسمي — لغة محترفة وجدية" },
  { value: "professional", labelAr: "احترافي — متوازن بين الجدية والمرونة" },
  { value: "friendly", labelAr: "ودود — قريب من القارئ ومحفّز" },
  { value: "casual", labelAr: "عفوي — لغة يومية وبسيطة" },
  { value: "authoritative", labelAr: "موثوق — واثق ومتخصص" },
  { value: "inspirational", labelAr: "ملهم — يحفّز الفعل والطموح" },
] as const;

export const PLATFORMS = [
  { value: "twitter", labelAr: "تويتر / X" },
  { value: "instagram", labelAr: "إنستقرام" },
  { value: "linkedin", labelAr: "لينكدإن" },
  { value: "facebook", labelAr: "فيسبوك" },
  { value: "tiktok", labelAr: "تيك توك" },
  { value: "youtube", labelAr: "يوتيوب" },
  { value: "snapchat", labelAr: "سناب شات" },
  { value: "blog", labelAr: "مدونة" },
] as const;

export const CONTENT_TYPES = [
  { value: "post", labelAr: "منشور" },
  { value: "article", labelAr: "مقال" },
  { value: "story", labelAr: "ستوري" },
  { value: "reel", labelAr: "ريل / فيديو قصير" },
  { value: "video", labelAr: "فيديو" },
  { value: "infographic", labelAr: "إنفوجرافيك" },
  { value: "newsletter", labelAr: "نشرة بريدية" },
  { value: "thread", labelAr: "ثريد" },
] as const;

export const TASK_STATUSES = [
  { value: "IDEA", labelAr: "فكرة", tone: "bg-slate-100 text-slate-700 border-slate-300" },
  { value: "WRITING", labelAr: "قيد الكتابة", tone: "bg-blue-100 text-blue-700 border-blue-300" },
  { value: "REVIEW", labelAr: "مراجعة", tone: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "APPROVED", labelAr: "معتمد", tone: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "PUBLISHED", labelAr: "منشور", tone: "bg-violet-100 text-violet-700 border-violet-300" },
] as const;

export const CLIENT_STATUSES = [
  { value: "ACTIVE", labelAr: "نشط" },
  { value: "PAUSED", labelAr: "متوقف مؤقتاً" },
  { value: "ARCHIVED", labelAr: "أرشيف" },
] as const;

export function getPlatformLabel(value: string | null | undefined) {
  if (!value) return "";
  return PLATFORMS.find((p) => p.value === value)?.labelAr ?? value;
}

export function getContentTypeLabel(value: string | null | undefined) {
  if (!value) return "";
  return CONTENT_TYPES.find((c) => c.value === value)?.labelAr ?? value;
}

export function getToneLabel(value: string | null | undefined) {
  if (!value) return "";
  return TONE_OF_VOICE.find((t) => t.value === value)?.labelAr ?? value;
}
