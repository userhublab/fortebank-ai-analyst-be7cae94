import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypewriterText } from "@/components/TypewriterText";
import { VoiceInput } from "@/components/VoiceInput";
import { FileUpload } from "@/components/FileUpload";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { aiService, AIProvider } from "@/services/ai";
import { storage } from "@/services/storage";
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Settings, 
  FileText,
  Sparkles,
  User,
  Moon,
  Sun,
  Loader2,
  AlertCircle,
  Mic,
  MicOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const Chat = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [aiProvider, setAiProvider] = useState<AIProvider | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Здравствуйте! Я AI-Business Analyst от ForteBank. Помогу вам собрать и структурировать бизнес-требования для вашего проекта. Расскажите, над чем вы работаете?",
      timestamp: new Date(),
      isTyping: true
    }
  ]);

  useEffect(() => {
    // Load or create current project
    let projectId = storage.getCurrentProject();
    if (!projectId) {
      const newProject = storage.createNewProject('Новый проект', 'Текущий пользователь');
      projectId = newProject.id;
    }
    setCurrentProjectId(projectId);

    // Check AI config
    const config = aiService.getConfig();
    if (!config) {
      setShowApiKeyDialog(true);
    } else {
      setAiProvider(config.provider);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleApiConfig = (provider: AIProvider, apiKey?: string) => {
    aiService.setConfig({ provider, apiKey });
    setAiProvider(provider);
    toast.success(`${provider === 'claude' ? 'Claude' : 'Gemini'} настроен успешно!`);
  };

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

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const config = aiService.getConfig();
    if (!config) {
      toast.error('Please configure AI provider first', {
        action: {
          label: 'Configure',
          onClick: () => setShowApiKeyDialog(true)
        }
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsAiTyping(true);

    // Save to project
    if (currentProjectId) {
      storage.addMessageToProject(currentProjectId, 'user', inputValue);
    }

    try {
      const conversationHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await aiService.chat(conversationHistory);
      
      setIsAiTyping(false);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        isTyping: true
      };
      setMessages(prev => [...prev, aiMessage]);

      // Save AI response
      if (currentProjectId) {
        storage.addMessageToProject(currentProjectId, 'assistant', response);
      }
    } catch (error) {
      setIsAiTyping(false);
      console.error('AI error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(errorMessage, {
        icon: <AlertCircle className="w-4 h-4" />,
        action: errorMessage.includes('configured') ? {
          label: 'Configure',
          onClick: () => setShowApiKeyDialog(true)
        } : undefined
      });
      
      // Remove user message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    }
  };

  const handleVoiceTranscript = useCallback((transcript: string) => {
    setInputValue(transcript);
  }, []);

  const handleFileProcessed = useCallback((summary: any) => {
    const summaryMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: `Я проанализировал ваш документ и нашел следующее:\n\n📋 Извлечено ${summary.requirements} требований\n🎯 ${summary.goals} ключевых целей\n📊 ${summary.useCases} Use Cases\n👥 ${summary.stakeholders} стейкхолдера\n\nГотов помочь структурировать эти требования в полноценный документ. Хотите начать?`,
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, summaryMessage]);
    toast.success('✅ Документ успешно обработан');
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-[280px] border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <Button className="w-full bg-primary hover:bg-primary/90 transition-smooth" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Новый проект
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">История</h3>
            <div className="space-y-2">
              <div className="bg-card border-l-4 border-primary rounded-lg p-3 cursor-pointer hover:bg-accent transition-smooth">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">CRM Модернизация</span>
                </div>
                <p className="text-xs text-muted-foreground">21 ноя, 2025</p>
              </div>

              <div className="bg-card rounded-lg p-3 cursor-pointer hover:bg-accent transition-smooth border border-transparent hover:border-border">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">Мобильное приложение</span>
                </div>
                <p className="text-xs text-muted-foreground">18 ноя, 2025</p>
              </div>

              <div className="bg-card rounded-lg p-3 cursor-pointer hover:bg-accent transition-smooth border border-transparent hover:border-border">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">Портал самообслуживания</span>
                </div>
                <p className="text-xs text-muted-foreground">15 ноя, 2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            size="sm"
            onClick={() => setShowApiKeyDialog(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">Настройки AI</span>
            {aiProvider && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {aiProvider === 'claude' ? 'Claude' : 'Gemini'}
              </span>
            )}
          </Button>
          <div className="flex items-center gap-3 mt-4 p-2 rounded-lg hover:bg-accent transition-smooth cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Иван Петров</p>
              <p className="text-xs text-muted-foreground truncate">analyst@fortebank.kz</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-[72px] border-b border-border flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              CRM Модернизация
            </h1>
            <p className="text-sm text-muted-foreground">Создан 21 ноября</p>
          </div>

          <div className="flex items-center gap-3">
            {!aiProvider && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setShowApiKeyDialog(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Настроить AI
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/document")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Документ
            </Button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-smooth"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="flex gap-3 max-w-[70%]">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 shadow-sm">
                    {message.isTyping ? (
                      <TypewriterText
                        text={message.content}
                        className="text-foreground leading-relaxed whitespace-pre-wrap"
                      />
                    ) : (
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              )}

              {message.role === "user" && (
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-4 max-w-[70%] shadow-lg">
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              )}
            </div>
          ))}
          
          {isAiTyping && (
            <div className="flex gap-3 max-w-[70%]">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4">
          <FileUpload onFileProcessed={handleFileProcessed} />
          
          <div className="flex items-end gap-3 mt-3">
            <VoiceInput 
              onTranscript={handleVoiceTranscript}
              onRecordingChange={setIsRecording}
            />

            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Опишите вашу задачу или нажмите 🎤 для голосового ввода..."
                className="min-h-[48px] resize-none bg-muted/50 border-border focus:border-primary transition-smooth"
                autoFocus
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90 transition-smooth hover:scale-105 disabled:opacity-50"
            >
              {isAiTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </main>

      <ApiKeyDialog 
        open={showApiKeyDialog} 
        onOpenChange={setShowApiKeyDialog}
        onSave={handleApiConfig}
      />
    </div>
  );
};

export default Chat;
