import { Mic } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useEffect } from 'react';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  onRecordingChange?: (isRecording: boolean) => void;
}

export const VoiceInput = ({ onTranscript, onRecordingChange }: VoiceInputProps) => {
  const { isRecording, transcript, recordingTime, startRecording, stopRecording, isSupported } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  useEffect(() => {
    onRecordingChange?.(isRecording);
  }, [isRecording, onRecordingChange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={toggleRecording}
        disabled={!isSupported}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
          ${isRecording 
            ? 'bg-destructive text-destructive-foreground animate-pulse-scale border-2 border-white' 
            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }
          ${!isSupported ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
        title={!isSupported ? 'Голосовой ввод не поддерживается' : isRecording ? 'Остановить запись' : 'Начать запись'}
      >
        <Mic className="w-5 h-5" />
      </button>

      {isRecording && (
        <>
          {/* Recording Timer */}
          <div className="absolute -top-12 left-0 bg-card text-card-foreground px-3 py-1.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
            Запись... {formatTime(recordingTime)}
          </div>

          {/* Audio Visualizer - Improved */}
          <div className="flex items-center gap-1 h-8">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 bg-white/90 rounded-full animate-sound-wave"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationDuration: `${600 + i * 50}ms`,
                  height: '8px'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
