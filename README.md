# Brightpath inquiry system

A small full-stack inquiry form and admin inbox built with React, Tailwind CSS, Express, and Supabase PostgreSQL.

## What it does

- Lets parents, students, and schools send an inquiry without signing in.
- Saves each inquiry to Supabase PostgreSQL.
- Gives admins a custom JWT-protected dashboard to search, filter, and update inquiry status.
- Hashes admin passwords with bcrypt. Supabase Auth is not used.

## Requirements

- Node.js 20 or newer
- A Supabase project and its PostgreSQL connection string

## Set up the database

1. Open the SQL Editor in your Supabase project.
2. Copy the contents of [`backend/schema.sql`](backend/schema.sql) into a new query and run it.
3. In Supabase project settings, copy the PostgreSQL connection string. A pooler connection string is a good choice if your hosting provider cannot reach the direct database address.

## Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set:

- `DATABASE_URL` to your Supabase PostgreSQL connection string.
- `JWT_SECRET` to a private, random value at least 32 characters long.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` to the admin account you want to use. The password must be at least 12 characters.
- `CLIENT_URL` to the frontend origin. For local development, use `http://localhost:5173`.

Create the admin account and start the API:

```bash
npm run create-admin
npm run dev
```

The API listens on `http://localhost:3001`. Its health check is at `/api/health`.
The create-admin command can be run again to change the password for the same email address.

## Set up the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The public form is at `/`, and the admin sign-in and dashboard are at `/admin`.

If the API is deployed to a different address, create `frontend/.env` with:

```env
VITE_API_URL=https://your-api.example.com/api
```

## API overview

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/inquiries` | Public | Submit an inquiry |
| `POST` | `/api/admin/login` | Public | Sign in and receive an 8-hour JWT |
| `GET` | `/api/inquiries` | Admin JWT | List inquiries; optional `category`, `userType`, and `search` query parameters |
| `PATCH` | `/api/inquiries/:id/status` | Admin JWT | Update an inquiry to `New`, `In Progress`, or `Resolved` |
| `GET` | `/api/health` | Public | Check that the API is running |

Protected requests use `Authorization: Bearer <token>`. Passwords are checked with bcrypt, and inquiry values are validated before they are stored. SQL queries use parameters rather than string-interpolated user input.

## Production notes

For a single-service Render deployment, follow the instructions below. If you deploy the frontend and backend separately, set the backend `CLIENT_URL` to the deployed frontend origin, set `DATABASE_URL` and `JWT_SECRET` in the backend host's environment settings, and set `VITE_API_URL` in the frontend build environment. Run the SQL script once against Supabase and provision an admin account using the backend environment. Never publish `.env` files or commit real database credentials.

## Deploy the whole app to Render

The root [`render.yaml`](render.yaml) configures one Render web service that builds the React frontend and serves it from the Express backend. The browser uses the same Render URL for the frontend and API.

1. Push this project to a GitHub repository. Check that `.env` files and credentials are not committed.
2. In Render, choose **New → Blueprint**, connect the repository, and deploy the `render.yaml` blueprint.
3. In the Render service's environment settings, set `DATABASE_URL` to the Supabase PostgreSQL connection string and `JWT_SECRET` to a new random secret. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to the admin credentials you want; use a password of at least 12 characters.
4. Run `npm run create-admin` from the backend using the same production environment variables. If your Render plan provides a service shell, run it there; otherwise, run it locally with the production variables loaded.
5. After deployment, open the Render service URL. The public inquiry form is at `/`, admin sign-in is at `/admin`, and the health check is at `/api/health`.

Do not add real credentials to `render.yaml`, GitHub, or this README. Store them only in Render's environment settings and your local ignored `.env` file.
