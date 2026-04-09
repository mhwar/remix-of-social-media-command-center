import { Users, ClipboardList, CheckCircle, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tasks, clients, statusLabels, statusColors, serviceTypeLabels } from "@/lib/mock-data";

const Dashboard = () => {
  const activeTasks = tasks.filter(t => t.status !== 'completed').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length;
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground text-sm mt-1">نظرة عامة على أعمالك</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="العملاء" value={clients.length} icon={Users} color="bg-primary/10 text-primary" />
        <StatCard title="المهام النشطة" value={activeTasks} icon={ClipboardList} color="bg-warning/10 text-warning" />
        <StatCard title="مكتملة" value={completedTasks} icon={CheckCircle} color="bg-success/10 text-success" />
        <StatCard title="متأخرة" value={overdueTasks} icon={AlertTriangle} color="bg-destructive/10 text-destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">آخر المهام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.clientName} • {serviceTypeLabels[task.serviceType]}</p>
                </div>
                <Badge variant="secondary" className={`${statusColors[task.status]} border-0 text-xs shrink-0 mr-3`}>
                  {statusLabels[task.status]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">العملاء النشطون</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {clients.filter(c => c.activeTasks > 0).map(client => (
              <div key={client.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.company}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">{client.activeTasks} مهام نشطة</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
