import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { teamMembers, tasks, statusLabels, statusColors, serviceTypeLabels } from "@/lib/mock-data";

const Team = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الفريق</h1>
        <p className="text-muted-foreground text-sm mt-1">{teamMembers.length} أعضاء</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teamMembers.map(member => {
          const memberTasks = tasks.filter(t => t.assignedTo === member.name);
          const activeTasks = memberTasks.filter(t => t.status !== 'completed');
          const completionRate = memberTasks.length > 0
            ? Math.round((memberTasks.filter(t => t.status === 'completed').length / memberTasks.length) * 100)
            : 0;

          return (
            <Card key={member.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">نسبة الإنجاز</span>
                      <Progress value={completionRate} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{completionRate}%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="text-sm font-medium mb-3">المهام الحالية ({activeTasks.length})</h4>
                <div className="space-y-2">
                  {activeTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.clientName} • تسليم: {task.dueDate}</p>
                      </div>
                      <Badge variant="secondary" className={`${statusColors[task.status]} border-0 text-xs shrink-0 mr-2`}>
                        {statusLabels[task.status]}
                      </Badge>
                    </div>
                  ))}
                  {activeTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">لا توجد مهام حالية</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
