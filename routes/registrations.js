const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireStudent } = require('../middleware/auth');

// POST /register - Register a student for an event (Student only)
router.post('/', authenticateToken, requireStudent, (req, res) => {
  const { event_id } = req.body;
  const student_id = req.user.id;

  // Validation
  if (!event_id) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'event_id is required'
    });
  }

  // Check if event exists
  const checkEventSql = 'SELECT id FROM events WHERE id = ?';
  db.get(checkEventSql, [event_id], (err, event) => {
    if (err) {
      console.error('Error checking event:', err.message);
      return res.status(500).json({
        error: 'Database error',
        message: err.message
      });
    }

    if (!event) {
      return res.status(404).json({
        error: 'Event not found',
        message: `Event with ID ${event_id} does not exist`
      });
    }

    // Check if already registered
    const checkRegistrationSql = 'SELECT id FROM registrations WHERE student_id = ? AND event_id = ?';
    db.get(checkRegistrationSql, [student_id, event_id], (err, registration) => {
      if (err) {
        console.error('Error checking registration:', err.message);
        return res.status(500).json({
          error: 'Database error',
          message: err.message
        });
      }

      if (registration) {
        return res.status(409).json({
          error: 'Already registered',
          message: 'Student is already registered for this event'
        });
      }

      // Register student for event
      const sql = 'INSERT INTO registrations (student_id, event_id) VALUES (?, ?)';

      db.run(sql, [student_id, event_id], function(err) {
        if (err) {
          console.error('Error registering student:', err.message);
          return res.status(500).json({
            error: 'Failed to register student',
            message: err.message
          });
        }

        res.status(201).json({
          message: 'Student registered successfully',
          registration: {
            id: this.lastID,
            student_id,
            event_id,
            registered_at: new Date().toISOString()
          }
        });
      });
    });
  });
});

// GET /register - List all registrations
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      r.*,
      u.name as student_name,
      u.email as student_email,
      e.name as event_name,
      e.date as event_date,
      c.name as college_name
    FROM registrations r
    JOIN users u ON r.student_id = u.id
    JOIN events e ON r.event_id = e.id
    JOIN colleges c ON u.college_id = c.id
    ORDER BY r.registered_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching registrations:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch registrations',
        message: err.message
      });
    }

    res.json({
      registrations: rows,
      count: rows.length
    });
  });
});

// GET /register/:id - Get a specific registration
router.get('/:id', (req, res) => {
  const registrationId = req.params.id;

  const sql = `
    SELECT 
      r.*,
      u.name as student_name,
      u.email as student_email,
      e.name as event_name,
      e.date as event_date,
      c.name as college_name
    FROM registrations r
    JOIN users u ON r.student_id = u.id
    JOIN events e ON r.event_id = e.id
    JOIN colleges c ON u.college_id = c.id
    WHERE r.id = ?
  `;

  db.get(sql, [registrationId], (err, row) => {
    if (err) {
      console.error('Error fetching registration:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch registration',
        message: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        error: 'Registration not found',
        message: `Registration with ID ${registrationId} does not exist`
      });
    }

    res.json({ registration: row });
  });
});

// DELETE /register/:id - Cancel a registration
router.delete('/:id', (req, res) => {
  const registrationId = req.params.id;

  const sql = 'DELETE FROM registrations WHERE id = ?';

  db.run(sql, [registrationId], function(err) {
    if (err) {
      console.error('Error deleting registration:', err.message);
      return res.status(500).json({
        error: 'Failed to delete registration',
        message: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: 'Registration not found',
        message: `Registration with ID ${registrationId} does not exist`
      });
    }

    res.json({
      message: 'Registration cancelled successfully',
      changes: this.changes
    });
  });
});

module.exports = router;
