# RFID-BC

RFID tracking dashboard built with Next.js and PostgreSQL (via Prisma).

## Installation (before pulling the repo)

1. Install prerequisites
   - Node.js 18+ (or 20+)
   - PostgreSQL 14+

2. Clone the repo
```bash
git clone <YOUR_REPO_URL>
cd rfid-bc
```

3. Install dependencies
```bash
npm install
```

4. Set up environment variables
   - Copy `.env` and update the database URL:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/rfid_bc?schema=public"
```

5. Generate Prisma client
```bash
npx prisma generate
```

6. Create database schema
```bash
npx prisma migrate dev --name init
```

7. Run the dev server
```bash
npm run dev
```

Open `http://localhost:3000` to view the app.

## Notes

- If you change Prisma models, re-run:
```bash
npx prisma migrate dev
```
- The Prisma client is generated to `app/generated/prisma`.
