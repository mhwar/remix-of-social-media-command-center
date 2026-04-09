import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tasks, statusLabels, statusColors, serviceTypeLabels, serviceColors, TaskStatus, ServiceType } from "@/lib/mock-data";

const Tasks = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ServiceType | "all">("all");

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.includes(search) || t.clientName.includes(search);
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchType = typeFilter === "all" || t.serviceType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...filtered].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">المهام والطلبات</h1>
        <p className="text-muted-foreground text-sm mt-1">{tasks.length} مهمة</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="pr-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as TaskStatus | "all")}
          >
            <option value="all">كل الحالات</option>
            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as ServiceType | "all")}
          >
            <option value="all">كل الخدمات</option>
            {Object.entries(serviceTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map(task => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-sm">{task.title}</h3>
                    {task.priority === 'high' && (
                      <Badge variant="destructive" className="text-xs">عاجل</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {task.clientName} • {task.assignedTo} • تسليم: {task.dueDate}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className={`${serviceColors[task.serviceType]} border-0 text-xs`}>
                    {serviceTypeLabels[task.serviceType]}
                  </Badge>
                  <Badge variant="secondary" className={`${statusColors[task.status]} border-0 text-xs`}>
                    {statusLabels[task.status]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
