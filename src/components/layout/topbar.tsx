"use client";

import { Search, Bell, Menu } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/80 px-6 backdrop-blur-md">
      <button
        type="button"
        className="btn btn-ghost lg:hidden"
        aria-label="القائمة"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="ابحث عن جهة أو مشروع..."
          className="input pr-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-ghost relative" aria-label="الإشعارات">
          <Bell className="h-5 w-5" />
          <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            م
          </div>
          <span className="text-sm font-medium">المدير</span>
        </div>
      </div>
    </header>
  );
}
