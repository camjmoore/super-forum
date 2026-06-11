# Super Forum

A full-stack Reddit-style discussion forum built with Node.js, GraphQL, TypeScript, and Next.js.

## Tech Stack

| Layer | Technology |
|---|---|
| **API** | Apollo Server 4, GraphQL, Express |
| **ORM** | TypeORM, PostgreSQL 16 |
| **Auth** | express-session, Redis, bcryptjs |
| **Email** | Nodemailer (Ethereal in dev, SMTP in prod) |
| **Frontend** | Next.js 16 (App Router), Apollo Client v4 |
| **Styling** | Tailwind CSS |
| **Testing** | Jest, ts-jest |
| **CI** | GitHub Actions |

## Features

- User registration with email verification
- Session-based authentication (Redis-backed)
- Threaded discussion: threads, replies, voting
- Category browsing with pagination
- User profiles
- Rate limiting (200 req/15 min global, 50 req/15 min on `/graphql`)

## Quick Start

### Prerequisites

- Docker & Docker Compose (v2)
- Node 22+ (for local development without Docker)

### Run with Docker

```bash
cp .env.example .env
docker compose up
```

Services:
- GraphQL API: http://localhost:4000/graphql
- Frontend: http://localhost:3000

Seed the database after startup:

```bash
docker compose exec server npm run db:seed
```

### Run locally (without Docker)

You'll need PostgreSQL and Redis running locally, then:

```bash
# Server
cd server
cp ../.env.example .env   # adjust PG_HOST=localhost, REDIS_HOST=localhost
npm install
npm run dev

# Client (separate terminal)
cd client
npm install
npm run dev
```

## Project Structure

```
super-forum/
├── server/            # GraphQL API
│   ├── src/
│   │   ├── resolvers/ # GraphQL resolvers
│   │   ├── repository/# Data access layer (TypeORM)
│   │   ├── email/     # Email verification
│   │   └── __tests__/ # Unit + integration tests
│   └── Dockerfile     # Multi-stage production image
├── client/            # Next.js frontend
│   ├── app/           # App Router pages
│   ├── components/    # Shared UI components
│   ├── graphql/       # Queries, mutations, generated types
│   └── context/       # Auth context
├── schema.graphql     # Single source of truth for the API contract
├── docker-compose.yml      # Development stack
├── docker-compose.prod.yml # Production stack
└── .github/workflows/ci.yml
```

## Environment Variables

Copy `.env.example` and adjust for your environment.

| Variable | Default | Description |
|---|---|---|
| `SESSION_SECRET` | dev value | **Change in production** — session encryption key |
| `JWT_SECRET` | dev value | **Change in production** — email verification tokens |
| `PG_PASSWORD` | `forum_password` | PostgreSQL password |
| `REDIS_PASSWORD` | *(empty)* | Redis password (required in prod) |
| `CORS_ORIGIN` | `http://localhost:3000` | Frontend origin |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/graphql` | API URL baked into the client bundle at build time |
| `SMTP_HOST` | *(unset)* | SMTP host for transactional email |
| `PG_SYNCHRONIZE` | `true` | Set to `false` in production |

## Running Tests

```bash
cd server
npm test               # run all tests
npm run test:coverage  # with coverage report
```

The test suite uses mocked repositories — no database required.

## Production Deployment

```bash
cp .env.example .env
# Edit .env: set SESSION_SECRET, JWT_SECRET, PG_PASSWORD, REDIS_PASSWORD,
#            CORS_ORIGIN, NEXT_PUBLIC_API_URL, SMTP_*

docker compose -f docker-compose.prod.yml up -d
```

The production compose file:
- Builds the server (multi-stage, `node dist/index.js`) and client (Next.js standalone, `node server.js`)
- Sets `PG_SYNCHRONIZE=false` and `PG_LOGGING=false`
- Requires Redis password
- Exposes no source volume mounts
- `NEXT_PUBLIC_API_URL` is a build-time arg — set it to the public URL of your API before building

Run migrations after first deploy:

```bash
docker compose -f docker-compose.prod.yml exec server npm run db:migration:run
```

## CI

GitHub Actions runs on every push to `master` and `ai/claude/**` branches, and on all PRs to `master`:

- **Server job**: TypeScript compile + full Jest test suite
- **Client job**: Next.js build (includes TypeScript type-check)

See [.github/workflows/ci.yml](.github/workflows/ci.yml).
