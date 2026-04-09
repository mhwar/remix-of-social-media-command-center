"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";
import { PROJECT_STATUSES } from "@/lib/constants";

export function NewProjectButton({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, clientId }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "حدث خطأ");
      setLoading(false);
      return;
    }
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-3.5 w-3.5" />
        مشروع جديد
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="card w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-base font-semibold">مشروع جديد</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-muted"
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

              <div>
                <label className="label">عنوان المشروع *</label>
                <input
                  name="title"
                  required
                  className="input"
                  placeholder="مثال: حملة إطلاق رمضان"
                />
              </div>

              <div>
                <label className="label">الوصف</label>
                <textarea
                  name="description"
                  rows={2}
                  className="textarea"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="label">الحالة</label>
                  <select
                    name="status"
                    defaultValue="PLANNING"
                    className="input"
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.labelAr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">البداية</label>
                  <input type="date" name="startDate" className="input" />
                </div>
                <div>
                  <label className="label">النهاية</label>
                  <input type="date" name="endDate" className="input" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn-ghost"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  إنشاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
