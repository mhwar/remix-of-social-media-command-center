"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Info, Palette, KanbanSquare, Sparkles } from "lucide-react";

export function ClientTabs({ clientId }: { clientId: string }) {
  const pathname = usePathname();

  const tabs = [
    { href: `/clients/${clientId}`, labelAr: "نظرة عامة", icon: Info },
    { href: `/clients/${clientId}/brand`, labelAr: "دليل الجهة", icon: Palette },
    { href: `/clients/${clientId}/projects`, labelAr: "المشاريع", icon: KanbanSquare },
    {
      href: `/clients/${clientId}/ai-context`,
      labelAr: "سياق الذكاء الاصطناعي",
      icon: Sparkles,
      highlight: true,
    },
  ];

  return (
    <div className="border-b">
      <nav className="-mb-px flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                tab.highlight && !active && "text-primary/80"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.labelAr}
              {tab.highlight && !active && (
                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  جديد
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
