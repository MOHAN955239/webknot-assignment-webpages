const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /reports/event-registrations - Total registrations per event
router.get('/event-registrations', (req, res) => {
  const sql = `
    SELECT 
      e.id,
      e.name as event_name,
      e.type,
      e.date,
      c.name as college_name,
      COUNT(r.id) as total_registrations
    FROM events e
    JOIN colleges c ON e.college_id = c.id
    LEFT JOIN registrations r ON e.id = r.event_id
    GROUP BY e.id, e.name, e.type, e.date, c.name
    ORDER BY total_registrations DESC, e.date DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching event registrations report:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch event registrations report',
        message: err.message
      });
    }

    res.json({
      report: 'Event Registrations',
      data: rows,
      count: rows.length
    });
  });
});

// GET /reports/attendance - Attendance percentage per event
router.get('/attendance', (req, res) => {
  const sql = `
    SELECT 
      e.id,
      e.name as event_name,
      e.type,
      e.date,
      c.name as college_name,
      COUNT(r.id) as total_registrations,
      COUNT(a.id) as attendance_marked,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
      COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_count,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_count,
      ROUND(
        (COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) * 100.0 / 
         NULLIF(COUNT(r.id), 0)), 2
      ) as attendance_percentage
    FROM events e
    JOIN colleges c ON e.college_id = c.id
    LEFT JOIN registrations r ON e.id = r.event_id
    LEFT JOIN attendance a ON r.id = a.registration_id
    GROUP BY e.id, e.name, e.type, e.date, c.name
    ORDER BY attendance_percentage DESC, e.date DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching attendance report:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch attendance report',
        message: err.message
      });
    }

    res.json({
      report: 'Event Attendance',
      data: rows,
      count: rows.length
    });
  });
});

// GET /reports/feedback - Average feedback score per event
router.get('/feedback', (req, res) => {
  const sql = `
    SELECT 
      e.id,
      e.name as event_name,
      e.type,
      e.date,
      c.name as college_name,
      COUNT(f.id) as total_feedback,
      ROUND(AVG(f.rating), 2) as average_rating,
      MIN(f.rating) as min_rating,
      MAX(f.rating) as max_rating
    FROM events e
    JOIN colleges c ON e.college_id = c.id
    LEFT JOIN registrations r ON e.id = r.event_id
    LEFT JOIN feedback f ON r.id = f.registration_id
    GROUP BY e.id, e.name, e.type, e.date, c.name
    HAVING COUNT(f.id) > 0
    ORDER BY average_rating DESC, e.date DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching feedback report:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch feedback report',
        message: err.message
      });
    }

    res.json({
      report: 'Event Feedback',
      data: rows,
      count: rows.length
    });
  });
});

// GET /reports/popular-events - Events sorted by number of registrations
router.get('/popular-events', (req, res) => {
  const sql = `
    SELECT 
      e.id,
      e.name as event_name,
      e.type,
      e.date,
      c.name as college_name,
      COUNT(r.id) as registration_count,
      COUNT(a.id) as attendance_count,
      ROUND(
        (COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) * 100.0 / 
         NULLIF(COUNT(r.id), 0)), 2
      ) as attendance_percentage
    FROM events e
    JOIN colleges c ON e.college_id = c.id
    LEFT JOIN registrations r ON e.id = r.event_id
    LEFT JOIN attendance a ON r.id = a.registration_id
    GROUP BY e.id, e.name, e.type, e.date, c.name
    ORDER BY registration_count DESC, e.date DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching popular events report:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch popular events report',
        message: err.message
      });
    }

    res.json({
      report: 'Popular Events',
      data: rows,
      count: rows.length
    });
  });
});

// GET /reports/student-participation - Events attended by each student
router.get('/student-participation', (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.name as student_name,
      s.email,
      c.name as college_name,
      COUNT(r.id) as total_registrations,
      COUNT(a.id) as events_attended,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
      COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_count,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_count,
      ROUND(
        (COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) * 100.0 / 
         NULLIF(COUNT(r.id), 0)), 2
      ) as participation_percentage
    FROM users s
    JOIN colleges c ON s.college_id = c.id
    LEFT JOIN registrations r ON s.id = r.student_id
    LEFT JOIN attendance a ON r.id = a.registration_id
    WHERE s.role = 'student'
    GROUP BY s.id, s.name, s.email, c.name
    ORDER BY participation_percentage DESC, total_registrations DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching student participation report:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch student participation report',
        message: err.message
      });
    }

    res.json({
      report: 'Student Participation',
      data: rows,
      count: rows.length
    });
  });
});

// GET /reports/top-students - Top 3 most active students (bonus)
router.get('/top-students', (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.name as student_name,
      s.email,
      c.name as college_name,
      COUNT(r.id) as total_registrations,
      COUNT(a.id) as events_attended,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
      COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_count,
      COUNT(f.id) as feedback_submitted,
      ROUND(AVG(f.rating), 2) as average_feedback_rating,
      ROUND(
        (COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) * 100.0 / 
         NULLIF(COUNT(r.id), 0)), 2
      ) as participation_percentage
    FROM users s
    JOIN colleges c ON s.college_id = c.id
    LEFT JOIN registrations r ON s.id = r.student_id
    LEFT JOIN attendance a ON r.id = a.registration_id
    LEFT JOIN feedback f ON r.id = f.registration_id
    WHERE s.role = 'student'
    GROUP BY s.id, s.name, s.email, c.name
    HAVING COUNT(r.id) > 0
    ORDER BY total_registrations DESC, participation_percentage DESC
    LIMIT 3
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching top students report:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch top students report',
        message: err.message
      });
    }

    res.json({
      report: 'Top 3 Most Active Students',
      data: rows,
      count: rows.length
    });
  });
});

// GET /reports/college-stats - Statistics by college
router.get('/college-stats', (req, res) => {
  const sql = `
    SELECT 
      c.id,
      c.name as college_name,
      COUNT(DISTINCT s.id) as total_students,
      COUNT(DISTINCT e.id) as total_events,
      COUNT(r.id) as total_registrations,
      COUNT(a.id) as total_attendance,
      COUNT(f.id) as total_feedback,
      ROUND(AVG(f.rating), 2) as average_feedback_rating,
      ROUND(
        (COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) * 100.0 / 
         NULLIF(COUNT(r.id), 0)), 2
      ) as overall_attendance_percentage
    FROM colleges c
    LEFT JOIN users s ON c.id = s.college_id AND s.role = 'student'
    LEFT JOIN events e ON c.id = e.college_id
    LEFT JOIN registrations r ON s.id = r.student_id
    LEFT JOIN attendance a ON r.id = a.registration_id
    LEFT JOIN feedback f ON r.id = f.registration_id
    GROUP BY c.id, c.name
    ORDER BY total_students DESC, total_events DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching college stats report:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch college stats report',
        message: err.message
      });
    }

    res.json({
      report: 'College Statistics',
      data: rows,
      count: rows.length
    });
  });
});

module.exports = router;
