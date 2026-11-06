# KITARO Backend

KITARO is a Malaysian waste-management platform that helps users manage waste reports, access waste collection information and understand waste-related trends.

This repository contains the backend API built with **Node.js and Express.js**, with **Supabase** providing authentication and PostgreSQL database services.

## Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Backend framework and API routing
- **Supabase** – Authentication and PostgreSQL database
- **CORS** – Cross-origin resource sharing
- **Dotenv** – Environment variable management
- **Countries.dev API** – Malaysian postcode lookup

## Features

- **Authentication** – User registration, login and token verification.
- **Profile Management** – Retrieve and update user profiles.
- **Postcode Lookup** – Retrieve Malaysian postcode and area information.
- **Waste Reporting** – Submit, view and delete eligible waste reports.
- **Admin Management** – View all waste reports and update report statuses.
- **Waste Analytics** – Retrieve waste hotspot, composition and reporting trend analysis.

### Folder Overview

| Folder / File | Purpose |
|---|---|
| `middleware/` | Handles authentication, admin authorization, UUID validation and error handling. |
| `routes/` | Contains API endpoints for authentication, profiles, waste reports and analytics. |
| `index.js` | Configures and starts the Express server. |
| `supabaseClient.js` | Establishes the Supabase connection. |
| `testSupabase.js` | Tests Supabase connectivity. |
| `index.html` | Provides API documentation. |
| `.env` | Stores environment variables and credentials. |

## API Overview

**Base URL:** `https://kitaro-server-indol.vercel.app`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API status |
| POST | `/api/auth/signup` | Register an account |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Verify authenticated user |
| GET / PATCH | `/api/profile` | Retrieve / update profile |
| POST | `/api/postcode/lookup` | Malaysian postcode lookup |
| GET / POST | `/api/waste-records` | Retrieve / submit waste reports |
| GET / DELETE | `/api/waste-records/:id` | Retrieve / delete a waste report |
| GET | `/api/admin/waste-records` | Retrieve all waste reports |
| PATCH | `/api/admin/waste-records/:id/status` | Update report status |
| GET | `/api/analytics/hotspots` | Waste hotspot analysis |
| GET | `/api/analytics/composition` | Waste composition analysis |
| GET | `/api/analytics/trends` | Waste reporting trend analysis |

## Authentication & Security

- Supabase Authentication verifies user identity through access tokens.
- Protected endpoints require a valid Bearer token.
- Users can only access their own waste reports.
- Administrator endpoints require additional authorization.
- UUID validation helps prevent invalid record identifiers.
- Environment variables keep sensitive credentials outside the source code.

For protected endpoints, include the following request header:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Deployment

The backend API is deployed on **Vercel**.

Production API:

https://kitaro-server-indol.vercel.app

---

**KITARO Backend**

Built with Node.js, Express.js and Supabase.