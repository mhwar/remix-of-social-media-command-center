# Content Studio — منصة إدارة المحتوى مع سياق AI للجهات

> امتداد لمشروع Lovable الأصلي يضيف **ملفات تعريفية احترافية للعملاء/الجهات**
> و**دليل هوية (Brand Guide) شامل** و**مولد سياق ذكي جاهز للصق في ChatGPT/Claude**
> حتى يُنتج الفريق محتوى مخصصاً بهوية كل جهة بنقرة واحدة.

## ✨ الميزات المضافة فوق Lovable

| الميزة | الوصف |
|---|---|
| 📂 **ملف تعريفي غني للجهة** | اسم عربي/إنجليزي، قطاع، وصف، موقع، تواصل، حالة |
| 🎨 **محرر دليل الجهة (Brand Guide)** | ألوان، خطوط، نبرة صوت، شخصية، مصطلحات مفضلة/محظورة، سياسة إعلامية |
| 👥 **الجمهور والمنصات** | جمهور مستهدف، منصات نشطة، استراتيجية هاشتاق |
| 📝 **أمثلة ومراجع** | أمثلة محتوى معتمد، روابط مرجعية |
| ⭐ **مولد سياق الذكاء الاصطناعي** | زر واحد ينتج System Prompt منسّق جاهز للصق في ChatGPT/Claude/Gemini |
| 📋 **مشاريع محتوى** | مشاريع مرتبطة بكل جهة مع حالات متعددة |

## 🗂️ الملفات الجديدة

```
supabase/
├── migrations/
│   └── 20260410120000_content_studio_schema.sql   ← النماذج الجديدة

src/
├── integrations/supabase/types.ts                  ← محدّث يشمل الجداول الجديدة
├── lib/
│   ├── ai-prompt-builder.ts                        ⭐ قلب الفكرة
│   └── brand-constants.ts                          ← ثوابت (نبرة، منصات، أنواع)
├── components/brand/
│   ├── TagsInput.tsx
│   ├── ColorField.tsx
│   └── BrandPreview.tsx
├── pages/
│   ├── ClientNew.tsx
│   ├── ClientDetail.tsx                            ← Layout + tabs
│   ├── ClientOverview.tsx                          ← تبويب "نظرة عامة"
│   ├── ClientBrand.tsx                             ⭐ محرر دليل الجهة
│   ├── ClientProjects.tsx                          ← تبويب "المشاريع"
│   └── ClientAIContext.tsx                         ⭐⭐⭐ توليد سياق AI
└── App.tsx                                         ← محدّث بمسارات متداخلة
```

## 🚦 الصفحات المتوفرة

مسارات Lovable الأصلية (تبقى كما هي):
- `/` — لوحة التحكم
- `/clients` — **مُحدَّث** ليستخدم Supabase + بطاقات ملونة بهوية الجهة
- `/tasks` — المهام (mock data من Lovable)
- `/calendar` — التقويم (mock data من Lovable)
- `/team` — الفريق (mock data من Lovable)

مسارات جديدة:
- `/clients/new` — نموذج إضافة جهة
- `/clients/:id` — نظرة عامة على الجهة
- `/clients/:id/brand` — محرر دليل الجهة ⭐
- `/clients/:id/projects` — مشاريع الجهة
- `/clients/:id/ai-context` — مولد سياق AI ⭐⭐⭐

## 🛠️ تشغيل Supabase Migration (خطوة إلزامية)

الجداول الجديدة لا توجد بعد في قاعدة بياناتك. لتفعيلها:

### الطريقة 1 — عبر Supabase Dashboard (الأسهل)

1. افتح مشروعك على [supabase.com/dashboard](https://supabase.com/dashboard)
2. اذهب إلى **SQL Editor**
3. اضغط **New query**
4. انسخ محتوى ملف `supabase/migrations/20260410120000_content_studio_schema.sql` كاملاً
5. الصقه في المحرر
6. اضغط **Run**

ستظهر رسائل نجاح، وسيتم إنشاء 4 جداول جديدة:
- `clients_brands`
- `brand_guides`
- `content_projects`
- `content_tasks`

وسيتم إدخال جهة تجريبية (`شركة نور للتقنية`) لتجربة الميزات فوراً.

### الطريقة 2 — عبر Supabase CLI

```bash
# إذا كان عندك supabase CLI متصل بمشروعك
supabase db push
```

## 🧑‍💻 التشغيل المحلي

```bash
# تثبيت التبعيات (باستخدام Bun)
bun install

# تأكد من ملف .env يحتوي على:
# VITE_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
# VITE_SUPABASE_PUBLISHABLE_KEY="eyJ..."

# تشغيل الخادم
bun run dev
```

افتح [http://localhost:5173](http://localhost:5173).

## 🎯 كيف تجرب الميزة المحورية (AI Context)

1. افتح `/clients`
2. اضغط على جهة "شركة نور للتقنية" (من البيانات التجريبية)
3. اختر تبويب **"سياق الذكاء الاصطناعي"** ⭐
4. اختياراً: اختر نوع المحتوى والمنصة، واكتب موضوعاً محدداً
5. اضغط **"نسخ السياق"** — يتم نسخ prompt منسّق كامل للحافظة
6. افتح ChatGPT أو Claude، والصق السياق كأول رسالة
7. اطلب أي محتوى — سيلتزم النموذج بهوية الجهة تلقائياً

## 🧠 كيف يعمل `ai-prompt-builder.ts`؟

الملف `src/lib/ai-prompt-builder.ts` يحتوي على دالة `buildSystemPrompt()`
تأخذ كائن الجهة + دليل الهوية وتبني نصاً Markdown منسّقاً يحتوي على:

1. **مقدمة تعريفية** بالجهة
2. **نبرة الصوت والشخصية** كتعليمات موجّهة للنموذج
3. **المصطلحات** (مفضلة ✓ ومحظورة ✗)
4. **الجمهور المستهدف والمنصات النشطة**
5. **السياسة الإعلامية والملاحظات القانونية**
6. **استراتيجية الهاشتاق**
7. **أمثلة محتوى معتمدة** للاسترشاد بالأسلوب
8. **المهمة المطلوبة** مع تخصيص (نوع المحتوى، المنصة، الطول، الموضوع)
9. **متطلبات نهائية** تذكّر النموذج بالالتزام بكل ما سبق

ترتيب الأقسام ومحتواها مصمم بعناية ليعمل مع ChatGPT و Claude و Gemini
بنفس الكفاءة.

## 📋 التقنيات المستخدمة

- **Vite** + React 18 + TypeScript
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (PostgreSQL + RLS)
- **React Router v6** (nested routes)
- **@tanstack/react-query** (إطار جاهز لتخزين الطلبات)
- **Sonner** للإشعارات
- **Lucide React** للأيقونات

## 🧪 الاختبارات

```bash
bun run test        # Vitest
bun run test:watch  # Watch mode
```

اختبارات Playwright الموجودة من Lovable تبقى تعمل كما هي.
