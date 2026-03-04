# AI English Learning Personal Analyzer

Веб-приложение для AI-анализа уровня английского языка.

## Стек

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **База данных:** PostgreSQL (через Docker)
- **Авторизация:** JWT

---

## 🐳 Запуск через Docker (рекомендуется)

**База данных и приложение в Docker** — одна команда, всё поднимается.

### Требования: [Docker Desktop](https://docs.docker.com/get-docker/)

```bash
git clone https://github.com/DiasIsenov06/ai-english-analyzer.git
cd ai-english-analyzer
```

Создай `.env`:
```
JWT_SECRET=любая-секретная-строка
GEMINI_API_KEY=твой-ключ
```

**Запуск (база + приложение):**
```bash
docker-compose up -d --build
```

Сайт: **http://localhost:3000**

**Остановка:**
```bash
docker-compose down
```

Данные БД сохраняются между перезапусками (Docker volume).

---

## 🚀 Для коллабораторов — как запустить сайт

**Вариант A — Docker (общая база, см. выше)**

**Вариант B — Локально (своя база)**

### Шаг 1. Клонировать репозиторий

```bash
git clone https://github.com/DiasIsenov06/ai-english-analyzer.git
cd ai-english-analyzer
```

### Шаг 2. Запустить PostgreSQL (Docker)

```bash
docker-compose up -d db
```

### Шаг 3. Установить зависимости и .env

```bash
npm install
copy .env.example .env   # Mac/Linux: cp .env.example .env
```

В `.env` заполни:
- **DATABASE_URL** — `postgresql://ai_user:ai_password@localhost:5432/ai_english_analyzer`
- **JWT_SECRET** — любая случайная строка
- **GEMINI_API_KEY** — опционально, для AI

### Шаг 4. Создать базу данных

```bash
npx prisma generate
npx prisma db push
```

### Шаг 5. Запустить сайт

```bash
npm run dev
```

Сайт: **http://localhost:3000**

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

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | PostgreSQL (в Docker задаётся автоматически) |
| `JWT_SECRET` | Секрет для JWT-токенов |
| `GEMINI_API_KEY` | Ключ Google AI (для чата и планов) |
| `OPENAI_API_KEY` | Альтернатива Gemini |

## API

- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `POST /api/test/results` — сохранить результат теста
- `GET /api/test/results` — получить результаты пользователя
