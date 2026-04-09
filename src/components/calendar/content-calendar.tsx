"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getTaskStatus, getPlatformLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  clientName: string;
  clientColor: string;
  status: string;
  platform: string | null;
};

type Props = {
  events: CalendarEvent[];
  month: number;
  year: number;
};

const MONTH_NAMES_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

// Week starts on Sunday (default in many Arabic contexts)
const WEEKDAYS_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export function ContentCalendar({ events, month, year }: Props) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Group events by day
  const eventsByDay = new Map<number, CalendarEvent[]>();
  events.forEach((e) => {
    const day = new Date(e.date).getDate();
    const existing = eventsByDay.get(day) ?? [];
    existing.push(e);
    eventsByDay.set(day, existing);
  });

  // Build grid: leading blanks + days
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad trailing to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year };
  const nextMonth = month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year };

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b p-4">
        <Link
          href={`/calendar?month=${prevMonth.month}&year=${prevMonth.year}`}
          className="btn btn-ghost btn-sm"
        >
          <ChevronRight className="h-4 w-4" />
          الشهر السابق
        </Link>
        <h2 className="text-lg font-bold">
          {MONTH_NAMES_AR[month]} {year}
        </h2>
        <Link
          href={`/calendar?month=${nextMonth.month}&year=${nextMonth.year}`}
          className="btn btn-ghost btn-sm"
        >
          الشهر التالي
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-7 border-b bg-muted/30">
        {WEEKDAYS_AR.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const dayEvents = day ? eventsByDay.get(day) ?? [] : [];
          const isToday = isCurrentMonth && day === today.getDate();
          return (
            <div
              key={idx}
              className={cn(
                "min-h-[110px] border-b border-l p-1.5",
                day === null && "bg-muted/20",
                isToday && "bg-primary/5"
              )}
            >
              {day !== null && (
                <>
                  <div
                    className={cn(
                      "mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isToday
                        ? "bg-primary font-bold text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((e) => {
                      const status = getTaskStatus(e.status);
                      return (
                        <div
                          key={e.id}
                          className="group relative cursor-pointer truncate rounded border-l-4 bg-muted/50 px-1.5 py-1 text-[10px] leading-tight hover:bg-muted"
                          style={{ borderLeftColor: e.clientColor }}
                          title={`${e.clientName} — ${e.title}${e.platform ? ` (${getPlatformLabel(e.platform)})` : ""}`}
                        >
                          <div className="truncate font-medium">{e.title}</div>
                          <div className="truncate text-muted-foreground">
                            {e.clientName}
                          </div>
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-muted-foreground">
                        +{dayEvents.length - 3} أكثر
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
