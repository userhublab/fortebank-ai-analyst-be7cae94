import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseVoiceRecognitionReturn {
  isRecording: boolean;
  transcript: string;
  recordingTime: number;
  startRecording: () => void;
  stopRecording: () => void;
  isSupported: boolean;
}

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ru-RU';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast.error('❌ Нет доступа к микрофону', {
            description: 'Разрешите доступ к микрофону в настройках браузера'
          });
        }
        stopRecording();
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current?.start();
        }
      };
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = useCallback(() => {
    if (!isSupported) {
      toast.error('❌ Голосовой ввод не поддерживается', {
        description: 'Попробуйте использовать другой браузер'
      });
      return;
    }

    setIsRecording(true);
    setTranscript('');
    setRecordingTime(0);
    
    recognitionRef.current?.start();

    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    recognitionRef.current?.stop();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    isRecording,
    transcript,
    recordingTime,
    startRecording,
    stopRecording,
    isSupported
  };
};
