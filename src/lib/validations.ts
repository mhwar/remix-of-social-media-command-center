import { z } from "zod";

export const clientSchema = z.object({
  nameAr: z.string().min(2, "اسم الجهة مطلوب"),
  nameEn: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  website: z.string().url("رابط غير صحيح").optional().or(z.literal("")).nullable(),
  contactEmail: z.string().email("بريد غير صحيح").optional().or(z.literal("")).nullable(),
  contactPhone: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]).default("ACTIVE"),
});

export type ClientInput = z.infer<typeof clientSchema>;

export const brandGuideSchema = z.object({
  primaryColor: z.string().optional().nullable(),
  secondaryColor: z.string().optional().nullable(),
  accentColors: z.array(z.string()).optional().nullable(),
  fontArabic: z.string().optional().nullable(),
  fontLatin: z.string().optional().nullable(),
  toneOfVoice: z.string().optional().nullable(),
  brandPersona: z.string().optional().nullable(),
  preferredTerms: z.array(z.string()).optional().nullable(),
  forbiddenTerms: z.array(z.string()).optional().nullable(),
  languages: z.array(z.string()).optional().nullable(),
  targetAudience: z.string().optional().nullable(),
  personas: z
    .array(
      z.object({
        name: z.string(),
        age: z.string().optional(),
        role: z.string().optional(),
        interests: z.array(z.string()).optional(),
      })
    )
    .optional()
    .nullable(),
  platforms: z.array(z.string()).optional().nullable(),
  postingSchedule: z.record(z.string()).optional().nullable(),
  mediaPolicy: z.string().optional().nullable(),
  legalNotes: z.string().optional().nullable(),
  hashtagStrategy: z.string().optional().nullable(),
  sampleContent: z.array(z.string()).optional().nullable(),
  referenceLinks: z.array(z.string()).optional().nullable(),
});

export type BrandGuideInput = z.infer<typeof brandGuideSchema>;

export const projectSchema = z.object({
  clientId: z.string().min(1, "الجهة مطلوبة"),
  title: z.string().min(2, "عنوان المشروع مطلوب"),
  description: z.string().optional().nullable(),
  status: z.enum(["PLANNING", "ACTIVE", "COMPLETED", "ON_HOLD"]).default("PLANNING"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const taskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2, "عنوان المهمة مطلوب"),
  description: z.string().optional().nullable(),
  status: z.enum(["IDEA", "WRITING", "REVIEW", "APPROVED", "PUBLISHED"]).default("IDEA"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  publishDate: z.string().optional().nullable(),
  platform: z.string().optional().nullable(),
  contentType: z.string().optional().nullable(),
  contentBody: z.string().optional().nullable(),
});

export type TaskInput = z.infer<typeof taskSchema>;
