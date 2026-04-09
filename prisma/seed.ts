import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      name: "المدير الرئيسي",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const writer = await prisma.user.upsert({
    where: { email: "writer@demo.com" },
    update: {},
    create: {
      email: "writer@demo.com",
      name: "كاتب المحتوى",
      password: await bcrypt.hash("writer123", 10),
      role: "MEMBER",
    },
  });

  // Sample client
  const existing = await prisma.client.findFirst({ where: { nameAr: "شركة نور للتقنية" } });
  const client =
    existing ??
    (await prisma.client.create({
      data: {
        nameAr: "شركة نور للتقنية",
        nameEn: "Noor Tech",
        industry: "التقنية والبرمجيات",
        description:
          "شركة متخصصة في حلول البرمجيات السحابية والذكاء الاصطناعي للشركات الصغيرة والمتوسطة.",
        website: "https://noor.tech",
        contactEmail: "hello@noor.tech",
        contactPhone: "+966500000000",
        status: "ACTIVE",
        brandGuide: {
          create: {
            primaryColor: "#0F766E",
            secondaryColor: "#F59E0B",
            accentColors: JSON.stringify(["#1E293B", "#F1F5F9"]),
            fontArabic: "IBM Plex Arabic",
            fontLatin: "Inter",
            toneOfVoice: "professional",
            brandPersona:
              "نتحدث كخبير تقني ودود يبسّط المفاهيم المعقدة للمستخدم غير التقني.",
            preferredTerms: JSON.stringify([
              "الحلول السحابية",
              "الأتمتة الذكية",
              "تجربة المستخدم",
              "التحول الرقمي",
            ]),
            forbiddenTerms: JSON.stringify([
              "رخيص",
              "بسيط جداً",
              "مشكلة",
            ]),
            languages: JSON.stringify(["ar", "en"]),
            targetAudience:
              "أصحاب ومدراء الشركات الصغيرة والمتوسطة في السعودية والخليج، أعمارهم 28-50، يبحثون عن حلول رقمية لتنمية أعمالهم.",
            personas: JSON.stringify([
              {
                name: "فهد",
                age: "35-45",
                role: "مدير تنفيذي",
                interests: ["الكفاءة التشغيلية", "خفض التكاليف", "الابتكار"],
              },
            ]),
            platforms: JSON.stringify(["twitter", "linkedin", "instagram"]),
            postingSchedule: JSON.stringify({
              twitter: "9:00 ص، 1:00 م، 8:00 م",
              linkedin: "10:00 ص، 5:00 م",
              instagram: "7:00 م",
            }),
            mediaPolicy:
              "الالتزام بالمصداقية، عدم المبالغة في الإعلانات، عدم استخدام مقارنات مباشرة مع المنافسين بأسمائهم. مراعاة القيم الإسلامية والعادات المحلية.",
            legalNotes:
              "عدم ذكر عملاء دون إذن كتابي. عدم استخدام صور من مصادر غير مرخصة.",
            hashtagStrategy:
              "هاشتاقات موحدة: #نور_للتقنية #التحول_الرقمي #الذكاء_الاصطناعي — 3 إلى 5 هاشتاقات لكل منشور.",
            sampleContent: JSON.stringify([
              "اكتشف كيف تُمكّن الأتمتة الذكية فريقك من التركيز على ما يهم حقاً — نمو أعمالك. #نور_للتقنية",
              "التحول الرقمي لم يعد خياراً، بل ضرورة. نحن هنا لنرافقك في كل خطوة.",
            ]),
            referenceLinks: JSON.stringify([
              "https://noor.tech/blog",
              "https://noor.tech/case-studies",
            ]),
          },
        },
      },
    }));

  // Sample project with tasks
  const existingProject = await prisma.project.findFirst({
    where: { clientId: client.id, title: "حملة إطلاق المنتج الجديد" },
  });

  if (!existingProject) {
    await prisma.project.create({
      data: {
        clientId: client.id,
        title: "حملة إطلاق المنتج الجديد",
        description: "حملة تسويقية لإطلاق منصة الأتمتة الجديدة عبر المنصات الرقمية.",
        status: "ACTIVE",
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        tasks: {
          create: [
            {
              title: "كتابة منشور إعلان الإطلاق - تويتر",
              description: "منشور تشويقي قبل 48 ساعة من الإطلاق.",
              status: "IDEA",
              priority: "HIGH",
              platform: "twitter",
              contentType: "post",
              assigneeId: writer.id,
              order: 0,
            },
            {
              title: "تصميم بوست لينكدإن طويل",
              description: "مقال قصير يشرح فوائد المنتج للمدراء التنفيذيين.",
              status: "WRITING",
              priority: "MEDIUM",
              platform: "linkedin",
              contentType: "article",
              assigneeId: writer.id,
              order: 0,
            },
            {
              title: "سلسلة ستوريز إنستقرام",
              description: "5 ستوريز تعرض ميزات المنتج بشكل بصري.",
              status: "REVIEW",
              priority: "MEDIUM",
              platform: "instagram",
              contentType: "story",
              order: 0,
            },
            {
              title: "فيديو تعريفي قصير",
              description: "فيديو 60 ثانية للإطلاق الرسمي.",
              status: "APPROVED",
              priority: "URGENT",
              platform: "instagram",
              contentType: "reel",
              publishDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
              order: 0,
            },
          ],
        },
      },
    });
  }

  console.log("✅ Seed completed.");
  console.log(`   Admin: admin@demo.com / admin123`);
  console.log(`   Writer: writer@demo.com / writer123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
