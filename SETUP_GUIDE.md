# Setup Guide - RFID School Management System

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm** (comes with Node.js)
  - Verify: `npm --version`

- **PostgreSQL** (v14 or higher)
  - Download: https://www.postgresql.org/download/
  - OR use Docker (recommended)

- **Docker Desktop** (Optional but recommended)
  - Download: https://www.docker.com/products/docker-desktop/

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd RFID-School-Management
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- Prisma ORM
- TypeScript
- TailwindCSS

---

## Database Setup

### Option A: Using Docker (Recommended)

1. **Start PostgreSQL with Docker:**

```bash
docker-compose up -d
```

This will:
- Download PostgreSQL 16 Alpine image
- Create a container named `rfid_postgres`
- Expose PostgreSQL on port 5432
- Create database `rfid_db`
- Set up persistent storage

2. **Verify the database is running:**

```bash
docker-compose ps
```

You should see:
```
NAME            IMAGE                  STATUS
rfid_postgres   postgres:16-alpine     Up
```

### Option B: Manual PostgreSQL Installation

1. **Install PostgreSQL** from https://www.postgresql.org/download/

2. **Create a database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE rfid_db;

# Exit
\q
```

3. **Update `.env` file** with your credentials (see next section)

---

## Environment Configuration

### Step 1: Configure Environment Variables

The `.env` file is already created. Update it with your settings:

```env
# Database connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/rfid_db?schema=public"

# Next.js
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**For Docker setup:** Use the default values (already configured)

**For manual PostgreSQL:** Update with your credentials:
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/rfid_db?schema=public"
```

### Step 2: Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name initial_setup

# (Optional) Seed the database with sample data
npx prisma db seed
```

### Step 3: Verify Database Schema

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all tables
- Add/edit/delete records
- Test queries

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Generate Prisma Client |

---

## First Time Setup Checklist

- [ ] Node.js and npm installed
- [ ] PostgreSQL running (Docker or manual)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Application running (`npm run dev`)
- [ ] Can access http://localhost:3000

---

## Default Login Credentials

After seeding the database, use these credentials:

**Admin Account:**
- Email: `admin@school.edu`
- Password: `admin123`

**Teacher Account:**
- Email: `teacher@school.edu`
- Password: `teacher123`

> ⚠️ **Important:** Change these passwords in production!

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   # For Docker
   docker-compose ps
   
   # For manual installation
   pg_isready -U postgres
   ```

2. Verify DATABASE_URL in `.env` is correct

3. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

Or use a different port:
```bash
PORT=3001 npm run dev
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

### Issue: "Migration failed"

**Solution:**
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Then run migrations again
npx prisma migrate dev
```

### Issue: Docker container won't start

**Solution:**
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Project Structure

```
RFID-School-Management/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   ├── dashboard/            # Dashboard pages
│   ├── login/                # Login page
│   └── page.tsx              # Landing page
├── lib/                      # Utility libraries
│   └── prisma.ts             # Prisma client instance
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration files
├── public/                   # Static assets
├── .env                      # Environment variables
├── docker-compose.yml        # Docker configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript configuration
```

---

## Next Steps

After successful setup:

1. **Explore the Dashboard**
   - Navigate to http://localhost:3000/dashboard
   - View overview, students, workers, etc.

2. **Add Sample Data**
   - Add students via "+ Add Student" button
   - Add workers via "+ Add Worker" button
   - Upload photos and test features

3. **Configure RFID Readers**
   - Go to Settings → RFID Settings
   - Configure your RFID hardware endpoints

4. **Customize Settings**
   - Update school information
   - Configure notification preferences
   - Set up user accounts

5. **Read Documentation**
   - `API_DOCUMENTATION.md` - API endpoints
   - `COMPONENT_DOCUMENTATION.md` - Component usage
   - `USER_GUIDE.md` - End-user instructions
   - `DATABASE_STRUCTURE.md` - Database schema

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check the GitHub issues page
4. Contact the development team

---

## Security Notes

### Production Deployment

Before deploying to production:

1. **Change default passwords**
2. **Use strong DATABASE_URL password**
3. **Enable HTTPS**
4. **Set up proper authentication**
5. **Configure CORS properly**
6. **Use environment-specific `.env` files**
7. **Enable rate limiting**
8. **Set up backup strategy**

### Environment Variables

Never commit `.env` files to version control!

The `.gitignore` file already excludes:
- `.env*`
- `node_modules/`
- `.next/`
- Database files

---

## Performance Optimization

### For Development
- Use `npm run dev` for hot reload
- Keep Prisma Studio open for database inspection
- Use React DevTools browser extension

### For Production
- Run `npm run build` to optimize
- Enable caching strategies
- Use CDN for static assets
- Configure database connection pooling
- Enable compression

---

## Backup and Restore

### Backup Database

```bash
# Using Docker
docker exec rfid_postgres pg_dump -U postgres rfid_db > backup.sql

# Manual PostgreSQL
pg_dump -U postgres rfid_db > backup.sql
```

### Restore Database

```bash
# Using Docker
docker exec -i rfid_postgres psql -U postgres rfid_db < backup.sql

# Manual PostgreSQL
psql -U postgres rfid_db < backup.sql
```

---

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run new migrations
npx prisma migrate deploy

# Rebuild application
npm run build

# Restart server
npm start
```

---

**Setup Complete!** 🎉

Your RFID School Management System is now ready to use.
