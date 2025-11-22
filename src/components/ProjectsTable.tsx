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
    <div className="bg-card rounded-xl border p-4 md:p-6 lg:p-8 shadow-sm hover:shadow-md transition-smooth animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg md:text-xl font-bold">Последние проекты</h3>
        
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[200px] md:w-[250px]"
            />
          </div>
          <Button variant="outline" size="icon" className="hover-scale">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-muted-foreground">Название проекта</th>
              <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-muted-foreground hidden sm:table-cell">Дата создания</th>
              <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-muted-foreground">Quality Score</th>
              <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-muted-foreground hidden md:table-cell">Статус</th>
              <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-muted-foreground">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr
                key={project.id}
                className="border-b hover:bg-muted/50 transition-smooth cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="py-3 md:py-4 px-2 md:px-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm md:text-base truncate">{project.name}</p>
                      <p className="text-xs text-muted-foreground truncate">Автор: {project.author}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 md:py-4 px-2 md:px-4 hidden sm:table-cell">
                  <div>
                    <p className="text-xs md:text-sm">{project.date}</p>
                    <p className="text-xs text-muted-foreground">{project.time}</p>
                  </div>
                </td>
                <td className="py-3 md:py-4 px-2 md:px-4">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className={`text-xl md:text-2xl font-bold ${getScoreColor(project.qualityScore)}`}>
                      {project.qualityScore}%
                    </div>
                  </div>
                </td>
                <td className="py-3 md:py-4 px-2 md:px-4 hidden md:table-cell">
                  {getStatusBadge(project.status)}
                </td>
                <td className="py-3 md:py-4 px-2 md:px-4">
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
        <p className="text-xs md:text-sm text-muted-foreground">
          Показано {filteredProjects.length} из {mockProjects.length} проектов
        </p>
        <div className="flex items-center gap-1 md:gap-2 flex-wrap justify-center">
          <Button variant="outline" size="sm" disabled className="text-xs md:text-sm">
            ← Пред.
          </Button>
          <Button variant="default" size="sm" className="text-xs md:text-sm hover-scale">1</Button>
          <Button variant="outline" size="sm" className="text-xs md:text-sm hover-scale">2</Button>
          <Button variant="outline" size="sm" className="text-xs md:text-sm hover-scale hidden sm:inline-flex">3</Button>
          <Button variant="outline" size="sm" className="text-xs md:text-sm">
            След. →
          </Button>
        </div>
      </div>
    </div>
  );
};
