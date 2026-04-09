import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CLIENT_STATUSES } from "@/lib/brand-constants";
import { toast } from "sonner";

export default function ClientNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("ACTIVE");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name_ar: String(form.get("name_ar") ?? "").trim(),
      name_en: String(form.get("name_en") ?? "").trim() || null,
      industry: String(form.get("industry") ?? "").trim() || null,
      description: String(form.get("description") ?? "").trim() || null,
      website: String(form.get("website") ?? "").trim() || null,
      contact_email: String(form.get("contact_email") ?? "").trim() || null,
      contact_phone: String(form.get("contact_phone") ?? "").trim() || null,
      status,
    };

    if (!payload.name_ar) {
      toast.error("اسم الجهة مطلوب");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("clients_brands")
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      toast.error("خطأ: " + (error?.message ?? "لم يتم الحفظ"));
      setLoading(false);
      return;
    }

    toast.success("تم إنشاء الجهة");
    navigate(`/clients/${data.id}/brand`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          to="/clients"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للعملاء
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">إضافة جهة جديدة</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          سجّل المعلومات الأساسية — ستتمكن بعدها من ملء دليل الجهة الكامل.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name_ar">
                  اسم الجهة بالعربي <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name_ar"
                  name="name_ar"
                  required
                  placeholder="مثال: شركة نور للتقنية"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name_en">الاسم بالإنجليزي</Label>
                <Input id="name_en" name="name_en" placeholder="Noor Tech" dir="ltr" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="industry">القطاع / الصناعة</Label>
              <Input
                id="industry"
                name="industry"
                placeholder="التقنية، التعليم، الصحة..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">وصف مختصر</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="ماذا تقدم الجهة؟ ما رؤيتها ورسالتها؟"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="website">الموقع الإلكتروني</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://example.com"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact_email">بريد التواصل</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  placeholder="hello@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contact_phone">رقم التواصل</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  placeholder="+966..."
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <Label>الحالة</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENT_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.labelAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-5">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                حفظ ومتابعة لدليل الجهة
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
