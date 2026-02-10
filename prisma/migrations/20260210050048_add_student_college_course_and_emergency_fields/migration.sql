-- CreateEnum
CREATE TYPE "TagStatus" AS ENUM ('unassigned', 'assigned', 'lost', 'disabled', 'retired');

-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('student', 'worker', 'visitor');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('student', 'worker');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('active', 'disabled');

-- CreateEnum
CREATE TYPE "WorkerStatus" AS ENUM ('active', 'disabled');

-- CreateEnum
CREATE TYPE "DoorStatus" AS ENUM ('online', 'offline', 'maintenance');

-- CreateEnum
CREATE TYPE "EventAction" AS ENUM ('entry', 'exit', 'denied');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'teacher', 'security', 'staff');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "status" "TagStatus" NOT NULL DEFAULT 'unassigned',
    "type" "TagType" NOT NULL,
    "ownerId" TEXT,
    "ownerType" "OwnerType",
    "issuedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "lastSeen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "college" TEXT,
    "course" TEXT,
    "status" "StudentStatus" NOT NULL DEFAULT 'active',
    "tagId" TEXT,
    "location" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "lastSeen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "status" "WorkerStatus" NOT NULL DEFAULT 'active',
    "tagId" TEXT,
    "location" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "lastSeen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Door" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "DoorStatus" NOT NULL DEFAULT 'online',
    "capacity" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Door_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "doorId" TEXT NOT NULL,
    "studentId" TEXT,
    "workerId" TEXT,
    "action" "EventAction" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'staff',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_uid_key" ON "Tag"("uid");

-- CreateIndex
CREATE INDEX "Tag_status_idx" ON "Tag"("status");

-- CreateIndex
CREATE INDEX "Tag_type_idx" ON "Tag"("type");

-- CreateIndex
CREATE INDEX "Tag_ownerId_idx" ON "Tag"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE INDEX "Student_grade_idx" ON "Student"("grade");

-- CreateIndex
CREATE INDEX "Student_status_idx" ON "Student"("status");

-- CreateIndex
CREATE INDEX "Student_email_idx" ON "Student"("email");

-- CreateIndex
CREATE INDEX "Student_tagId_idx" ON "Student"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_email_key" ON "Worker"("email");

-- CreateIndex
CREATE INDEX "Worker_role_idx" ON "Worker"("role");

-- CreateIndex
CREATE INDEX "Worker_status_idx" ON "Worker"("status");

-- CreateIndex
CREATE INDEX "Worker_email_idx" ON "Worker"("email");

-- CreateIndex
CREATE INDEX "Worker_tagId_idx" ON "Worker"("tagId");

-- CreateIndex
CREATE INDEX "Door_status_idx" ON "Door"("status");

-- CreateIndex
CREATE INDEX "Event_tagId_idx" ON "Event"("tagId");

-- CreateIndex
CREATE INDEX "Event_doorId_idx" ON "Event"("doorId");

-- CreateIndex
CREATE INDEX "Event_studentId_idx" ON "Event"("studentId");

-- CreateIndex
CREATE INDEX "Event_workerId_idx" ON "Event"("workerId");

-- CreateIndex
CREATE INDEX "Event_timestamp_idx" ON "Event"("timestamp");

-- CreateIndex
CREATE INDEX "Event_action_idx" ON "Event"("action");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_doorId_fkey" FOREIGN KEY ("doorId") REFERENCES "Door"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
