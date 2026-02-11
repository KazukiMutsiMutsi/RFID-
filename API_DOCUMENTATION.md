# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently using session-based authentication. Include session cookie in requests.

---

## Students API

### List Students
Get paginated list of students with filtering.

**Endpoint:** `GET /api/students`

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number | 1 |
| pageSize | number | Items per page (5-50) | 10 |
| search | string | Search in name/email/tag | - |
| grade | number | Filter by grade (7-12) | - |
| status | string | Filter by status (active/disabled) | - |

**Response:**
```json
{
  "data": [
    {
      "id": "clx123abc",
      "name": "John Doe",
      "email": "john.doe@students.school.edu",
      "studentType": "highschool",
      "grade": 10,
      "section": "A",
      "college": null,
      "course": null,
      "status": "active",
      "tagId": "2024-0001",
      "photoUrl": "data:image/jpeg;base64,...",
      "lastSeen": "2024-02-10T10:30:00Z"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 120
}
```

**Example:**
```bash
curl "http://localhost:3000/api/students?page=1&pageSize=10&grade=10"
```

---

### Get Single Student
Get detailed information about a specific student.

**Endpoint:** `GET /api/students/[id]`

**Response:**
```json
{
  "student": {
    "id": "clx123abc",
    "name": "John Doe",
    "email": "john.doe@students.school.edu",
    "studentType": "highschool",
    "grade": 10,
    "section": "A",
    "status": "active",
    "tagId": "2024-0001",
    "location": "123 Main St",
    "emergencyContact": "Jane Doe",
    "emergencyPhone": "+1234567890",
    "photoUrl": "data:image/jpeg;base64,...",
    "lastSeen": "2024-02-10T10:30:00Z",
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-02-10T10:30:00Z"
  }
}
```

---

### Create Student
Add a new student to the system.

**Endpoint:** `POST /api/students`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@students.school.edu",
  "studentType": "highschool",
  "grade": 10,
  "section": "A",
  "tagId": "2024-0001",
  "location": "123 Main St",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "+1234567890",
  "photoUrl": "data:image/jpeg;base64,..."
}
```

**Validation Rules:**
- `name`: Required, string
- `email`: Required, unique, valid email format
- `studentType`: Required, "highschool" or "college"
- `grade`: Required if studentType is "highschool" (7-12)
- `section`: Optional for highschool
- `college`: Optional for college students
- `course`: Optional for college students
- `tagId`: Optional, unique format YYYY-XXXX
- `photoUrl`: Optional, Base64 encoded image

**Response:**
```json
{
  "student": {
    "id": "clx123abc",
    "name": "John Doe",
    ...
  }
}
```

**Status Codes:**
- `201`: Created successfully
- `400`: Bad request (validation error)
- `409`: Conflict (duplicate email/tagId)

---

### Update Student
Update an existing student's information.

**Endpoint:** `PATCH /api/students/[id]`

**Request Body:** (all fields optional)
```json
{
  "name": "John Updated Doe",
  "location": "456 New St",
  "emergencyContact": "Jane Updated Doe",
  "emergencyPhone": "+0987654321",
  "status": "disabled"
}
```

**Response:**
```json
{
  "student": {
    "id": "clx123abc",
    "name": "John Updated Doe",
    ...
  }
}
```

---

### Delete Student
Remove a student from the system.

**Endpoint:** `DELETE /api/students/[id]`

**Response:**
```json
{
  "message": "Student deleted successfully",
  "id": "clx123abc"
}
```

**Status Codes:**
- `200`: Deleted successfully
- `404`: Student not found
- `409`: Cannot delete (has related records)

---

### Get Student Events
Get RFID access events for a specific student.

**Endpoint:** `GET /api/students/[id]/events`

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| limit | number | Number of events | 50 |
| offset | number | Skip events | 0 |

**Response:**
```json
{
  "events": [
    {
      "id": "evt123",
      "time": "2024-02-10T10:30:00Z",
      "door": "Main Entrance",
      "direction": "entry",
      "status": "allowed"
    }
  ]
}
```

---

## Workers API

### List Workers
Get paginated list of workers with filtering.

**Endpoint:** `GET /api/workers`

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number | 1 |
| pageSize | number | Items per page (5-50) | 10 |
| search | string | Search in name/email/tag | - |
| role | string | Filter by role | - |
| status | string | Filter by status | - |

**Response:** Similar to students API

---

### Get Single Worker
**Endpoint:** `GET /api/workers/[id]`

### Create Worker
**Endpoint:** `POST /api/workers`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@school.edu",
  "role": "Teacher",
  "department": "Mathematics",
  "tagId": "2024-5001",
  "location": "Room 101",
  "emergencyContact": "John Smith",
  "emergencyPhone": "+1234567890",
  "photoUrl": "data:image/jpeg;base64,..."
}
```

### Update Worker
**Endpoint:** `PATCH /api/workers/[id]`

### Delete Worker
**Endpoint:** `DELETE /api/workers/[id]`

### Get Worker Events
**Endpoint:** `GET /api/workers/[id]/events`

---

## Tags API

### List Tags
**Endpoint:** `GET /api/tags`

**Query Parameters:**
- `status`: Filter by status (unassigned, assigned, lost, disabled, retired)
- `type`: Filter by type (student, worker, visitor)

**Response:**
```json
{
  "data": [
    {
      "id": "tag123",
      "uid": "RFID-UID-12345",
      "status": "assigned",
      "type": "student",
      "ownerId": "clx123abc",
      "ownerType": "student",
      "issuedAt": "2024-01-15T08:00:00Z",
      "lastSeen": "2024-02-10T10:30:00Z"
    }
  ],
  "total": 500
}
```

### Get Single Tag
**Endpoint:** `GET /api/tags/[id]`

### Get Tag Events
**Endpoint:** `GET /api/tags/[id]/events`

---

## Events API

### List Events
Get recent RFID access events.

**Endpoint:** `GET /api/events`

**Query Parameters:**
- `limit`: Number of events (default: 100)
- `offset`: Skip events (default: 0)
- `action`: Filter by action (entry, exit, denied)
- `doorId`: Filter by door
- `startDate`: Filter from date
- `endDate`: Filter to date

**Response:**
```json
{
  "events": [
    {
      "id": "evt123",
      "tagId": "2024-0001",
      "doorId": "door1",
      "studentId": "clx123abc",
      "workerId": null,
      "action": "entry",
      "timestamp": "2024-02-10T10:30:00Z",
      "metadata": "{\"temperature\": 36.5}"
    }
  ],
  "total": 1500
}
```

### Create Event
Record a new RFID scan event.

**Endpoint:** `POST /api/events`

**Request Body:**
```json
{
  "tagId": "2024-0001",
  "doorId": "door1",
  "action": "entry",
  "metadata": {
    "temperature": 36.5,
    "deviceId": "reader-01"
  }
}
```

**Response:**
```json
{
  "event": {
    "id": "evt123",
    "status": "allowed",
    "message": "Access granted"
  }
}
```

---

## Dashboard APIs

### Get Attendance Summary
**Endpoint:** `GET /api/dashboard/attendance`

**Response:**
```json
{
  "present": 450,
  "absent": 50,
  "late": 20,
  "total": 520,
  "percentage": 86.5
}
```

### Get Door Status
**Endpoint:** `GET /api/dashboard/doors`

**Response:**
```json
{
  "doors": [
    {
      "id": "door1",
      "name": "Main Entrance",
      "location": "Building A",
      "status": "online",
      "capacity": 100,
      "currentOccupancy": 45
    }
  ]
}
```

### Get Recent Events
**Endpoint:** `GET /api/dashboard/events`

**Response:**
```json
{
  "events": [
    {
      "id": "evt123",
      "personName": "John Doe",
      "door": "Main Entrance",
      "action": "entry",
      "timestamp": "2024-02-10T10:30:00Z",
      "status": "allowed"
    }
  ]
}
```

---

## Attendance APIs

### Get Attendance Alerts
**Endpoint:** `GET /api/attendance/alerts`

**Response:**
```json
{
  "alerts": [
    {
      "id": "alert1",
      "type": "absent",
      "studentId": "clx123abc",
      "studentName": "John Doe",
      "message": "Absent for 3 consecutive days",
      "severity": "high",
      "timestamp": "2024-02-10T08:00:00Z"
    }
  ]
}
```

### Search Attendance
**Endpoint:** `GET /api/attendance/search`

**Query Parameters:**
- `q`: Search query (name, email, tag)
- `date`: Specific date (YYYY-MM-DD)

---

## Location APIs

### Get Location Heatmap
**Endpoint:** `GET /api/locations/heatmap`

**Query Parameters:**
- `startDate`: Start date
- `endDate`: End date

**Response:**
```json
{
  "locations": [
    {
      "doorId": "door1",
      "doorName": "Main Entrance",
      "count": 1250,
      "coordinates": { "x": 100, "y": 200 }
    }
  ]
}
```

---

## Reports APIs

### Get Report Definitions
**Endpoint:** `GET /api/reports/definitions`

**Response:**
```json
{
  "reports": [
    {
      "id": "daily-attendance",
      "name": "Daily Attendance Report",
      "description": "Summary of daily attendance",
      "parameters": ["date", "grade"]
    }
  ]
}
```

### Generate Report
**Endpoint:** `POST /api/reports/generate`

**Request Body:**
```json
{
  "reportId": "daily-attendance",
  "parameters": {
    "date": "2024-02-10",
    "grade": 10
  },
  "format": "pdf"
}
```

### Get Report History
**Endpoint:** `GET /api/reports/history`

### Get Report Stats
**Endpoint:** `GET /api/reports/stats`

---

## Settings APIs

### Get Notification Settings
**Endpoint:** `GET /api/settings/notifications`

### Update Notification Settings
**Endpoint:** `PATCH /api/settings/notifications`

### Get RFID Settings
**Endpoint:** `GET /api/settings/rfid`

### Update RFID Settings
**Endpoint:** `PATCH /api/settings/rfid`

### Get Security Settings
**Endpoint:** `GET /api/settings/security`

### Update Security Settings
**Endpoint:** `PATCH /api/settings/security`

### Get System Settings
**Endpoint:** `GET /api/settings/system`

### Update System Settings
**Endpoint:** `PATCH /api/settings/system`

---

## Users API

### List Users
**Endpoint:** `GET /api/users`

### Get Single User
**Endpoint:** `GET /api/users/[id]`

### Create User
**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@school.edu",
  "password": "securepassword",
  "role": "admin",
  "status": "active"
}
```

### Update User
**Endpoint:** `PATCH /api/users/[id]`

### Delete User
**Endpoint:** `DELETE /api/users/[id]`

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": {
    "email": "Invalid email format",
    "grade": "Must be between 7 and 12"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "resource": "student",
  "id": "clx123abc"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists",
  "field": "email",
  "value": "john.doe@students.school.edu"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- **Rate Limit:** 100 requests per minute per IP
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Pagination

All list endpoints support pagination:

**Request:**
```
GET /api/students?page=2&pageSize=20
```

**Response Headers:**
```
X-Total-Count: 120
X-Page: 2
X-Page-Size: 20
X-Total-Pages: 6
```

---

## Filtering and Sorting

**Filtering:**
```
GET /api/students?status=active&grade=10
```

**Sorting:**
```
GET /api/students?sortBy=name&order=asc
```

**Combined:**
```
GET /api/students?status=active&sortBy=lastSeen&order=desc&page=1&pageSize=20
```

---

## Webhooks

Configure webhooks to receive real-time notifications:

**Events:**
- `student.created`
- `student.updated`
- `student.deleted`
- `event.created` (RFID scan)
- `alert.triggered`

**Webhook Payload:**
```json
{
  "event": "student.created",
  "timestamp": "2024-02-10T10:30:00Z",
  "data": {
    "id": "clx123abc",
    "name": "John Doe",
    ...
  }
}
```

---

## Testing

Use these tools to test the API:

**Postman Collection:**
Import the provided `postman_collection.json`

**cURL Examples:**
```bash
# List students
curl http://localhost:3000/api/students

# Create student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@school.edu",...}'

# Update student
curl -X PATCH http://localhost:3000/api/students/clx123abc \
  -H "Content-Type: application/json" \
  -d '{"location":"New Address"}'

# Delete student
curl -X DELETE http://localhost:3000/api/students/clx123abc
```

---

## API Versioning

Current version: **v1**

Future versions will be accessible via:
```
/api/v2/students
```

---

## Support

For API issues or questions:
- Check error responses for details
- Review this documentation
- Contact development team
