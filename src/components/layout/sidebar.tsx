"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Calendar,
  Sparkles,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", labelAr: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/clients", labelAr: "الجهات والعملاء", icon: Users },
  { href: "/projects", labelAr: "المشاريع", icon: KanbanSquare },
  { href: "/calendar", labelAr: "تقويم المحتوى", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-l bg-card lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-bold">إدارة المحتوى</div>
          <div className="text-[10px] text-muted-foreground">Content Studio</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.labelAr}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            ميزة ذكية
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            صدّر سياق الجهة كـ Prompt جاهز للصقه في ChatGPT أو Claude لتوليد محتوى
            مخصص بثوانٍ.
          </p>
        </div>
      </div>
    </aside>
  );
}
