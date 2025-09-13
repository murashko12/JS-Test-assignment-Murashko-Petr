# Управление пользователями

Система управления пользователями

## 🛠 Стек технологий

*   **Backend:** NestJS, TypeScript, Prisma, PostgreSQL,
*   **Frontend:** React, TypeScript, Vite, RTK-Query, Tailwind CSS, Anta

Проект доступен по ссылке: 

```
https://js-test-assignment-murashko-petr.vercel.app/
```

## Склонировать проект

```
git clone https://github.com/murashko12/JS-Test-assignment-Murashko-Petr.git
cd JS-Test-assignment-Murashko-Petr
```

## Настройка backend

- Переходим в папку backend
```
cd backend
```

- Устанавливаем зависимости
```
npm install
```

- внутри папки backend создайте файл .env
```
touch .env
```

- В .env укажите:
```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# The following `prisma+postgres` URL is similar to the URL produced by running a local Prisma Postgres 
# server with the `prisma dev` CLI command, when not choosing any non-default ports or settings. The API key, unlike the 
# one found in a remote Prisma Postgres URL, does not contain any sensitive information.

POSTGRES_URL="postgres://b1f2b176e2c2ff7f412bd978f00c24f0814c595a8ad5f5558104d3517ebefc40:sk_T8NAMi6eJJPlDlNKHb3PH@db.prisma.io:5432/postgres?sslmode=require"
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19UOE5BTWk2ZUpKUGxEbE5LSGIzUEgiLCJhcGlfa2V5IjoiMDFLNFlLTjI2MUY4NTkzUFgwV0FQTjRIN1kiLCJ0ZW5hbnRfaWQiOiJiMWYyYjE3NmUyYzJmZjdmNDEyYmQ5NzhmMDBjMjRmMDgxNGM1OTVhOGFkNWY1NTU4MTA0ZDM1MTdlYmVmYzQwIiwiaW50ZXJuYWxfc2VjcmV0IjoiMDk5MDYwZDktZjVlZC00YTcwLWEzMzctZDZkY2E2YTg0ZTc3In0.ZqM2TkFmENPHk8TQlBNtpNoEfscyCTmV6Gyvuwtq9Hg"
DATABASE_URL="postgres://b1f2b176e2c2ff7f412bd978f00c24f0814c595a8ad5f5558104d3517ebefc40:sk_T8NAMi6eJJPlDlNKHb3PH@db.prisma.io:5432/postgres?sslmode=require"
```

- Запуск миграции и генерация клиента (Prisma)
```
npx prisma generate
npx prisma migrate dev
```

- Запускаем сервер в режиме разработки
```
npm run start:dev
```

## Настройка frontend

```
cd frontend
npm install
npm run dev
```