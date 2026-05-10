import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Activity, CalendarCheck, FileText, LogOut, ShieldAlert, HeartPulse, BellRing, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Child Registration', icon: <UserPlus size={20} />, path: '/register' },
    { name: 'Children', icon: <Users size={20} />, path: '/children' },
    { name: 'Growth Monitoring', icon: <Activity size={20} />, path: '/growth' },
    { name: 'Attendance', icon: <CalendarCheck size={20} />, path: '/attendance' },
    { name: 'Vaccination', icon: <HeartPulse size={20} />, path: '/vaccinations' },
    { name: 'AI Alerts', icon: <ShieldAlert size={20} />, path: '/alerts' },
    { name: 'Parent Notifications', icon: <BellRing size={20} />, path: '/notifications' },
    { name: 'Reports', icon: <FileText size={20} />, path: '/reports' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Activity className="sidebar-logo-icon pulse-animation" />
        </div>
        <div>
          <h1 className="sidebar-title">Nutrilytics</h1>
          <p className="sidebar-subtitle">Smart Health Command</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-text">{item.name}</span>
            {item.name === 'AI Alerts' && <span className="sidebar-badge-alert">3</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="user-info">
            <p className="user-name">{user?.username || 'Worker'}</p>
            <p className="poshan-badge badge-info user-role">{user?.role || 'Anganwadi Worker'}</p>
          </div>
        </div>
        <button onClick={onLogout} className="logout-btn">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
