const db = require('../config/database');
const bcrypt = require('bcryptjs');

const seedData = () => {
  return new Promise(async (resolve, reject) => {
    console.log('Starting to seed database...');
    
    try {
      // Insert colleges first
      const colleges = [
        'MIT',
        'Stanford University', 
        'Harvard University',
        'University of California'
      ];

      for (const name of colleges) {
        await new Promise((resolve, reject) => {
          db.run('INSERT OR IGNORE INTO colleges (name) VALUES (?)', [name], function(err) {
            if (err) {
              console.error('Error inserting college:', err.message);
              reject(err);
            } else {
              console.log(`Inserted college: ${name}`);
              resolve();
            }
          });
        });
      }

      // Insert users (admins and students)
      const users = [
        {
          name: 'Admin User',
          email: 'admin@campus.edu',
          password: await bcrypt.hash('admin123', 10),
          role: 'admin',
          college_id: 1
        },
        {
          name: 'John Doe',
          email: 'john.doe@mit.edu',
          password: await bcrypt.hash('student123', 10),
          role: 'student',
          college_id: 1
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@stanford.edu',
          password: await bcrypt.hash('student123', 10),
          role: 'student',
          college_id: 2
        },
        {
          name: 'Mike Johnson',
          email: 'mike.johnson@harvard.edu',
          password: await bcrypt.hash('student123', 10),
          role: 'student',
          college_id: 3
        },
        {
          name: 'Sarah Wilson',
          email: 'sarah.wilson@uc.edu',
          password: await bcrypt.hash('student123', 10),
          role: 'student',
          college_id: 4
        },
        {
          name: 'David Brown',
          email: 'david.brown@mit.edu',
          password: await bcrypt.hash('student123', 10),
          role: 'student',
          college_id: 1
        },
        {
          name: 'Lisa Davis',
          email: 'lisa.davis@stanford.edu',
          password: await bcrypt.hash('student123', 10),
          role: 'student',
          college_id: 2
        }
      ];

      for (const user of users) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT OR IGNORE INTO users (name, email, password, role, college_id) VALUES (?, ?, ?, ?, ?)',
            [user.name, user.email, user.password, user.role, user.college_id],
            function(err) {
              if (err) {
                console.error('Error inserting user:', err.message);
                reject(err);
              } else {
                console.log(`Inserted user: ${user.name} (${user.role})`);
                resolve();
              }
            }
          );
        });
      }

      // Insert events
      const events = [
        {
          name: 'Tech Conference 2024',
          type: 'Conference',
          date: '2024-03-15 09:00:00',
          college_id: 1,
          created_by: 1,
          description: 'Annual technology conference featuring latest innovations'
        },
        {
          name: 'Hackathon Spring',
          type: 'Competition',
          date: '2024-04-20 10:00:00',
          college_id: 2,
          created_by: 1,
          description: '48-hour coding competition for students'
        },
        {
          name: 'Career Fair',
          type: 'Career',
          date: '2024-05-10 11:00:00',
          college_id: 3,
          created_by: 1,
          description: 'Meet with top companies and explore career opportunities'
        },
        {
          name: 'Cultural Festival',
          type: 'Cultural',
          date: '2024-06-05 14:00:00',
          college_id: 4,
          created_by: 1,
          description: 'Celebrate diversity with food, music, and performances'
        },
        {
          name: 'AI Workshop',
          type: 'Workshop',
          date: '2024-07-12 13:00:00',
          college_id: 1,
          created_by: 1,
          description: 'Hands-on workshop on artificial intelligence and machine learning'
        }
      ];

      for (const event of events) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT OR IGNORE INTO events (name, type, date, college_id, created_by, description) VALUES (?, ?, ?, ?, ?, ?)',
            [event.name, event.type, event.date, event.college_id, event.created_by, event.description],
            function(err) {
              if (err) {
                console.error('Error inserting event:', err.message);
                reject(err);
              } else {
                console.log(`Inserted event: ${event.name}`);
                resolve();
              }
            }
          );
        });
      }

      // Insert sample registrations
      const registrations = [
        { student_id: 2, event_id: 1 },
        { student_id: 3, event_id: 1 },
        { student_id: 4, event_id: 1 },
        { student_id: 2, event_id: 2 },
        { student_id: 5, event_id: 2 },
        { student_id: 6, event_id: 2 },
        { student_id: 3, event_id: 3 },
        { student_id: 4, event_id: 3 },
        { student_id: 7, event_id: 3 },
        { student_id: 5, event_id: 4 },
        { student_id: 6, event_id: 4 },
        { student_id: 7, event_id: 4 },
        { student_id: 2, event_id: 5 },
        { student_id: 4, event_id: 5 },
        { student_id: 6, event_id: 5 }
      ];

      for (const registration of registrations) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT OR IGNORE INTO registrations (student_id, event_id) VALUES (?, ?)',
            [registration.student_id, registration.event_id],
            function(err) {
              if (err) {
                console.error('Error inserting registration:', err.message);
                reject(err);
              } else {
                console.log(`Inserted registration: Student ${registration.student_id} -> Event ${registration.event_id}`);
                resolve();
              }
            }
          );
        });
      }

      // Insert sample attendance
      const attendance = [
        { registration_id: 1, status: 'present' },
        { registration_id: 2, status: 'present' },
        { registration_id: 3, status: 'late' },
        { registration_id: 4, status: 'present' },
        { registration_id: 5, status: 'absent' },
        { registration_id: 6, status: 'present' },
        { registration_id: 7, status: 'present' },
        { registration_id: 8, status: 'present' },
        { registration_id: 9, status: 'late' },
        { registration_id: 10, status: 'present' },
        { registration_id: 11, status: 'present' },
        { registration_id: 12, status: 'absent' },
        { registration_id: 13, status: 'present' },
        { registration_id: 14, status: 'present' },
        { registration_id: 15, status: 'present' }
      ];

      for (const att of attendance) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT OR IGNORE INTO attendance (registration_id, status) VALUES (?, ?)',
            [att.registration_id, att.status],
            function(err) {
              if (err) {
                console.error('Error inserting attendance:', err.message);
                reject(err);
              } else {
                console.log(`Inserted attendance: Registration ${att.registration_id} -> ${att.status}`);
                resolve();
              }
            }
          );
        });
      }

      // Insert sample feedback
      const feedback = [
        { registration_id: 1, rating: 5, comment: 'Excellent conference!' },
        { registration_id: 2, rating: 4, comment: 'Great speakers and content' },
        { registration_id: 3, rating: 3, comment: 'Good but could be better organized' },
        { registration_id: 4, rating: 5, comment: 'Amazing hackathon experience' },
        { registration_id: 5, rating: 2, comment: 'Could not attend due to technical issues' },
        { registration_id: 6, rating: 4, comment: 'Well organized event' },
        { registration_id: 7, rating: 5, comment: 'Found great internship opportunities' },
        { registration_id: 8, rating: 4, comment: 'Good networking event' },
        { registration_id: 9, rating: 3, comment: 'Average experience' },
        { registration_id: 10, rating: 5, comment: 'Fantastic cultural celebration' },
        { registration_id: 11, rating: 4, comment: 'Enjoyed the performances' },
        { registration_id: 12, rating: 1, comment: 'Could not attend' },
        { registration_id: 13, rating: 5, comment: 'Learned a lot about AI' },
        { registration_id: 14, rating: 4, comment: 'Good workshop content' },
        { registration_id: 15, rating: 5, comment: 'Excellent hands-on experience' }
      ];

      for (const fb of feedback) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT OR IGNORE INTO feedback (registration_id, rating, comment) VALUES (?, ?, ?)',
            [fb.registration_id, fb.rating, fb.comment],
            function(err) {
              if (err) {
                console.error('Error inserting feedback:', err.message);
                reject(err);
              } else {
                console.log(`Inserted feedback: Registration ${fb.registration_id} -> ${fb.rating} stars`);
                resolve();
              }
            }
          );
        });
      }

      console.log('Sample data inserted successfully');
      resolve();
    } catch (error) {
      console.error('Error seeding database:', error);
      reject(error);
    }
  });
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Database seeded successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error seeding database:', err);
      process.exit(1);
    });
}

module.exports = { seedData };