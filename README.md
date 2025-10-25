# Social Network API (STBackend)

Production-ready Express.js backend API for a social network with Telegram-like chat functionality.

## 📋 Содержание

- [Описание](#описание)
- [Технологический стек](#технологический-стек)
- [Быстрый старт](#быстрый-старт)
- [Деплой](#деплой)
- [API Endpoints](#api-endpoints)
- [Безопасность](#безопасность)

## 📝 Описание

STBackend - это полнофункциональный API для социальной сети с поддержкой:

- 👤 Аутентификации и авторизации (JWT)
- 💬 Приватных и групповых чатов
- 📨 Отправки и получения сообщений
- 👥 Управления отношениями (друзья, подписчики, заблокированные)
- 🔐 Безопасности на уровне production

## 🛠️ Технологический стек

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MySQL 9.3.0 с TypeORM
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet.js, CORS, Rate Limiting, bcryptjs
- **Logging:** Winston
- **Containerization:** Docker & Docker Compose

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd STBackend

# Установить зависимости
cd api
npm install

# Создать .env файл
cp .env.example .env

# Запустить в режиме разработки
npm run dev
```

### Docker (рекомендуется)

```bash
# Запустить все сервисы
docker-compose up -d

# Проверить статус
docker-compose ps

# Просмотреть логи
docker-compose logs -f api
```

## 🌐 Деплой

### Быстрый деплой на удаленный сервер

Полное руководство по деплою находится в [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Краткие шаги:**

1. Подготовить сервер (Docker, Docker Compose)
2. Клонировать репозиторий
3. Создать .env файл с production переменными
4. Настроить HTTPS (Let's Encrypt)
5. Настроить Nginx как обратный прокси
6. Запустить `docker-compose up -d`

### Проверка перед деплоем

Используйте [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md) для проверки всех требований.

## 🔒 Безопасность

Все критические проблемы безопасности исправлены:

- ✅ Удалены hardcoded пароли
- ✅ Переменные окружения в .env файле
- ✅ HTTPS обязателен в production
- ✅ Отключен Adminer в production
- ✅ Health checks настроены
- ✅ Rate limiting включен

Дополнительные рекомендации в [SECURITY_RECOMMENDATIONS.md](./SECURITY_RECOMMENDATIONS.md)

## 📚 API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/health` - Проверка здоровья приложения

### Чаты

- `POST /api/chats/private` - Создать приватный чат
- `POST /api/chats/group` - Создать групповой чат
- `GET /api/chats` - Получить чаты пользователя

### Сообщения

- `POST /api/messages` - Отправить сообщение
- `GET /api/messages/:chatId` - Получить сообщения чата

### Отношения

- `POST /api/relationships` - Добавить отношение
- `GET /api/relationships` - Получить отношения пользователя

## 📖 Документация

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Полное руководство по деплою
- [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md) - Чек-лист перед деплоем
- [SECURITY_RECOMMENDATIONS.md](./SECURITY_RECOMMENDATIONS.md) - Рекомендации по безопасности
- [api/README.md](./api/README.md) - Документация API

## 🧪 Тестирование

Используйте Postman коллекцию: `STBackend_API_Tests.postman_collection.json`

```bash
# Или используйте curl
curl -X POST http://localhost:5555/api/auth/health
```

## 📊 Переменные окружения

Все переменные окружения описаны в [api/.env.example](./api/.env.example)

**Важные переменные для production:**

- `NODE_ENV=production`
- `MYSQL_PASSWORD` - минимум 32 символа
- `JWT_SECRET` - минимум 32 символа
- `FRONTEND_URL` - URL вашего фронтенда

## 🐛 Решение проблем

### Приложение не запускается

```bash
docker-compose logs api
```

### Проблемы с базой данных

```bash
docker-compose logs mysqlDatabase
docker-compose restart mysqlDatabase
```

### Очистить все и начать заново

```bash
docker-compose down -v
docker-compose up -d
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose logs -f api`
2. Проверьте health endpoint: `curl http://localhost:5555/api/auth/health`
3. Обратитесь к документации в папке проекта

## 📄 Лицензия

MIT
