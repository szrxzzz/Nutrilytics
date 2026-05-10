import React, { useState } from 'react';
import { LogIn, ShieldCheck, Activity, Users } from 'lucide-react';
import './Login.css'; // Let's create a separate CSS file for Login page specific layout to avoid messy React classes

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin({ username: 'admin', role: 'supervisor', centre_name: 'Regional HQ' });
    } else {
      onLogin({ username: username || 'demo', role: role, centre_name: 'Anganwadi Centre 1' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-visual">
        <div className="visual-content">
          <div className="logo-container">
            <Activity className="logo-icon pulse-animation" />
            <h1 className="logo-text">Nutrilytics</h1>
          </div>
          <p className="visual-tagline">
            Smarter child health monitoring for every Anganwadi centre.
          </p>
          
          <div className="trust-badges">
            <div className="trust-badge">
              <ShieldCheck className="badge-icon" />
              <span>AI Risk Alerts</span>
            </div>
            <div className="trust-badge">
              <LogIn className="badge-icon" />
              <span>Offline-First Sync</span>
            </div>
            <div className="trust-badge">
              <Users className="badge-icon" />
              <span>Parent Notifications</span>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="login-form-container">
        <div className="poshan-card login-card">
          <div className="login-header">
            <h2 className="heading-1">Welcome Back</h2>
            <p className="text-muted">Sign in to your health monitoring dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="poshan-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="poshan-input"
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label className="poshan-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="poshan-input"
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label className="poshan-label">Select Role</label>
              <div className="role-selector">
                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`role-btn ${role === 'worker' ? 'active' : ''}`}
                >
                  Worker
                </button>
                <button
                  type="button"
                  onClick={() => setRole('supervisor')}
                  className={`role-btn ${role === 'supervisor' ? 'active' : ''}`}
                >
                  Supervisor
                </button>
              </div>
            </div>

            <button type="submit" className="poshan-btn poshan-btn-primary login-submit-btn">
              Access Dashboard
            </button>
            <button type="button" onClick={handleSubmit} className="poshan-btn poshan-btn-outline demo-btn">
              Demo Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
