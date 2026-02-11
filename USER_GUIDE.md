# User Guide - RFID School Management System

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Students](#managing-students)
4. [Managing Workers](#managing-workers)
5. [Attendance Tracking](#attendance-tracking)
6. [RFID Tag Management](#rfid-tag-management)
7. [Reports](#reports)
8. [Settings](#settings)
9. [Tips & Best Practices](#tips--best-practices)

---

## Getting Started

### Logging In

1. Open your web browser
2. Navigate to the application URL (e.g., http://localhost:3000)
3. Click "Login" button
4. Enter your credentials:
   - Email: your-email@school.edu
   - Password: your-password
5. Click "Sign In"

### Dashboard Navigation

After logging in, you'll see the main dashboard with:
- **Sidebar** (left): Main navigation menu
- **Top Bar**: Search, notifications, and user menu
- **Main Content**: Current page content

---

## Dashboard Overview

The dashboard home page shows:

### Quick Stats Cards
- **Students**: Total enrolled students
- **Workers**: Total staff members
- **Attendance**: Today's attendance summary

### Recent Activity
- Latest RFID scan events
- Door access logs
- System alerts

### Door Status
- Real-time status of all access points
- Online/offline indicators
- Current occupancy levels

---

## Managing Students

### Viewing Students

1. Click **"Students"** in the sidebar
2. You'll see a table with all students
3. Use filters to narrow results:
   - **Search**: Type name, email, or tag ID
   - **Grade**: Select grade level (7-12)
   - **Status**: Active or Disabled

### Adding a New Student

1. Click **"+ Add Student"** button
2. A modal window opens with a form

#### Step 1: Upload Photo
- Click **"Upload Photo"** button
- Select an image file (JPG, PNG, GIF)
- Maximum size: 5MB
- Photo preview appears immediately
- Click **"×"** to remove and choose another

#### Step 2: Select Student Type
- Choose **"High School"** or **"College"**
- Form fields change based on selection

#### Step 3: Fill Basic Information
- **Full Name**: Enter student's complete name
- **Email**: Enter unique email address
- **Tag ID**: Auto-generated (YYYY-XXXX format)
  - Click **"🔄 Regenerate"** for a new ID

#### Step 4: Academic Information

**For High School Students:**
- **Grade**: Select 7-12
- **Section**: Enter section (A, B, C, D)

**For College Students:**
- **College**: Select from dropdown
- **Course**: Select from dropdown (organized by category)

#### Step 5: Additional Information (Optional)
- **Location**: Physical address
- **Emergency Contact**: Contact person name
- **Emergency Phone**: Contact phone number

#### Step 6: Save
1. Click **"Add Student"** button
2. Confirmation dialog appears
3. Click **"Yes, Add"** to confirm
4. Success message appears
5. Student added to the list

### Editing a Student

1. Find the student in the table
2. Click **"View"** button
3. Modal opens with student details
4. Click **"Edit Profile"** button
5. Update any fields
6. Click **"Save Changes"**
7. Confirm in the dialog
8. Success message appears

### Deleting a Student

1. Open student details (click "View")
2. Click **"🗑️ Delete"** button (red button)
3. Confirmation dialog appears with warning
4. Click **"Yes, Delete"** to confirm
5. Student is removed from the system

> ⚠️ **Warning**: Deletion cannot be undone!

### Viewing Student Details

Click "View" on any student to see:
- Profile photo
- Full name and email
- Student type (High School/College)
- Academic information
- Tag ID
- Status
- Location and emergency contacts
- Last seen timestamp
- Recent activity/events

---

## Managing Workers

### Viewing Workers

1. Click **"Workers"** in the sidebar
2. Table shows all staff members
3. Use filters:
   - **Search**: Name, email, or tag
   - **Role**: Teacher, Security, Admin, etc.
   - **Status**: Active or Disabled

### Adding a New Worker

1. Click **"+ Add Worker"** button
2. Modal opens with form

#### Fill Worker Information:
- **Profile Photo**: Upload worker's photo
- **Full Name**: Complete name
- **Email**: Unique email address
- **Role**: Select from dropdown
  - Teacher
  - Security
  - Admin
  - Custodial
  - IT
- **Department**: Enter department name
- **Tag ID**: Auto-generated
- **Location**: Office/room location
- **Emergency Contact**: Contact person
- **Emergency Phone**: Contact number
- **Status**: Active or Disabled

#### Save Worker:
1. Click **"Add Worker"**
2. Confirm in dialog
3. Success message appears

### Editing and Deleting Workers

Same process as students:
- Click "View" to see details
- Click "Edit Profile" to modify
- Click "🗑️ Delete" to remove

---

## Attendance Tracking

### Viewing Attendance

1. Click **"Attendance"** in the sidebar
2. Dashboard shows:
   - **Attendance Summary**: Present, absent, late counts
   - **Real-time Tracker**: Live updates as people scan
   - **Alerts Panel**: Unusual patterns or issues
   - **Location Heatmap**: Popular entry/exit points

### Quick Search

Use the search bar to:
- Find specific person's attendance
- Check current location
- View attendance history

### Attendance Alerts

System automatically detects:
- **Consecutive absences**: 3+ days absent
- **Late arrivals**: Frequent tardiness
- **Unusual patterns**: Irregular attendance
- **Missing scans**: Expected but not recorded

Click on any alert to:
- View details
- See person's profile
- Take action (contact, mark excused, etc.)

---

## RFID Tag Management

### Viewing Tags

1. Click **"Tags"** in the sidebar
2. See all RFID tags with status:
   - **Unassigned**: Available for use
   - **Assigned**: Currently in use
   - **Lost**: Reported missing
   - **Disabled**: Deactivated
   - **Retired**: No longer in service

### Tag Information

Each tag shows:
- **UID**: Unique RFID identifier
- **Tag ID**: System ID (YYYY-XXXX)
- **Type**: Student, Worker, or Visitor
- **Owner**: Assigned person
- **Status**: Current state
- **Issued Date**: When assigned
- **Last Seen**: Last scan timestamp

### Managing Tags

**Assign Tag:**
1. Find unassigned tag
2. Click "Assign"
3. Select person (student/worker)
4. Confirm assignment

**Report Lost:**
1. Find assigned tag
2. Click "Report Lost"
3. Tag status changes to "Lost"
4. Access is automatically disabled

**Deactivate Tag:**
1. Find tag
2. Click "Deactivate"
3. Confirm action
4. Tag can no longer be used

---

## Reports

### Accessing Reports

1. Click **"Reports"** in the sidebar
2. See three sections:
   - **Quick Stats**: Summary metrics
   - **Report Generator**: Create custom reports
   - **Report History**: Previously generated reports

### Generating Reports

#### Step 1: Select Report Type
- Daily Attendance Report
- Weekly Summary
- Monthly Statistics
- Custom Date Range
- Student Attendance History
- Worker Access Log
- Door Usage Report
- Alert Summary

#### Step 2: Set Parameters
- **Date Range**: Start and end dates
- **Grade/Department**: Filter by group
- **Status**: Active, disabled, or all
- **Format**: PDF, Excel, or CSV

#### Step 3: Generate
1. Click **"Generate Report"**
2. System processes data
3. Report appears in new tab or downloads

### Report History

View previously generated reports:
- Report name and type
- Generation date and time
- Parameters used
- Download link
- Delete option

---

## Settings

### Notification Settings

Configure alerts and notifications:
- **Email Notifications**: Enable/disable
- **Alert Types**: Choose which alerts to receive
- **Frequency**: Immediate, daily digest, weekly
- **Recipients**: Who receives notifications

### RFID Settings

Configure RFID hardware:
- **Reader Endpoints**: Add/edit RFID reader URLs
- **Scan Timeout**: How long to wait for response
- **Retry Attempts**: Number of retries on failure
- **Test Connection**: Verify reader connectivity

### Security Settings

Manage security options:
- **Password Policy**: Minimum length, complexity
- **Session Timeout**: Auto-logout time
- **Two-Factor Authentication**: Enable/disable
- **IP Whitelist**: Restrict access by IP
- **Audit Log**: View security events

### System Settings

General system configuration:
- **School Information**: Name, address, contact
- **Academic Year**: Current year settings
- **Time Zone**: System timezone
- **Date Format**: Display preferences
- **Language**: Interface language

### User Management

Manage admin users:
- **View Users**: List all admin accounts
- **Add User**: Create new admin
- **Edit User**: Update permissions
- **Delete User**: Remove access
- **Roles**: Admin, Teacher, Security, Staff

---

## Tips & Best Practices

### For Administrators

**Daily Tasks:**
- ✅ Check attendance summary each morning
- ✅ Review alerts and take action
- ✅ Verify door status (all online)
- ✅ Monitor recent events for anomalies

**Weekly Tasks:**
- ✅ Generate weekly attendance report
- ✅ Review and resolve outstanding alerts
- ✅ Check for lost/damaged tags
- ✅ Update student/worker information as needed

**Monthly Tasks:**
- ✅ Generate monthly statistics
- ✅ Review system performance
- ✅ Update emergency contacts
- ✅ Audit user accounts and permissions

### Data Entry Best Practices

**Photos:**
- Use clear, well-lit photos
- Face should be clearly visible
- Neutral background preferred
- Keep file size under 2MB for faster loading

**Email Addresses:**
- Use official school email domain
- Follow consistent format (firstname.lastname@school.edu)
- Verify email is unique before saving

**Tag IDs:**
- Use auto-generated IDs for consistency
- Format: YYYY-XXXX (year-number)
- Don't manually edit unless necessary

**Emergency Contacts:**
- Always include emergency contact information
- Verify phone numbers are correct
- Update regularly (at least annually)

### Search Tips

**Quick Search:**
- Type partial names (e.g., "john" finds "John Doe")
- Search by email domain (e.g., "@students")
- Use tag ID for exact matches

**Advanced Filtering:**
- Combine multiple filters for precise results
- Use status filter to find inactive records
- Sort by "Last Seen" to find recent activity

### Troubleshooting Common Issues

**"Student not found"**
- Check spelling of name
- Try searching by email or tag ID
- Verify student hasn't been deleted

**"Tag not scanning"**
- Check tag status (should be "assigned")
- Verify RFID reader is online
- Try reporting tag as lost and reassigning

**"Cannot upload photo"**
- Check file size (max 5MB)
- Verify file format (JPG, PNG, GIF only)
- Try compressing the image

**"Duplicate email error"**
- Email already exists in system
- Check if person already registered
- Use different email address

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Quick search |
| `Ctrl + N` | Add new (context-dependent) |
| `Esc` | Close modal/dialog |
| `Enter` | Confirm action |
| `Tab` | Navigate form fields |

---

## Mobile Access

The system is responsive and works on mobile devices:

**Supported Browsers:**
- Chrome (recommended)
- Safari
- Firefox
- Edge

**Mobile Features:**
- View students and workers
- Check attendance
- Search records
- View reports
- Receive notifications

**Limited on Mobile:**
- Photo upload (use desktop for best experience)
- Complex report generation
- Bulk operations

---

## Getting Help

### In-App Help
- Look for **"?"** icons for tooltips
- Hover over fields for descriptions
- Check validation messages for errors

### Support Resources
- **Documentation**: Review this guide
- **FAQ**: Check frequently asked questions
- **Contact Support**: Email support@school.edu
- **Training Videos**: Available in Help menu

### Reporting Issues

When reporting a problem, include:
1. What you were trying to do
2. What happened instead
3. Error message (if any)
4. Screenshot (if applicable)
5. Your browser and device info

---

## Security Reminders

**Password Security:**
- Use strong, unique passwords
- Change password regularly
- Never share your credentials
- Log out when finished

**Data Privacy:**
- Only access information you need
- Don't share student/worker data
- Report suspicious activity
- Follow school privacy policies

**Physical Security:**
- Lock your computer when away
- Don't leave system unattended
- Secure printed reports
- Dispose of sensitive data properly

---

## Glossary

**Tag ID**: Unique identifier for RFID tag (format: YYYY-XXXX)

**UID**: RFID chip's unique identifier

**Event**: Record of an RFID scan (entry/exit/denied)

**Last Seen**: Timestamp of most recent RFID scan

**Status**: Current state (active/disabled for people, online/offline for doors)

**Student Type**: High School or College classification

**Emergency Contact**: Person to contact in case of emergency

**Heatmap**: Visual representation of location usage

**Alert**: System notification about unusual patterns

---

**Need more help?** Contact your system administrator or IT support team.
