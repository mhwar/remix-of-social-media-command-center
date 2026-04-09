"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TASK_STATUSES,
  getTaskPriority,
  getPlatformLabel,
  getContentTypeLabel,
} from "@/lib/constants";
import { Plus, Filter, X, Loader2, CalendarClock, User2 } from "lucide-react";
import { cn, formatDateAr } from "@/lib/utils";
import { NewTaskDialog } from "@/components/kanban/new-task-dialog";

export type KanbanTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  platform: string | null;
  contentType: string | null;
  dueDate: string | null;
  assigneeName: string | null;
  clientName: string;
  clientColor: string;
  projectTitle: string;
};

export type KanbanClient = {
  id: string;
  nameAr: string;
  primaryColor: string;
  projects: { id: string; title: string }[];
};

type Props = {
  initialTasks: KanbanTask[];
  clients: KanbanClient[];
  activeClientId: string | null;
};

export function KanbanBoard({ initialTasks, clients, activeClientId }: Props) {
  const router = useRouter();
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);
  const [newTaskStatus, setNewTaskStatus] = useState<string | null>(null);
  const [moving, startMoving] = useTransition();

  const columns = useMemo(() => {
    return TASK_STATUSES.map((s) => ({
      ...s,
      tasks: tasks.filter((t) => t.status === s.value),
    }));
  }, [tasks]);

  const totalCount = tasks.length;

  async function moveTask(taskId: string, newStatus: string) {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    startMoving(async () => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        // Rollback on error
        setTasks(initialTasks);
      }
      router.refresh();
    });
  }

  return (
    <>
      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            تصفية حسب الجهة:
          </div>
          <Link
            href="/projects"
            className={cn(
              "badge border px-3 py-1.5 text-xs transition-colors",
              !activeClientId
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted"
            )}
          >
            الكل ({totalCount})
          </Link>
          {clients.map((c) => {
            const active = activeClientId === c.id;
            return (
              <Link
                key={c.id}
                href={`/projects?clientId=${c.id}`}
                className={cn(
                  "badge flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                )}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: c.primaryColor }}
                />
                {c.nameAr}
              </Link>
            );
          })}
          {activeClientId && (
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
              إزالة
            </Link>
          )}
        </div>
        {moving && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            جارٍ الحفظ...
          </div>
        )}
      </div>

      {/* Board */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {columns.map((col) => (
          <div
            key={col.value}
            className="flex flex-col rounded-xl border bg-muted/30"
          >
            <div className="flex items-center justify-between border-b px-3 py-3">
              <div className="flex items-center gap-2">
                <span className={cn("badge border", col.color)}>
                  {col.labelAr}
                </span>
                <span className="text-xs text-muted-foreground">
                  {col.tasks.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNewTaskStatus(col.value)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="إضافة مهمة"
                title="إضافة مهمة"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-2">
              {col.tasks.length === 0 && (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  لا توجد مهام
                </div>
              )}
              {col.tasks.map((task) => (
                <TaskCard key={task.id} task={task} onMove={moveTask} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {newTaskStatus !== null && (
        <NewTaskDialog
          status={newTaskStatus}
          clients={clients}
          activeClientId={activeClientId}
          onClose={() => setNewTaskStatus(null)}
          onCreated={() => {
            setNewTaskStatus(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function TaskCard({
  task,
  onMove,
}: {
  task: KanbanTask;
  onMove: (id: string, newStatus: string) => void;
}) {
  const priority = getTaskPriority(task.priority);

  return (
    <div className="group relative rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div
        className="mb-2 h-1 w-8 rounded-full"
        style={{ backgroundColor: task.clientColor }}
      />
      <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
        <span>{task.clientName}</span>
      </div>

      {(task.platform || task.contentType) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.platform && (
            <span className="badge border-border bg-muted text-[10px]">
              {getPlatformLabel(task.platform)}
            </span>
          )}
          {task.contentType && (
            <span className="badge border-border bg-muted text-[10px]">
              {getContentTypeLabel(task.contentType)}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t pt-2 text-[11px]">
        <span className={cn("font-medium", priority.color)}>
          {priority.labelAr}
        </span>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <CalendarClock className="h-3 w-3" />
            {formatDateAr(task.dueDate)}
          </span>
        )}
      </div>
      {task.assigneeName && (
        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <User2 className="h-3 w-3" />
          {task.assigneeName}
        </div>
      )}

      {/* Move dropdown (appears on hover) */}
      <select
        className="absolute inset-x-2 bottom-2 mt-2 h-7 rounded-md border border-input bg-background/90 px-2 text-[11px] opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        value={task.status}
        onChange={(e) => onMove(task.id, e.target.value)}
        aria-label="نقل المهمة"
      >
        {TASK_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            نقل إلى: {s.labelAr}
          </option>
        ))}
      </select>
    </div>
  );
}
