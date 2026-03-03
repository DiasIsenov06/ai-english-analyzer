# AI English Learning Personal Analyzer

Веб-приложение для AI-анализа уровня английского языка.

## Стек

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **База данных:** SQLite (по умолчанию) или PostgreSQL
- **Авторизация:** JWT

---

## 🚀 Для коллабораторов — как запустить сайт

### Шаг 1. Клонировать репозиторий

```bash
git clone https://github.com/DiasIsenov06/ai-english-analyzer.git
cd ai-english-analyzer
```

### Шаг 2. Установить зависимости

```bash
npm install
```

### Шаг 3. Настроить .env (обязательно!)

1. Скопируй файл с примером:
   ```bash
   copy .env.example .env
   ```
   (на Mac/Linux: `cp .env.example .env`)

2. Открой `.env` и заполни:
   - **JWT_SECRET** — любая длинная случайная строка (например: `my-super-secret-key-123`)
   - **GEMINI_API_KEY** — ключ из [Google AI Studio](https://aistudio.google.com/app/apikey) (для AI в чате и планах)
   - Или **OPENAI_API_KEY** — если используешь OpenAI вместо Gemini

### Шаг 4. Создать базу данных

```bash
npx prisma generate
npx prisma db push
```

### Шаг 5. Запустить сайт

```bash
npm run dev
```

Сайт откроется по адресу: **http://localhost:3000**

---

## Установка и запуск (кратко)

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка .env

Создай `.env` из `.env.example` и заполни `JWT_SECRET` и `GEMINI_API_KEY` (или `OPENAI_API_KEY`).

### 3. Инициализация базы данных

```bash
npx prisma generate
npx prisma db push
```

### 4. Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

## Структура страниц

| Путь | Описание |
|------|----------|
| `/` | Главная |
| `/register` | Регистрация |
| `/login` | Вход |
| `/test` | AI Placement Test (требует авторизации) |
| `/result` | Результат теста |
| `/dashboard` | Личный кабинет (требует авторизации) |

## Использование PostgreSQL

1. Установите PostgreSQL
2. Создайте базу: `createdb ai_english_analyzer`
3. В `prisma/schema.prisma` измените:
   - `provider = "postgresql"`
   - `url = env("DATABASE_URL")`
4. Создайте `.env` с `DATABASE_URL="postgresql://user:password@localhost:5432/ai_english_analyzer"`
5. Выполните `npx prisma db push`

## API

- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `POST /api/test/results` — сохранить результат теста
- `GET /api/test/results` — получить результаты пользователя
