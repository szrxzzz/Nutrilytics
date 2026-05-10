# Nutrilytics - Complete Anganwadi Monitoring System

A comprehensive web-based application for Anganwadi Centres to manage child health monitoring, growth tracking, attendance, vaccinations, AI-based risk alerts, and parent notifications.

## Features

- 👶 Child Registration & Profile Management
- 📊 Growth Monitoring with Charts
- ✅ Digital Attendance Tracking
- 💉 Vaccination Schedule Management
- 🤖 AI-Powered Risk Alerts
- 📱 Parent SMS Notifications
- 📈 Reports & Analytics Dashboard
- 🔄 Offline-First Architecture
- 📴 Works without internet connectivity

## Tech Stack

- Frontend: React 18
- UI: Custom CSS
- Charts: Recharts
- Routing: React Router v6
- Local Storage: LocalForage (IndexedDB)
- Backend: Node.js + Express
- State Management: React Context API

## Installation

1. Install dependencies:

```bash
npm install
```

1. Start the application:

For development (runs both frontend and backend):

```bash
npm run dev
```

Or run separately:

Frontend only (port 3000):

```bash
npm start
```

Backend only (port 3001):

```bash
npm run server
```

## Usage

1. Open <http://localhost:3000> in your browser
1. Login with any username/password (demo mode)
1. Choose role: Anganwadi Worker or Supervisor
1. Start managing child health data!

## Default Login

- Username: Any username works
- Password: Any password works
- Role: Choose Worker or Supervisor

## Key Modules

### For Anganwadi Workers

- Register new children
- Record growth measurements (weight, height, MUAC)
- Mark daily attendance
- Update vaccination status
- View AI-generated health alerts
- Send parent notifications via SMS

### For Supervisors

- View dashboard analytics
- Monitor multiple centres
- Track at-risk children
- Generate and download reports
- Centre performance comparison

## Offline Capability

The app uses IndexedDB for local storage and works completely offline:

- All data stored locally first
- Automatic sync when internet returns
- Sync status indicator in navbar
- Queue management for pending updates

## Sample Data

The app comes pre-loaded with:

- 20 sample children
- 3 Anganwadi centres
- Growth records
- Attendance logs
- Vaccination schedules
- AI-generated alerts

## Project Structure

```text
src/
├── components/       # Reusable UI components
├── pages/           # Main application pages
├── context/         # React Context providers
├── data/            # Sample data generator
├── App.js           # Main app component
└── index.js         # Entry point
```

## Features in Detail

### AI Risk Detection

- Growth stagnation detection
- Malnutrition risk scoring
- Vaccination overdue alerts
- Attendance pattern analysis
- Automated recommendations

### Parent Engagement

- SMS notification templates
- Vaccination reminders
- Health check-up alerts
- Attendance concerns
- Custom messages

### Reports & Analytics

- Centre-wise statistics
- Growth trend charts
- Vaccination coverage
- Risk distribution
- Export to CSV/PDF

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Mobile Responsive

Fully responsive design works on:

- Desktop computers
- Tablets
- Mobile phones

## Future Enhancements

- Real SMS gateway integration
- Photo upload for children
- Voice-assisted data entry
- Multi-language support (Hindi, Tamil)
- PWA installation
- Biometric authentication
- Advanced ML models for risk prediction

## License

MIT

## Support

For issues or questions, contact: <contact@nutrilytics.org>

---

Built with ❤️ for India's Anganwadi workers and children
