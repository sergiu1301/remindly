# Remindly

A clean Next.js + Prisma app for reminders, email verification, forgot password and automatic expiry notifications.

## Features

- Login with email verification required
- Internal register endpoint only
- Forgot password + reset password
- Profile page with phone number and language
- Generic reminders: category is plain text, not enum
- Mobile-first UI
- Automatic notifications through cron endpoint
- Gmail SMTP support for free usage

## Setup

1. Install dependencies

```bash
npm install
```

2. Copy environment file

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

3. Fill `.env`

4. Generate Prisma client and push schema

```bash
npm run db:generate
npm run db:push
```

5. Start the app

```bash
npm run dev
```

## Create first user

Use PowerShell:

```powershell
Invoke-RestMethod -Method POST "http://localhost:3000/api/internal/register" `
-Headers @{
  "Content-Type" = "application/json"
  "x-admin-secret" = "secret-only-you-know"
} `
-Body '{"email":"sergiu.eduard.suciu@gmail.com","password":"ParolaAdmin123!","fullName":"Admin Sergiu","language":"en"}'
```

## Automatic notifications

Local test:

```bash
curl -X POST http://localhost:3000/api/cron/send-expiry-notifications
```

For Vercel, add a cron entry in `vercel.json`.

## Notes

- If Gmail SMTP is not configured, email sending is skipped gracefully in development.
- Passwords are hashed with bcrypt.
- Category is a string so users can enter anything.
