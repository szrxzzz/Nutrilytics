# Nutrilytics - Smart Child Health Monitoring System

A comprehensive web-based application for Anganwadi Centres to manage child registration, growth monitoring, attendance, vaccination tracking, AI-based risk alerts, and parent notifications.

## 🌟 Features

### Core Modules

- **Child Registration** - Digital enrollment with complete health profiles
- **Growth Monitoring** - Track weight, height, MUAC with AI-powered risk detection
- **Attendance Tracking** - Daily attendance with pattern analysis
- **Vaccination Tracker** - Complete immunization schedule management
- **AI Alerts** - Intelligent early warning system for health risks
- **Parent Notifications** - Automated SMS alerts and reminders
- **Reports & Analytics** - Comprehensive dashboards and data exports
- **Offline-First** - Works without internet, syncs when online

### User Roles

- **Anganwadi Worker** - Register children, update records, mark attendance, send notifications
- **Supervisor/Admin** - View analytics, monitor centres, track at-risk children, download reports

## 🚀 Quick Start

### Prerequisites

- **Node.js (v14 or higher)**
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

1. Start the backend server:

```bash
node server.js
```
Backend runs on `http://localhost:3001`

1. Start the React frontend (in a new terminal):

```bash
npm start
```
Frontend runs on `http://localhost:3000`

1. Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage

### Login

- Use any username/password to login (demo mode)
- Select role: Anganwadi Worker or Supervisor
- Click "Continue as Demo" for quick access

### Demo Credentials

- Username: `demo`
- Password: `demo`
- Role: Any

## 📱 Application Flow

1. **Splash Screen** - Animated intro (3 seconds)
2. **Login Page** - Split-screen design with features showcase
3. **Dashboard** - Overview with stats, charts, and quick actions
4. **Child Management** - Register, view, and update child records
5. **Health Monitoring** - Track growth, attendance, vaccinations
6. **AI Alerts** - View and manage risk alerts
7. **Notifications** - Send SMS alerts to parents
8. **Reports** - Generate and export analytics

## 🏗️ Project Structure

```text
nutrilytics/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   └── StatCard.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── DataContext.js
│   ├── data/
│   │   └── sampleData.js
│   ├── pages/
│   │   ├── Splash.js
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── ChildRegistration.js
│   │   ├── ChildList.js
│   │   ├── ChildProfile.js
│   │   ├── GrowthMonitoring.js
│   │   ├── Attendance.js
│   │   ├── VaccinationTracker.js
│   │   ├── AIAlerts.js
│   │   ├── ParentNotifications.js
│   │   ├── Reports.js
│   │   └── Settings.js
│   ├── App.js
│   └── index.js
├── server.js
├── package.json
└── README.md
```

## 🎨 Design Features

- **Animated Splash Screen** - Professional intro with floating health icons
- **Split-Screen Login** - Desktop-first design with feature highlights
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Interactive Charts** - Growth trends, vaccination coverage, risk distribution
- **Real-time Stats** - Live dashboard with key metrics
- **Offline Support** - Local storage with sync capabilities

## 🔧 Technology Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **Charts**: Recharts
- **Styling**: Custom CSS with animations
- **Backend**: Node.js + Express
- **Storage**: In-memory (demo) / IndexedDB (offline)
- **State Management**: React Context API

## 📊 Sample Data

The application includes realistic sample data:

- 20 children across 3 Anganwadi centres
- Growth records (6 months per child)
- Attendance logs (30 days)
- Vaccination schedules
- AI-generated alerts
- Parent contact information

## 🤖 AI Features

### Risk Detection

- Growth stagnation detection
- Underweight trend identification
- MUAC threshold monitoring
- Vaccination overdue alerts
- Attendance pattern analysis

### Alert Severity Levels

- 🟢 **Low** - Monitor
- 🟡 **Medium** - Action needed
- 🔴 **High** - Urgent attention required

## 📱 Parent Notifications

Automated SMS templates for:

- Vaccination reminders
- Growth check-up alerts
- Attendance concerns
- Follow-up appointments
- Nutrition counseling

## 📈 Reports & Analytics

- Centre-wise performance
- Child health trends
- Vaccination completion rates
- Attendance statistics
- Risk distribution
- Export to CSV/PDF

## 🌐 Offline-First Architecture

- Local data storage using IndexedDB
- Queue unsynced records
- Auto-sync when online
- Sync status indicators
- Works in low-connectivity areas

## 🎯 Future Enhancements

- [ ] Real SMS/WhatsApp integration
- [ ] Multi-language support (Tamil, Hindi, etc.)
- [ ] Voice-assisted data entry
- [ ] PWA installation
- [ ] Real-time collaboration
- [ ] Advanced ML models
- [ ] Photo-based growth tracking
- [ ] Integration with government systems

## 📝 License

MIT License - Built for social impact and rural health innovation

## 🤝 Contributing

This is a demo/prototype application. For production use:

1. Replace in-memory storage with a real database (PostgreSQL/MongoDB)
2. Implement proper authentication and authorization
3. Add SMS gateway integration
4. Implement data encryption
5. Add comprehensive error handling
6. Set up proper logging and monitoring

## 📞 Support

For questions or issues, please contact the development team.

---

### Built with ❤️ for India's children and Anganwadi workers
