import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface FileUploadState {
  file: File | null;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  summary: {
    requirements: number;
    goals: number;
    useCases: number;
    stakeholders: number;
  } | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['.pdf', '.docx', '.xlsx'];

export const useFileUpload = () => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    progress: 0,
    status: 'idle',
    summary: null
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

    setUploadState({
      file,
      progress: 0,
      status: 'uploading',
      summary: null
    });

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadState(prev => ({ ...prev, progress: i }));
    }

    // Simulate processing
    setUploadState(prev => ({ ...prev, status: 'processing', progress: 100 }));
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate success with mock data
    const mockSummary = {
      requirements: Math.floor(Math.random() * 100) + 50,
      goals: Math.floor(Math.random() * 10) + 3,
      useCases: Math.floor(Math.random() * 20) + 5,
      stakeholders: Math.floor(Math.random() * 5) + 2
    };

    setUploadState(prev => ({
      ...prev,
      status: 'success',
      summary: mockSummary
    }));

    toast.success('✅ Документ успешно обработан', {
      description: `Извлечено ${mockSummary.requirements} требований`
    });
  }, [validateFile]);

  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      progress: 0,
      status: 'idle',
      summary: null
    });
  }, []);

  return {
    uploadState,
    uploadFile,
    resetUpload,
    validateFile
  };
};
