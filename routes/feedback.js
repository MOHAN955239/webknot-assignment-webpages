const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /feedback - Submit feedback for an event
router.post('/', (req, res) => {
  const { registration_id, rating, comment } = req.body;

  // Validation
  if (!registration_id || !rating) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'registration_id and rating are required'
    });
  }

  // Validate rating
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return res.status(400).json({
      error: 'Invalid rating',
      message: 'Rating must be an integer between 1 and 5'
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

    // Check if feedback already submitted
    const checkFeedbackSql = 'SELECT id FROM feedback WHERE registration_id = ?';
    db.get(checkFeedbackSql, [registration_id], (err, feedback) => {
      if (err) {
        console.error('Error checking feedback:', err.message);
        return res.status(500).json({
          error: 'Database error',
          message: err.message
        });
      }

      if (feedback) {
        return res.status(409).json({
          error: 'Feedback already submitted',
          message: 'Feedback for this registration has already been submitted'
        });
      }

      // Submit feedback
      const sql = 'INSERT INTO feedback (registration_id, rating, comment) VALUES (?, ?, ?)';

      db.run(sql, [registration_id, rating, comment || null], function(err) {
        if (err) {
          console.error('Error submitting feedback:', err.message);
          return res.status(500).json({
            error: 'Failed to submit feedback',
            message: err.message
          });
        }

        res.status(201).json({
          message: 'Feedback submitted successfully',
          feedback: {
            id: this.lastID,
            registration_id,
            rating,
            comment,
            submitted_at: new Date().toISOString()
          }
        });
      });
    });
  });
});

// GET /feedback - List all feedback
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      f.*,
      r.student_id,
      r.event_id,
      u.name as student_name,
      u.email as student_email,
      e.name as event_name,
      e.date as event_date,
      c.name as college_name
    FROM feedback f
    JOIN registrations r ON f.registration_id = r.id
    JOIN users u ON r.student_id = u.id
    JOIN events e ON r.event_id = e.id
    JOIN colleges c ON u.college_id = c.id
    ORDER BY f.submitted_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching feedback:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch feedback',
        message: err.message
      });
    }

    res.json({
      feedback: rows,
      count: rows.length
    });
  });
});

// GET /feedback/:id - Get a specific feedback
router.get('/:id', (req, res) => {
  const feedbackId = req.params.id;

  const sql = `
    SELECT 
      f.*,
      r.student_id,
      r.event_id,
      u.name as student_name,
      u.email as student_email,
      e.name as event_name,
      e.date as event_date,
      c.name as college_name
    FROM feedback f
    JOIN registrations r ON f.registration_id = r.id
    JOIN users u ON r.student_id = u.id
    JOIN events e ON r.event_id = e.id
    JOIN colleges c ON u.college_id = c.id
    WHERE f.id = ?
  `;

  db.get(sql, [feedbackId], (err, row) => {
    if (err) {
      console.error('Error fetching feedback:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch feedback',
        message: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        error: 'Feedback not found',
        message: `Feedback with ID ${feedbackId} does not exist`
      });
    }

    res.json({ feedback: row });
  });
});

// PUT /feedback/:id - Update feedback
router.put('/:id', (req, res) => {
  const feedbackId = req.params.id;
  const { rating, comment } = req.body;

  // Validation
  if (!rating) {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'rating is required'
    });
  }

  // Validate rating
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return res.status(400).json({
      error: 'Invalid rating',
      message: 'Rating must be an integer between 1 and 5'
    });
  }

  const sql = 'UPDATE feedback SET rating = ?, comment = ? WHERE id = ?';

  db.run(sql, [rating, comment || null, feedbackId], function(err) {
    if (err) {
      console.error('Error updating feedback:', err.message);
      return res.status(500).json({
        error: 'Failed to update feedback',
        message: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: 'Feedback not found',
        message: `Feedback with ID ${feedbackId} does not exist`
      });
    }

    res.json({
      message: 'Feedback updated successfully',
      changes: this.changes
    });
  });
});

module.exports = router;
