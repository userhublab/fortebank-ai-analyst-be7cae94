import Anthropic from '@anthropic-ai/sdk';

// For demo purposes - in production, use backend
const getApiKey = () => {
  const key = localStorage.getItem('claude_api_key');
  if (!key) {
    throw new Error('Claude API key not found. Please add it in Settings.');
  }
  return key;
};

export const initClaude = () => {
  try {
    const apiKey = getApiKey();
    return new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true // Only for demo
    });
  } catch (error) {
    console.error('Failed to initialize Claude:', error);
    return null;
  }
};

export const sendMessage = async (messages: Array<{ role: string; content: string }>) => {
  const client = initClaude();
  if (!client) throw new Error('Claude not initialized');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    messages: messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    })),
    system: "You are an expert Business Analyst AI assistant. Help users create detailed requirements, user stories, and documentation. Be concise and professional."
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
};

export const analyzeDocument = async (content: string) => {
  const client = initClaude();
  if (!client) throw new Error('Claude not initialized');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Analyze this document and extract: requirements count, goals count, use cases count, and stakeholders count. Return as JSON:
${content}

Format: {"requirements": number, "goals": number, "useCases": number, "stakeholders": number}`
    }]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  return JSON.parse(text);
};

export const validateDocument = async (document: string) => {
  const client = initClaude();
  if (!client) throw new Error('Claude not initialized');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Analyze this requirements document and provide quality scores (0-100) and specific issues. Return as JSON:

${document}

Format: {
  "completeness": number,
  "clarity": number,
  "detail": number,
  "consistency": number,
  "issues": [{"section": "string", "problem": "string", "suggestion": "string"}]
}`
    }]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  return JSON.parse(text);
};

export const generateMermaidDiagram = async (description: string, type: 'flowchart' | 'sequence' | 'journey' | 'erDiagram') => {
  const client = initClaude();
  if (!client) throw new Error('Claude not initialized');

  const prompts = {
    flowchart: 'Create a Mermaid flowchart (graph TD syntax) for this business process',
    sequence: 'Create a Mermaid sequence diagram showing actor interactions',
    journey: 'Create a Mermaid user journey diagram',
    erDiagram: 'Create a Mermaid entity relationship diagram'
  };

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `${prompts[type]}: ${description}

Return ONLY the mermaid code, no explanations, no markdown code blocks.`
    }]
  });

  return response.content[0].type === 'text' ? response.content[0].text.trim() : '';
};
