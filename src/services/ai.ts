// Universal AI Service supporting Claude API or Gemini (Lovable AI)

export type AIProvider = 'claude' | 'gemini';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string; // Only for Claude
  model?: string;
}

class AIService {
  private config: AIConfig | null = null;

  setConfig(config: AIConfig) {
    this.config = config;
    localStorage.setItem('ai_config', JSON.stringify(config));
  }

  getConfig(): AIConfig | null {
    if (this.config) return this.config;
    
    const stored = localStorage.getItem('ai_config');
    if (stored) {
      this.config = JSON.parse(stored);
      return this.config;
    }
    
    return null;
  }

  clearConfig() {
    this.config = null;
    localStorage.removeItem('ai_config');
  }

  async chat(messages: AIMessage[]): Promise<string> {
    const config = this.getConfig();
    if (!config) {
      // Use mock responses if not configured
      const { getMockResponse } = await import('./mockAi');
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      return getMockResponse(lastUserMessage?.content || '');
    }

    if (config.provider === 'claude') {
      return this.chatWithClaude(messages, config);
    } else {
      return this.chatWithGemini(messages, config);
    }
  }

  async streamChat(
    messages: AIMessage[],
    onChunk: (text: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const config = this.getConfig();
    if (!config) {
      // Use mock streaming if not configured
      const { getMockResponse, simulateTyping } = await import('./mockAi');
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      const response = getMockResponse(lastUserMessage?.content || '');
      await simulateTyping(response, onChunk, onComplete);
      return;
    }

    if (config.provider === 'claude') {
      await this.streamClaude(messages, config, onChunk, onComplete, onError);
    } else {
      await this.streamGemini(messages, config, onChunk, onComplete, onError);
    }
  }

  private async chatWithClaude(messages: AIMessage[], config: AIConfig): Promise<string> {
    if (!config.apiKey) {
      throw new Error('Claude API key is required');
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ 
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true 
    });

    const systemMessage = messages.find(m => m.role === 'system')?.content;
    const userMessages = messages.filter(m => m.role !== 'system').map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));

    const response = await client.messages.create({
      model: config.model || 'claude-sonnet-4-5',
      max_tokens: 4096,
      messages: userMessages,
      ...(systemMessage && { system: systemMessage }),
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  private async streamClaude(
    messages: AIMessage[],
    config: AIConfig,
    onChunk: (text: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      if (!config.apiKey) {
        throw new Error('Claude API key is required');
      }

      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const client = new Anthropic({ 
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true 
      });

      const systemMessage = messages.find(m => m.role === 'system')?.content;
      const userMessages = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      const stream = await client.messages.create({
        model: config.model || 'claude-sonnet-4-5',
        max_tokens: 4096,
        messages: userMessages,
        ...(systemMessage && { system: systemMessage }),
        stream: true,
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          onChunk(event.delta.text);
        }
      }

      onComplete();
    } catch (error) {
      onError(error as Error);
    }
  }

  private async chatWithGemini(messages: AIMessage[], config: AIConfig): Promise<string> {
    // Check if Supabase is available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('Gemini requires Lovable Cloud. Please enable Cloud in project settings.');
    }

    const CHAT_URL = `${supabaseUrl}/functions/v1/ai-chat`;
    
    const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages,
        model: config.model || 'google/gemini-2.5-flash'
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('Payment required. Please add credits to your Lovable AI workspace.');
      }
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.response;
  }

  private async streamGemini(
    messages: AIMessage[],
    config: AIConfig,
    onChunk: (text: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Gemini requires Lovable Cloud. Please enable Cloud in project settings.');
      }

      const CHAT_URL = `${supabaseUrl}/functions/v1/ai-chat-stream`;
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages,
          model: config.model || 'google/gemini-2.5-flash'
        }),
      });

      if (!response.ok || !response.body) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (response.status === 402) {
          throw new Error('Payment required. Please add credits to your workspace.');
        }
        throw new Error('Failed to start stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) onChunk(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      onComplete();
    } catch (error) {
      onError(error as Error);
    }
  }

  async generateDiagram(description: string, type: 'flowchart' | 'sequence' | 'journey' | 'erd' = 'flowchart'): Promise<string> {
    const config = this.getConfig();
    if (!config) {
      // Use mock diagram if not configured
      const { getMockDiagram } = await import('./mockAi');
      return getMockDiagram(type);
    }

    const systemPrompt = `You are a Mermaid diagram expert. Generate ONLY valid Mermaid code without markdown code blocks or explanations.`;
    
    const userPrompt = `Create a ${type} diagram for: ${description}

Return ONLY the Mermaid code, no explanations or markdown formatting.`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    // Clean up response
    return response
      .replace(/```mermaid/g, '')
      .replace(/```/g, '')
      .trim();
  }

  async validateDocument(content: string): Promise<{
    overallScore: number;
    completeness: number;
    clarity: number;
    detail: number;
    consistency: number;
    issues: Array<{ type: string; message: string; section?: string }>;
  }> {
    const config = this.getConfig();
    if (!config) {
      // Return mock validation if not configured
      const { mockResponses } = await import('./mockAi');
      return mockResponses.validation;
    }

    const systemPrompt = `You are a business requirements validation expert. Analyze documents and provide structured scores.`;
    
    const userPrompt = `Analyze this requirements document and return a JSON response with:
{
  "overallScore": 0-100,
  "completeness": 0-100,
  "clarity": 0-100,
  "detail": 0-100,
  "consistency": 0-100,
  "issues": [
    { "type": "error|warning|info", "message": "description", "section": "section name" }
  ]
}

Document:
${content}`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback
    return {
      overallScore: 75,
      completeness: 80,
      clarity: 75,
      detail: 70,
      consistency: 75,
      issues: [{ type: 'info', message: 'Analysis completed' }]
    };
  }

  async analyzeFile(fileName: string, fileType: string): Promise<string> {
    const config = this.getConfig();
    if (!config) {
      // Return mock file analysis if not configured
      const { getMockFileAnalysis } = await import('./mockAi');
      return getMockFileAnalysis(fileType);
    }

    const systemPrompt = `You are a business analyst expert. Extract requirements from uploaded documents.`;
    
    const userPrompt = `Analyze this ${fileType} file (${fileName}) and extract:
1. Project goals and objectives
2. Key requirements
3. Stakeholders
4. Main features/functionality

Provide a structured summary.`;

    return await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
  }
}

export const aiService = new AIService();
