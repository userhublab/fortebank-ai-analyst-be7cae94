import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Upload, CheckCircle, AlertCircle, Info, Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface ConfluenceExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
}

export const ConfluenceExportModal = ({ open, onOpenChange, documentTitle }: ConfluenceExportModalProps) => {
  const [space, setSpace] = useState('BANK');
  const [pageTitle, setPageTitle] = useState(documentTitle);
  const [parentPage, setParentPage] = useState('');
  const [includeDiagrams, setIncludeDiagrams] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  const [createChildPages, setCreateChildPages] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const handleSubmit = async () => {
    if (!pageTitle.trim()) {
      toast.error('❌ Введите название страницы');
      return;
    }

    setStatus('uploading');
    setProgress(0);

    // Simulate upload process
    const stages = [
      { text: 'Подготовка документа...', progress: 25, delay: 800 },
      { text: 'Загрузка диаграмм...', progress: 50, delay: 1000 },
      { text: 'Создание страницы...', progress: 75, delay: 800 },
      { text: 'Финализация...', progress: 100, delay: 600 }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      setProgress(stage.progress);
      setProgressText(stage.text);
    }

    setStatus('success');
    setTimeout(() => {
      onOpenChange(false);
      resetForm();
    }, 3000);
  };

  const resetForm = () => {
    setStatus('idle');
    setProgress(0);
    setProgressText('');
    setPageTitle(documentTitle);
    setParentPage('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        {status === 'idle' && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0052CC] flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <DialogTitle className="text-2xl">Экспорт в Confluence</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* Space Selection */}
              <div className="space-y-2">
                <Label htmlFor="space" className="text-sm font-semibold">Confluence Space</Label>
                <Select value={space} onValueChange={setSpace}>
                  <SelectTrigger id="space">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK">BANK</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="PROJECTS">PROJECTS</SelectItem>
                    <SelectItem value="ANALYTICS">ANALYTICS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">Название страницы</Label>
                <Input
                  id="title"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="Введите название страницы..."
                />
              </div>

              {/* Parent Page */}
              <div className="space-y-2">
                <Label htmlFor="parent" className="text-sm font-semibold">
                  Родительская страница <span className="text-muted-foreground font-normal">(опционально)</span>
                </Label>
                <p className="text-xs text-muted-foreground italic">Оставьте пустым для создания в корне</p>
                <Input
                  id="parent"
                  value={parentPage}
                  onChange={(e) => setParentPage(e.target.value)}
                  placeholder="Например: Проектная документация"
                />
              </div>

              {/* Options */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Дополнительные параметры</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="diagrams"
                    checked={includeDiagrams}
                    onCheckedChange={(checked) => setIncludeDiagrams(checked as boolean)}
                  />
                  <label htmlFor="diagrams" className="text-sm cursor-pointer">
                    Включить диаграммы
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tables"
                    checked={includeTables}
                    onCheckedChange={(checked) => setIncludeTables(checked as boolean)}
                  />
                  <label htmlFor="tables" className="text-sm cursor-pointer">
                    Включить таблицы
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="child-pages"
                    checked={createChildPages}
                    onCheckedChange={(checked) => setCreateChildPages(checked as boolean)}
                  />
                  <label htmlFor="child-pages" className="text-sm cursor-pointer">
                    Создать дочерние страницы для каждой секции
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Предпросмотр структуры
                  <ChevronDown className={`w-4 h-4 transition-transform ${showPreview ? 'rotate-180' : ''}`} />
                </button>
                
                {showPreview && (
                  <div className="pl-4 space-y-1 text-sm text-muted-foreground animate-in slide-in-from-top-2 duration-300">
                    <div>📄 {pageTitle || 'Бизнес-требования'}</div>
                    {createChildPages && (
                      <>
                        <div className="pl-4">📊 Use Cases</div>
                        <div className="pl-4">📈 KPI и метрики</div>
                        <div className="pl-4">🔀 Диаграммы</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-1">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>Документ будет опубликован с текущими правами доступа</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSubmit} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Опубликовать
                </Button>
              </div>
            </DialogFooter>
          </>
        )}

        {status === 'uploading' && (
          <div className="py-16 px-8">
            <div className="flex flex-col items-center gap-6">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <p className="font-medium">Публикация в Confluence...</p>
                <p className="text-sm text-muted-foreground">{progressText} {progress}%</p>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="py-16 px-8">
            <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500">
              <CheckCircle className="w-20 h-20 text-green-500" />
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Успешно опубликовано!</h3>
                <p className="text-muted-foreground">Документ доступен в Confluence Space: {space}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Закрыть
                </Button>
                <Button>Открыть в Confluence →</Button>
              </div>
              <p className="text-xs text-muted-foreground">Закроется через 3 секунды...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
