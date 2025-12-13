# Sea Battle Server

Сервер для игры "Морской бой" с авторизацией пользователей и четкой архитектурой.

## Структура проекта

```
server/
├── config/           # Конфигурация
│   ├── database.js   # Подключение к MongoDB
│   └── jwt.js        # Настройки JWT
├── controllers/      # Контроллеры (бизнес-логика)
│   ├── authController.js  # Авторизация
│   └── userController.js   # Управление пользователями
├── middleware/       # Middleware
│   └── auth.js       # Аутентификация
├── models/           # Модели MongoDB
│   ├── User.js       # Модель пользователя
│   ├── Room.js       # Модель комнаты
│   ├── Gamelogs.js   # Модель логов игр
│   └── index.js      # Экспорт всех моделей
├── routes/           # API маршруты
│   ├── authRoutes.js # Маршруты авторизации
│   └── userRoutes.js # Маршруты пользователей
├── services/         # Сервисы (бизнес-логика)
│   ├── gameService.js        # Логика игры
│   └── roomCleanupService.js # Очистка неактивных комнат
├── socket/           # Socket.IO обработчики
│   ├── index.js      # Главный файл сокетов
│   ├── roomHandlers.js # Обработчики комнат
│   └── gameHandlers.js  # Обработчики игры
├── utils/            # Утилиты
│   ├── jwt.js        # JWT утилиты
│   └── gameUtils.js  # Игровые утилиты
└── server.js         # Главный файл сервера
```

## Модель пользователя

Пользователь имеет следующие поля:
- `username` - имя пользователя (уникальное)
- `email` - email (уникальный)
- `password` - пароль (хешированный)
- `rank` - звание (Новичок, Матрос, Старшина, Лейтенант, Капитан, Адмирал)
- `rating` - рейтинг (начинается с 1000)
- `gamesPlayed` - количество сыгранных игр
- `gamesWon` - количество побед
- `lastGameDate` - дата последней игры
- `lastOnlineDate` - дата последнего онлайна

## API Endpoints

### Авторизация

- `POST /api/auth/register` - Регистрация
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

- `POST /api/auth/login` - Вход
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- `GET /api/auth/me` - Получить текущего пользователя (требует токен)

### Пользователи

- `GET /api/users/leaderboard` - Таблица лидеров
- `GET /api/users/:userId` - Профиль пользователя
- `PUT /api/users/profile` - Обновить профиль (требует токен)

## Socket.IO

### Аутентификация

Для аутентификации через Socket.IO передайте токен в `handshake.auth.token` или `handshake.query.token`.

### События

- `create-room` - Создать комнату
- `join-room` - Присоединиться к комнате
- `get-room-info` - Получить информацию о комнате
- `submit-fleet` - Отправить флот
- `fire` - Выстрел
- `player-left-room` - Покинуть комнату

## Установка зависимостей

```bash
npm install
```

## Запуск

```bash
# Разработка
npm run dev

# Продакшн
npm start
```

## Переменные окружения

Создайте файл `.env` в корне проекта:

```
MONGO_CONNECTION_URL=mongodb://localhost:27017/seawar
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
```

