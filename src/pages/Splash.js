import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo">
          <div className="logo-pulse">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path d="M40 10C23.43 10 10 23.43 10 40C10 56.57 23.43 70 40 70C56.57 70 70 56.57 70 40C70 23.43 56.57 10 40 10Z" fill="url(#gradient1)" />
              <path d="M40 20C29.51 20 21 28.51 21 39C21 49.49 29.51 58 40 58C50.49 58 59 49.49 59 39C59 28.51 50.49 20 40 20Z" fill="url(#gradient2)" />
              <path d="M35 35L38 42L45 32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gradient1" x1="10" y1="10" x2="70" y2="70">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#F7931E" />
                </linearGradient>
                <linearGradient id="gradient2" x1="21" y1="20" x2="59" y2="58">
                  <stop offset="0%" stopColor="#FFA07A" />
                  <stop offset="100%" stopColor="#FF8C42" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <h1 className="splash-title">Nutrilytics</h1>
        <p className="splash-tagline">Hybrid Offline-First Child Health Monitoring for Anganwadi Centres</p>
        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>
      </div>
      <div className="splash-background">
        <div className="floating-icon icon-1">❤️</div>
        <div className="floating-icon icon-2">🌱</div>
        <div className="floating-icon icon-3">🛡️</div>
        <div className="floating-icon icon-4">📊</div>
        <div className="floating-icon icon-5">💉</div>
        <div className="floating-icon icon-6">👶</div>
      </div>
    </div>
  );
};

export default Splash;
