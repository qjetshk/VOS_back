# VOS (Volunteer Organizing System) - Backend

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-000000?logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748?logo=prisma)](https://www.prisma.io/)

Backend часть системы управления волонтерами (VOS), построенная на современном стеке технологий. Предоставляет RESTful API для аутентификации пользователей, управления событиями и записи на волонтерские мероприятия.<br>

## 🛠 Технологический стек

- **Runtime:** Node.js
- **Фреймворк:** Express.js
- **Язык:** TypeScript
- **ORM:** Prisma
- **База данных:** PostgreSQL (развернута на Supabase)
- **Аутентификация:** JWT (JSON Web Tokens)
- **Обработка cookies:** cookie-parser<br>  


🗄️ Структура базы данных
Проект использует Prisma ORM для управления базой данных. Основные модели:<br>

User - пользователи системы<br>

Event - волонтерские события/мероприятия<br>

Participation - связь пользователей с событиями (записи на мероприятия)<br>    

📡 API Endpoints<br>
Аутентификация (/auth)<br>
POST /auth/register - Регистрация нового пользователя<br>

POST /auth/login - Вход в систему<br>

POST /auth/refresh - Обновление access token с помощью refresh token<br>

POST /auth/check_auth - Проверка аутентификации пользователя<br>

POST /auth/logout - Выход из системы (очистка cookies)<br>

События (/event)<br>
POST /event/add - Создание нового события (требуется аутентификация)<br>

GET /event/get_user - Получение событий текущего пользователя<br>

GET /event/get_all - Получение всех событий<br>

GET /event/get/:id - Получение конкретного события по ID<br>

DELETE /event/:id - Удаление события (требуются права создателя)<br>  

Участие (/participation)<br>
GET /participation/get/:eventId - Получение списка участников конкретного события<br>

GET /participation/get_user - Получение событий, на которые записан текущий пользователь<br>

POST /participation/add/:id - Запись на событие (требуется аутентификация)<br>

DELETE /participation/:id - Отмена записи на событие<br>

🔐 Аутентификация и авторизация<br>
Система использует JWT-токены для аутентификации:<br>

Access Token - хранится в памяти клиента, короткое время жизни

Refresh Token - хранится в httpOnly cookie, более длительное время жизни

