# webknot-assignment-webpages
webknot-assignment-webpage
 Campus Event Management Platform

A comprehensive, role-based event management system with **dark theme** designed for educational institutions. Features separate interfaces for administrators and students with JWT authentication, real-time data management, and beautiful UI components.

## 🌟 Features

### 🔐 Authentication & Security
- **JWT-based authentication** with role-based access control
- **Secure password hashing** using bcryptjs
- **Role separation**: Admin and Student portals
- **Session management** with token expiration

### 👨‍💼 Admin Portal (`admin-portal.html`)
- **Dark theme dashboard** with modern glass-morphism design
- **Event Management**: Create, view, and manage campus events
- **Registration Tracking**: Monitor student registrations
- **Attendance Management**: Track attendance with status (Present/Absent/Late)
- **Feedback Analytics**: View student ratings and comments
- **Comprehensive Reports**: 
  - Event popularity rankings
  - Attendance percentage reports
  - Feedback analysis
  - Top performing students
  - College statistics

### 🎓 Student App (`student-app.html`)
- **Mobile-responsive design** with dark theme
- **Event Discovery**: Browse available campus events
- **Easy Registration**: One-click event registration
- **Check-in System**: Mark attendance at events
- **Feedback Submission**: Rate events (1-5 stars) with comments
- **Real-time Status**: See registration, attendance, and feedback status

### 📊 Database & API
- **SQLite database** with comprehensive schema
- **RESTful API** with proper error handling
- **Role-based endpoints** with middleware protection
- **Data validation** and foreign key constraints

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   ```bash
   npm run init-db
   ```

3. **Seed Sample Data**
   ```bash
   npm run seed
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

5. **Access Applications**
   - **Admin Portal**: Open `admin-portal.html` in your browser
   - **Student App**: Open `student-app.html` in your browser

## 🔑 Demo Credentials

### Admin Access
- **Email**: `admin@campus.edu`
- **Password**: `admin123`
- **Access**: Full administrative control

### Student Access
- **Email**: `john.doe@mit.edu`
- **Password**: `student123`
- **Access**: Student features (registration, check-in, feedback)

### Additional Test Users
- `jane.smith@stanford.edu` / `student123`
- `mike.johnson@harvard.edu` / `student123`
- `sarah.wilson@uc.edu` / `student123`

## 🗄️ Database Schema

### Core Tables
- **users**: Authentication and user management
- **colleges**: Institution information
- **events**: Campus events and activities
- **registrations**: Student event registrations
- **attendance**: Attendance tracking
- **feedback**: Student ratings and comments

### Key Relationships
- Users belong to colleges
- Events are created by admins and belong to colleges
- Registrations link students to events
- Attendance and feedback are linked to registrations

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Events (Public)
- `GET /events` - List all events

### Events (Admin Only)
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Student Actions
- `POST /register` - Register for event
- `POST /attendance` - Mark attendance
- `POST /feedback` - Submit feedback

### Reports (Admin Only)
- `GET /reports/event-registrations` - Registration counts
- `GET /reports/attendance` - Attendance percentages
- `GET /reports/feedback` - Average ratings
- `GET /reports/popular-events` - Most popular events
- `GET /reports/top-students` - Most active students

## 🎨 UI/UX Features

### Dark Theme Design
- **Modern gradient backgrounds** with glass-morphism effects
- **Consistent color scheme** with blue/purple gradients
- **Smooth animations** and hover effects
- **Responsive design** for all screen sizes

### User Experience
- **Intuitive navigation** with clear role separation
- **Real-time feedback** with success/error messages
- **Loading states** and progress indicators
- **Modal dialogs** for complex interactions

### Data Visualization
- **Clean table layouts** with proper spacing
- **Status indicators** with color coding
- **Rating displays** with star ratings
- **Card-based layouts** for better readability

## 📱 Mobile Responsiveness

Both applications are fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Adapted layouts
- **Mobile**: Touch-friendly interface

## 🔧 Technical Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database
- **JWT** authentication
- **bcryptjs** password hashing
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with hooks
- **Tailwind CSS** for styling
- **Font Awesome** icons
- **Google Fonts** (Inter)
- **Babel** for JSX compilation

### Development Tools
- **Nodemon** for auto-restart
- **Axios** for API testing
- **ESLint** ready structure

## 📊 Sample Data

The platform comes pre-loaded with:
- **4 Colleges**: MIT, Stanford, Harvard, UC
- **7 Users**: 1 admin + 6 students
- **5 Events**: Various types (Conference, Workshop, Competition, etc.)
- **15 Registrations**: Students registered for different events
- **15 Attendance Records**: Mix of present, absent, and late
- **15 Feedback Entries**: Ratings and comments

## 🚨 Error Handling

- **Comprehensive validation** on all inputs
- **Proper HTTP status codes** (400, 401, 403, 404, 500)
- **User-friendly error messages**
- **Network error handling**
- **Database constraint validation**

## 🔒 Security Features

- **Password hashing** with salt rounds
- **JWT token expiration** (24 hours)
- **Role-based access control**
- **Input sanitization**
- **SQL injection prevention**

## 📈 Performance Optimizations

- **Database indexes** on frequently queried columns
- **Efficient SQL queries** with proper joins
- **Lazy loading** for large datasets
- **Optimized React rendering**

## 🧪 Testing

### Manual Testing
- Use the demo credentials to test both portals
- Try different user roles and permissions
- Test error scenarios (invalid login, duplicate registration)

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campus.edu","password":"admin123"}'

# Test event listing
curl http://localhost:3000/events
```

## 🎯 Use Cases

### Educational Institutions
- **Event Management**: Organize campus events efficiently
- **Student Engagement**: Track participation and feedback
- **Analytics**: Generate reports for administration
- **Communication**: Streamline event registration process

### Event Organizers
- **Registration Management**: Handle event sign-ups
- **Attendance Tracking**: Monitor actual participation
- **Feedback Collection**: Gather student insights
- **Performance Metrics**: Measure event success

## 🔮 Future Enhancements

- **Email notifications** for event updates
- **Calendar integration** with Google Calendar
- **QR code check-in** system
- **Mobile app** development
- **Advanced analytics** dashboard
- **Multi-language support**

## 📄 License

This project is licensed under the MIT License - see the package.json file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For issues or questions:
1. Check the demo credentials
2. Verify the server is running on port 3000
3. Check browser console for errors
4. Review the API documentation above

---

**Built with ❤️ for campus event management**

*Experience the future of event management with our dark-themed, role-based platform!*
