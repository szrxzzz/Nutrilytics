import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [language, setLanguage] = useState('english');
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Location settings
  const [selectedCentre, setSelectedCentre] = useState('Anganwadi Centre 1');
  const [selectedDistrict, setSelectedDistrict] = useState('Sample District');
  const [selectedState, setSelectedState] = useState('Sample State');

  const user = {
    username: 'Demo User',
    role: 'Anganwadi Worker',
    centre: selectedCentre,
    district: selectedDistrict,
    state: selectedState
  };

  // Sample data for dropdowns
  const states = ['Sample State', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Uttar Pradesh', 'West Bengal'];
  const districts = ['Sample District', 'Mumbai', 'Chennai', 'Bangalore', 'Lucknow', 'Kolkata'];
  const centres = [
    'Anganwadi Centre 1',
    'Anganwadi Centre 2',
    'Anganwadi Centre 3',
    'Anganwadi Centre 4',
    'Anganwadi Centre 5'
  ];

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your profile and preferences</p>
      </div>

      <div className="settings-content">
        {/* Profile Information */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="card-title">Profile Information</h2>
          </div>
          <div className="card-body">
            <div className="info-grid">
              <div className="info-item">
                <label>Username</label>
                <p>{user.username}</p>
              </div>
              <div className="info-item">
                <label>Role</label>
                <p style={{textTransform: 'capitalize'}}>{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Settings */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="card-title">Location Settings</h2>
          </div>
          <div className="card-body">
            <div className="setting-item">
              <div className="setting-info">
                <label>State</label>
                <p className="setting-description">Select your state</p>
              </div>
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                className="setting-select"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>District</label>
                <p className="setting-description">Select your district</p>
              </div>
              <select 
                value={selectedDistrict} 
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="setting-select"
              >
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Centre</label>
                <p className="setting-description">Select your Anganwadi centre</p>
              </div>
              <select 
                value={selectedCentre} 
                onChange={(e) => setSelectedCentre(e.target.value)}
                className="setting-select"
              >
                {centres.map(centre => (
                  <option key={centre} value={centre}>{centre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="card-title">App Preferences</h2>
          </div>
          <div className="card-body">
            <div className="setting-item">
              <div className="setting-info">
                <label>Language</label>
                <p className="setting-description">Choose your preferred language</p>
              </div>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="setting-select"
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी (Hindi)</option>
                <option value="tamil">தமிழ் (Tamil)</option>
                <option value="telugu">తెలుగు (Telugu)</option>
                <option value="bengali">বাংলা (Bengali)</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Push Notifications</label>
                <p className="setting-description">Receive alerts for important updates</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Auto Sync</label>
                <p className="setting-description">Automatically sync data when online</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Dark Mode</label>
                <p className="setting-description">Switch to dark theme</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="card-title">Data Management</h2>
          </div>
          <div className="card-body">
            <div className="setting-item">
              <div className="setting-info">
                <label>Clear Cache</label>
                <p className="setting-description">Remove temporary files and cached data</p>
              </div>
              <button className="btn btn-secondary">Clear Cache</button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Export Data</label>
                <p className="setting-description">Download your data as CSV</p>
              </div>
              <button className="btn btn-secondary">Export</button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="card-title">Account Actions</h2>
          </div>
          <div className="card-body">
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => window.location.href = '/login'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
