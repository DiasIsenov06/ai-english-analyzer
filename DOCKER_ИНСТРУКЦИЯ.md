# Запуск через Docker (база + приложение)

База данных PostgreSQL и приложение работают в Docker. Одна команда — всё поднимается.

---

## Шаг 1. Установи Docker

https://www.docker.com/products/docker-desktop/ — установи и запусти Docker Desktop.

---

## Шаг 2. Файл .env

В папке проекта должен быть файл `.env` с минимум:

```
JWT_SECRET=любая-длинная-секретная-строка
GEMINI_API_KEY=твой-ключ
```

`DATABASE_URL` при `docker-compose up` задаётся автоматически (контейнер `db`).

---

## Шаг 3. Запуск

В папке проекта:

```powershell
docker-compose up -d --build
```

- Первый раз соберётся образ приложения (1–2 минуты).
- Поднимется PostgreSQL в контейнере `db` и приложение в контейнере `app`.
- При первом старте приложение выполнит `prisma db push` (создаст таблицы в базе).

---

## Шаг 4. Проверка

Открой в браузере: **http://localhost:3000**

Можно регистрироваться и входить — данные хранятся в базе внутри Docker.

---

## Остановить

```powershell
docker-compose down
```

Данные в БД сохраняются в Docker-томе. При следующем `docker-compose up -d` они снова будут доступны.

---

## Запуск без Docker (только база в Docker)

Если хочешь запускать приложение локально (`npm run dev`), но базу оставить в Docker:

1. Запусти только базу: `docker-compose up -d db`
2. В `.env` должно быть:  
   `DATABASE_URL="postgresql://ai_user:ai_password@localhost:5432/ai_english_analyzer"`
3. Запусти приложение: `npm run dev`
