# Agile Management API

Backend REST API для управления agile-проектами. Вдохновлён Trello и Jira.

Построен на **NestJS + PostgreSQL + Prisma ORM**.

---

## Технологии

- **NestJS** — фреймворк для построения серверных приложений
- **PostgreSQL** — реляционная база данных
- **Prisma ORM** — работа с БД, миграции, типизация
- **JWT** — авторизация через access + refresh токены
- **Argon2** — хеширование паролей
- **Jest** — unit тестирование
- **Swagger** — автодокументация API

---

## Архитектура

```
src/
├── core/           # Инфраструктура: PrismaModule, ConfigModule, JwtModule
├── shared/         # Переиспользуемое: Guards, Decorators, Types, Utils
└── modules/
    ├── auth/       # Авторизация и аутентификация
    ├── users/      # Управление пользователями
    ├── boards/     # Управление досками
    └── columns/    # Управление колонками
```

---

## API Эндпоинты

### Auth

| Метод | URL              | Описание              | Доступ |
| ----- | ---------------- | --------------------- | ------ |
| POST  | `/auth/register` | Регистрация           | Все    |
| POST  | `/auth/login`    | Вход                  | Все    |
| POST  | `/auth/refresh`  | Обновить access токен | Все    |
| POST  | `/auth/logout`   | Выход                 | Все    |

### Users

| Метод | URL          | Описание                  | Доступ |
| ----- | ------------ | ------------------------- | ------ |
| GET   | `/users`     | Список всех пользователей | ADMIN  |
| GET   | `/users/:id` | Один пользователь         | Все    |
| POST  | `/users`     | Создать пользователя      | Все    |

### Boards

| Метод  | URL                             | Описание            | Доступ            |
| ------ | ------------------------------- | ------------------- | ----------------- |
| GET    | `/boards`                       | Мои доски           | Авторизованные    |
| GET    | `/boards/:id`                   | Одна доска          | Owner + участники |
| POST   | `/boards`                       | Создать доску       | ADMIN             |
| PATCH  | `/boards/:id`                   | Редактировать доску | Owner             |
| DELETE | `/boards/:id`                   | Удалить доску       | Owner             |
| POST   | `/boards/:id/members/:memberId` | Добавить участника  | Owner             |
| DELETE | `/boards/:id/members/:memberId` | Удалить участника   | Owner             |

### Columns

| Метод  | URL                             | Описание              | Доступ            |
| ------ | ------------------------------- | --------------------- | ----------------- |
| GET    | `/boards/:id/columns`           | Колонки доски         | Owner + участники |
| POST   | `/boards/:id/columns`           | Создать колонку       | Owner             |
| PATCH  | `/boards/:id/columns/:columnId` | Редактировать колонку | Owner             |
| DELETE | `/boards/:id/columns/:columnId` | Удалить колонку       | Owner             |

---

## Авторизация

Система использует два токена:

- **Access token** — короткоживущий (15 мин в prod, 1 час в dev), передаётся в заголовке `Authorization: Bearer <token>`
- **Refresh token** — долгоживущий (7 дней), хранится в `HttpOnly` куке, используется для обновления access токена

### Глобальные роли

- `ADMIN` — полный доступ к системе
- `USER` — обычный пользователь

### Роли на доске

- `ADMIN` — владелец доски
- `MEMBER` — участник
- `VIEWER` — наблюдатель

---

## Модели данных

```prisma
User         — пользователь системы
Board        — доска проекта
BoardMembership — участие пользователя в доске
Column       — колонка внутри доски (To Do, In Progress, Done)
```

### Связи

```
User (1) ──→ (M) Board          — один пользователь владеет многими досками
User (M) ──→ (M) Board          — через BoardMembership (участники)
Board (1) ──→ (M) Column        — одна доска содержит много колонок
```

---

## Запуск проекта

### Требования

- Node.js 18+
- PostgreSQL 14+

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/webDeveloperSergey/agile-management

# Установить зависимости
npm install

# Создать .env файл
cp .env.sample .env
# Заполнить переменные окружения

# Применить миграции
npx prisma migrate deploy

# Запустить в режиме разработки
npm run start:dev
```

### Переменные окружения

```env
DATABASE_URL="postgresql://user:password@localhost:5432/agile_management"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="15"           # в минутах
JWT_REFRESH_EXPIRES_IN="7"    # в днях
MODE="development"
CLIENT_URL="http://localhost:3001"
DOMAIN="localhost"
```

---

## Тестирование

```bash
# Запустить все тесты
npm run test

# Запустить конкретный файл
npx jest auth.service.spec.ts --watch

# Покрытие тестами
npm run test:cov
```

Покрыто unit тестами:

- `AuthService` — 5 тестов
- `BoardsService` — 13 тестов

---

## Документация API

После запуска сервера Swagger доступен по адресу:

```
http://localhost:3000/api/docs
```
