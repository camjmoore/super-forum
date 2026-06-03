# Docker Setup Guide

This document explains how to run the Super Forum application using Docker Compose for local development.

## Prerequisites

- **Docker** (v20.10+) - [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose** (v2.0+) - Included with Docker Desktop

## Quick Start

### 1. Clone environment variables
```bash
cp .env.example .env
```

The `.env.example` file contains sensible defaults for local development. For production, you'll want to change `SESSION_SECRET` and `PG_PASSWORD`.

### 2. Start all services
```bash
docker compose up
```

This command will:
- Pull PostgreSQL 16 Alpine and Redis 7 Alpine images
- Build the Node.js server image
- Start all three services
- Create persistent volumes for database and cache data
- Automatically wait for postgres and redis to be healthy before starting the server

The first run takes ~2-3 minutes (downloading images + npm install). Subsequent runs start in ~10 seconds.

### 3. Verify everything is running
```bash
docker compose ps
```

You should see three containers with status `Up`:
```
NAME                      STATUS
super-forum-postgres      Up (healthy)
super-forum-redis         Up (healthy)
super-forum-server        Up
```

### 4. Verify the API is working
```bash
curl http://localhost:4000
```

You should see:
```
userId: null, loadedcount: 0
```

The GraphQL endpoint is at: **http://localhost:4000/graphql**

## Development Workflow

### Hot Reload
The `server/src` directory is mounted as a volume, so changes to TypeScript files trigger automatic reload via `tsx watch`. Just save a file and the server restarts within 1-2 seconds.

### View Logs
```bash
# All services
docker compose logs -f

# Just the server
docker compose logs -f server

# Just postgres
docker compose logs -f postgres

# Last 50 lines
docker compose logs --tail=50 server
```

### Access the Database Directly
```bash
docker compose exec postgres psql -U forum_user -d super_duper_forum
```

Inside the psql prompt:
```sql
\dt                    -- List all tables
SELECT * FROM "Users"; -- Query users
\q                     -- Exit
```

### Access Redis CLI
```bash
docker compose exec redis redis-cli
```

Common commands:
```
KEYS *              -- List all keys
GET <key>           -- Get a key's value
FLUSHALL            -- Clear all data
QUIT                -- Exit
```

### Seed the Database
```bash
docker compose exec server npm run db:seed
```

This creates an admin user and generates 30 threads with replies and votes using Faker.

### Run Tests
```bash
docker compose exec server npm test
docker compose exec server npm run test:watch
docker compose exec server npm run test:coverage
```

### Run Linting
```bash
docker compose exec server npm run lint
docker compose exec server npm run lint:fix
docker compose exec server npm run format
```

## Stopping and Cleaning Up

### Stop containers (data persists)
```bash
docker compose stop
```

### Stop and remove containers (data persists in volumes)
```bash
docker compose down
```

### Remove containers AND data volumes (⚠️ destructive)
```bash
docker compose down -v
```

### Rebuild the server image
```bash
docker compose build --no-cache server
docker compose up
```

This is useful if you add new npm packages or change the Dockerfile.

## Troubleshooting

### "Cannot start service server: address already in use"
Port 4000 is already in use. Either:
- Stop the other process using port 4000
- Change PORT in `.env` to a different port (e.g., 4001)
- Use `docker compose up -p 4001:4000 server` to override

### "postgres service fails to start"
Check the logs:
```bash
docker compose logs postgres
```

If you see "directory is not empty", the volume is corrupted. Clean it:
```bash
docker compose down -v
docker compose up
```

### "server can't connect to postgres"
This usually means postgres isn't healthy yet. Docker Compose has a `depends_on` with health check, but sometimes the initial startup is slow. Wait 30 seconds and check logs:
```bash
docker compose logs server
```

### "Permission denied" errors on Mac/Windows
Docker Desktop sometimes has permission issues with mounted volumes. Try:
```bash
docker compose down
docker compose up --build
```

### npm install takes forever inside Docker
The first build downloads Node packages. Subsequent builds use the cached layer. If rebuilding frequently, you can speed it up by using a named volume for `node_modules`:

In `docker-compose.yml`, change:
```yaml
volumes:
  - ./server/node_modules:/app/node_modules
```

To:
```yaml
volumes:
  - server_node_modules:/app/node_modules
```

And add at the bottom:
```yaml
volumes:
  server_node_modules:
```

## Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Node environment (development/production) |
| `PORT` | `4000` | Server port |
| `PG_HOST` | `postgres` | PostgreSQL host |
| `PG_ACCOUNT` | `forum_user` | PostgreSQL user |
| `PG_PASSWORD` | `forum_password` | PostgreSQL password |
| `PG_DATABASE` | `super_duper_forum` | Database name |
| `PG_SYNCHRONIZE` | `true` | Auto-sync TypeORM schema (dev only) |
| `PG_LOGGING` | `true` | Log SQL queries |
| `REDIS_HOST` | `redis` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `SESSION_SECRET` | `dev_secret_key_...` | Session encryption key |

## What's Running Inside

### postgres service
- **Image**: `postgres:16-alpine`
- **Port**: 5432
- **Data directory**: `/var/lib/postgresql/data` (persisted in `postgres_data` volume)
- **Health check**: `pg_isready` command every 10 seconds
- **Credentials**: See `PG_*` env vars

### redis service
- **Image**: `redis:7-alpine`
- **Port**: 6379
- **Data directory**: `/data` (persisted in `redis_data` volume)
- **Persistence**: RDB snapshots with `appendonly yes`
- **Health check**: `redis-cli ping` every 10 seconds

### server service
- **Build context**: `./server` directory
- **Port**: 4000
- **Volume mounts**:
  - `./server/src` → `/app/src` (source code, live reload)
  - `./server/node_modules` → `/app/node_modules` (dependencies)
- **Startup command**: `npm run dev` (tsx watch)
- **Depends on**: postgres and redis health checks

## Next Steps

Once you have the stack running:

1. **Seed data**: `docker compose exec server npm run db:seed`
2. **Visit GraphQL**: http://localhost:4000/graphql
3. **Run tests**: `docker compose exec server npm test`


## Common Commands Cheat Sheet

```bash
# Start everything
docker compose up

# Start in background
docker compose up -d

# Stop everything
docker compose stop

# Remove everything (keep volumes)
docker compose down

# Remove everything including data
docker compose down -v

# View logs
docker compose logs -f

# Run a command in a container
docker compose exec server npm run db:seed

# Rebuild images
docker compose build --no-cache

# Get inside a container shell
docker compose exec server sh
```
