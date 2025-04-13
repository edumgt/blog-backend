# Blog backend API

REST API для блога на Express и TS.

[Frontend для этого API](https://blogaboutit.netlify.app/)

## Technologies Used

- Node.js + Express
- TypeScript
- MongoDB (mongoose)
- JWT - авторизация и аутентификация
- bcrypt - хеширование паролей
- Multer + Cloudinary - загрузка изображений
- CORS, dotenv - настройка окружения
- express-validator — валидация входящих данных
- Render - деплой

## Features

- Регистрация и авторизация пользователей
- CRUD для постов
- CRUD для комментариев
- Загрузка изображений (Cloudinary)
- Защита маршрутов (middleware checkAuth)
- Валидация данных (express-validator)

### API Endpoints

| Method | Endpoint            | Description                     | Auth Required |
| ------ | ------------------- | ------------------------------- | ------------- |
| POST   | /auth/login         | Авторизация                     | Нет           |
| POST   | /auth/register      | Регистрация                     | Нет           |
| GET    | /auth/me            | Получение данных о пользователе | Да            |
| POST   | /upload             | Загрузка изображения            | Да            |
| GET    | /posts              | Получение всех постов           | Нет           |
| GET    | /posts/:id          | Получение одного поста          | Нет           |
| POST   | /posts              | Создание поста                  | Да            |
| PATCH  | /posts/:id          | Обновление поста                | Да            |
| DELETE | /posts/:id          | Удаление поста                  | Да            |
| GET    | /tags               | Получение тегов                 | Нет           |
| GET    | /posts/:id/comments | Получение комментариев к посту  | Нет           |
| POST   | /posts/:id/comments | Добавление комментария к посту  | Да            |
| PATCH  | /comments/:id       | Обновление комментария          | Да            |
| DELETE | /comments/:id       | Удаление комментария            | Да            |

## How to start project

in the project directory enter:

```js
npm install
```

create .env file in the root directory and specify:

```
MONGODB_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret
PORT = your_port
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_key
CLOUDINARY_API_SECRET = your_secret
```

compile the project:

```js
npm run build
```

start the server:

```js
npm start
```
