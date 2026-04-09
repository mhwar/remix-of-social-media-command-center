import { prisma } from "@/lib/db";
import { ContentCalendar } from "@/components/calendar/content-calendar";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const month = sp.month ? parseInt(sp.month, 10) : now.getMonth();
  const year = sp.year ? parseInt(sp.year, 10) : now.getFullYear();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { publishDate: { gte: startOfMonth, lte: endOfMonth } },
        { dueDate: { gte: startOfMonth, lte: endOfMonth } },
      ],
    },
    include: {
      project: {
        include: {
          client: {
            select: {
              id: true,
              nameAr: true,
              brandGuide: { select: { primaryColor: true } },
            },
          },
        },
      },
    },
  });

  const events = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    date: (t.publishDate ?? t.dueDate)!.toISOString(),
    clientName: t.project.client.nameAr,
    clientColor: t.project.client.brandGuide?.primaryColor ?? "#0f766e",
    status: t.status,
    platform: t.platform,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">تقويم المحتوى</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          عرض شهري للمحتوى المجدول ومواعيد التسليم
        </p>
      </div>
      <ContentCalendar
        events={events}
        month={month}
        year={year}
      />
    </div>
  );
}
