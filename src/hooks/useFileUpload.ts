import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { aiService } from '@/services/ai';

interface FileUploadState {
  file: File | null;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  analysis: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['.pdf', '.docx', '.xlsx'];

export const useFileUpload = () => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    progress: 0,
    status: 'idle',
    analysis: null
  });

  const validateFile = useCallback((file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('❌ Файл слишком большой', {
        description: 'Максимальный размер файла: 10MB'
      });
      return false;
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_TYPES.includes(extension)) {
      toast.error('❌ Неподдерживаемый формат файла', {
        description: 'Поддерживаются: PDF, DOCX, Excel'
      });
      return false;
    }

    return true;
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    const config = aiService.getConfig();
    if (!config) {
      toast.error('Сначала настройте AI провайдер');
      return;
    }

    setUploadState({
      file,
      progress: 0,
      status: 'uploading',
      analysis: null
    });

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadState(prev => ({ ...prev, progress: i }));
    }

    // Process with AI
    setUploadState(prev => ({ ...prev, status: 'processing', progress: 100 }));
    
    try {
      const analysis = await aiService.analyzeFile(file.name, file.type);
      
      setUploadState(prev => ({
        ...prev,
        status: 'success',
        analysis
      }));

      toast.success('✅ Документ успешно обработан');
    } catch (error) {
      console.error('Document analysis error:', error);
      
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        analysis: 'Ошибка анализа документа'
      }));

      const errorMsg = error instanceof Error ? error.message : 'Ошибка анализа';
      toast.error(errorMsg);
    }
  }, [validateFile]);

  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      progress: 0,
      status: 'idle',
      analysis: null
    });
  }, []);

  return {
    uploadState,
    uploadFile,
    resetUpload,
    validateFile
  };
};
