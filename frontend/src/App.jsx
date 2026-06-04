import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SyncProvider } from './context/SyncContext';

import Splash from './pages/Splash';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChildRegistration from './pages/ChildRegistration';
import ChildList from './pages/ChildList';
import ChildProfile from './pages/ChildProfile';
import GrowthMonitoring from './pages/GrowthMonitoring';
import Attendance from './pages/Attendance';
import VaccinationTracker from './pages/VaccinationTracker';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import ParentNotifications from './pages/ParentNotifications';
import Settings from './pages/Settings';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function AppLayout({ children }) {
  const [user] = useState({ username: 'Demo User', role: 'Anganwadi Worker' });
  
  return (
    <div className="app-container">
      <Sidebar user={user} onLogout={() => window.location.href = '/login'} />
      <div className="main-content">
        <Navbar user={user} />
        <main className="scrollable-area">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <SyncProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={() => window.location.href = '/'} />} />
          
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/register" element={<AppLayout><ChildRegistration /></AppLayout>} />
          <Route path="/children" element={<AppLayout><ChildList /></AppLayout>} />
          <Route path="/child/:id" element={<AppLayout><ChildProfile /></AppLayout>} />
          <Route path="/growth" element={<AppLayout><GrowthMonitoring /></AppLayout>} />
          <Route path="/attendance" element={<AppLayout><Attendance /></AppLayout>} />
          <Route path="/vaccinations" element={<AppLayout><VaccinationTracker /></AppLayout>} />
          <Route path="/alerts" element={<AppLayout><Alerts /></AppLayout>} />
          <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
          <Route path="/notifications" element={<AppLayout><ParentNotifications /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </SyncProvider>
  );
}

export default App;
