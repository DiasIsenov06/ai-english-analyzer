# AI English Learning Personal Analyzer

Веб-приложение для AI-анализа уровня английского языка.

## Стек

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **База данных:** SQLite (по умолчанию) или PostgreSQL
- **Авторизация:** JWT

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Инициализация базы данных

```bash
npx prisma generate
npx prisma db push
```

### 3. Запуск

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
