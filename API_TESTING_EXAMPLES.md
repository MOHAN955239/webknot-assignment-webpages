# Campus Event Management Platform - API Testing Examples

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Initialize database:
```bash
npm run init-db
```

3. Seed sample data:
```bash
npm run seed
```

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Testing Examples

### 1. Event Management

#### Create a new event
```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Development Workshop",
    "type": "Workshop",
    "date": "2024-08-15 14:00:00",
    "college_id": 1,
    "description": "Learn modern web development techniques"
  }'
```

#### Get all events
```bash
curl -X GET http://localhost:3000/events
```

#### Get a specific event
```bash
curl -X GET http://localhost:3000/events/1
```

### 2. Student Registration

#### Register a student for an event
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "event_id": 1
  }'
```

#### Get all registrations
```bash
curl -X GET http://localhost:3000/register
```

### 3. Attendance Management

#### Mark attendance for a student
```bash
curl -X POST http://localhost:3000/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "registration_id": 1,
    "status": "present"
  }'
```

#### Get all attendance records
```bash
curl -X GET http://localhost:3000/attendance
```

### 4. Feedback System

#### Submit feedback for an event
```bash
curl -X POST http://localhost:3000/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "registration_id": 1,
    "rating": 5,
    "comment": "Excellent workshop! Learned a lot."
  }'
```

#### Get all feedback
```bash
curl -X GET http://localhost:3000/feedback
```

### 5. Reports

#### Event registrations report
```bash
curl -X GET http://localhost:3000/reports/event-registrations
```

#### Attendance percentage report
```bash
curl -X GET http://localhost:3000/reports/attendance
```

#### Average feedback score report
```bash
curl -X GET http://localhost:3000/reports/feedback
```

#### Popular events report
```bash
curl -X GET http://localhost:3000/reports/popular-events
```

#### Student participation report
```bash
curl -X GET http://localhost:3000/reports/student-participation
```

#### Top 3 most active students
```bash
curl -X GET http://localhost:3000/reports/top-students
```

#### College statistics
```bash
curl -X GET http://localhost:3000/reports/college-stats
```

## Postman Collection

You can also import these requests into Postman for easier testing:

1. Create a new collection called "Campus Event Management"
2. Add the above requests with their respective methods and URLs
3. Set the base URL to `http://localhost:3000`

## Sample Data

The seed script creates:
- 4 colleges (MIT, Stanford, Harvard, UC)
- 6 students across different colleges
- 5 sample events of different types
- 15 registrations
- 15 attendance records
- 15 feedback entries

This provides a good foundation for testing all the API endpoints and reports.
