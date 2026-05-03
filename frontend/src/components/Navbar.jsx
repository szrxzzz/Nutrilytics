import React from 'react';
import { useSync } from '../context/SyncContext';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user }) => {
  const { isOnline, syncStatus, pendingSync } = useSync();

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <h2 className="navbar-title">
          {user?.centre_name || 'Main Dashboard'}
        </h2>
      </div>

      <div className="navbar-right">
        <div className="sync-indicators">
          {isOnline ? (
            <span className="sync-badge badge-online">
              <Wifi size={14} /> Online
            </span>
          ) : (
            <span className="sync-badge badge-offline">
              <WifiOff size={14} /> Offline
            </span>
          )}
          
          {syncStatus === 'Syncing' && (
            <span className="sync-badge badge-syncing">
              <RefreshCw size={14} className="icon-spin" /> Syncing...
            </span>
          )}

          {syncStatus === 'Pending' && (
            <span className="sync-badge badge-pending">
              <RefreshCw size={14} /> Pending ({pendingSync?.length || 0})
            </span>
          )}

          {syncStatus === 'Synced' && (
            <span className="sync-badge badge-synced">
              <CheckCircle2 size={14} /> Synced
            </span>
          )}
        </div>

        <div className="navbar-actions">
          <button className="icon-btn position-relative">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          
          <div className="user-avatar-container">
            <div className="user-avatar">
              {user?.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <span className="user-greeting hidden-mobile">
              Hi, {user?.username || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
