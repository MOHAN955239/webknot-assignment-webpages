const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// POST /events - Create a new event (Admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, type, date, college_id, description } = req.body;

  // Validation
  if (!name || !type || !date || !college_id) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Name, type, date, and college_id are required'
    });
  }

  const sql = `
    INSERT INTO events (name, type, date, college_id, created_by, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, type, date, college_id, req.user.id, description], function(err) {
    if (err) {
      console.error('Error creating event:', err.message);
      return res.status(500).json({
        error: 'Failed to create event',
        message: err.message
      });
    }

    res.status(201).json({
      message: 'Event created successfully',
      event: {
        id: this.lastID,
        name,
        type,
        date,
        college_id,
        created_by: req.user.id,
        description
      }
    });
  });
});

// GET /events - List all events (Public for browsing)
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      e.*,
      c.name as college_name,
      u.name as created_by_name
    FROM events e
    JOIN colleges c ON e.college_id = c.id
    JOIN users u ON e.created_by = u.id
    ORDER BY e.date DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching events:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch events',
        message: err.message
      });
    }

    res.json({
      events: rows,
      count: rows.length
    });
  });
});

// GET /events/:id - Get a specific event
router.get('/:id', (req, res) => {
  const eventId = req.params.id;

  const sql = `
    SELECT 
      e.*,
      c.name as college_name
    FROM events e
    JOIN colleges c ON e.college_id = c.id
    WHERE e.id = ?
  `;

  db.get(sql, [eventId], (err, row) => {
    if (err) {
      console.error('Error fetching event:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch event',
        message: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        error: 'Event not found',
        message: `Event with ID ${eventId} does not exist`
      });
    }

    res.json({ event: row });
  });
});

// PUT /events/:id - Update an event
router.put('/:id', (req, res) => {
  const eventId = req.params.id;
  const { name, type, date, college_id, description } = req.body;

  const sql = `
    UPDATE events 
    SET name = ?, type = ?, date = ?, college_id = ?, description = ?
    WHERE id = ?
  `;

  db.run(sql, [name, type, date, college_id, description, eventId], function(err) {
    if (err) {
      console.error('Error updating event:', err.message);
      return res.status(500).json({
        error: 'Failed to update event',
        message: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: 'Event not found',
        message: `Event with ID ${eventId} does not exist`
      });
    }

    res.json({
      message: 'Event updated successfully',
      changes: this.changes
    });
  });
});

// DELETE /events/:id - Delete an event
router.delete('/:id', (req, res) => {
  const eventId = req.params.id;

  const sql = 'DELETE FROM events WHERE id = ?';

  db.run(sql, [eventId], function(err) {
    if (err) {
      console.error('Error deleting event:', err.message);
      return res.status(500).json({
        error: 'Failed to delete event',
        message: err.message
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: 'Event not found',
        message: `Event with ID ${eventId} does not exist`
      });
    }

    res.json({
      message: 'Event deleted successfully',
      changes: this.changes
    });
  });
});

module.exports = router;
