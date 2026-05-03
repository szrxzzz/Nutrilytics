import React, { useEffect } from 'react';
import { Activity } from 'lucide-react';
import './Splash.css';

const Splash = ({ onComplete }) => {
  useEffect(() => {
    // Automatically transition to the next screen after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-container">
      {/* Animated background shapes */}
      <div className="splash-shape shape-1"></div>
      <div className="splash-shape shape-2"></div>
      <div className="splash-shape shape-3"></div>

      <div className="splash-content">
        <div className="logo-pulse-container">
          {/* Animated rings */}
          <div className="pulse-ring ring-1"></div>
          <div className="pulse-ring ring-2"></div>
          <div className="pulse-ring ring-3"></div>
          
          <div className="splash-logo-wrapper">
            <Activity className="splash-logo-icon" />
          </div>
        </div>

        <div className="splash-text-container">
          <h1 className="splash-title">Nutrilytics</h1>
          <p className="splash-tagline">
            Smarter child health monitoring for every Anganwadi centre.
          </p>
        </div>

        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
