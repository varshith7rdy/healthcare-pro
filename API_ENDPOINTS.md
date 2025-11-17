# Backend API Endpoints Documentation

This document describes all the API endpoints that the frontend expects. Implement these endpoints in your backend server.

## Base URL
All endpoints are relative to: `http://localhost:5000`

## Authentication

### POST `/auth/login`
Login with credentials
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

### POST `/auth/signup`
Create a new user account
```json
Request:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

## User Profile

### GET `/api/user/profile`
Get current user's profile
```json
Response:
{
  "id": "user_id",
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+1 (555) 123-4567",
  "dateOfBirth": "1990-05-15",
  "address": "123 Healthcare St, Medical City, MC 12345"
}
```

### PUT `/api/user/profile`
Update user profile
```json
Request:
{
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+1 (555) 123-4567",
  "dateOfBirth": "1990-05-15",
  "address": "123 Healthcare St, Medical City, MC 12345"
}

Response:
{
  "id": "user_id",
  "name": "John Doe",
  "email": "user@example.com",
  ...
}
```

### POST `/api/user/change-password`
Change user password
```json
Request:
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}

Response:
{
  "message": "Password updated successfully"
}
```

## Dashboard / Health Metrics

### GET `/api/health/metrics`
Get current health metrics for dashboard
```json
Response:
[
  {
    "label": "Heart Rate",
    "value": "72",
    "unit": "bpm",
    "trend": "+2%"
  },
  {
    "label": "Steps Today",
    "value": "8,247",
    "unit": "steps",
    "trend": "+15%"
  },
  {
    "label": "Sleep",
    "value": "7.5",
    "unit": "hours",
    "trend": "+0.5h"
  },
  {
    "label": "Active Minutes",
    "value": "45",
    "unit": "mins",
    "trend": "+12%"
  }
]
```

### GET `/api/health/activity`
Get recent activity feed
```json
Response:
[
  {
    "time": "2 hours ago",
    "text": "Synced Apple Watch data",
    "type": "sync"
  },
  {
    "time": "5 hours ago",
    "text": "Upcoming appointment with Dr. Smith",
    "type": "appointment"
  },
  {
    "time": "Yesterday",
    "text": "New health insights available",
    "type": "insight"
  },
  {
    "time": "2 days ago",
    "text": "Lab results uploaded",
    "type": "record"
  }
]
```

## Wearables

### GET `/api/wearables/devices`
Get all connected wearable devices
```json
Response:
[
  {
    "id": 1,
    "name": "Apple Watch Series 9",
    "type": "Smartwatch",
    "connected": true,
    "lastSync": "2 hours ago",
    "battery": 85
  },
  {
    "id": 2,
    "name": "Fitbit Charge 6",
    "type": "Fitness Tracker",
    "connected": false,
    "lastSync": "3 days ago",
    "battery": null
  }
]
```

### POST `/api/wearables/sync/:deviceId`
Sync data from a specific device
```json
Response:
{
  "message": "Sync completed successfully",
  "dataPoints": 156
}
```

### POST `/api/wearables/connect/:deviceId`
Connect a new device
```json
Response:
{
  "message": "Device connected successfully",
  "device": {
    "id": 2,
    "name": "Fitbit Charge 6",
    "connected": true
  }
}
```

## Virtual Health Companion (Chat)

### POST `/api/chat/query`
Send a message to the AI health companion
```json
Request:
{
  "message": "How's my heart rate trending?"
}

Response:
{
  "response": "Based on your recent data, your average heart rate over the past week has been 72 bpm, which is within the normal range. Your sleep quality has improved by 15% compared to last month."
}
```

## Analytics

### GET `/api/analytics/data?timeRange=7d`
Get analytics data for specified time range
Query parameters:
- `timeRange`: One of "7d", "30d", "90d"

```json
Response:
{
  "metrics": [
    {
      "name": "Average Heart Rate",
      "value": "72 bpm",
      "change": "+2%",
      "trend": "up"
    },
    {
      "name": "Daily Steps",
      "value": "8,247",
      "change": "+15%",
      "trend": "up"
    },
    {
      "name": "Sleep Quality",
      "value": "7.5 hrs",
      "change": "+0.5%",
      "trend": "up"
    },
    {
      "name": "Active Minutes",
      "value": "45 min",
      "change": "+12%",
      "trend": "up"
    }
  ],
  "chartData": [
    {
      "date": "Nov 10",
      "heartRate": 68,
      "steps": 6500,
      "sleep": 6.8,
      "activeMinutes": 35,
      "calories": 1980
    },
    {
      "date": "Nov 11",
      "heartRate": 70,
      "steps": 7200,
      "sleep": 7.2,
      "activeMinutes": 42,
      "calories": 2100
    }
    // ... more data points
  ],
  "summary": {
    "heartRate": {
      "max": 150,
      "avg": 72,
      "min": 60
    },
    "activity": {
      "totalSteps": 57729,
      "totalMinutes": 315
    },
    "sleep": {
      "avg": "7.5"
    },
    "calories": {
      "total": 14700,
      "avg": 2100
    }
  },
  "insights": [
    {
      "type": "positive",
      "category": "heart",
      "title": "Excellent Heart Rate Stability",
      "description": "Your heart rate has been very consistent...",
      "metric": "72 bpm average"
    },
    {
      "type": "warning",
      "category": "sleep",
      "title": "Sleep Pattern Alert",
      "description": "Your sleep has decreased by 10% recently...",
      "metric": "Declining trend detected"
    }
    // ... more insights
  ]
}
```

## Appointments

### GET `/api/appointments`
Get all appointments (upcoming and past)
```json
Response:
{
  "upcoming": [
    {
      "id": 1,
      "doctor": "Dr. Sarah Smith",
      "specialty": "Cardiologist",
      "doctorInitials": "SS",
      "date": "Nov 20, 2025",
      "time": "10:00 AM",
      "type": "virtual",
      "location": null
    },
    {
      "id": 2,
      "doctor": "Dr. Michael Chen",
      "specialty": "General Practitioner",
      "doctorInitials": "MC",
      "date": "Nov 25, 2025",
      "time": "2:30 PM",
      "type": "in-person",
      "location": "Medical Center, Room 305"
    }
  ],
  "past": [
    {
      "id": 3,
      "doctor": "Dr. Emily Johnson",
      "specialty": "Dermatologist",
      "doctorInitials": "EJ",
      "date": "Nov 10, 2025",
      "time": "11:00 AM",
      "type": "in-person"
    }
  ]
}
```

### POST `/api/appointments/book`
Book a new appointment
```json
Request:
{
  "doctor": "dr-smith",
  "date": "2025-11-20",
  "time": "10:00",
  "type": "virtual"
}

Response:
{
  "id": 4,
  "doctor": "Dr. Sarah Smith",
  "specialty": "Cardiologist",
  "date": "Nov 20, 2025",
  "time": "10:00 AM",
  "type": "virtual"
}
```

### DELETE `/api/appointments/:id`
Cancel an appointment
```json
Response:
{
  "message": "Appointment cancelled successfully"
}
```

## Digital Records

### GET `/api/records`
Get all medical records
```json
Response:
[
  {
    "id": 1,
    "name": "Blood Test Results - Oct 2025",
    "type": "Lab Report",
    "category": "lab",
    "date": "Oct 28, 2025",
    "size": "2.4 MB",
    "format": "PDF",
    "url": "/uploads/records/file1.pdf"
  },
  {
    "id": 2,
    "name": "X-Ray - Chest",
    "type": "Imaging",
    "category": "imaging",
    "date": "Oct 15, 2025",
    "size": "5.1 MB",
    "format": "JPEG",
    "url": "/uploads/records/file2.jpg"
  }
]
```

### POST `/api/records/upload`
Upload a new medical record (multipart/form-data)
```
Form Data:
- file: (binary file data)

Response:
{
  "id": 5,
  "name": "Lab Results - Nov 2025.pdf",
  "type": "Lab Report",
  "category": "lab",
  "date": "Nov 17, 2025",
  "size": "1.2 MB",
  "format": "PDF",
  "url": "/uploads/records/file5.pdf"
}
```

### DELETE `/api/records/:id`
Delete a medical record
```json
Response:
{
  "message": "Record deleted successfully"
}
```

## Authentication Header

All authenticated endpoints (everything except `/auth/login` and `/auth/signup`) should include:
```
Authorization: Bearer {jwt_token}
```

The frontend automatically adds this header based on the stored user token in localStorage.

## Error Responses

All endpoints should return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

Error response format:
```json
{
  "error": "Error message here",
  "details": "Optional detailed error information"
}
```

## Notes for Backend Implementation

1. **Authentication**: Use JWT tokens for authentication. Token should be returned on login/signup and validated on protected routes.

2. **File Uploads**: The `/api/records/upload` endpoint should handle multipart form data and store files securely.

3. **Data Persistence**: Store user data, health metrics, appointments, and records in your database of choice.

4. **CORS**: Enable CORS for `http://localhost:5173` (Vite dev server) during development.

5. **Validation**: Implement proper input validation and sanitization on all endpoints.

6. **Analytics Calculations**: The analytics endpoint should calculate metrics, trends, and generate insights based on the user's health data over the specified time range.

7. **Chat/AI Integration**: The chat endpoint can integrate with AI services like OpenAI for intelligent health responses, or implement rule-based responses as a starting point.
