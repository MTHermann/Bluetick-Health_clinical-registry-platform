# Clinical Registry Platform

Production-ready Next.js 14 clinical registry for organisation master data, user administration, patient tracking, structured form capture, validation workflows, and operational analytics.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth credentials authentication
- Docker + docker-compose

## Features

- Role-aware login flow
- CRUD for countries, hospitals, departments, and ICUs
- User management for registry teams
- Patient registry with ICU assignment
- JSON-backed clinical data forms
- Validation workflow with audit notes
- Dashboard and analytics metrics from live API routes

## Getting started

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Update `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start PostgreSQL (local or Docker):
   ```bash
   docker compose up -d db
   ```
5. Generate Prisma client and apply schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```
6. Seed the default administrator:
   ```bash
   npm run db:seed
   ```
7. Run the development server:
   ```bash
   npm run dev
   ```

## Seeded login

- **Email:** `admin@clinicalregistry.com`
- **Password:** `admin123`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
npm run db:studio
```

## Docker

Bring up the full stack:

```bash
docker compose up --build
```

## Project structure

- `app/` — App Router pages, layouts, and API route handlers
- `components/` — shared UI and layout components
- `lib/` — Prisma, auth, validation, and API helpers
- `prisma/` — schema, SQL migration, and seed data
- `types/` — shared TypeScript types

## Notes

- All application data is served through `app/api/*` route handlers.
- Organisation, users, patients, forms, validation, dashboard, and analytics pages consume live API endpoints.
- Prisma schema targets PostgreSQL.
