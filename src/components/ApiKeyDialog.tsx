import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ApiKeyDialog = ({ open, onClose }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('claude_api_key') || '');

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    localStorage.setItem('claude_api_key', apiKey);
    toast.success('API key saved successfully');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Claude API Key</DialogTitle>
          <DialogDescription>
            Enter your Anthropic API key. Get one at console.anthropic.com ($5 free credits)
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
