const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /attendance - Mark attendance for a student
router.post('/', (req, res) => {
  const { registration_id, status } = req.body;

  // Validation
  if (!registration_id || !status) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'registration_id and status are required'
    });
  }

  // Validate status
  if (!['present', 'absent', 'late'].includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      message: 'Status must be one of: present, absent, late'
    });
  }

  // Check if registration exists
  const checkRegistrationSql = 'SELECT id FROM registrations WHERE id = ?';
  db.get(checkRegistrationSql, [registration_id], (err, registration) => {
    if (err) {
      console.error('Error checking registration:', err.message);
      return res.status(500).json({
        error: 'Database error',
        message: err.message
      });
    }

    if (!registration) {
      return res.status(404).json({
        error: 'Registration not found',
        message: `Registration with ID ${registration_id} does not exist`
      });
    }

    // Check if attendance already marked
    const checkAttendanceSql = 'SELECT id FROM attendance WHERE registration_id = ?';
    db.get(checkAttendanceSql, [registration_id], (err, attendance) => {
      if (err) {
        console.error('Error checking attendance:', err.message);
        return res.status(500).json({
          error: 'Database error',
          message: err.message
        });
      }

      if (attendance) {
        return res.status(409).json({
          error: 'Attendance already marked',
          message: 'Attendance for this registration has already been marked'
        });
      }

      // Mark attendance
      const sql = 'INSERT INTO attendance (registration_id, status) VALUES (?, ?)';

      db.run(sql, [registration_id, status], function(err) {
        if (err) {
          console.error('Error marking attendance:', err.message);
          return res.status(500).json({
            error: 'Failed to mark attendance',
            message: err.message
          });
        }

        res.status(201).json({
          message: 'Attendance marked successfully',
          attendance: {
            id: this.lastID,
            registration_id,
            status,
            marked_at: new Date().toISOString()
          }
        });
      });
    });
  });
});

// GET /attendance - List all attendance records
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      a.*,
      r.student_id,
      r.event_id,
      u.name as student_name,
      u.email as student_email,
      e.name as event_name,
      e.date as event_date,
      c.name as college_name
    FROM attendance a
    JOIN registrations r ON a.registration_id = r.id
    JOIN users u ON r.student_id = u.id
    JOIN events e ON r.event_id = e.id
    JOIN colleges c ON u.college_id = c.id
    ORDER BY a.marked_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching attendance:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch attendance',
        message: err.message
      });
    }

    res.json({
      attendance: rows,
      count: rows.length
    });
  });
});

// GET /attendance/:id - Get a specific attendance record
router.get('/:id', (req, res) => {
  const attendanceId = req.params.id;

  const sql = `
    SELECT 
      a.*,
      r.student_id,
      r.event_id,
      u.name as student_name,
      u.email as student_email,
      e.name as event_name,
      e.date as event_date,
      c.name as college_name
    FROM attendance a
    JOIN registrations r ON a.registration_id = r.id
    JOIN users u ON r.student_id = u.id
    JOIN events e ON r.event_id = e.id
    JOIN colleges c ON u.college_id = c.id
    WHERE a.id = ?
  `;

  db.get(sql, [attendanceId], (err, row) => {
    if (err) {
      console.error('Error fetching attendance:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch attendance',
        message: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        error: 'Attendance record not found',
        message: `Attendance record with ID ${attendanceId} does not exist`
      });
    }

    res.json({ attendance: row });
  });
});

// PUT /attendance/:id - Update attendance status
router.put('/:id', (req, res) => {
  const attendanceId = req.params.id;
  const { status } = req.body;

  // Validation
  if (!status) {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'status is required'
    });
  }

  // Validate status
  if (!['present', 'absent', 'late'].includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      message: 'Status must be one of: present, absent, late'
    });
  }

  const sql = 'UPDATE attendance SET status = ? WHERE id = ?';

  db.run(sql, [status, attendanceId], function(err) {
    if (err) {
      console.error('Error updating attendance:', err.message);
      return res.status(500).json({
        error: 'Failed to update attendance',
        message: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: 'Attendance record not found',
        message: `Attendance record with ID ${attendanceId} does not exist`
      });
    }

    res.json({
      message: 'Attendance updated successfully',
      changes: this.changes
    });
  });
});

module.exports = router;
