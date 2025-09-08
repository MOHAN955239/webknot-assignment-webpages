const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testEvent = {
  name: 'Test Event',
  type: 'Test',
  date: '2024-12-31 12:00:00',
  college_id: 1,
  description: 'This is a test event'
};

const testStudent = {
  name: 'Test Student',
  email: 'test.student@test.edu',
  college_id: 1
};

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test 2: Create event
    console.log('\n2. Testing event creation...');
    const eventResponse = await axios.post(`${BASE_URL}/events`, testEvent);
    console.log('✅ Event created:', eventResponse.data.event.name);
    const eventId = eventResponse.data.event.id;

    // Test 3: Get events
    console.log('\n3. Testing get all events...');
    const eventsResponse = await axios.get(`${BASE_URL}/events`);
    console.log('✅ Events retrieved:', eventsResponse.data.count, 'events');

    // Test 4: Create student
    console.log('\n4. Testing student creation...');
    const studentResponse = await axios.post(`${BASE_URL}/students`, testStudent);
    console.log('✅ Student created:', studentResponse.data.student.name);
    const studentId = studentResponse.data.student.id;

    // Test 5: Register student for event
    console.log('\n5. Testing student registration...');
    const registrationResponse = await axios.post(`${BASE_URL}/register`, {
      student_id: studentId,
      event_id: eventId
    });
    console.log('✅ Student registered for event');
    const registrationId = registrationResponse.data.registration.id;

    // Test 6: Mark attendance
    console.log('\n6. Testing attendance marking...');
    const attendanceResponse = await axios.post(`${BASE_URL}/attendance`, {
      registration_id: registrationId,
      status: 'present'
    });
    console.log('✅ Attendance marked:', attendanceResponse.data.attendance.status);

    // Test 7: Submit feedback
    console.log('\n7. Testing feedback submission...');
    const feedbackResponse = await axios.post(`${BASE_URL}/feedback`, {
      registration_id: registrationId,
      rating: 5,
      comment: 'Great test event!'
    });
    console.log('✅ Feedback submitted:', feedbackResponse.data.feedback.rating, 'stars');

    // Test 8: Test reports
    console.log('\n8. Testing reports...');
    
    const reports = [
      'event-registrations',
      'attendance',
      'feedback',
      'popular-events',
      'student-participation',
      'top-students',
      'college-stats'
    ];

    for (const report of reports) {
      try {
        const reportResponse = await axios.get(`${BASE_URL}/reports/${report}`);
        console.log(`✅ ${report} report:`, reportResponse.data.count, 'records');
      } catch (error) {
        console.log(`❌ ${report} report failed:`, error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
