# AI English Learning Analyzer

**Жасанды интеллект негізіндегі ағылшын тілін оқыту платформасы.**  
Серверлік инфрақұрылымды жобалау және жүзеге асыру жобасы.

---

## Архитектура

```
┌────────────────────────────────────────────────────────┐
│                    Интернет                             │
└───────────────────────┬────────────────────────────────┘
                        │ 80 / 443
                ┌───────▼───────┐
                │  Nginx (SSL)  │  ← Reverse Proxy + Rate Limit
                └───────┬───────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
  ┌─────▼─────┐  ┌──────▼──────┐ ┌─────▼──────┐
  │ Next.js   │  │  Grafana    │ │  Jenkins   │
  │ App:3000  │  │  UI:3001    │ │  CI/CD:8080│
  └─────┬─────┘  └──────┬──────┘ └────────────┘
        │               │
  ┌─────▼─────┐  ┌──────▼──────┐
  │PostgreSQL │  │ Prometheus  │ ← Node Exporter метрикасы
  │ DB:5432   │  │  :9090      │
  └───────────┘  └──────┬──────┘
                        │ Alert
                 ┌──────▼──────┐
                 │Alertmanager │ → Telegram Bot → Чат
                 └─────────────┘
```

---

## Модульдер (100 балл)

| # | Модуль | Балл | Мәртебе |
|---|--------|------|---------|
| 1 | ОЖ — Docker/Linux орнату | 5 | ✅ |
| 2 | Қауіпсіздік — Nginx, SSL, Fail2Ban, UFW, Backup | 10 | ✅ |
| 3 | Дерекқор — PostgreSQL + seed деректер | 20 | ✅ |
| 4 | Қосымша — Next.js + React + AI (Gemini) | 25 | ✅ |
| 5 | Контейнерлеу — Docker + Docker Compose | 9 | ✅ |
| 6 | Нұсқа басқару — Git + GitHub | 6 | ✅ |
| 7 | Мониторинг — Prometheus + Grafana + Telegram | 11 | ✅ |
| 8 | ЖИ қабаты — Gemini/OpenAI API интеграция | 9 | ✅ |
| 9 | IaC — Terraform + Ansible | 5 | ✅ |
| | **Жиыны** | **100** | **✅** |

---

## Технологиялар стегі

**Frontend:** Next.js 14, React 18, Tailwind CSS  
**Backend:** Next.js API Routes, TypeScript  
**Дерекқор:** PostgreSQL 16, Prisma ORM  
**AI:** Google Gemini API, OpenAI API  
**Контейнерлеу:** Docker, Docker Compose  
**Reverse Proxy:** Nginx (SSL/TLS)  
**Мониторинг:** Prometheus, Grafana, Alertmanager  
**CI/CD:** Jenkins  
**IaC:** Terraform, Ansible  
**Қауіпсіздік:** UFW, Fail2Ban, JWT, bcrypt  

---

## Жылдам іске қосу

### Талаптар
- Docker Desktop
- Git

### 1. Репозиторийді клондау
```bash
git clone https://github.com/DiasIsenov06/ai-english-analyzer.git
cd ai-english-analyzer
```

### 2. SSL сертификат жасау
```bash
# Linux/Mac:
bash nginx/ssl-setup.sh
# Windows (PowerShell):
# nginx/ssl каталогын жасап, cert.pem мен key.pem файлдарын орнатыңыз
```

### 3. .env файлын жасау
```bash
cp .env.example .env
# .env файлын өңдеп, мәндерді толтырыңыз:
# JWT_SECRET=...
# GEMINI_API_KEY=...
```

### 4. Docker Compose іске қосу
```bash
# Тек қосымша (жылдам):
docker-compose up -d db app

# Толық стек (мониторинг + Jenkins):
docker-compose up -d
```

### 5. Дерекқорды деректермен толтыру (опционалды)
```bash
npm run db:seed
```

---

## Сервистер мекенжайлары

| Сервис | URL |
|--------|-----|
| Қосымша | http://localhost:3000 |
| Grafana | http://localhost:3001 |
| Prometheus | http://localhost:9090 |
| Jenkins | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

---

## Қауіпсіздік (Модуль 2)

### Nginx + SSL
```bash
# Self-signed SSL:
bash nginx/ssl-setup.sh

# Let's Encrypt (продакшн):
bash nginx/ssl-setup.sh prod yourdomain.com admin@yourdomain.com
```

**Мүмкіндіктер:**
- HTTPS (TLS 1.2/1.3)
- Rate limiting (Auth: 5 сор./мин, API: 10 сор./сек)
- Security headers (HSTS, X-Frame-Options, CSP)
- HTTP → HTTPS автоматты бағыттау

### UFW Firewall
```bash
sudo bash scripts/setup-server.sh
```

### Дерекқор сақтық көшірмесі
```bash
# Сақтық көшірме жасау:
bash scripts/backup.sh backup

# Қалпына келтіру:
bash scripts/backup.sh restore backups/db_backup_2026-05-01_03-00-00.sql.gz
```

---

## Мониторинг (Модуль 7)

### Grafana дашборд
- CPU, RAM, Диск метрикалары
- Желі трафигі
- Қосымша күйі (онлайн/офлайн)
- **Кіру:** admin / admin123

### Prometheus ескерту ережелері
- CPU > 85% → Warning
- CPU > 95% → Critical
- RAM > 85% → Warning
- Диск < 15% → Warning
- Қосымша офлайн → Critical

### Telegram Bot хабарландыру
`.env` файлына қосыңыз:
```
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

---

## CI/CD — Jenkins (Модуль 7)

**Pipeline кезеңдері:**
1. `Checkout` — GitHub-тан код тарту
2. `Install Dependencies` — npm install
3. `Lint` — ESLint тексеру
4. `Type Check` — TypeScript тексеру
5. `Build` — Next.js жинақтау
6. `Docker Build` — Image жасау
7. `Backup Database` — Сақтық көшірме
8. `Deploy` — Продакшнға орналастыру
9. `Health Check` — Денсаулық тексеру

---

## Infrastructure as Code (Модуль 9)

### Terraform
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# terraform.tfvars мәндерін толтырыңыз

terraform init
terraform plan
terraform apply
```

**Жасалатын ресурстар:** VPC, Subnet, Security Group, EC2, Elastic IP

### Ansible
```bash
# inventory.ini файлындағы IP мекенжайын өзгертіңіз
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

**Автоматтандыратындар:** жүйе жаңарту, Docker орнату, UFW, Fail2Ban, жобаны тарту, SSL, Docker Compose іске қосу, автоматты сақтық көшірме (cron)

---

## API эндпоинттері

| Метод | URL | Сипаттама |
|-------|-----|-----------|
| POST | `/api/auth/register` | Тіркелу |
| POST | `/api/auth/login` | Кіру |
| POST | `/api/test/results` | Тест нәтижесін сақтау |
| GET | `/api/test/results` | Тест нәтижелерін алу |
| POST | `/api/plan/generate` | 28 күндік жоспар жасау |
| GET | `/api/plan/current` | Ағымдағы жоспарды алу |
| POST | `/api/training/session/start` | Жаттығу сессиясын бастау |
| POST | `/api/training/session/:id/message` | AI-ға хабар жіберу |

---

## Дерекқор схемасы

```
User ─── TestResult
  └───── StudyPlan ─── StudyPlanDay ─── StudyTask
  └───── TrainingSession ─── TrainingMessage
  └───── UserVocabulary ─── VocabularyWord
                            GrammarLesson
```

**Demo кіру:** `demo@aienglish.kz` / `Test1234!`  
(npm run db:seed командасынан кейін)

---

## Орта айнымалылары (.env)

| Айнымалы | Сипаттама | Міндетті |
|----------|-----------|---------|
| `DATABASE_URL` | PostgreSQL байланыс жолы | ✅ |
| `JWT_SECRET` | JWT токен кілті | ✅ |
| `GEMINI_API_KEY` | Google Gemini API кілті | — |
| `OPENAI_API_KEY` | OpenAI API кілті | — |
| `GRAFANA_PASSWORD` | Grafana admin құпия сөзі | — |
| `TELEGRAM_BOT_TOKEN` | Telegram bot токені | — |
| `TELEGRAM_CHAT_ID` | Telegram чат ID | — |

---

## Жоба құрылымы

```
ai-english-analyzer/
├── src/                      # Next.js қосымшасы
│   ├── app/api/              # Backend API routes
│   ├── app/(pages)/          # Frontend беттері
│   ├── components/           # React компоненттері
│   └── lib/                  # Утилиталар (auth, AI, prisma)
├── prisma/
│   ├── schema.prisma         # Дерекқор схемасы
│   └── seed.ts               # Бастапқы деректер
├── nginx/
│   ├── nginx.conf            # Nginx конфигурациясы
│   └── ssl-setup.sh          # SSL сертификат скрипті
├── monitoring/
│   ├── prometheus.yml        # Prometheus конфигурациясы
│   ├── alert-rules.yml       # Ескерту ережелері
│   ├── alertmanager.yml      # Alertmanager (Telegram)
│   ├── telegram-bot/         # Telegram Bot (Python)
│   └── grafana/              # Grafana provisioning
├── scripts/
│   ├── setup-server.sh       # Сервер баптауы
│   ├── backup.sh             # DB сақтық көшірме
│   └── deploy.sh             # Орналастыру скрипті
├── terraform/                # Infrastructure as Code
│   ├── main.tf               # Негізгі ресурстар
│   ├── variables.tf          # Айнымалылар
│   └── outputs.tf            # Шығыс мәндер
├── ansible/                  # Конфигурация басқару
│   ├── playbook.yml          # Негізгі playbook
│   └── inventory.ini         # Сервер тізімі
├── Dockerfile                # Docker image
├── docker-compose.yml        # Барлық сервистер
└── Jenkinsfile               # CI/CD pipeline
```

---

## Авторлар

**Ақжан Расуул** — АЖ-37 тобы  
GitHub: [DiasIsenov06/ai-english-analyzer](https://github.com/DiasIsenov06/ai-english-analyzer)
