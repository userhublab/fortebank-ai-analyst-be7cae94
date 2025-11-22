import { useState } from 'react';
import { FileText, Search, Filter, MoreVertical, Eye, Edit, Download, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Project {
  id: string;
  name: string;
  author: string;
  date: string;
  time: string;
  qualityScore: number;
  status: 'completed' | 'in-progress' | 'attention';
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'CRM Модернизация',
    author: 'Иван Петров',
    date: '21 ноя 2025',
    time: '14:30',
    qualityScore: 87,
    status: 'completed'
  },
  {
    id: '2',
    name: 'Мобильный банкинг v2.0',
    author: 'Анна Смирнова',
    date: '20 ноя 2025',
    time: '11:15',
    qualityScore: 92,
    status: 'completed'
  },
  {
    id: '3',
    name: 'Система отчетности',
    author: 'Петр Сидоров',
    date: '19 ноя 2025',
    time: '16:45',
    qualityScore: 75,
    status: 'in-progress'
  },
  {
    id: '4',
    name: 'API интеграция',
    author: 'Мария Иванова',
    date: '18 ноя 2025',
    time: '09:20',
    qualityScore: 55,
    status: 'attention'
  },
  {
    id: '5',
    name: 'Документооборот',
    author: 'Алексей Козлов',
    date: '17 ноя 2025',
    time: '13:50',
    qualityScore: 88,
    status: 'completed'
  }
];

export const ProjectsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: Project['status']) => {
    const config = {
      completed: { label: '✅ Завершен', variant: 'default' as const },
      'in-progress': { label: '📝 В работе', variant: 'secondary' as const },
      attention: { label: '⚠️ Требует внимания', variant: 'destructive' as const }
    };
    
    const { label, variant } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="bg-card rounded-xl border p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Последние проекты</h3>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[250px]"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Название проекта</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Дата создания</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Quality Score</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Статус</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr
                key={project.id}
                className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{project.name}</p>
                      <p className="text-xs text-muted-foreground">Автор: {project.author}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm">{project.date}</p>
                    <p className="text-xs text-muted-foreground">{project.time}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`text-2xl font-bold ${getScoreColor(project.qualityScore)}`}>
                      {project.qualityScore}%
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(project.status)}
                </td>
                <td className="py-4 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Открыть
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Экспорт
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Показано {filteredProjects.length} из {mockProjects.length} проектов
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            ← Предыдущая
          </Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">
            Следующая →
          </Button>
        </div>
      </div>
    </div>
  );
};
