import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Sparkles, 
  X, 
  MessageSquarePlus, 
  Upload, 
  LayoutTemplate, 
  Zap,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadProgress } from "./UploadProgress";
import { useFileUpload } from "@/hooks/useFileUpload";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (config: ProjectConfig) => void;
}

export interface ProjectConfig {
  startType: 'empty' | 'file' | 'template';
  name?: string;
  type?: string;
  department?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  file?: File;
  template?: string;
}

export function NewProjectModal({ open, onOpenChange, onCreateProject }: NewProjectModalProps) {
  const [selectedStartType, setSelectedStartType] = useState<'empty' | 'file' | 'template' | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [rememberChoice, setRememberChoice] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  const { uploadFile: processFile, uploadState } = useFileUpload();

  const handleStartTypeClick = (type: 'empty' | 'file' | 'template') => {
    if (type === 'template') {
      // Template functionality coming soon
      return;
    }
    
    if (type === 'file') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.docx,.xlsx,.doc,.xls';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          if (file.size > 10 * 1024 * 1024) {
            alert('Файл слишком большой. Максимальный размер: 10MB');
            return;
          }
          setUploadFile(file);
          setIsUploading(true);
          // Process file upload
          await processFile(file);
        }
      };
      input.click();
      return;
    }
    
    setSelectedStartType(type);
  };

  const handleCreate = () => {
    if (!selectedStartType && !uploadFile) {
      // Shake animation will be handled by CSS
      const button = document.querySelector('[data-create-button]');
      button?.classList.add('animate-shake');
      setTimeout(() => button?.classList.remove('animate-shake'), 500);
      return;
    }

    const config: ProjectConfig = {
      startType: selectedStartType || 'file',
      name: projectName || undefined,
      type: projectType || undefined,
      department: department || undefined,
      priority,
      file: uploadFile || undefined,
    };

    if (rememberChoice && selectedStartType) {
      localStorage.setItem('preferredStartType', selectedStartType);
    }

    onCreateProject(config);
    onOpenChange(false);
    
    // Reset state
    setSelectedStartType(null);
    setProjectName("");
    setProjectType("");
    setDepartment("");
    setPriority('medium');
    setRememberChoice(false);
    setIsUploading(false);
    setUploadFile(null);
  };

  if (isUploading && uploadFile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[800px] p-0 gap-0">
          <UploadProgress 
            file={uploadFile} 
            uploadState={uploadState}
            onComplete={(summary) => {
              setIsUploading(false);
              onCreateProject({
                startType: 'file',
                file: uploadFile,
                name: uploadFile.name.replace(/\.[^/.]+$/, "")
              });
              onOpenChange(false);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] p-0 gap-0 overflow-y-auto">
        <DialogTitle className="sr-only">Создать новый проект</DialogTitle>
        
        {/* Header */}
        <div className="p-8 pb-6 border-b bg-gradient-to-br from-background to-primary/5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Создать новый проект</h2>
                <p className="text-muted-foreground mt-2">Выберите способ начала работы</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Quick Start Options */}
        <div className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-warning" />
            <h3 className="text-xl font-semibold">Быстрый старт</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Empty Project */}
            <button
              onClick={() => handleStartTypeClick('empty')}
              className={cn(
                "flex flex-col items-center p-6 rounded-xl border-2 min-h-[180px] transition-all duration-200",
                "hover:border-primary hover:shadow-lg hover:-translate-y-1",
                selectedStartType === 'empty' 
                  ? "border-primary bg-primary/5" 
                  : "border-border bg-card"
              )}
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquarePlus className="w-12 h-12 text-primary" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-center">С чистого листа</h4>
              <p className="text-sm text-muted-foreground text-center mb-4 flex-1">
                Начните диалог с AI и постепенно соберите требования
              </p>
              <Badge className="bg-success/10 text-success hover:bg-success/20">
                Рекомендуется
              </Badge>
            </button>

            {/* Card 2: Upload File */}
            <button
              onClick={() => handleStartTypeClick('file')}
              className={cn(
                "flex flex-col items-center p-6 rounded-xl border-2 border-dashed min-h-[180px] transition-all duration-200",
                "hover:border-primary hover:border-solid hover:shadow-lg hover:-translate-y-1",
                selectedStartType === 'file' 
                  ? "border-primary border-solid bg-primary/5" 
                  : "border-border bg-card"
              )}
            >
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Upload className="w-12 h-12 text-purple-500" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-center">Загрузить документ</h4>
              <p className="text-sm text-muted-foreground text-center mb-4 flex-1">
                Загрузите PDF, DOCX или Excel с техзаданием для автоматического анализа
              </p>
              <div className="text-xs text-muted-foreground">
                📄 PDF | 📝 DOCX | 📊 XLSX
              </div>
            </button>

            {/* Card 3: From Template */}
            <button
              onClick={() => handleStartTypeClick('template')}
              className={cn(
                "flex flex-col items-center p-6 rounded-xl border-2 min-h-[180px] transition-all duration-200",
                "hover:border-primary hover:shadow-lg hover:-translate-y-1 opacity-60 cursor-not-allowed",
                "border-border bg-card"
              )}
              disabled
            >
              <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mb-4">
                <LayoutTemplate className="w-12 h-12 text-warning" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-center">Из шаблона</h4>
              <p className="text-sm text-muted-foreground text-center mb-4 flex-1">
                Используйте готовый шаблон для типовых проектов банка
              </p>
              <Badge variant="secondary">Скоро</Badge>
            </button>
          </div>

          {/* Advanced Options */}
          <div className="mt-6">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              Дополнительные настройки
              <ChevronDown className={cn(
                "w-4 h-4 ml-2 transition-transform",
                showAdvanced && "rotate-180"
              )} />
            </Button>

            {showAdvanced && (
              <div className="mt-6 space-y-5 animate-in slide-in-from-top-2">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="project-name" className="text-sm font-semibold">
                    Название проекта
                  </Label>
                  <Input
                    id="project-name"
                    placeholder="Например: Модернизация CRM системы"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Project Type */}
                <div className="space-y-2">
                  <Label htmlFor="project-type" className="text-sm font-semibold">
                    Тип проекта
                  </Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web приложение</SelectItem>
                      <SelectItem value="mobile">Mobile приложение</SelectItem>
                      <SelectItem value="backend">Backend система</SelectItem>
                      <SelectItem value="integration">Интеграция</SelectItem>
                      <SelectItem value="analytics">Аналитика</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground italic">
                    Опционально. Поможет AI лучше понять контекст
                  </p>
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-semibold">
                    Департамент
                  </Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите департамент" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Розничный бизнес</SelectItem>
                      <SelectItem value="corporate">Корпоративный бизнес</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="risk">Риски</SelectItem>
                      <SelectItem value="compliance">Комплаенс</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Приоритет проекта</Label>
                  <RadioGroup value={priority} onValueChange={(v) => setPriority(v as any)}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'low', label: 'Низкий', color: 'success' },
                        { value: 'medium', label: 'Средний', color: 'warning' },
                        { value: 'high', label: 'Высокий', color: 'destructive' },
                        { value: 'critical', label: 'Критичный', color: 'destructive' },
                      ].map((item) => (
                        <label
                          key={item.value}
                          className={cn(
                            "flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                            priority === item.value
                              ? `border-${item.color} bg-${item.color}/5`
                              : "border-border hover:border-${item.color}/50"
                          )}
                        >
                          <RadioGroupItem value={item.value} />
                          <span className="text-sm">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-muted/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberChoice}
              onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Запомнить мой выбор
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!selectedStartType && !uploadFile}
              className="gap-2"
              data-create-button
            >
              Создать проект
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
