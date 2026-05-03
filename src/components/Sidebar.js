import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/register-child', icon: '➕', label: 'Register Child' },
    { path: '/children', icon: '👶', label: 'Children List' },
    { path: '/attendance', icon: '✅', label: 'Attendance' },
    { path: '/vaccinations', icon: '💉', label: 'Vaccinations' },
    { path: '/alerts', icon: '🚨', label: 'AI Alerts' },
    { path: '/notifications', icon: '📱', label: 'Notifications' },
    { path: '/reports', icon: '📈', label: 'Reports' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
