import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderKanban, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type ContextValue = {
  client: Tables<"clients"> & {
    brand_guides: Tables<"brand_guides"> | null;
  };
};

type ProjectWithCount = Tables<"projects"> & { task_count: number };

export default function ClientProjects() {
  const { id } = useParams<{ id: string }>();
  const { client } = useOutletContext<ContextValue>();
  const [projects, setProjects] = useState<ProjectWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadProjects() {
    if (!id) return;
    const { data } = await supabase
      .from("projects")
      .select("*, tasks(id)")
      .eq("client_id", id)
      .order("updated_at", { ascending: false });

    const withCounts: ProjectWithCount[] = (data ?? []).map((p) => {
      const tasks = (p as unknown as { tasks: unknown[] }).tasks;
      return {
        ...(p as Tables<"projects">),
        task_count: Array.isArray(tasks) ? tasks.length : 0,
      };
    });
    setProjects(withCounts);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function createProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.from("projects").insert({
      client_id: id,
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? "") || null,
      status: "PLANNING",
    });
    setSaving(false);
    if (error) {
      toast.error("خطأ: " + error.message);
      return;
    }
    toast.success("تم إنشاء المشروع");
    setOpen(false);
    loadProjects();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">مشاريع {client.name_ar}</h2>
          <p className="text-xs text-muted-foreground">{projects.length} مشروع</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              مشروع جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={createProject}>
              <DialogHeader>
                <DialogTitle>مشروع جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">عنوان المشروع *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="مثال: حملة إطلاق رمضان"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea id="description" name="description" rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  إنشاء
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground text-sm">جارٍ التحميل...</div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-3 text-base font-semibold">لا توجد مشاريع</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              ابدأ بإنشاء مشروع لتنظيم محتوى الجهة.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{project.title}</h3>
                    {project.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">{project.status}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span>{project.task_count} مهام</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
