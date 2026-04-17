# frontend-web — ToolRent

Next.js 14 frontend microservice for the ToolRent platform.

## Overview

This service provides the full user-facing web application. It communicates with two backend microservices:

| Service | URL | Purpose |
|---|---|---|
| auth-service | `http://localhost:8000` | Register / Login → JWT |
| tools-service | `http://localhost:8001` | Browse tools / Create listing |

## Pages

| Route | Description |
|---|---|
| `/` | Browse all tools, search & filter, open detail drawer |
| `/list` | Create a new tool listing (drag-and-drop image upload, JWT required) |
| `/about` | Architecture overview, how-it-works, tech stack |

## Running locally

### With Docker Compose (recommended)

From the **root** of the ToolRent repo, copy the updated `docker-compose.yml` from this folder to the root, then:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

### Without Docker

```bash
cd frontend-web
npm install
npm run dev
```

Make sure `auth-service` is running on `:8000` and `tools-service` on `:8001`.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_AUTH_API_URL` | `http://localhost:8000` | Auth service base URL |
| `NEXT_PUBLIC_TOOLS_API_URL` | `http://localhost:8001` | Tools service base URL |

Copy `.env.local` and adjust if your services run on different ports.

## Project structure

```
frontend-web/
├── components/
│   ├── Navbar.js / .module.css       # Sticky nav, auth buttons
│   ├── AuthModal.js / .module.css    # Login + Register modal (→ auth-service)
│   ├── ToolCard.js / .module.css     # Tool grid card
│   └── ToolDetail.js / .module.css   # Slide-in detail drawer
├── context/
│   └── AuthContext.js                # Global auth state, JWT cookie management
├── lib/
│   └── api.js                        # authApi + toolsApi clients
├── pages/
│   ├── _app.js                       # AuthProvider + Toaster wrapper
│   ├── index.js / .module.css        # Home / Browse page
│   ├── list.js / .module.css         # Create tool (multipart → tools-service)
│   ├── about.js / .module.css        # Architecture + how it works
│   └── 404.js / .module.css          # Custom 404
├── styles/
│   └── globals.css                   # Design tokens + CSS reset
├── .env.local                        # Local env vars
├── Dockerfile                        # Multi-stage production build
├── next.config.js
└── package.json
```

## API integration

### Auth (auth-service :8000)

```js
// Register
POST /register  { email, full_name, password }  → { id, email, full_name }

// Login — JWT stored in cookie automatically
POST /login     { email, password }             → { access_token, token_type }
```

### Tools (tools-service :8001)

```js
// Browse — public
GET  /tools                                       → Tool[]

// Create — requires Authorization: Bearer <jwt>
POST /tools  multipart: { title, description, price, file }  → Tool
```

## Tech

- **Next.js 14** with Pages Router
- **axios** for API calls
- **js-cookie** for JWT persistence
- **react-hot-toast** for notifications  
- **react-dropzone** for image upload UX
- **CSS Modules** — zero runtime CSS-in-JS overhead
