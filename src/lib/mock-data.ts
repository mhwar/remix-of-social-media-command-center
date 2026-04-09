export type TaskStatus = 'new' | 'in_progress' | 'awaiting_approval' | 'completed';
export type ServiceType = 'content' | 'design' | 'report' | 'ads';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  platforms: string[];
  tasksCount: number;
  activeTasks: number;
}

export interface Task {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  serviceType: ServiceType;
  status: TaskStatus;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tasksCount: number;
  completedTasks: number;
}

export const serviceTypeLabels: Record<ServiceType, string> = {
  content: 'كتابة محتوى',
  design: 'تصميم جرافيك',
  report: 'تقرير أداء',
  ads: 'إدارة إعلانات',
};

export const statusLabels: Record<TaskStatus, string> = {
  new: 'جديد',
  in_progress: 'قيد التنفيذ',
  awaiting_approval: 'بانتظار الموافقة',
  completed: 'مكتمل',
};

export const statusColors: Record<TaskStatus, string> = {
  new: 'bg-primary/10 text-primary',
  in_progress: 'bg-warning/10 text-warning',
  awaiting_approval: 'bg-accent/10 text-accent',
  completed: 'bg-success/10 text-success',
};

export const serviceColors: Record<ServiceType, string> = {
  content: 'bg-primary/10 text-primary',
  design: 'bg-accent/10 text-accent',
  report: 'bg-success/10 text-success',
  ads: 'bg-warning/10 text-warning',
};

export const clients: Client[] = [
  { id: '1', name: 'أحمد الشمري', company: 'شركة النخبة', email: 'ahmed@elite.sa', phone: '0501234567', platforms: ['Instagram', 'Twitter', 'TikTok'], tasksCount: 12, activeTasks: 3 },
  { id: '2', name: 'سارة القحطاني', company: 'مؤسسة الإبداع', email: 'sara@ibdaa.sa', phone: '0559876543', platforms: ['Instagram', 'Snapchat'], tasksCount: 8, activeTasks: 2 },
  { id: '3', name: 'محمد العتيبي', company: 'متجر رونق', email: 'mohammed@ronaq.sa', phone: '0541112233', platforms: ['Instagram', 'Twitter', 'TikTok', 'Snapchat'], tasksCount: 15, activeTasks: 5 },
  { id: '4', name: 'نورة الدوسري', company: 'عيادة الجمال', email: 'noura@jamal.sa', phone: '0532223344', platforms: ['Instagram', 'Snapchat'], tasksCount: 6, activeTasks: 1 },
  { id: '5', name: 'خالد المطيري', company: 'مطعم الأصيل', email: 'khaled@aseel.sa', phone: '0567778899', platforms: ['Instagram', 'TikTok'], tasksCount: 10, activeTasks: 4 },
];

export const tasks: Task[] = [
  { id: '1', title: 'تصميم بوست إنستغرام - عرض رمضان', clientId: '1', clientName: 'شركة النخبة', serviceType: 'design', status: 'in_progress', assignedTo: 'فاطمة', dueDate: '2026-04-12', createdAt: '2026-04-05', description: 'تصميم 5 بوستات لعرض رمضان مع ستوريز', priority: 'high' },
  { id: '2', title: 'كتابة محتوى أسبوعي - إنستغرام', clientId: '2', clientName: 'مؤسسة الإبداع', serviceType: 'content', status: 'awaiting_approval', assignedTo: 'يوسف', dueDate: '2026-04-10', createdAt: '2026-04-03', description: 'كتابة 7 بوستات مع هاشتاقات', priority: 'medium' },
  { id: '3', title: 'تقرير أداء شهري - مارس', clientId: '3', clientName: 'متجر رونق', serviceType: 'report', status: 'new', assignedTo: 'يوسف', dueDate: '2026-04-15', createdAt: '2026-04-08', description: 'تقرير شامل لأداء جميع المنصات', priority: 'high' },
  { id: '4', title: 'إدارة حملة إعلانية - إطلاق منتج', clientId: '3', clientName: 'متجر رونق', serviceType: 'ads', status: 'in_progress', assignedTo: 'فاطمة', dueDate: '2026-04-20', createdAt: '2026-04-01', description: 'حملة إعلانية على إنستغرام وسناب شات', priority: 'high' },
  { id: '5', title: 'تصميم هوية سناب شات', clientId: '4', clientName: 'عيادة الجمال', serviceType: 'design', status: 'completed', assignedTo: 'فاطمة', dueDate: '2026-04-05', createdAt: '2026-03-28', description: 'تصميم قالب ستوري وهايلايت', priority: 'low' },
  { id: '6', title: 'خطة محتوى شهرية - أبريل', clientId: '5', clientName: 'مطعم الأصيل', serviceType: 'content', status: 'new', assignedTo: 'يوسف', dueDate: '2026-04-11', createdAt: '2026-04-07', description: 'خطة محتوى شاملة لشهر أبريل', priority: 'medium' },
  { id: '7', title: 'تصميم ريلز تيك توك', clientId: '1', clientName: 'شركة النخبة', serviceType: 'design', status: 'new', assignedTo: 'فاطمة', dueDate: '2026-04-14', createdAt: '2026-04-09', description: '3 فيديوهات قصيرة للتيك توك', priority: 'medium' },
  { id: '8', title: 'تقرير حملة إعلانية', clientId: '5', clientName: 'مطعم الأصيل', serviceType: 'report', status: 'completed', assignedTo: 'يوسف', dueDate: '2026-04-03', createdAt: '2026-03-25', description: 'تقرير نتائج الحملة الإعلانية السابقة', priority: 'low' },
];

export const teamMembers: TeamMember[] = [
  { id: '1', name: 'يوسف', role: 'كاتب محتوى', avatar: 'ي', tasksCount: 4, completedTasks: 12 },
  { id: '2', name: 'فاطمة', role: 'مصممة جرافيك', avatar: 'ف', tasksCount: 4, completedTasks: 18 },
];

export const calendarEvents = [
  { id: '1', title: 'بوست إنستغرام - النخبة', date: '2026-04-10', type: 'design' as ServiceType, status: 'in_progress' as TaskStatus },
  { id: '2', title: 'محتوى أسبوعي - الإبداع', date: '2026-04-10', type: 'content' as ServiceType, status: 'awaiting_approval' as TaskStatus },
  { id: '3', title: 'تقرير شهري - رونق', date: '2026-04-15', type: 'report' as ServiceType, status: 'new' as TaskStatus },
  { id: '4', title: 'حملة إعلانية - رونق', date: '2026-04-20', type: 'ads' as ServiceType, status: 'in_progress' as TaskStatus },
  { id: '5', title: 'ستوري سناب - الأصيل', date: '2026-04-12', type: 'content' as ServiceType, status: 'new' as TaskStatus },
  { id: '6', title: 'ريلز تيك توك - النخبة', date: '2026-04-14', type: 'design' as ServiceType, status: 'new' as TaskStatus },
  { id: '7', title: 'خطة محتوى - الأصيل', date: '2026-04-11', type: 'content' as ServiceType, status: 'new' as TaskStatus },
  { id: '8', title: 'بوست تويتر - النخبة', date: '2026-04-17', type: 'content' as ServiceType, status: 'new' as TaskStatus },
  { id: '9', title: 'تصميم ستوري - الإبداع', date: '2026-04-22', type: 'design' as ServiceType, status: 'new' as TaskStatus },
];
