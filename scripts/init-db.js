const db = require('../config/database');

// Database initialization script
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create Users table (for authentication)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
          college_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (college_id) REFERENCES colleges (id)
        )
      `);

      // Create Colleges table
      db.run(`
        CREATE TABLE IF NOT EXISTS colleges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Events table
      db.run(`
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          date DATETIME NOT NULL,
          college_id INTEGER NOT NULL,
          created_by INTEGER NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (college_id) REFERENCES colleges (id),
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Create Registrations table
      db.run(`
        CREATE TABLE IF NOT EXISTS registrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          event_id INTEGER NOT NULL,
          registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES users (id),
          FOREIGN KEY (event_id) REFERENCES events (id),
          UNIQUE(student_id, event_id)
        )
      `);

      // Create Attendance table
      db.run(`
        CREATE TABLE IF NOT EXISTS attendance (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          registration_id INTEGER NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
          marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (registration_id) REFERENCES registrations (id)
        )
      `);

      // Create Feedback table
      db.run(`
        CREATE TABLE IF NOT EXISTS feedback (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          registration_id INTEGER NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (registration_id) REFERENCES registrations (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tables:', err.message);
          reject(err);
        } else {
          console.log('Database tables created successfully');
          resolve();
        }
      });
    });
  });
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database initialization completed successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error initializing database:', err);
      process.exit(1);
    });
}

module.exports = { initDatabase };
