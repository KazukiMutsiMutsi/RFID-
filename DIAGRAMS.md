# System Diagrams

## 1. Database Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    STUDENT ||--o{ EVENT : "generates"
    WORKER ||--o{ EVENT : "generates"
    TAG ||--o{ EVENT : "scans"
    DOOR ||--o{ EVENT : "records"
    
    STUDENT {
        string id PK
        string name
        string email UK
        enum studentType
        int grade
        string section
        string college
        string course
        enum status
        string tagId
        string location
        string emergencyContact
        string emergencyPhone
        string photoUrl
        datetime lastSeen
        datetime createdAt
        datetime updatedAt
    }
    
    WORKER {
        string id PK
        string name
        string email UK
        string role
        string department
        enum status
        string tagId
        string location
        string emergencyContact
        string emergencyPhone
        string photoUrl
        datetime lastSeen
        datetime createdAt
        datetime updatedAt
    }
    
    TAG {
        string id PK
        string uid UK
        enum status
        enum type
        string ownerId
        enum ownerType
        datetime issuedAt
        datetime revokedAt
        datetime lastSeen
        datetime createdAt
        datetime updatedAt
    }
    
    EVENT {
        string id PK
        string tagId FK
        string doorId FK
        string studentId FK
        string workerId FK
        enum action
        datetime timestamp
        string metadata
    }
    
    DOOR {
        string id PK
        string name
        string location
        enum status
        int capacity
        datetime createdAt
        datetime updatedAt
    }
    
    USER {
        string id PK
        string name
        string email UK
        string passwordHash
        enum role
        enum status
        datetime lastLogin
        datetime createdAt
        datetime updatedAt
    }
```

## 2. System Architecture Diagram (Mermaid)

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[React Components]
        C[State Management]
    end
    
    subgraph "Application Layer"
        D[Next.js Server]
        E[API Routes]
        F[Authentication]
    end
    
    subgraph "Data Layer"
        G[Prisma ORM]
        H[(PostgreSQL Database)]
    end
    
    subgraph "External Systems"
        I[RFID Readers]
        J[File Storage]
    end
    
    A --> B
    B --> C
    B --> E
    E --> F
    E --> G
    G --> H
    I --> E
    B --> J
    
    style A fill:#e1f5ff
    style H fill:#ffe1e1
    style I fill:#e1ffe1
```

## 3. Student Management Flow (Mermaid)

```mermaid
sequenceDiagram
    participant User
    participant UI as Students Page
    participant Modal as Add/Edit Modal
    participant API as API Route
    participant DB as Database
    
    User->>UI: Click "+ Add Student"
    UI->>Modal: Open modal
    Modal->>Modal: Generate Tag ID (YYYY-XXXX)
    User->>Modal: Upload photo
    Modal->>Modal: Convert to Base64
    User->>Modal: Fill form fields
    User->>Modal: Click "Save"
    Modal->>Modal: Show confirmation dialog
    User->>Modal: Confirm save
    Modal->>API: POST /api/students
    API->>DB: INSERT student record
    DB-->>API: Success
    API-->>Modal: Return student data
    Modal-->>UI: Update table
    UI-->>User: Show success message
```

## 4. RFID Event Flow (Mermaid)

```mermaid
sequenceDiagram
    participant RFID as RFID Reader
    participant API as Event API
    participant DB as Database
    participant WS as WebSocket
    participant Dashboard as Dashboard UI
    
    RFID->>API: Scan tag (POST /api/events)
    API->>DB: Query tag info
    DB-->>API: Return tag & owner data
    API->>API: Validate permissions
    API->>DB: INSERT event record
    API->>DB: UPDATE lastSeen timestamp
    DB-->>API: Success
    API->>WS: Broadcast event
    WS->>Dashboard: Real-time update
    Dashboard->>Dashboard: Update attendance count
    Dashboard->>Dashboard: Show notification
    API-->>RFID: Return status (allowed/denied)
```

## 5. Component Hierarchy (Mermaid)

```mermaid
graph TD
    A[App Root] --> B[Landing Page]
    A --> C[Dashboard Layout]
    
    C --> D[Sidebar Navigation]
    C --> E[Top Bar]
    C --> F[Main Content Area]
    
    F --> G[Overview Page]
    F --> H[Students Page]
    F --> I[Workers Page]
    F --> J[Attendance Page]
    F --> K[Tags Page]
    F --> L[Reports Page]
    F --> M[Settings Page]
    
    H --> N[StudentsTable Component]
    N --> O[Add Student Modal]
    N --> P[View/Edit Modal]
    N --> Q[Delete Confirmation]
    N --> R[Save Confirmation]
    
    O --> S[Photo Upload]
    O --> T[Student Type Selector]
    O --> U[Form Fields]
    O --> V[Tag ID Generator]
    
    style A fill:#ff9999
    style C fill:#99ccff
    style H fill:#99ff99
    style N fill:#ffff99
```

## 6. Authentication Flow (Mermaid)

```mermaid
stateDiagram-v2
    [*] --> Landing: User visits site
    Landing --> Login: Click "Login"
    Login --> Authenticating: Submit credentials
    Authenticating --> Dashboard: Valid credentials
    Authenticating --> Login: Invalid credentials
    Dashboard --> Overview: Default route
    Dashboard --> Students: Navigate
    Dashboard --> Workers: Navigate
    Dashboard --> Attendance: Navigate
    Dashboard --> Tags: Navigate
    Dashboard --> Reports: Navigate
    Dashboard --> Settings: Navigate
    Dashboard --> Logout: Click logout
    Logout --> Landing: Session cleared
    
    note right of Authenticating
        POST /api/auth/login
        Validate credentials
        Create session
    end note
```

## 7. Data Flow Architecture (Mermaid)

```mermaid
flowchart LR
    subgraph Frontend
        A[User Interface] --> B[React Components]
        B --> C[API Client]
    end
    
    subgraph Backend
        D[API Routes] --> E[Business Logic]
        E --> F[Prisma Client]
    end
    
    subgraph Database
        G[(PostgreSQL)]
    end
    
    subgraph External
        H[RFID Hardware]
        I[File Storage]
    end
    
    C -->|HTTP Requests| D
    F -->|SQL Queries| G
    H -->|Events| D
    B -->|Upload| I
    
    style Frontend fill:#e3f2fd
    style Backend fill:#fff3e0
    style Database fill:#f3e5f5
    style External fill:#e8f5e9
```

---

## How to Use These Diagrams

### Option 1: Mermaid Live Editor
1. Go to https://mermaid.live/
2. Copy any diagram code above
3. Paste into the editor
4. Download as PNG/SVG

### Option 2: VS Code Extension
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file in VS Code
3. Use Markdown preview
4. Right-click diagram → Export as image

### Option 3: GitHub/GitLab
- These platforms render Mermaid diagrams automatically in markdown files

### Option 4: Draw.io / Lucidchart
- Use the text descriptions to manually create diagrams
- More customization options available

### Option 5: PlantUML
- Convert Mermaid syntax to PlantUML
- Generate high-quality diagrams

---

## Additional Diagram Tools

**For ERD:**
- dbdiagram.io - Paste schema, get visual ERD
- QuickDBD - Quick database diagram tool

**For Flowcharts:**
- draw.io (diagrams.net) - Free, powerful
- Lucidchart - Professional diagrams
- Figma - Design tool with diagramming

**For Architecture:**
- Excalidraw - Hand-drawn style diagrams
- Cloudcraft - AWS architecture diagrams
- Structurizr - C4 model diagrams

---

## Quick Reference: Diagram Types

| Diagram Type | Best Tool | Use Case |
|--------------|-----------|----------|
| ERD | Mermaid, dbdiagram.io | Database structure |
| Sequence | Mermaid, PlantUML | API flows, interactions |
| Flowchart | Mermaid, draw.io | Process flows |
| Component | Mermaid, draw.io | UI hierarchy |
| State | Mermaid, PlantUML | User journeys |
| Architecture | draw.io, Lucidchart | System overview |

