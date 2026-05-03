import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChildRegistration from './pages/ChildRegistration';
import ChildList from './pages/ChildList';
import ChildProfile from './pages/ChildProfile';
import GrowthMonitoring from './pages/GrowthMonitoring';
import Attendance from './pages/Attendance';
import VaccinationTracker from './pages/VaccinationTracker';
import AIAlerts from './pages/AIAlerts';
import ParentNotifications from './pages/ParentNotifications';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/register-child" element={<PrivateRoute><ChildRegistration /></PrivateRoute>} />
            <Route path="/children" element={<PrivateRoute><ChildList /></PrivateRoute>} />
            <Route path="/child/:id" element={<PrivateRoute><ChildProfile /></PrivateRoute>} />
            <Route path="/growth/:id" element={<PrivateRoute><GrowthMonitoring /></PrivateRoute>} />
            <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
            <Route path="/vaccinations" element={<PrivateRoute><VaccinationTracker /></PrivateRoute>} />
            <Route path="/alerts" element={<PrivateRoute><AIAlerts /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><ParentNotifications /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
