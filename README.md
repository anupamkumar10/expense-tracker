# Smart Expense Tracker (Full‑Stack)

Production‑grade, full‑stack expense tracking app with JWT auth (access + refresh), role‑based admin panel, transaction management, budget alerts, analytics insights, and charts.

## Features

- **Auth**: register/login, bcrypt hashing, access+refresh JWT, refresh endpoint, secure logout, role‑based authorization (user/admin)
- **Transactions**: create/edit/delete, bulk delete, pagination, filtering, sorting, keyword search, CSV export
- **Dashboard**: totals, recent transactions, charts (income vs expense, category pie), rule‑based insights
- **Budget**: monthly limit + warning at 80%/100%
- **Admin**: stats, list/delete users, list/delete all transactions
- **UX**: responsive UI, dark mode, toasts, debounced search, optimistic deletes

## Tech Stack

- **Client**: React (Vite), Tailwind CSS, React Router, Axios, Recharts
- **Server**: Node.js, Express, MVC, express-validator, JWT, bcrypt
- **DB**: MongoDB + Mongoose

## Folder Structure

```
expense-tracker/
  client/
    src/
      components/
      context/
      pages/
      services/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
```

## Setup (Local)

### 1) Backend

From `server/`:

```bash
npm install
```

Create `.env` (already included for local dev) or copy from `.env.example`:

```bash
cp .env.example .env
```

Run:

```bash
npm run dev
```

Server runs on `http://localhost:5000`.

### 2) Frontend

From `client/`:

```bash
npm install
npm run dev
```

Client runs on `http://localhost:5173` and proxies `/api` to the backend.

## Run with Docker Compose (Full Stack)

From project root:

```bash
docker compose up --build -d
```

This starts:

- `mongodb` on `mongodb://localhost:27017`
- `server` on `http://localhost:5000`
- `client` on `http://localhost:8080`

Useful commands:

```bash
docker compose ps
docker compose logs -f server
docker compose down
```

To also remove MongoDB volume data:

```bash
docker compose down -v
```

### Open the application

Open this URL in your browser:

- `http://localhost:8080` (landing page)
- `http://localhost:8080/login` (sign in)
- `http://localhost:8080/app/dashboard` (app after login)

**Local dev (without Docker):**

```bash
cd server && npm run dev
cd client && npm run dev
```

- Landing: `http://localhost:5173/`
- App: `http://localhost:5173/app/dashboard`

You can optionally check API health at:

- `http://localhost:5000/health`

## Admin Setup

Set `ADMIN_EMAIL` in `server/.env`. When that email registers, it becomes `role=admin`.

## API Documentation (REST)

Base URL: `/api`

### Auth

- `POST /auth/register`

Request:

```json
{ "name": "Anupa", "email": "anupa@example.com", "password": "password123" }
```

Response:

```json
{ "success": true, "user": { "id": "...", "name": "Anupa", "email": "anupa@example.com", "role": "user" } }
```

- `POST /auth/login`

Response:

```json
{ "success": true, "accessToken": "<jwt>", "user": { "id": "...", "role": "user" } }
```

Also sets `refreshToken` **httpOnly cookie**.

- `POST /auth/refresh`

Uses cookie and returns a new access token:

```json
{ "success": true, "accessToken": "<jwt>", "user": { "id": "...", "role": "user" } }
```

- `POST /auth/logout`
- `GET /auth/me` (requires `Authorization: Bearer <accessToken>`)

### Transactions (requires auth)

- `GET /transactions`

Query params:
`page`, `limit`, `type`, `category`, `startDate`, `endDate`, `sortBy` (`date|amount`), `sortOrder` (`asc|desc`), `q`

- `POST /transactions`

```json
{ "amount": 1200, "type": "expense", "category": "Travel", "note": "Taxi", "date": "2026-06-02" }
```

- `PATCH /transactions/:id`
- `DELETE /transactions/:id`
- `POST /transactions/bulk-delete`

```json
{ "ids": ["<id1>", "<id2>"] }
```

- `GET /transactions/export` (same filters as list; returns CSV)

### Budget (requires auth)

- `GET /budget`
- `PUT /budget`

```json
{ "monthlyLimit": 25000 }
```

### Planner (requires auth) — manual savings, recurring, bills

- `GET/POST /planner/savings-goals`
- `PATCH/DELETE /planner/savings-goals/:id`
- `GET/POST /planner/recurring`
- `PATCH/DELETE /planner/recurring/:id`
- `GET/POST /planner/bills`
- `PATCH/DELETE /planner/bills/:id`

Example savings goal body:

```json
{
  "name": "Emergency Fund",
  "savingsType": "emergency",
  "targetAmount": 300000,
  "currentAmount": 120000,
  "targetDate": "2026-12-31",
  "note": "6 months runway"
}
```

### Analytics (requires auth)

- `GET /analytics/dashboard?month=YYYY-MM`
- `GET /analytics/insights?month=YYYY-MM`
- `GET /analytics/charts?month=YYYY-MM`

### Admin (requires `role=admin`)

- `GET /admin/stats`
- `GET /admin/users?page&limit&q`
- `DELETE /admin/users/:id`
- `GET /admin/transactions?page&limit&type&userId&category&startDate&endDate`
- `DELETE /admin/transactions/:id`

## Future Improvements

- Persist refresh tokens per-device and rotate with a token family + reuse detection
- Add rate limiting and audit logging
- Add categories CRUD + custom categories per user
- Add tests (unit + integration) and CI pipeline
- Add Docker Compose for client and optional reverse proxy

