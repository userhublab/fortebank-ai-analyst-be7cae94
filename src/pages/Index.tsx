import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, MessageSquare, Palette, CheckCircle, FileText, Clock, Target, TrendingUp, Briefcase, Download, Upload, Eye, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const features = [
    {
      icon: MessageSquare,
      title: "AI Диалог",
      description: "Интеллектуальный сбор требований через естественный диалог",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Palette,
      title: "Visual Designer",
      description: "Автоматическая генерация диаграмм процессов и архитектуры",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      badge: "NEW"
    },
    {
      icon: CheckCircle,
      title: "Smart Validator",
      description: "Проверка качества требований с оценкой полноты и рекомендациями",
      color: "text-success",
      bgColor: "bg-success/10",
      badge: "NEW"
    },
    {
      icon: FileText,
      title: "Автодокументация",
      description: "Генерация полного пакета документов: Use Cases, диаграммы, KPI",
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  const steps = [
    {
      number: "1",
      icon: MessageSquare,
      title: "Ведете диалог с AI",
      description: "AI задает уточняющие вопросы и собирает все требования",
      color: "bg-primary"
    },
    {
      number: "2",
      icon: Sparkles,
      title: "AI анализирует и структурирует",
      description: "Автоматическая проверка полноты, генерация диаграмм и валидация",
      color: "bg-purple-500"
    },
    {
      number: "3",
      icon: Download,
      title: "Получаете готовый документ",
      description: "Полный пакет требований с диаграммами и экспортом в Confluence",
      color: "bg-success"
    }
  ];

  const stats = [
    {
      icon: Clock,
      value: "80%",
      label: "экономия времени аналитиков"
    },
    {
      icon: FileText,
      value: "500+",
      label: "созданных документов требований"
    },
    {
      icon: Target,
      value: "95%",
      label: "точность извлечения требований"
    },
    {
      icon: TrendingUp,
      value: "4 мес",
      label: "срок окупаемости решения"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-background/80 backdrop-blur-md border-b border-border transition-smooth">
        <div className="container mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">AI-BA</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-muted-foreground hover:text-primary transition-smooth">О проекте</a>
            <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">Возможности</a>
            <a href="#demo" className="text-muted-foreground hover:text-primary transition-smooth">Демо</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/chat")}>
              Войти
            </Button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-smooth"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-[120px] pb-20 gradient-hero">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-secondary text-primary border-0 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Powered by Claude AI
              </Badge>
              
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  AI-Business Analyst
                  <br />
                  <span className="text-primary">for ForteBank</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Автоматизируйте сбор требований с помощью ИИ. От диалога до документа за 30 минут.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 transition-smooth shadow-lg hover:shadow-xl hover:scale-105"
                  onClick={() => navigate("/chat")}
                >
                  Начать работу
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="hover:border-primary transition-smooth"
                >
                  Смотреть демо
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">30 мин</div>
                  <div className="text-sm text-muted-foreground">вместо 3 дней</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">точность</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">проектов</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl opacity-30"></div>
              <div className="relative bg-card border border-border rounded-2xl p-6 shadow-elegant">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-foreground">Опишите проект модернизации CRM для банка</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">Хорошо, давайте начнем с целей проекта. Какие основные бизнес-задачи вы хотите решить?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pl-11">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">AI печатает...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Уникальные возможности</h2>
            <p className="text-xl text-muted-foreground">Полный цикл работы с требованиями в одном решении</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-smooth group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-500 border-purple-500/20">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Как это работает</h2>
            <p className="text-xl text-muted-foreground">Три простых шага до готового документа</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto shadow-lg`}>
                    {step.number}
                  </div>
                  <step.icon className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-muted-foreground/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Showcase */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Результаты, которые говорят сами за себя</h2>
            <p className="text-xl opacity-90">Проверенная эффективность на реальных проектах ForteBank</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-4 opacity-90" />
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Готовы автоматизировать работу аналитиков?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Начните создавать требования с AI прямо сейчас
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 transition-smooth shadow-xl hover:shadow-2xl hover:scale-105 text-lg px-12 py-6"
            onClick={() => navigate("/chat")}
          >
            Попробовать бесплатно
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-semibold">AI-Business Analyst</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 ForteBank. Powered by Claude AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
