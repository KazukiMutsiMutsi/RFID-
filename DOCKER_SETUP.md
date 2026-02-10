# Docker Setup Guide

## Prerequisites

Make sure Docker Desktop is installed and running on your Windows machine.
- Download from: https://www.docker.com/products/docker-desktop/

## Quick Start

### 1. Start PostgreSQL with Docker

Open your terminal in the project folder and run:

```bash
docker-compose up -d
```

This will:
- Download the PostgreSQL image (if not already downloaded)
- Create and start a PostgreSQL container named `rfid_postgres`
- Expose PostgreSQL on port 5432
- Create a database named `rfid_db`
- Store data persistently in a Docker volume

### 2. Verify the database is running

```bash
docker-compose ps
```

You should see the `rfid_postgres` container with status "Up".

### 3. Run Prisma migrations

Now that the database is running, apply the schema:

```bash
npx prisma migrate dev --name add_location_emergency_contact
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Start your Next.js application

```bash
npm run dev
```

## Docker Commands Reference

### Start the database
```bash
docker-compose up -d
```

### Stop the database
```bash
docker-compose down
```

### Stop and remove all data (⚠️ Warning: This deletes all database data)
```bash
docker-compose down -v
```

### View database logs
```bash
docker-compose logs postgres
```

### Access PostgreSQL CLI
```bash
docker exec -it rfid_postgres psql -U postgres -d rfid_db
```

### Restart the database
```bash
docker-compose restart
```

## Database Connection Details

The `.env` file is already configured with these settings:

- **Host**: localhost
- **Port**: 5432
- **Database**: rfid_db
- **User**: postgres
- **Password**: password

## Troubleshooting

### Port 5432 already in use
If you have PostgreSQL already installed locally, it might be using port 5432. You can either:
1. Stop your local PostgreSQL service
2. Change the port in `docker-compose.yml` (e.g., `"5433:5432"`) and update the `.env` file accordingly

### Container won't start
```bash
# Check logs
docker-compose logs postgres

# Remove and recreate
docker-compose down
docker-compose up -d
```

### Reset everything
```bash
# Stop and remove containers and volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Re-run migrations
npx prisma migrate dev
```
