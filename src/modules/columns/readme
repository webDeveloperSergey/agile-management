# Columns Module — Документация

## Концепция

Колонки (Columns) — это разделы внутри доски, которые организуют задачи по статусу.
Например: **To Do → In Progress → Done**.

Управлять колонками может только **владелец доски (owner)**.
Просматривать колонки могут все **участники и владелец** доски.

---

## Схема данных

```prisma
model Column {
  column_id String @id @default(uuid()) @db.Uuid
  name      String
  order     Int                          // порядок отображения колонки
  
  board_id  String @db.Uuid
  board     Board  @relation(fields: [board_id], references: [board_id])
  
  tasks     Task[]                       // задачи внутри колонки (пока пустой массив)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("columns")
}
```

---

## Инициализация колонок при создании доски

При создании доски (`POST /boards`) пользователь выбирает один из двух вариантов:

### Вариант 1 — Базовые колонки (по умолчанию)

Если `withDefaultColumns: true` (или поле не передано) — автоматически создаются 3 колонки:

| order | name        |
|-------|-------------|
| 1     | To Do       |
| 2     | In Progress |
| 3     | Done        |

### Вариант 2 — Пустая доска

Если `withDefaultColumns: false` — доска создаётся без колонок.
Владелец добавляет колонки вручную через `POST /boards/:id/columns`.

**Обновление `CreateBoardDto`:**
```typescript
withDefaultColumns?: boolean  // default: true
```

---

## Эндпоинты

| Метод  | URL                                  | Описание                        | Доступ              |
|--------|--------------------------------------|---------------------------------|---------------------|
| GET    | `/boards/:id/columns`               | Получить все колонки доски      | Owner + участники   |
| POST   | `/boards/:id/columns`               | Создать новую колонку           | Только owner        |
| PATCH  | `/boards/:id/columns/:columnId`     | Редактировать колонку           | Только owner        |
| DELETE | `/boards/:id/columns/:columnId`     | Удалить колонку                 | Только owner        |

---

## Поля колонки

### Создание (`CreateColumnDto`)
```typescript
{
  name: string      // обязательное, длина 1-50 символов
  order?: number    // необязательное, если не передан — добавляется последней
}
```

### Ответ сервера
```typescript
{
  column_id: string
  name: string
  order: number
  tasks: []         // пустой массив при создании
}
```

---

## Бизнес-логика

### GET /boards/:id/columns
- Проверяем что юзер является **владельцем или участником** доски
- Возвращаем все колонки доски отсортированные по полю `order`

### POST /boards/:id/columns
- Проверяем что юзер является **владельцем** доски (`checkOwner`)
- Если `order` не передан — берём максимальный `order` существующих колонок + 1
- Создаём колонку и возвращаем `201 Created`

### PATCH /boards/:id/columns/:columnId
- Проверяем что юзер является **владельцем** доски
- Можно обновить `name` и/или `order`
- Возвращаем обновлённую колонку

### DELETE /boards/:id/columns/:columnId
- Проверяем что юзер является **владельцем** доски
- Удаляем колонку (и все задачи внутри неё — каскадное удаление)
- Возвращаем `204 No Content`

---

## Порядок реализации

1. Добавить модель `Column` в `schema.prisma`
2. Создать миграцию
3. Обновить `CreateBoardDto` — добавить `withDefaultColumns`
4. Обновить `BoardsRepository.createBoard` — создавать дефолтные колонки если нужно
5. Создать `ColumnModule` (controller, service, repository)
6. Покрыть `ColumnService` unit тестами

---

## Связи с другими модулями

```
Board (1) ──→ (M) Column (1) ──→ (M) Task
```

- Одна доска содержит много колонок
- Одна колонка содержит много задач
- При удалении доски — удаляются все её колонки (каскад)
- При удалении колонки — удаляются все её задачи (каскад)