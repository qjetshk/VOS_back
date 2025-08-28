# VOS (Volunteer Management System) - Backend

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-000000?logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748?logo=prisma)](https://www.prisma.io/)

Backend часть системы управления волонтерами (VOS), построенная на современном стеке технологий. Предоставляет RESTful API для аутентификации пользователей, управления событиями и записи на волонтерские мероприятия.

## 🛠 Технологический стек

- **Runtime:** Node.js
- **Фреймворк:** Express.js
- **Язык:** TypeScript
- **ORM:** Prisma
- **База данных:** PostgreSQL (развернута на Supabase)
- **Аутентификация:** JWT (JSON Web Tokens)
- **Обработка cookies:** cookie-parser


🗄️ Структура базы данных
Проект использует Prisma ORM для управления базой данных. Основные модели:

User - пользователи системы

Event - волонтерские события/мероприятия

Participation - связь пользователей с событиями (записи на мероприятия)

📡 API Endpoints
Аутентификация (/auth)
POST /auth/register - Регистрация нового пользователя

POST /auth/login - Вход в систему

POST /auth/refresh - Обновление access token с помощью refresh token

POST /auth/check_auth - Проверка аутентификации пользователя

POST /auth/logout - Выход из системы (очистка cookies)

События (/event)
POST /event/add - Создание нового события (требуется аутентификация)

GET /event/get_user - Получение событий текущего пользователя

GET /event/get_all - Получение всех событий

GET /event/get/:id - Получение конкретного события по ID

DELETE /event/:id - Удаление события (требуются права создателя)

Участие (/participation)
GET /participation/get/:eventId - Получение списка участников конкретного события

GET /participation/get_user - Получение событий, на которые записан текущий пользователь

POST /participation/add/:id - Запись на событие (требуется аутентификация)

DELETE /participation/:id - Отмена записи на событие

🔐 Аутентификация и авторизация
Система использует JWT-токены для аутентификации:

Access Token - хранится в памяти клиента, короткое время жизни

Refresh Token - хранится в httpOnly cookie, более длительное время жизни

