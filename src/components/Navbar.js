import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const { syncStatus, pendingSync } = useData();

  const getSyncStatusIcon = () => {
    if (syncStatus === 'offline') return '📴';
    if (pendingSync.length > 0) return '🔄';
    return '✅';
  };

  const getSyncStatusText = () => {
    if (syncStatus === 'offline') return 'Offline';
    if (pendingSync.length > 0) return `Syncing ${pendingSync.length} items`;
    return 'Synced';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">❤️</span>
        <span className="navbar-title">Nutrilytics</span>
      </div>
      <div className="navbar-right">
        <div className="sync-status">
          <span className="sync-icon">{getSyncStatusIcon()}</span>
          <span className="sync-text">{getSyncStatusText()}</span>
        </div>
        <div className="user-info">
          <span className="user-name">{user?.username}</span>
          <span className="user-role">{user?.role}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
