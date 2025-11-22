import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { KeyRound, Sparkles, Cloud } from 'lucide-react';
import { AIProvider } from '@/services/ai';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (provider: AIProvider, apiKey?: string) => void;
}

export const ApiKeyDialog = ({ open, onOpenChange, onSave }: ApiKeyDialogProps) => {
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [provider, setProvider] = useState<AIProvider>('claude');

  const handleSave = () => {
    if (provider === 'claude' && claudeApiKey.trim()) {
      onSave('claude', claudeApiKey.trim());
      onOpenChange(false);
      setClaudeApiKey('');
    } else if (provider === 'gemini') {
      // Check if Cloud is enabled
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        alert('Gemini requires Lovable Cloud. Please enable Cloud in project settings first.');
        return;
      }
      onSave('gemini');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Configure AI Provider
          </DialogTitle>
          <DialogDescription>
            Choose your AI provider to enable all AI features in the application.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={provider} onValueChange={(v) => setProvider(v as AIProvider)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="claude" className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Claude API
            </TabsTrigger>
            <TabsTrigger value="gemini" className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Gemini
              <Badge variant="secondary" className="ml-1 text-xs">Cloud</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="claude" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="claudeKey">Claude API Key</Label>
              <Input
                id="claudeKey"
                type="password"
                placeholder="sk-ant-..."
                value={claudeApiKey}
                onChange={(e) => setClaudeApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <p className="text-xs text-muted-foreground">
                Get your key from{' '}
                <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  console.anthropic.com
                </a>
                {' '}($5 free credits)
              </p>
            </div>

            <div className="rounded-lg bg-muted p-3 space-y-1">
              <p className="text-sm font-medium">✨ Claude Sonnet 4.5</p>
              <p className="text-xs text-muted-foreground">Superior reasoning, fastest responses, best for production</p>
            </div>
          </TabsContent>

          <TabsContent value="gemini" className="space-y-4 py-4">
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-primary" />
                <p className="font-medium text-sm">Lovable Cloud Required</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Gemini uses Lovable AI Gateway through Cloud. No API key needed - it's pre-configured!
              </p>
            </div>

            <div className="space-y-2">
              <div className="rounded-lg bg-muted p-3 space-y-1">
                <p className="text-sm font-medium">🚀 Gemini 2.5 Flash</p>
                <p className="text-xs text-muted-foreground">Balanced performance, excellent for most use cases</p>
              </div>
              
              <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                <p className="text-sm font-medium">⚡ Free Credits Included</p>
                <p className="text-xs text-muted-foreground">Start with free monthly usage, pay as you grow</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={provider === 'claude' && !claudeApiKey.trim()}
          >
            {provider === 'gemini' ? 'Use Gemini' : 'Save Key'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
