import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, title, value, subtitle, color = 'primary', onClick }) => {
  return (
    <div className={`stat-card stat-card-${color}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
