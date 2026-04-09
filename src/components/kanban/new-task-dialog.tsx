"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { PLATFORMS, CONTENT_TYPES, TASK_PRIORITIES, getTaskStatus } from "@/lib/constants";
import type { KanbanClient } from "./kanban-board";

type Props = {
  status: string;
  clients: KanbanClient[];
  activeClientId: string | null;
  onClose: () => void;
  onCreated: () => void;
};

export function NewTaskDialog({
  status,
  clients,
  activeClientId,
  onClose,
  onCreated,
}: Props) {
  const [projectOptions, setProjectOptions] = useState<
    { id: string; title: string; clientName: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>(activeClientId ?? "");

  useEffect(() => {
    const opts: { id: string; title: string; clientName: string }[] = [];
    clients.forEach((c) => {
      if (clientId && c.id !== clientId) return;
      c.projects.forEach((p) =>
        opts.push({ id: p.id, title: p.title, clientName: c.nameAr })
      );
    });
    setProjectOptions(opts);
  }, [clients, clientId]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      projectId: form.get("projectId"),
      title: form.get("title"),
      description: form.get("description"),
      status,
      priority: form.get("priority"),
      platform: form.get("platform") || null,
      contentType: form.get("contentType") || null,
      dueDate: form.get("dueDate") || null,
    };

    if (!payload.projectId) {
      setError("اختر مشروعاً");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "حدث خطأ");
      setLoading(false);
      return;
    }
    onCreated();
  }

  const statusInfo = getTaskStatus(status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <span className={`badge border ${statusInfo.color}`}>
              {statusInfo.labelAr}
            </span>
            <h2 className="text-base font-semibold">مهمة جديدة</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-4">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">الجهة</label>
              <select
                className="input"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">— كل الجهات —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameAr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">المشروع</label>
              <select name="projectId" className="input" required>
                <option value="">اختر مشروعاً</option>
                {projectOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                    {!clientId && ` — ${p.clientName}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">عنوان المهمة *</label>
            <input
              name="title"
              type="text"
              required
              className="input"
              placeholder="مثال: منشور تويتر عن الميزة الجديدة"
            />
          </div>

          <div>
            <label className="label">الوصف</label>
            <textarea
              name="description"
              rows={2}
              className="textarea"
              placeholder="تفاصيل المطلوب..."
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="label">الأولوية</label>
              <select name="priority" className="input" defaultValue="MEDIUM">
                {TASK_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.labelAr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">المنصة</label>
              <select name="platform" className="input">
                <option value="">—</option>
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.labelAr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">النوع</label>
              <select name="contentType" className="input">
                <option value="">—</option>
                {CONTENT_TYPES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.labelAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">الموعد النهائي</label>
            <input name="dueDate" type="date" className="input" />
          </div>

          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              إنشاء المهمة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
