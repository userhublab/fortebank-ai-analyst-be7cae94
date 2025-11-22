import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';

interface MermaidDiagramProps {
  chart: string;
  title: string;
  isDark?: boolean;
}

export const MermaidDiagram = ({ chart, title, isDark = false }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        primaryColor: '#0085CA',
        primaryTextColor: isDark ? '#F1F5F9' : '#1F2937',
        primaryBorderColor: '#0085CA',
        lineColor: '#6B7280',
        secondaryColor: '#F8E5E5',
        tertiaryColor: '#F9FAFB',
        fontSize: '16px'
      }
    });
  }, [isDark]);

  useEffect(() => {
    const renderDiagram = async () => {
      if (containerRef.current) {
        setIsGenerating(true);
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          
          // Simulate generation delay for animation
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.innerHTML = svg;
              setIsGenerating(false);
            }
          }, 500);
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          setIsGenerating(false);
        }
      }
    };

    renderDiagram();
  }, [chart]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleFitScreen = () => setZoom(1);
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  return (
    <div className={`
      relative rounded-xl border bg-muted/30 transition-all duration-300
      ${isFullscreen ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm' : ''}
    `}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 bg-card rounded-lg shadow-lg p-1 flex gap-1 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomIn}
          title="Увеличить"
          className="h-8 w-8"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomOut}
          title="Уменьшить"
          className="h-8 w-8"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleFitScreen}
          title="По размеру экрана"
          className="h-8 w-8"
        >
          <span className="text-xs">⊡</span>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
          className="h-8 w-8"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Diagram Container */}
      <div className="p-8 overflow-auto">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">Генерирую диаграмму...</p>
            <div className="h-1 w-48 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-purple-500 animate-progress-bar" />
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="flex justify-center items-center transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          />
        )}
      </div>
    </div>
  );
};
