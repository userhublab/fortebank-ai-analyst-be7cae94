// Mock AI Service with predefined responses

export const mockResponses = {
  greeting: "Здравствуйте! Я AI-Business Analyst от ForteBank. Помогу вам собрать и структурировать бизнес-требования для вашего проекта. Расскажите, над чем вы работаете?",
  
  general: [
    "Это интересный проект! Давайте начнем с определения основных целей. Какую проблему вы хотите решить?",
    "Понял. Расскажите подробнее о вашей целевой аудитории и основных пользователях системы.",
    "Отлично! А какие у вас есть ограничения по срокам и бюджету?",
    "Хорошо. Какие интеграции с существующими системами необходимы?",
    "Понятно. Есть ли у вас особые требования по безопасности и защите данных?",
  ],

  crm: "Отлично! Создание CRM системы — важная задача. Основные вопросы:\n\n1. **Целевые пользователи**: Кто будет работать с системой? (менеджеры, аналитики, руководство)\n2. **Основной функционал**: Управление лидами, сделками, контактами?\n3. **Интеграции**: Нужна ли интеграция с телефонией, email, мессенджерами?\n4. **Аналитика**: Какие отчеты и метрики важны?\n\nРасскажите подробнее о ваших требованиях.",

  mobile: "Мобильное приложение — отличный выбор! Давайте обсудим:\n\n1. **Платформы**: iOS, Android или обе?\n2. **Целевая аудитория**: Клиенты банка, сотрудники?\n3. **Ключевой функционал**: Что должно быть доступно в первую очередь?\n4. **Offline режим**: Нужна ли работа без интернета?\n5. **Безопасность**: Какие методы аутентификации планируются?\n\nРасскажите о приоритетах.",

  backend: "Backend система и интеграции — критически важная часть. Обсудим детали:\n\n1. **Архитектура**: Микросервисы или монолит?\n2. **Нагрузка**: Ожидаемое количество запросов в секунду?\n3. **Данные**: Какие источники данных нужно интегрировать?\n4. **API**: REST, GraphQL или оба?\n5. **Безопасность**: OAuth2, JWT токены?\n\nКакие у вас приоритеты?",

  analytics: "Аналитическая система — мощный инструмент для принятия решений. Ключевые аспекты:\n\n1. **Источники данных**: Какие системы будут источниками?\n2. **Метрики**: Какие KPI и показатели важны?\n3. **Визуализация**: Дашборды в реальном времени?\n4. **Доступ**: Кто будет пользователями системы?\n5. **Экспорт**: Нужна ли выгрузка в Excel, PDF?\n\nРасскажите о ваших требованиях.",

  validation: {
    overallScore: 85,
    completeness: 90,
    clarity: 80,
    detail: 85,
    consistency: 85,
    issues: [
      { 
        type: 'warning', 
        message: 'Рекомендуется добавить информацию о сроках реализации', 
        section: 'Общие требования' 
      },
      { 
        type: 'info', 
        message: 'Хорошо структурированный документ с четкими требованиями', 
        section: 'Общая оценка' 
      },
      { 
        type: 'warning', 
        message: 'Добавьте детали по интеграциям с внешними системами', 
        section: 'Техническая часть' 
      }
    ]
  },

  fileAnalysis: {
    pdf: `📄 **Анализ документа завершен**

**Выявлено:**
- 🎯 **5 основных целей проекта**
- 📋 **47 требований** (15 критичных, 32 важных)
- 👥 **3 категории пользователей**
- 🔄 **12 бизнес-процессов**
- 🔗 **4 интеграции с внешними системами**

**Основные выводы:**
Проект направлен на модернизацию клиентского сервиса с фокусом на автоматизацию и улучшение пользовательского опыта. Требуется интеграция с CRM, биллинговой системой и системой документооборота.

**Следующие шаги:**
1. Уточнить приоритеты требований
2. Детализировать интеграционные сценарии
3. Определить метрики успеха`,

    docx: `📝 **Word документ обработан**

**Структура документа:**
- ✅ Введение и цели
- ✅ Функциональные требования (разделы 1-5)
- ✅ Нефункциональные требования
- ⚠️ Отсутствует раздел по безопасности
- ⚠️ Не указаны критерии приемки

**Ключевые требования:**
1. Веб-интерфейс для управления данными
2. Мобильное приложение (iOS/Android)
3. Интеграция с существующей БД
4. Система уведомлений
5. Аналитический модуль

**Рекомендации:**
- Добавить раздел по информационной безопасности
- Определить SLA требования
- Уточнить объемы данных`,

    xlsx: `📊 **Excel файл проанализирован**

**Обнаружено:**
- 📑 **5 листов** с данными
- 📈 **156 строк требований**
- 🏷️ **8 категорий функционала**
- ⏱️ **Оценка: 1200 часов разработки**

**Распределение по приоритетам:**
- 🔴 Высокий: 34 требования
- 🟡 Средний: 89 требований  
- 🟢 Низкий: 33 требования

**Основные модули:**
1. Управление пользователями (180ч)
2. Каталог товаров (240ч)
3. Система заказов (320ч)
4. Отчетность (160ч)
5. Интеграции (300ч)

**Готов обсудить детали любого модуля!**`
  },

  diagram: {
    flowchart: `graph TD
    A[Начало] --> B{Проверка условия}
    B -->|Да| C[Процесс 1]
    B -->|Нет| D[Процесс 2]
    C --> E[Результат]
    D --> E
    E --> F[Конец]`,
    
    sequence: `sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    User->>Frontend: Запрос данных
    Frontend->>Backend: API вызов
    Backend->>Database: SQL запрос
    Database-->>Backend: Данные
    Backend-->>Frontend: JSON ответ
    Frontend-->>User: Отображение`,
    
    journey: `journey
    title Путь пользователя
    section Регистрация
      Заполнение формы: 5: User
      Подтверждение email: 3: User
      Вход в систему: 4: User
    section Работа
      Просмотр данных: 5: User
      Создание записи: 4: User
      Сохранение: 5: User`,
    
    erd: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    USER {
        int id
        string name
        string email
    }
    ORDER {
        int id
        date order_date
        int user_id
    }
    PRODUCT {
        int id
        string name
        decimal price
    }`
  }
};

export function getMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for specific topics
  if (lowerMessage.includes('crm') || lowerMessage.includes('црм')) {
    return mockResponses.crm;
  }
  if (lowerMessage.includes('мобильн') || lowerMessage.includes('mobile') || lowerMessage.includes('приложени')) {
    return mockResponses.mobile;
  }
  if (lowerMessage.includes('backend') || lowerMessage.includes('бэкенд') || lowerMessage.includes('интеграц')) {
    return mockResponses.backend;
  }
  if (lowerMessage.includes('аналитик') || lowerMessage.includes('analytics') || lowerMessage.includes('отчет')) {
    return mockResponses.analytics;
  }
  
  // Random general response
  const randomIndex = Math.floor(Math.random() * mockResponses.general.length);
  return mockResponses.general[randomIndex];
}

export function getMockFileAnalysis(fileType: string): string {
  if (fileType.includes('pdf')) {
    return mockResponses.fileAnalysis.pdf;
  }
  if (fileType.includes('word') || fileType.includes('docx')) {
    return mockResponses.fileAnalysis.docx;
  }
  if (fileType.includes('excel') || fileType.includes('xlsx')) {
    return mockResponses.fileAnalysis.xlsx;
  }
  return mockResponses.fileAnalysis.pdf;
}

export function getMockDiagram(type: 'flowchart' | 'sequence' | 'journey' | 'erd' = 'flowchart'): string {
  return mockResponses.diagram[type];
}

export async function simulateTyping(
  text: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
) {
  const words = text.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
    onChunk(chunk);
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
  }
  
  onComplete();
}
