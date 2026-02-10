# Database Migration Instructions

## Changes Made

Added the following fields to the `Student` model:
- `studentType` (Enum: highschool/college) - Type of student with default "highschool"
- `grade` (Int, optional) - Grade level for high school students (7-12)
- `section` (String, optional) - Section for high school students
- `college` (String, optional) - College/Faculty name for college students
- `course` (String, optional) - Course/Program name for college students
- `location` (String, optional) - Physical location/address
- `emergencyContact` (String, optional) - Emergency contact person name
- `emergencyPhone` (String, optional) - Emergency contact phone number

Added the following fields to the `Worker` model:
- `location` (String, optional) - Physical location/address
- `emergencyContact` (String, optional) - Emergency contact person name
- `emergencyPhone` (String, optional) - Emergency contact phone number

## Quick Setup with Docker (Recommended)

If you have Docker installed, this is the easiest way:

1. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

2. **Run the migration**
   ```bash
   npx prisma migrate dev --name add_student_type_and_fields
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Start your app**
   ```bash
   npm run dev
   ```

See `DOCKER_SETUP.md` for detailed Docker instructions.

## Alternative: Manual PostgreSQL Setup

If you prefer to install PostgreSQL directly:

1. **Install PostgreSQL** (if not already installed)
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Create a database**
   ```sql
   CREATE DATABASE rfid_db;
   ```

3. **Configure your `.env` file**
   - A `.env` file has been created with a default connection string
   - Update the `DATABASE_URL` with your actual PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   ```
   - Example: `postgresql://postgres:mypassword@localhost:5432/rfid_db?schema=public`

## Migration Steps

1. Install dependencies (if not already done):
```bash
npm install
```

2. Run the Prisma migration command:
```bash
npx prisma migrate dev --name add_location_emergency_contact
```

3. Generate the Prisma client:
```bash
npx prisma generate
```

4. If you're using a production database, use:
```bash
npx prisma migrate deploy
```

## What Was Updated

### Database Schema (`prisma/schema.prisma`)
- Added `location`, `emergencyContact`, and `emergencyPhone` fields to `Student` model
- Added `location`, `emergencyContact`, and `emergencyPhone` fields to `Worker` model

### Frontend Components
- Created `EditableProfile.tsx` for students with edit functionality
- Created `EditableProfile.tsx` for workers with edit functionality
- Updated student detail page to use the new editable component
- Updated worker detail page to use the new editable component

### API Routes
- Updated mock data in `/api/students/[id]/route.ts` to include new fields
- Updated mock data in `/api/workers/[id]/route.ts` to include new fields
- PATCH endpoints already support updating these fields

## Features

- Admin can click "Edit" button on student/worker profile pages
- Edit mode allows updating location and emergency contact information
- Click "Save" to persist changes (currently using mock API)
- Data displays in read-only mode when not editing
