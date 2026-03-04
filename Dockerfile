FROM node:20-slim

# OpenSSL нужен для Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем файлы зависимостей и Prisma (нужен для postinstall)
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Устанавливаем зависимости (postinstall = prisma generate)
RUN npm ci

# Копируем весь проект
COPY . .

# Генерируем Prisma клиент (URL-заглушка для сборки)
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npx prisma generate

# Сборка Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Применяем схему БД и запускаем приложение
CMD ["sh", "-c", "npx prisma db push && npm run start"]
