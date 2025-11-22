import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { ConfluenceExportModal } from "@/components/ConfluenceExportModal";
import { SmartValidator } from "@/components/SmartValidator";
import { DiagramGenerator } from "@/components/DiagramGenerator";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { sampleDiagrams } from "@/utils/mermaid-config";
import { 
  FileText, 
  Download, 
  Upload, 
  Edit, 
  Target,
  Layers,
  GitBranch,
  TrendingUp,
  Activity,
  CheckCircle,
  User,
  ArrowLeft,
  Palette
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Document = () => {
  const navigate = useNavigate();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const navLinks = [
    { id: "description", label: "Описание проекта" },
    { id: "goals", label: "Цели и задачи" },
    { id: "scope", label: "Scope (Границы)" },
    { id: "use-cases", label: "Use Cases" },
    { id: "kpi", label: "KPI и метрики" },
    { id: "diagrams", label: "Диаграммы" },
  ];

  const activeSection = useScrollSpy(navLinks.map(link => link.id));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-[240px] border-r border-border bg-muted/30 p-6 fixed h-screen overflow-y-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6"
          onClick={() => navigate("/chat")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к чату
        </Button>

        <h3 className="text-lg font-semibold mb-6">Содержание</h3>
        
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`block px-3 py-2 rounded-lg text-sm transition-smooth ${
                activeSection === link.id
                  ? 'bg-primary text-primary-foreground font-semibold border-l-4 border-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-primary'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-8 space-y-3 pt-6 border-t border-border">
          <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт PDF
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            В Confluence
          </Button>
          <Button variant="ghost" className="w-full" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Редактировать
          </Button>
        </div>
      </aside>

      {/* Document Viewer */}
      <main className="flex-1 ml-[240px]">
        <div className="max-w-[900px] mx-auto p-12 bg-card my-8 rounded-2xl shadow-elegant">
          {/* Document Header */}
          <header className="mb-12 pb-8 border-b-2 border-border">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Бизнес-требования: CRM Модернизация
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Создан: 21 ноября 2025</span>
              <span>•</span>
              <span>Автор: AI-Business Analyst</span>
              <Badge className="bg-success/10 text-success border-success/20">
                <CheckCircle className="mr-1 h-3 w-3" />
                Проверено
              </Badge>
            </div>
          </header>

          {/* Smart Validator */}
          <SmartValidator 
            documentContent="CRM Модернизация - полный текст документа для анализа..."
          />

          {/* Section 1: Description */}
          <section id="description" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-primary">1. Описание проекта</h2>
            </div>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                Проект направлен на модернизацию существующей CRM-системы банка с целью повышения качества обслуживания клиентов и оптимизации работы сотрудников. Текущая система морально устарела и не соответствует современным требованиям бизнеса.
              </p>
              <p>
                В рамках проекта планируется внедрение новых функциональных возможностей, улучшение пользовательского интерфейса и интеграция с современными системами банка.
              </p>
            </div>
          </section>

          {/* Section 2: Goals */}
          <section id="goals" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-primary">2. Цели и задачи</h2>
            </div>
            <h3 className="text-xl font-semibold mb-4">Бизнес-цели:</h3>
            <div className="space-y-3">
              {[
                "Увеличить скорость обработки заявок на 40%",
                "Снизить количество ошибок на 25%",
                "Повысить удовлетворенность клиентов до 90%",
                "Оптимизировать рабочие процессы операторов"
              ].map((goal, index) => (
                <div key={index} className="bg-accent rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{goal}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Scope */}
          <section id="scope" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-primary">3. Scope (Границы проекта)</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-success/5 border-l-4 border-success rounded-lg p-6">
                <h3 className="text-lg font-semibold text-success mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  В проекте
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Модернизация интерфейса для операторов</li>
                  <li>• Интеграция с системой документооборота</li>
                  <li>• Мобильное приложение для клиентов</li>
                  <li>• Автоматизация типовых операций</li>
                </ul>
              </div>

              <div className="bg-destructive/5 border-l-4 border-destructive rounded-lg p-6">
                <h3 className="text-lg font-semibold text-destructive mb-4">
                  ❌ Не входит
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Изменение backend архитектуры</li>
                  <li>• Миграция исторических данных</li>
                  <li>• Интеграция с внешними CRM</li>
                  <li>• Изменение бизнес-процессов кредитования</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Use Cases */}
          <section id="use-cases" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <GitBranch className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-primary">4. Use Cases</h2>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-border rounded-xl p-6 hover:shadow-lg transition-smooth">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">UC-1: Создание заявки клиентом</h3>
                  </div>
                  <Badge variant="destructive">Критичный</Badge>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-semibold text-muted-foreground">Актор:</span>
                    <p className="mt-1">Клиент банка</p>
                  </div>

                  <div>
                    <span className="font-semibold text-muted-foreground">Предусловия:</span>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• Клиент авторизован в системе</li>
                      <li>• Клиент имеет активный счет</li>
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-muted-foreground">Основной сценарий:</span>
                    <ol className="mt-2 space-y-2 ml-4">
                      <li className="bg-muted/50 p-2 rounded">1. Клиент открывает мобильное приложение</li>
                      <li className="bg-muted/50 p-2 rounded">2. Выбирает тип услуги из списка</li>
                      <li className="bg-muted/50 p-2 rounded">3. Заполняет форму заявки</li>
                      <li className="bg-muted/50 p-2 rounded">4. Подтверждает отправку</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: KPI */}
          <section id="kpi" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-primary">5. KPI и метрики успеха</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-success to-success/70 text-white rounded-xl p-6">
                <Target className="h-8 w-8 mb-3" />
                <p className="text-sm opacity-90 mb-2">Скорость обработки</p>
                <p className="text-4xl font-bold mb-2">45 мин</p>
                <p className="text-sm opacity-75">Цель: 30 мин</p>
                <div className="mt-4 h-2 bg-white/20 rounded-full">
                  <div className="h-full bg-white rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-xl p-6">
                <Activity className="h-8 w-8 mb-3" />
                <p className="text-sm opacity-90 mb-2">Удовлетворенность</p>
                <p className="text-4xl font-bold mb-2">82%</p>
                <p className="text-sm opacity-75">Цель: 90%</p>
                <div className="mt-4 h-2 bg-white/20 rounded-full">
                  <div className="h-full bg-white rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                <CheckCircle className="h-8 w-8 mb-3" />
                <p className="text-sm opacity-90 mb-2">Количество ошибок</p>
                <p className="text-4xl font-bold mb-2">12/день</p>
                <p className="text-sm opacity-75">Цель: {'<'} 5/день</p>
                <div className="mt-4 h-2 bg-white/20 rounded-full">
                  <div className="h-full bg-white rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Diagrams */}
          <section id="diagrams" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-primary">6. Диаграммы и визуализация</h2>
              <Badge className="bg-purple-500">AI Generated</Badge>
            </div>
            <p className="text-sm text-muted-foreground italic mb-8">Автоматически сгенерировано AI Visual Designer</p>

            <div className="space-y-8">
              <div className="group">
                <h3 className="text-xl font-semibold mb-4">Процесс обработки заявки (BPMN)</h3>
                <MermaidDiagram chart={sampleDiagrams.bpmn} title="BPMN Process" isDark={isDark} />
              </div>

              <div className="group">
                <h3 className="text-xl font-semibold mb-4">Взаимодействие компонентов системы</h3>
                <MermaidDiagram chart={sampleDiagrams.sequence} title="Sequence Diagram" isDark={isDark} />
              </div>

              <div className="group">
                <h3 className="text-xl font-semibold mb-4">Путь клиента (Customer Journey)</h3>
                <MermaidDiagram chart={sampleDiagrams.journey} title="User Journey" isDark={isDark} />
              </div>

              <div className="mt-8">
                <DiagramGenerator />
              </div>
            </div>
          </section>

          {/* Document Footer */}
          <footer className="mt-16 pt-8 border-t-2 border-border text-sm text-muted-foreground">
            <div className="flex justify-between items-center">
              <span>Сгенерировано AI-Business Analyst | ForteBank</span>
              <span>21 ноября 2025, 14:30</span>
              <span className="font-semibold">v1.0</span>
            </div>
          </footer>
        </div>
      </main>

      <ConfluenceExportModal 
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        documentTitle="Бизнес-требования: CRM Модернизация"
      />
    </div>
  );
};

export default Document;
