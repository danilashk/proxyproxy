# XML Proxy Service

Прокси-сервис для безопасного доступа к XML эндпоинтам без раскрытия реальных URL.

## Как развернуть на Vercel

1. **Fork этот репозиторий** или скачайте код
2. **Импортируйте проект в Vercel**:
   - Зайдите на [vercel.com](https://vercel.com)
   - Нажмите "New Project"
   - Импортируйте ваш GitHub репозиторий
3. **Настройте Environment Variables в Vercel**:
   - В настройках проекта перейдите в раздел "Environment Variables"
   - Добавьте переменные:
     - `LIVE_ENDPOINT_URL` - URL для live данных
     - `UPCOMING_ENDPOINT_URL` - URL для предстоящих данных

## Использование

После деплоя у вас будет:
- **Главная страница**: `https://your-vercel-url.vercel.app/` или `https://your-vercel-url.vercel.app/home`
- **Live данные**: `https://your-vercel-url.vercel.app/api/live`
- **Upcoming данные**: `https://your-vercel-url.vercel.app/api/upcoming`

## Локальная разработка

```bash
npm install
npm run dev
```

Создайте `.env.local` файл с вашими тестовыми эндпоинтами:
```
LIVE_ENDPOINT_URL=https://test-live-endpoint.com
UPCOMING_ENDPOINT_URL=https://test-upcoming-endpoint.com
```

## Безопасность

- Реальные URLs эндпоинтов видны только владельцу Vercel проекта
- Разработчик не имеет доступа к environment variables после деплоя
- Все запросы проксируются через серверную часть Next.js