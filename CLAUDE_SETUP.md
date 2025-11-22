# Claude API Integration Setup

## Overview

This application uses Claude AI (Anthropic) for:
- **Real-time chat responses** in the Chat page
- **Document analysis** from uploaded PDF/DOCX files
- **Quality validation** of requirements documents
- **Dynamic Mermaid diagram generation** based on process descriptions

## Quick Setup

### 1. Get Your API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Get **$5 free credits** to start
4. Copy your API key (starts with `sk-ant-...`)

### 2. Configure in the App

1. Open the application
2. Navigate to Chat page
3. Click the "API Key" button in the sidebar (or it will prompt automatically)
4. Paste your API key
5. Click "Save"

**Note:** The API key is stored in `localStorage` for development purposes. In production, this should be stored securely on the backend.

## Features Using Claude API

### 1. Chat Interface (`/chat`)

**What it does:**
- Real-time AI responses to user queries
- Contextual conversation with full history
- Business analyst expertise for requirements gathering

**Model Used:** `claude-sonnet-4-5`

**How it works:**
```typescript
// Full conversation history is sent to Claude
const response = await claude.sendMessage([
  { role: 'user', content: 'What are the key stakeholders?' },
  { role: 'assistant', content: '...' }
]);
```

### 2. File Upload & Analysis

**What it does:**
- Analyzes uploaded PDF/DOCX documents
- Extracts: requirements count, goals, use cases, stakeholders
- Returns structured JSON data

**How it works:**
```typescript
const analysis = await claude.analyzeDocument(fileContent);
// Returns: { requirements: 127, goals: 5, useCases: 18, stakeholders: 8 }
```

### 3. Smart Validator (`/document`)

**What it does:**
- Validates document quality in 4 dimensions:
  - **Completeness** - Are all sections filled?
  - **Clarity** - Is the language clear?
  - **Detail** - Is there enough detail?
  - **Consistency** - Are there contradictions?
- Identifies specific issues with suggestions
- Provides actionable improvement recommendations

**How to use:**
1. Navigate to Document page (`/document`)
2. Click "Проверить качество" (Check Quality)
3. Wait for Claude to analyze
4. View scores and issues

**Example output:**
```json
{
  "completeness": 92,
  "clarity": 85,
  "detail": 88,
  "consistency": 83,
  "issues": [
    {
      "section": "Use Case UC-5",
      "problem": "Не указаны критерии приемки",
      "suggestion": "Добавить измеримые критерии успеха"
    }
  ]
}
```

### 4. Visual AI Designer - Dynamic Diagrams

**What it does:**
- Generates Mermaid diagrams from text descriptions
- Supports 4 types:
  - **Flowchart** - Business processes (BPMN-style)
  - **Sequence Diagram** - Actor interactions
  - **User Journey** - Customer journey maps
  - **ERD** - Entity relationship diagrams

**How to use:**
1. Navigate to Document page (`/document`)
2. Scroll to "Диаграммы" section
3. Select diagram type
4. Enter process description
5. Click "Сгенерировать"
6. View rendered diagram with zoom/fullscreen

**Example:**
```
Input: "Процесс регистрации пользователя: 
1. Пользователь заходит на сайт
2. Вводит email и пароль
3. Система проверяет данные
4. Отправляет письмо подтверждения"

Output: Mermaid flowchart with all steps visualized
```

## API Usage & Limits

### Free Tier
- **$5 free credits** on signup
- Enough for ~1,000 chat messages
- ~500 document analyses
- ~2,000 diagram generations

### Rate Limits
- Handled gracefully with error messages
- Automatic fallback to mock data if API fails
- User-friendly error toasts

### Error Handling

The app handles common errors:

1. **No API Key**
   ```
   Shows: "Claude API key not found. Please add it in Settings."
   Action: Opens API key dialog
   ```

2. **Invalid API Key**
   ```
   Shows: "Ошибка подключения к Claude API. Проверьте API ключ."
   Action: Prompts to re-enter key
   ```

3. **Rate Limit Exceeded**
   ```
   Shows: "Too many requests. Please wait."
   Action: User must wait before retrying
   ```

4. **Network Error**
   ```
   Shows: "Network error. Using fallback data."
   Action: Falls back to mock data for demo
   ```

## Architecture

### Client-Side Integration (for hackathon demo)

**⚠️ Note:** For the hackathon, we use client-side API calls with `dangerouslyAllowBrowser: true`. This is **NOT production-ready**.

```typescript
// src/services/claude.ts
const client = new Anthropic({
  apiKey: localStorage.getItem('claude_api_key'),
  dangerouslyAllowBrowser: true // Only for demo!
});
```

### Production Recommendations

For production, move Claude API calls to backend:

1. Create backend API routes
2. Store API key in environment variables
3. Proxy requests through your server
4. Add rate limiting & authentication

## Troubleshooting

### Issue: "Claude not initialized"
**Solution:** Click "API Key" in sidebar and add your key

### Issue: API calls fail
**Solutions:**
1. Check internet connection
2. Verify API key is valid
3. Check if you have credits remaining
4. Try refreshing the page

### Issue: Diagrams don't render
**Solutions:**
1. Check if Mermaid syntax is valid
2. Try regenerating with simpler description
3. Check browser console for errors

## For Judges

To test the Claude integration:

1. **Setup (1 min):**
   - Get free API key from console.anthropic.com
   - Add key in app settings

2. **Test Chat (2 min):**
   - Ask about project requirements
   - See real AI responses
   - Observe typewriter animation

3. **Test File Analysis (3 min):**
   - Upload a requirements document
   - See extracted metrics
   - Compare with mock data

4. **Test Validator (2 min):**
   - Navigate to Document page
   - Click "Проверить качество"
   - See real quality scores
   - Review identified issues

5. **Test Diagram Generator (3 min):**
   - Describe a business process
   - Generate flowchart
   - Try sequence diagram
   - Test zoom/fullscreen

## Credits & Attribution

- **AI Provider:** Anthropic Claude
- **Model:** claude-sonnet-4-5
- **Diagram Rendering:** Mermaid.js
- **UI Components:** shadcn/ui
- **Framework:** React + Vite + TypeScript

---

**Built for ForteBank Hackathon 2025** 🚀
