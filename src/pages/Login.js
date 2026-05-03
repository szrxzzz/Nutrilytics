import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      login(username, password, role);
      navigate('/dashboard');
    }
  };

  const handleDemo = () => {
    login('demo', 'demo', 'worker');
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="animated-bg">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>
        <div className="health-icons">
          <div className="health-icon icon-1">❤️</div>
          <div className="health-icon icon-2">🌱</div>
          <div className="health-icon icon-3">🛡️</div>
          <div className="health-icon icon-4">📊</div>
          <div className="health-icon icon-5">💉</div>
          <div className="health-icon icon-6">👶</div>
          <div className="health-icon icon-7">✅</div>
          <div className="health-icon icon-8">📱</div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-left">
          <div className="brand-section">
            <div className="brand-logo">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="28" fill="url(#brandGradient)" />
                <path d="M25 28L28 35L38 22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="brandGradient" x1="0" y1="0" x2="60" y2="60">
                    <stop offset="0%" stopColor="#FF6B35" />
                    <stop offset="100%" stopColor="#F7931E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="brand-title">Hybrid Offline-First Child Health Monitoring for Anganwadi Centres</h1>
            <p className="brand-description">
              Track growth, attendance, nutrition, and vaccination locally, generate AI-powered risk alerts, 
              and sync insights to the cloud when connected. Built for rural and low-connectivity environments.
            </p>
            
            <div className="feature-highlights">
              <div className="feature-item">
                <div className="feature-icon">📴</div>
                <div className="feature-text">
                  <h3>Hybrid Offline-First Monitoring</h3>
                  <p>Record and analyze child health data locally without internet, sync when connected</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤖</div>
                <div className="feature-text">
                  <h3>AI-Based Child Risk Detection</h3>
                  <p>Lightweight on-device AI identifies nutrition, growth, and vaccination risks</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">☁️</div>
                <div className="feature-text">
                  <h3>Cloud Sync for Supervisory Reporting</h3>
                  <p>Summarized insights automatically sync for oversight and intervention</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <div className="feature-text">
                  <h3>Parent Alerts & Community Engagement</h3>
                  <p>Automated SMS reminders keep parents informed and engaged</p>
                </div>
              </div>
            </div>

            <div className="trust-badges">
              <div className="badge">
                <span className="badge-icon">📴</span>
                <span>Works Offline First</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🌐</span>
                <span>Syncs When Connected</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🏛️</span>
                <span>Built for Rural Care</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🔒</span>
                <span>Local Data Privacy</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to Nutrilytics</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username / Worker ID</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="worker">Anganwadi Worker</option>
                  <option value="supervisor">Supervisor / Admin</option>
                </select>
              </div>

              <div className="form-options">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Sign In
              </button>

              <button type="button" className="btn btn-secondary btn-block" onClick={handleDemo}>
                Continue as Demo
              </button>
            </form>

            <div className="login-footer">
              <p className="demo-note">
                <span className="info-icon">ℹ️</span>
                Demo: Use any username/password to explore
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
