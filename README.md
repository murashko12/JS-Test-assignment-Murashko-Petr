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

- Копируем файл с переменными окружения и настраиваем его
```
cp .env.example .env
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