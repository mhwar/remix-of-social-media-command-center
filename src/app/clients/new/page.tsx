import { NewClientForm } from "@/components/clients/new-client-form";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/clients"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للجهات
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">إضافة جهة جديدة</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          سجّل المعلومات الأساسية — ستتمكن بعدها من ملء دليل الجهة الكامل.
        </p>
      </div>

      <div className="card">
        <div className="card-content pt-6">
          <NewClientForm />
        </div>
      </div>
    </div>
  );
}
