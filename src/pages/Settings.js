import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your profile and preferences</p>
        </div>

        <div className="card">
          <h2 className="section-title">Profile Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Username</label>
              <p>{user?.username}</p>
            </div>
            <div className="info-item">
              <label>Role</label>
              <p style={{textTransform: 'capitalize'}}>{user?.role}</p>
            </div>
            <div className="info-item">
              <label>Centre</label>
              <p>{user?.centre}</p>
            </div>
            <div className="info-item">
              <label>District</label>
              <p>{user?.district}</p>
            </div>
          </div>
        </div>

        <div className="card" style={{marginTop: '20px'}}>
          <h2 className="section-title">Preferences</h2>
          <div className="form-group">
            <label>Language</label>
            <select style={{padding: '12px', borderRadius: '8px', border: '2px solid #E0E0E0'}}>
              <option>English</option>
              <option>हिंदी (Hindi)</option>
              <option>தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>

        <div className="card" style={{marginTop: '20px'}}>
          <h2 className="section-title">Account Actions</h2>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
