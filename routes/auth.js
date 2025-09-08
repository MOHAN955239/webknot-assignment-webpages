const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generateToken, hashPassword, comparePassword } = require('../middleware/auth');

// POST /auth/signup - User registration
router.post('/signup', async (req, res) => {
  const { name, email, password, role, college_id } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Name, email, password, and role are required'
    });
  }

  if (!['admin', 'student'].includes(role)) {
    return res.status(400).json({
      error: 'Invalid role',
      message: 'Role must be either "admin" or "student"'
    });
  }

  // Check if email already exists
  const checkEmailSql = 'SELECT id FROM users WHERE email = ?';
  
  db.get(checkEmailSql, [email], async (err, row) => {
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
        message: 'A user with this email already exists'
      });
    }

    try {
      // Hash password
      const hashedPassword = await hashPassword(password);

      // Insert new user
      const sql = 'INSERT INTO users (name, email, password, role, college_id) VALUES (?, ?, ?, ?, ?)';

      db.run(sql, [name, email, hashedPassword, role, college_id || null], function(err) {
        if (err) {
          console.error('Error creating user:', err.message);
          return res.status(500).json({
            error: 'Failed to create user',
            message: err.message
          });
        }

        // Generate token
        const token = generateToken({
          id: this.lastID,
          email,
          role,
          college_id: college_id || null
        });

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: {
            id: this.lastID,
            name,
            email,
            role,
            college_id: college_id || null
          }
        });
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      return res.status(500).json({
        error: 'Server error',
        message: 'Failed to process registration'
      });
    }
  });
});

// POST /auth/login - User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Email and password are required'
    });
  }

  // Find user by email
  const sql = 'SELECT * FROM users WHERE email = ?';
  
  db.get(sql, [email], async (err, user) => {
    if (err) {
      console.error('Error finding user:', err.message);
      return res.status(500).json({
        error: 'Database error',
        message: err.message
      });
    }

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    try {
      // Compare password
      const isValidPassword = await comparePassword(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        college_id: user.college_id
      });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          college_id: user.college_id
        }
      });
    } catch (error) {
      console.error('Error comparing password:', error);
      return res.status(500).json({
        error: 'Server error',
        message: 'Failed to process login'
      });
    }
  });
});

// GET /auth/me - Get current user info
router.get('/me', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      error: 'No token provided'
    });
  }

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'campus-events-secret-key-2024';

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token'
      });
    }

    const sql = 'SELECT id, name, email, role, college_id, created_at FROM users WHERE id = ?';
    
    db.get(sql, [decoded.id], (err, user) => {
      if (err) {
        console.error('Error fetching user:', err.message);
        return res.status(500).json({
          error: 'Database error',
          message: err.message
        });
      }

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json({ user });
    });
  });
});

module.exports = router;
