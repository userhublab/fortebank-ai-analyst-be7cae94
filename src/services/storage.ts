// Local Storage Service for Projects

export interface Project {
  id: string;
  name: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'in-progress' | 'completed' | 'attention';
  qualityScore: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  document?: {
    goals: string[];
    scope: {
      included: string[];
      excluded: string[];
    };
    useCases: Array<{
      id: string;
      title: string;
      actor: string;
      steps: string[];
    }>;
    diagrams: string[];
  };
}

class StorageService {
  private PROJECTS_KEY = 'aibi_projects';
  private CURRENT_PROJECT_KEY = 'aibi_current_project';
  private STATS_KEY = 'aibi_stats';

  // Projects
  getProjects(): Project[] {
    const stored = localStorage.getItem(this.PROJECTS_KEY);
    if (!stored) return this.getDefaultProjects();
    return JSON.parse(stored);
  }

  getProject(id: string): Project | null {
    const projects = this.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  saveProject(project: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift(project);
    }
    
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
    this.updateStats();
  }

  deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
    this.updateStats();
  }

  getCurrentProject(): string | null {
    return localStorage.getItem(this.CURRENT_PROJECT_KEY);
  }

  setCurrentProject(id: string): void {
    localStorage.setItem(this.CURRENT_PROJECT_KEY, id);
  }

  createNewProject(name: string, author: string = 'AI-Business Analyst'): Project {
    const project: Project = {
      id: `proj_${Date.now()}`,
      name,
      description: '',
      author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'in-progress',
      qualityScore: 0,
      messages: []
    };
    
    this.saveProject(project);
    this.setCurrentProject(project.id);
    return project;
  }

  addMessageToProject(projectId: string, role: 'user' | 'assistant', content: string): void {
    const project = this.getProject(projectId);
    if (!project) return;

    project.messages.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });

    this.saveProject(project);
  }

  updateProjectDocument(projectId: string, document: Project['document']): void {
    const project = this.getProject(projectId);
    if (!project) return;

    project.document = document;
    this.saveProject(project);
  }

  updateProjectScore(projectId: string, score: number): void {
    const project = this.getProject(projectId);
    if (!project) return;

    project.qualityScore = score;
    
    // Auto-update status based on score
    if (score >= 80) {
      project.status = 'completed';
    } else if (score >= 60) {
      project.status = 'in-progress';
    } else {
      project.status = 'attention';
    }

    this.saveProject(project);
  }

  // Statistics
  getStats() {
    const stored = localStorage.getItem(this.STATS_KEY);
    if (stored) return JSON.parse(stored);
    
    return this.calculateStats();
  }

  private updateStats(): void {
    const stats = this.calculateStats();
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }

  private calculateStats() {
    const projects = this.getProjects();
    const completed = projects.filter(p => p.status === 'completed').length;
    const avgScore = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.qualityScore, 0) / projects.length)
      : 0;
    
    // Calculate time saved (mock calculation)
    const timeSaved = projects.length * 3.3; // Each project saves ~3.3 hours
    
    return {
      totalProjects: projects.length,
      completedProjects: completed,
      averageScore: avgScore,
      timeSaved: Math.round(timeSaved),
      lastUpdated: new Date().toISOString()
    };
  }

  // Activity data for charts
  getActivityData(days: 7 | 30 | 90) {
    const projects = this.getProjects();
    const now = new Date();
    const data: Array<{ date: string; projects: number }> = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      
      const count = projects.filter(p => {
        const projectDate = new Date(p.createdAt);
        return projectDate.toDateString() === date.toDateString();
      }).length;
      
      data.push({ date: dateStr, projects: count });
    }
    
    return data;
  }

  // Default demo projects
  private getDefaultProjects(): Project[] {
    const defaultProjects: Project[] = [
      {
        id: 'demo_1',
        name: 'CRM Модернизация',
        description: 'Обновление системы управления клиентами',
        author: 'Иван Петров',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed',
        qualityScore: 87,
        messages: []
      },
      {
        id: 'demo_2',
        name: 'Мобильный банкинг v2.0',
        description: 'Новая версия мобильного приложения',
        author: 'Анна Смирнова',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'completed',
        qualityScore: 92,
        messages: []
      },
      {
        id: 'demo_3',
        name: 'Система отчетности',
        description: 'Автоматизация финансовой отчетности',
        author: 'Петр Сидоров',
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 14400000).toISOString(),
        status: 'in-progress',
        qualityScore: 75,
        messages: []
      },
      {
        id: 'demo_4',
        name: 'API интеграция',
        description: 'Интеграция с внешними сервисами',
        author: 'Мария Иванова',
        createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        updatedAt: new Date(Date.now() - 21600000).toISOString(),
        status: 'attention',
        qualityScore: 55,
        messages: []
      },
      {
        id: 'demo_5',
        name: 'Документооборот',
        description: 'Электронный документооборот',
        author: 'Алексей Козлов',
        createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 28800000).toISOString(),
        status: 'completed',
        qualityScore: 88,
        messages: []
      }
    ];

    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(defaultProjects));
    return defaultProjects;
  }

  // Reset to demo data
  resetToDemo(): void {
    localStorage.removeItem(this.PROJECTS_KEY);
    localStorage.removeItem(this.STATS_KEY);
    this.getDefaultProjects();
    this.updateStats();
  }
}

export const storage = new StorageService();
