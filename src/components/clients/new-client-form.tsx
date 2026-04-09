"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CLIENT_STATUSES } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export function NewClientForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "خطأ أثناء الحفظ");
      setLoading(false);
      return;
    }

    const client = await res.json();
    router.push(`/clients/${client.id}/brand`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="nameAr">
            اسم الجهة بالعربي <span className="text-destructive">*</span>
          </label>
          <input
            id="nameAr"
            name="nameAr"
            type="text"
            required
            className="input"
            placeholder="مثال: شركة نور للتقنية"
          />
        </div>
        <div>
          <label className="label" htmlFor="nameEn">
            الاسم بالإنجليزي
          </label>
          <input
            id="nameEn"
            name="nameEn"
            type="text"
            className="input"
            placeholder="Noor Tech"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="industry">
          القطاع / الصناعة
        </label>
        <input
          id="industry"
          name="industry"
          type="text"
          className="input"
          placeholder="التقنية، التعليم، الصحة..."
        />
      </div>

      <div>
        <label className="label" htmlFor="description">
          وصف مختصر
        </label>
        <textarea
          id="description"
          name="description"
          className="textarea"
          rows={3}
          placeholder="ماذا تقدم الجهة؟ ما رؤيتها ورسالتها؟"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="website">
            الموقع الإلكتروني
          </label>
          <input
            id="website"
            name="website"
            type="url"
            className="input"
            placeholder="https://example.com"
            dir="ltr"
          />
        </div>
        <div>
          <label className="label" htmlFor="contactEmail">
            بريد التواصل
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            className="input"
            placeholder="hello@example.com"
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="contactPhone">
            رقم التواصل
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            className="input"
            placeholder="+966..."
            dir="ltr"
          />
        </div>
        <div>
          <label className="label" htmlFor="status">
            الحالة
          </label>
          <select id="status" name="status" className="input" defaultValue="ACTIVE">
            {CLIENT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.labelAr}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t pt-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-ghost"
        >
          إلغاء
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          حفظ ومتابعة لدليل الجهة
        </button>
      </div>
    </form>
  );
}
