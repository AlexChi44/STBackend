# 🚀 Руководство по деплою на удаленный сервер

## Предварительные требования

- Docker и Docker Compose установлены на сервере
- SSH доступ к серверу
- Доменное имя (для HTTPS)
- SSL сертификат (Let's Encrypt рекомендуется)

## Шаг 1: Подготовка сервера

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установить Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Проверить установку
docker --version
docker-compose --version
```

## Шаг 2: Клонирование репозитория

```bash
cd /opt
sudo git clone <your-repo-url> st-backend
cd st-backend
sudo chown -R $USER:$USER .
```

## Шаг 3: Настройка переменных окружения

```bash
# Скопировать пример конфигурации
cp api/.env.example .env

# Отредактировать .env с вашими значениями
nano .env
```

**Важные переменные для production:**

```env
NODE_ENV=production
PORT=5555

MYSQL_HOST=mysqlDatabase
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=<GENERATE_STRONG_PASSWORD>
DATABASE_NAME=simple_telegram

JWT_SECRET=<GENERATE_STRONG_SECRET_MIN_32_CHARS>
FRONTEND_URL=https://your-domain.com
```

### Генерация безопасных паролей:

```bash
# Генерировать пароль для MySQL
openssl rand -base64 32

# Генерировать JWT секрет
openssl rand -base64 32
```

## Шаг 4: Настройка HTTPS (Let's Encrypt)

```bash
# Установить Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получить сертификат
sudo certbot certonly --standalone -d your-domain.com

# Сертификаты будут в: /etc/letsencrypt/live/your-domain.com/
```

## Шаг 5: Настройка Nginx (обратный прокси)

Создать `/etc/nginx/sites-available/st-backend`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:5555;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активировать конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/st-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Шаг 6: Запуск приложения

```bash
# Перейти в директорию проекта
cd /opt/st-backend

# Запустить Docker Compose
docker-compose up -d

# Проверить статус
docker-compose ps

# Просмотреть логи
docker-compose logs -f api
```

## Шаг 7: Проверка здоровья приложения

```bash
# Проверить health endpoint
curl https://your-domain.com/api/auth/health

# Должен вернуть:
# {"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

## Шаг 8: Настройка автоматического обновления сертификата

```bash
# Создать скрипт для обновления
sudo nano /usr/local/bin/renew-cert.sh
```

```bash
#!/bin/bash
certbot renew --quiet
systemctl reload nginx
```

```bash
# Сделать исполняемым
sudo chmod +x /usr/local/bin/renew-cert.sh

# Добавить в crontab
sudo crontab -e
# Добавить строку:
# 0 3 * * * /usr/local/bin/renew-cert.sh
```

## Шаг 9: Резервное копирование базы данных

```bash
# Создать скрипт резервного копирования
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/mysql"
mkdir -p $BACKUP_DIR
docker-compose exec -T mysqlDatabase mysqldump -u root -p$MYSQL_PASSWORD $DATABASE_NAME > $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql
```

```bash
# Сделать исполняемым и добавить в crontab
sudo chmod +x /usr/local/bin/backup-db.sh
sudo crontab -e
# Добавить: 0 2 * * * /usr/local/bin/backup-db.sh
```

## Мониторинг и логирование

```bash
# Просмотреть логи приложения
docker-compose logs -f api

# Просмотреть логи базы данных
docker-compose logs -f mysqlDatabase

# Просмотреть логи последних 100 строк
docker-compose logs --tail=100 api
```

## Обновление приложения

```bash
cd /opt/st-backend

# Получить последние изменения
git pull origin main

# Пересобрать и перезапустить
docker-compose down
docker-compose up -d --build

# Проверить статус
docker-compose ps
```

## Решение проблем

### Приложение не запускается

```bash
# Проверить логи
docker-compose logs api

# Проверить переменные окружения
docker-compose config
```

### Проблемы с базой данных

```bash
# Проверить здоровье MySQL
docker-compose exec mysqlDatabase mysqladmin ping -u root -p$MYSQL_PASSWORD

# Перезагрузить контейнер
docker-compose restart mysqlDatabase
```

### Очистить все и начать заново

```bash
docker-compose down -v
docker-compose up -d
```

## Безопасность

✅ **Что было сделано:**
- Удалены hardcoded пароли
- Включен HTTPS
- Отключен Adminer в production
- Добавлены health checks
- Настроена изоляция сети Docker

⚠️ **Дополнительные рекомендации:**
- Регулярно обновляйте Docker образы
- Используйте firewall (ufw)
- Мониторьте логи на ошибки
- Настройте резервное копирование
- Используйте strong пароли (минимум 32 символа)

