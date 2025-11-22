import { FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface FilePreviewProps {
  uploadState: {
    file: File | null;
    progress: number;
    status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
    summary: {
      requirements: number;
      goals: number;
      useCases: number;
      stakeholders: number;
    } | null;
  };
  onReset: () => void;
  onStartChat?: (summary: any) => void;
}

export const FilePreview = ({ uploadState, onReset, onStartChat }: FilePreviewProps) => {
  const { file, progress, status, summary } = uploadState;

  if (!file) return null;

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const colors = {
      pdf: 'text-red-500',
      docx: 'text-blue-500',
      xlsx: 'text-green-500'
    };
    return colors[ext as keyof typeof colors] || 'text-muted-foreground';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading': return 'bg-primary';
      case 'processing': return 'bg-yellow-500';
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading': return `Загрузка... ${progress}%`;
      case 'processing': return 'Анализирую документ...';
      case 'success': return `✅ Извлечено ${summary?.requirements || 0} требований`;
      case 'error': return '❌ Ошибка при обработке';
      default: return '';
    }
  };

  return (
    <div className="mb-3 bg-card border border-primary rounded-lg p-4 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-3">
        <FileText className={`w-6 h-6 flex-shrink-0 ${getFileIcon(file.name)}`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            
            <button
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Удалить"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          {status !== 'success' && (
            <div className="mb-2">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getStatusColor()}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
                {getStatusText()}
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && summary && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                <CheckCircle className="w-4 h-4" />
                <p className="text-sm font-medium">{getStatusText()}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/50 rounded p-2">
                  <p className="text-muted-foreground">Ключевые цели</p>
                  <p className="font-semibold">{summary.goals}</p>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <p className="text-muted-foreground">Use Cases</p>
                  <p className="font-semibold">{summary.useCases}</p>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <p className="text-muted-foreground">Стейкхолдеры</p>
                  <p className="font-semibold">{summary.stakeholders}</p>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <p className="text-muted-foreground">Требования</p>
                  <p className="font-semibold">{summary.requirements}</p>
                </div>
              </div>

              <Button
                onClick={() => onStartChat?.(summary)}
                className="w-full"
                size="sm"
              >
                Начать диалог на основе документа
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
