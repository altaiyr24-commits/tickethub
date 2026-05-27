# 🎟️ TicketHub — Premium Ticket Platform

Современная full-stack платформа для продажи билетов уровня Ticketmaster/Kino.kz.

## 🚀 Технологии

**Frontend:** React 18 + Vite + TailwindCSS + Framer Motion + Zustand  
**Backend:** Node.js + Express + Socket.io  
**Database:** PostgreSQL + Prisma ORM  
**Auth:** JWT (access + refresh tokens)  
**Real-time:** WebSocket (seat status updates)

## 📁 Структура проекта

```
tickethub/
├── frontend/          # React + Vite приложение
│   └── src/
│       ├── components/
│       │   ├── home/      # Hero, Categories, Featured Events
│       │   ├── layout/    # Navbar, Footer, AdminLayout
│       │   ├── seats/     # Интерактивная SVG схема зала
│       │   └── ui/        # EventCard, Modal, Countdown, Skeleton
│       ├── hooks/         # useEvents, useSeats, useCountdown
│       ├── lib/           # api.js, socket.js, utils.js
│       ├── pages/         # Все страницы
│       │   └── admin/     # Админ панель
│       └── store/         # Zustand stores (auth, cart, theme)
└── backend/           # Express API
    ├── prisma/
    │   ├── schema.prisma  # Полная схема БД
    │   └── seed.js        # Тестовые данные
    └── src/
        ├── controllers/   # auth, event, seat, order
        ├── middleware/     # auth, error, validate
        ├── routes/        # Все API маршруты
        └── socket/        # WebSocket handlers
```

## ⚡ Быстрый старт

### 1. Установка зависимостей

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Настройка окружения

```bash
cd backend
cp .env.example .env
# Заполни DATABASE_URL и другие переменные
```

### 3. База данных

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Запуск

```bash
# Backend (порт 5000)
cd backend && npm run dev

# Frontend (порт 5173)
cd frontend && npm run dev
```

## 🔑 Демо аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | admin@tickethub.kz | admin123 |
| User | user@tickethub.kz | user123 |

## 🌐 API Endpoints

| Method | Endpoint | Описание |
|--------|----------|----------|
| POST | /api/auth/register | Регистрация |
| POST | /api/auth/login | Вход |
| GET | /api/events | Список событий |
| GET | /api/events/:slug | Детали события |
| GET | /api/seats/event/:id | Схема зала |
| POST | /api/seats/reserve | Бронирование мест |
| POST | /api/orders | Создание заказа |
| GET | /api/orders | Мои заказы |
| GET | /api/admin/stats | Статистика (admin) |

## ✨ Функционал

- 🎨 **Glassmorphism UI** с тёмной темой и неоновыми акцентами
- 🗺️ **Интерактивная SVG схема зала** с zoom/pan, hover tooltips
- ⚡ **Real-time обновления** мест через WebSocket
- 🔒 **JWT авторизация** с refresh tokens
- 🛒 **Корзина** с таймером бронирования (10 мин)
- 📱 **QR-билеты** генерируются автоматически
- 👑 **Админ панель** с CRUD событий, статистикой
- 📱 **Полная адаптивность** для мобильных
- 🔍 **Поиск и фильтрация** событий
- ❤️ **Избранное** и история заказов
