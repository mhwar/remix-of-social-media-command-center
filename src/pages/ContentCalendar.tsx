import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calendarEvents, serviceTypeLabels, statusColors, statusLabels, serviceColors } from "@/lib/mock-data";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ar } from "date-fns/locale";

const dayNames = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

const ContentCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); // April 2026

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (date: Date) =>
    calendarEvents.filter(e => isSameDay(new Date(e.date), date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">تقويم المحتوى</h1>
        <p className="text-muted-foreground text-sm mt-1">جدولة ومتابعة المحتوى</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {format(currentMonth, "MMMM yyyy", { locale: ar })}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {dayNames.map(d => (
              <div key={d} className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
            {days.map((d, i) => {
              const events = getEventsForDay(d);
              const inMonth = isSameMonth(d, currentMonth);
              const today = isToday(d);
              return (
                <div
                  key={i}
                  className={`bg-card min-h-[80px] md:min-h-[100px] p-1.5 ${
                    !inMonth ? "opacity-30" : ""
                  } ${today ? "ring-2 ring-primary ring-inset" : ""}`}
                >
                  <span className={`text-xs font-medium ${today ? "text-primary" : "text-muted-foreground"}`}>
                    {format(d, "d")}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {events.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded truncate ${serviceColors[ev.type]}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{events.length - 2} أخرى</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentCalendar;
