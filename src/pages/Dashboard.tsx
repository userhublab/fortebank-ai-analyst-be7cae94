import { Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, Star, Moon, Sun } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { ActivityChart } from '@/components/ActivityChart';
import { ProjectsTable } from '@/components/ProjectsTable';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b h-[72px]">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FB</span>
            </div>
            <span className="text-xl font-bold text-primary">AI-BA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors">
              Chat
            </Link>
            <Link to="/document" className="text-muted-foreground hover:text-primary transition-colors">
              Документ
            </Link>
            <Link to="/dashboard" className="text-primary font-semibold">
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all duration-300 hover:rotate-180"
              title={isDark ? 'Светлая тема' : 'Темная тема'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[96px] pb-12 px-6 container mx-auto max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Briefcase}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
            title="Всего проектов"
            value="47"
            change="+12 за месяц"
            changeType="positive"
          />
          <StatsCard
            icon={Clock}
            iconColor="text-purple-500"
            iconBgColor="bg-purple-500/10"
            title="Сэкономлено времени"
            value="156 часов"
            change="+23 часа за неделю"
            changeType="positive"
          />
          <StatsCard
            icon={CheckCircle}
            iconColor="text-green-500"
            iconBgColor="bg-green-500/10"
            title="Завершенных проектов"
            value="38"
            change="81% от общего числа"
            changeType="neutral"
          />
          <StatsCard
            icon={Star}
            iconColor="text-yellow-500"
            iconBgColor="bg-yellow-500/10"
            title="Средний Quality Score"
            value="87%"
            change="+5% за месяц"
            changeType="positive"
          />
        </div>

        {/* Activity Chart */}
        <div className="mb-8">
          <ActivityChart />
        </div>

        {/* Projects Table */}
        <ProjectsTable />
      </main>
    </div>
  );
}
