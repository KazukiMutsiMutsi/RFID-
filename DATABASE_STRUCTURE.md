# Database Structure & Frontend Flow Documentation

## Database Schema Overview

### Entity Relationship Diagram (ERD)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Student   │         │   Worker    │         │     Tag     │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │         │ id (PK)     │
│ name        │         │ name        │         │ uid         │
│ email       │         │ email       │         │ status      │
│ studentType │         │ role        │         │ type        │
│ grade       │         │ department  │         │ ownerId     │
│ section     │         │ status      │         │ ownerType   │
│ college     │         │ tagId       │         │ issuedAt    │
│ course      │         │ location    │         │ revokedAt   │
│ status      │         │ emergency   │         │ lastSeen    │
│ tagId       │         │ Contact     │         └─────────────┘
│ location    │         │ emergency   │                │
│ emergency   │         │ Phone       │                │
│ Contact     │         │ lastSeen    │                │
│ emergency   │         └─────────────┘                │
│ Phone       │                │                       │
│ photoUrl    │                │                       │
│ lastSeen    │                │                       │
└─────────────┘                │                       │
       │                       │                       │
       │                       │                       │
       └───────────────────────┴───────────────────────┘
                               │
                               │
                        ┌──────▼──────┐
                        │    Event    │
                        ├─────────────┤
                        │ id (PK)     │
                        │ tagId (FK)  │
                        │ doorId (FK) │
                        │ studentId   │
                        │ workerId    │
                        │ action      │
                        │ timestamp   │
                        │ metadata    │
                        └─────────────┘
                               │
                               │
                        ┌──────▼──────┐
                        │    Door     │
                        ├─────────────┤
                        │ id (PK)     │
                        │ name        │
                        │ location    │
                        │ status      │
                        │ capacity    │
                        └─────────────┘

┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ name        │
│ email       │
│ password    │
│ role        │
│ status      │
│ lastLogin   │
└─────────────┘
```

---

## Database Tables

### 1. **Student Table**
Stores information about students (high school and college).

| Column            | Type          | Description                                    |
|-------------------|---------------|------------------------------------------------|
| id                | String (PK)   | Unique identifier (CUID)                       |
| name              | String        | Full name of the student                       |
| email             | String        | Email address (unique)                         |
| studentType       | Enum          | "highschool" or "college"                      |
| grade             | Int?          | Grade level (7-12) for high school students    |
| section           | String?       | Section (A, B, C, D) for high school           |
| college           | String?       | College name for college students              |
| course            | String?       | Course/program for college students            |
| status            | Enum          | "active" or "disabled"                         |
| tagId             | String?       | RFID tag ID (format: YYYY-XXXX)                |
| location          | String?       | Physical location/address                      |
| emergencyContact  | String?       | Emergency contact person name                  |
| emergencyPhone    | String?       | Emergency contact phone number                 |
| photoUrl          | String?       | Profile photo URL (Base64 or file path)        |
| lastSeen          | DateTime?     | Last RFID scan timestamp                       |
| createdAt         | DateTime      | Record creation timestamp                      |
| updatedAt         | DateTime      | Last update timestamp                          |

**Indexes:** grade, status, email, tagId, studentType

---

### 2. **Worker Table**
Stores information about school staff/workers.

| Column            | Type          | Description                                    |
|-------------------|---------------|------------------------------------------------|
| id                | String (PK)   | Unique identifier (CUID)                       |
| name              | String        | Full name of the worker                        |
| email             | String        | Email address (unique)                         |
| role              | String        | Job role (Teacher, Security, Admin, etc.)      |
| department        | String        | Department name                                |
| status            | Enum          | "active" or "disabled"                         |
| tagId             | String?       | RFID tag ID (format: YYYY-XXXX)                |
| location          | String?       | Physical location/address                      |
| emergencyContact  | String?       | Emergency contact person name                  |
| emergencyPhone    | String?       | Emergency contact phone number                 |
| photoUrl          | String?       | Profile photo URL (Base64 or file path)        |
| lastSeen          | DateTime?     | Last RFID scan timestamp                       |
| createdAt         | DateTime      | Record creation timestamp                      |
| updatedAt         | DateTime      | Last update timestamp                          |

**Indexes:** role, status, email, tagId

---

### 3. **Tag Table**
Manages RFID tags and their assignments.

| Column      | Type          | Description                                    |
|-------------|---------------|------------------------------------------------|
| id          | String (PK)   | Unique identifier (CUID)                       |
| uid         | String        | RFID tag UID (unique)                          |
| status      | Enum          | unassigned, assigned, lost, disabled, retired  |
| type        | Enum          | student, worker, visitor                       |
| ownerId     | String?       | ID of the owner (student/worker)               |
| ownerType   | Enum?         | "student" or "worker"                          |
| issuedAt    | DateTime?     | When tag was issued                            |
| revokedAt   | DateTime?     | When tag was revoked                           |
| lastSeen    | DateTime?     | Last scan timestamp                            |
| createdAt   | DateTime      | Record creation timestamp                      |
| updatedAt   | DateTime      | Last update timestamp                          |

**Indexes:** status, type, ownerId

---

### 4. **Event Table**
Logs all RFID access events.

| Column      | Type          | Description                                    |
|-------------|---------------|------------------------------------------------|
| id          | String (PK)   | Unique identifier (CUID)                       |
| tagId       | String (FK)   | Reference to Tag                               |
| doorId      | String (FK)   | Reference to Door                              |
| studentId   | String?       | Reference to Student (if applicable)           |
| workerId    | String?       | Reference to Worker (if applicable)            |
| action      | Enum          | "entry", "exit", "denied"                      |
| timestamp   | DateTime      | When the event occurred                        |
| metadata    | String?       | Additional JSON data                           |

**Indexes:** tagId, doorId, studentId, workerId, timestamp, action

---

### 5. **Door Table**
Manages door/access point information.

| Column      | Type          | Description                                    |
|-------------|---------------|------------------------------------------------|
| id          | String (PK)   | Unique identifier (CUID)                       |
| name        | String        | Door name/identifier                           |
| location    | String        | Physical location                              |
| status      | Enum          | "online", "offline", "maintenance"             |
| capacity    | Int           | Maximum capacity (default: 100)                |
| createdAt   | DateTime      | Record creation timestamp                      |
| updatedAt   | DateTime      | Last update timestamp                          |

**Indexes:** status

---

### 6. **User Table**
Admin/staff users who can access the dashboard.

| Column        | Type          | Description                                    |
|---------------|---------------|------------------------------------------------|
| id            | String (PK)   | Unique identifier (CUID)                       |
| name          | String        | Full name                                      |
| email         | String        | Email address (unique)                         |
| passwordHash  | String        | Hashed password                                |
| role          | Enum          | admin, teacher, security, staff                |
| status        | Enum          | "active" or "inactive"                         |
| lastLogin     | DateTime?     | Last login timestamp                           |
| createdAt     | DateTime      | Record creation timestamp                      |
| updatedAt     | DateTime      | Last update timestamp                          |

**Indexes:** email, role, status

---

## Frontend Flow Architecture

### Application Structure

```
app/
├── page.tsx                          # Landing page
├── login/                            # Login route
├── logout/                           # Logout route
└── dashboard/                        # Main dashboard
    ├── layout.tsx                    # Dashboard layout with sidebar
    ├── page.tsx                      # Dashboard overview
    ├── context/
    │   └── DashboardContext.tsx      # Global state management
    ├── components/                   # Shared components
    │   ├── AttendanceSummary.tsx
    │   ├── DoorStatusGrid.tsx
    │   ├── EventsFeed.tsx
    │   └── Modal.tsx
    ├── students/                     # Student management
    │   ├── page.tsx                  # Student list page
    │   ├── [id]/
    │   │   ├── page.tsx              # Student detail page
    │   │   └── components/
    │   │       └── EditableProfile.tsx
    │   └── components/
    │       └── StudentsTable.tsx     # Student table with CRUD
    ├── workers/                      # Worker management
    │   ├── page.tsx                  # Worker list page
    │   ├── [id]/
    │   │   ├── page.tsx              # Worker detail page
    │   │   └── components/
    │   │       └── EditableProfile.tsx
    │   └── components/
    │       └── WorkersTable.tsx      # Worker table with CRUD
    ├── attendance/                   # Attendance tracking
    │   ├── page.tsx
    │   └── components/
    │       ├── AttendanceTracker.tsx
    │       ├── AlertsPanel.tsx
    │       ├── LocationHeatmap.tsx
    │       └── QuickSearch.tsx
    ├── tags/                         # RFID tag management
    │   ├── page.tsx
    │   ├── [id]/page.tsx
    │   └── components/
    │       └── TagsTable.tsx
    ├── reports/                      # Reporting system
    │   ├── page.tsx
    │   └── components/
    │       ├── QuickStats.tsx
    │       ├── ReportGenerator.tsx
    │       └── ReportHistory.tsx
    └── settings/                     # System settings
        ├── page.tsx
        └── components/
            ├── NotificationSettings.tsx
            ├── RFIDSettings.tsx
            ├── SecuritySettings.tsx
            ├── SystemSettings.tsx
            └── UserManagement.tsx
```

---

## Frontend Data Flow

### 1. **Student Management Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                    Student List Page                         │
│                  /dashboard/students                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              StudentsTable Component                         │
│  • Fetches data from /api/students                          │
│  • Displays paginated table                                 │
│  • Search, filter by grade/status                           │
│  • Click "+ Add Student" → Opens modal                      │
│  • Click "View" → Opens detail modal                        │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Add Student Modal      │  │   View/Edit Modal        │
│  • Upload photo          │  │  • View student info     │
│  • Select type (HS/Col)  │  │  • Click "Edit"          │
│  • Auto-generate tag ID  │  │  • Update fields         │
│  • Fill form fields      │  │  • Click "Delete"        │
│  • Confirmation dialog   │  │  • Confirmation dialogs  │
│  • POST /api/students    │  │  • PATCH /api/students   │
└──────────────────────────┘  └──────────────────────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Routes                                  │
│  GET    /api/students          - List with pagination       │
│  POST   /api/students          - Create new student         │
│  GET    /api/students/[id]     - Get single student         │
│  PATCH  /api/students/[id]     - Update student             │
│  DELETE /api/students/[id]     - Delete student             │
│  GET    /api/students/[id]/events - Get student events      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database (Prisma)                           │
│  • Student table operations                                 │
│  • Transaction support                                      │
│  • Relationship queries                                     │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Worker Management Flow**

```
Same structure as Student Management, but:
- Routes: /dashboard/workers, /api/workers
- Different fields: role, department (instead of grade, section)
- Tag ID format: YYYY-XXXX (same as students)
```

### 3. **Authentication Flow**

```
┌─────────────┐
│ Landing Page│
│   /         │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Login Page  │
│   /login    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /api/auth/login       │
│  • Validate credentials     │
│  • Create session           │
│  • Return user data         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Dashboard Layout           │
│  • Check authentication     │
│  • Load user context        │
│  • Render sidebar/topbar    │
└─────────────────────────────┘
```

### 4. **RFID Event Flow**

```
┌─────────────────┐
│  RFID Reader    │
│  (Hardware)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  POST /api/events           │
│  • tagId                    │
│  • doorId                   │
│  • action (entry/exit)      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Event Processing           │
│  • Validate tag             │
│  • Check permissions        │
│  • Log event                │
│  • Update lastSeen          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Real-time Updates          │
│  • WebSocket/SSE            │
│  • Update dashboard         │
│  • Trigger alerts           │
└─────────────────────────────┘
```

---

## Key Features Implementation

### 1. **Photo Upload**
- Client-side: FileReader API converts image to Base64
- Validation: Max 5MB, image formats only
- Storage: Base64 string in `photoUrl` field
- Display: `<img src={photoUrl}>` renders directly

### 2. **Tag ID Generation**
- Format: `YYYY-XXXX` (e.g., 2024-0001)
- YYYY: Current year (enrollment year)
- XXXX: Random 4-digit number (0001-9999)
- Auto-generated on student/worker creation
- Regenerate button available

### 3. **Student Type System**
- High School: Shows grade (7-12) and section fields
- College: Shows college and course dropdown fields
- Dynamic form rendering based on selection
- Validation ensures correct fields are filled

### 4. **Confirmation Dialogs**
- Save confirmation: Prevents accidental saves
- Delete confirmation: Prevents accidental deletions
- Modal overlays with clear actions
- Success messages after operations

---

## State Management

### Client-Side State (React)
```typescript
// Component-level state
const [rows, setRows] = useState<Student[]>([]);
const [page, setPage] = useState(1);
const [isEditing, setIsEditing] = useState(false);
const [photoPreview, setPhotoPreview] = useState<string | null>(null);

// Context state (DashboardContext)
const [user, setUser] = useState<User | null>(null);
const [notifications, setNotifications] = useState<Notification[]>([]);
```

### Server-Side State (Database)
- Prisma ORM manages database connections
- Transactions for complex operations
- Optimistic updates on client
- Server validation on all mutations

---

## API Endpoints Summary

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| GET    | /api/students                   | List students (paginated)      |
| POST   | /api/students                   | Create student                 |
| GET    | /api/students/[id]              | Get student details            |
| PATCH  | /api/students/[id]              | Update student                 |
| DELETE | /api/students/[id]              | Delete student                 |
| GET    | /api/students/[id]/events       | Get student events             |
| GET    | /api/workers                    | List workers (paginated)       |
| POST   | /api/workers                    | Create worker                  |
| GET    | /api/workers/[id]               | Get worker details             |
| PATCH  | /api/workers/[id]               | Update worker                  |
| DELETE | /api/workers/[id]               | Delete worker                  |
| GET    | /api/workers/[id]/events        | Get worker events              |
| GET    | /api/tags                       | List tags                      |
| GET    | /api/tags/[id]                  | Get tag details                |
| GET    | /api/events                     | List events                    |
| POST   | /api/events                     | Create event (RFID scan)       |
| GET    | /api/dashboard/attendance       | Attendance summary             |
| GET    | /api/dashboard/doors            | Door status                    |
| GET    | /api/dashboard/events           | Recent events                  |
| GET    | /api/reports/generate           | Generate report                |
| GET    | /api/settings/*                 | Various settings endpoints     |

---

This documentation provides a complete overview of the database structure and frontend architecture for the RFID School Management System.
