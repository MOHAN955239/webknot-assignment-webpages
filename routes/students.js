const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /students - Create a new student
router.post('/', (req, res) => {
  const { name, email, college_id } = req.body;

  // Validation
  if (!name || !email || !college_id) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Name, email, and college_id are required'
    });
  }

  // Check if email already exists
  const checkEmailSql = 'SELECT id FROM students WHERE email = ?';
  
  db.get(checkEmailSql, [email], (err, row) => {
    if (err) {
      console.error('Error checking email:', err.message);
      return res.status(500).json({
        error: 'Database error',
        message: err.message
      });
    }

    if (row) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'A student with this email already exists'
      });
    }

    // Insert new student
    const sql = 'INSERT INTO students (name, email, college_id) VALUES (?, ?, ?)';

    db.run(sql, [name, email, college_id], function(err) {
      if (err) {
        console.error('Error creating student:', err.message);
        return res.status(500).json({
          error: 'Failed to create student',
          message: err.message
        });
      }

      res.status(201).json({
        message: 'Student created successfully',
        student: {
          id: this.lastID,
          name,
          email,
          college_id
        }
      });
    });
  });
});

// GET /students - List all students
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      s.*,
      c.name as college_name
    FROM students s
    JOIN colleges c ON s.college_id = c.id
    ORDER BY s.name
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching students:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch students',
        message: err.message
      });
    }

    res.json({
      students: rows,
      count: rows.length
    });
  });
});

// GET /students/:id - Get a specific student
router.get('/:id', (req, res) => {
  const studentId = req.params.id;

  const sql = `
    SELECT 
      s.*,
      c.name as college_name
    FROM students s
    JOIN colleges c ON s.college_id = c.id
    WHERE s.id = ?
  `;

  db.get(sql, [studentId], (err, row) => {
    if (err) {
      console.error('Error fetching student:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch student',
        message: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        error: 'Student not found',
        message: `Student with ID ${studentId} does not exist`
      });
    }

    res.json({ student: row });
  });
});

// GET /students/:id/events - Get events registered by a student
router.get('/:id/events', (req, res) => {
  const studentId = req.params.id;

  const sql = `
    SELECT 
      e.*,
      c.name as college_name,
      r.registered_at
    FROM events e
    JOIN colleges c ON e.college_id = c.id
    JOIN registrations r ON e.id = r.event_id
    WHERE r.student_id = ?
    ORDER BY e.date DESC
  `;

  db.all(sql, [studentId], (err, rows) => {
    if (err) {
      console.error('Error fetching student events:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch student events',
        message: err.message
      });
    }

    res.json({
      student_id: studentId,
      events: rows,
      count: rows.length
    });
  });
});

module.exports = router;
