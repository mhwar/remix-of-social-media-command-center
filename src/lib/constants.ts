export const TASK_STATUSES = [
  { value: "IDEA", labelAr: "فكرة", color: "bg-slate-100 text-slate-700 border-slate-300" },
  { value: "WRITING", labelAr: "قيد الكتابة", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { value: "REVIEW", labelAr: "مراجعة", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "APPROVED", labelAr: "معتمد", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "PUBLISHED", labelAr: "منشور", color: "bg-violet-100 text-violet-700 border-violet-300" },
] as const;

export const TASK_PRIORITIES = [
  { value: "LOW", labelAr: "منخفضة", color: "text-slate-500" },
  { value: "MEDIUM", labelAr: "متوسطة", color: "text-blue-600" },
  { value: "HIGH", labelAr: "عالية", color: "text-amber-600" },
  { value: "URGENT", labelAr: "عاجلة", color: "text-red-600" },
] as const;

export const PROJECT_STATUSES = [
  { value: "PLANNING", labelAr: "قيد التخطيط" },
  { value: "ACTIVE", labelAr: "نشط" },
  { value: "COMPLETED", labelAr: "مكتمل" },
  { value: "ON_HOLD", labelAr: "معلق" },
] as const;

export const CLIENT_STATUSES = [
  { value: "ACTIVE", labelAr: "نشط" },
  { value: "PAUSED", labelAr: "متوقف مؤقتاً" },
  { value: "ARCHIVED", labelAr: "أرشيف" },
] as const;

export const TONE_OF_VOICE = [
  { value: "formal", labelAr: "رسمي" },
  { value: "professional", labelAr: "احترافي" },
  { value: "friendly", labelAr: "ودود" },
  { value: "casual", labelAr: "عفوي" },
  { value: "authoritative", labelAr: "موثوق" },
  { value: "inspirational", labelAr: "ملهم" },
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

export function getTaskStatus(value: string) {
  return TASK_STATUSES.find((s) => s.value === value) ?? TASK_STATUSES[0];
}

export function getTaskPriority(value: string) {
  return TASK_PRIORITIES.find((p) => p.value === value) ?? TASK_PRIORITIES[1];
}

export function getPlatformLabel(value: string) {
  return PLATFORMS.find((p) => p.value === value)?.labelAr ?? value;
}

export function getContentTypeLabel(value: string) {
  return CONTENT_TYPES.find((c) => c.value === value)?.labelAr ?? value;
}
