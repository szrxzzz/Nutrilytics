import React from 'react';
import './AIInsightsPanel.css';
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiTrendingDown, 
  FiCalendar, 
  FiActivity,
  FiInfo
} from 'react-icons/fi';

const AIInsightsPanel = ({ 
  dropoutRisk = "Low", 
  vaccineRisk = "Low", 
  growthAnomaly = "Normal", 
  deepRisk = "Calculating...",
  deepConfidence = 0,
  recommendations = [],
  loading = false,
  isOnline = true
}) => {
  if (loading) {
    return (
      <div className="ai-panel loading-skeleton">
        <div className="skeleton-title"></div>
        <div className="skeleton-grid">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk) => {
    const r = risk.toLowerCase();
    if (r.includes('high') || r.includes('miss') || r.includes('anomaly')) return 'danger';
    if (r.includes('medium') || r.includes('irregular') || r.includes('warning')) return 'warning';
    return 'success';
  };

  return (
    <div className={`ai-panel ${!isOnline ? 'offline-mode' : ''}`}>
      <div className="ai-header">
        <div className="ai-title">
          <FiActivity className="ai-icon-main" />
          <h3>Health Intelligence Insights</h3>
        </div>
        <div className={`ai-status ${isOnline ? 'online' : 'offline'}`}>
          <span className="status-dot"></span>
          {isOnline ? 'AI Online' : 'AI Offline (Sync Pending)'}
        </div>
      </div>

      <div className="ai-grid">
        <div className={`ai-insight-card ${getRiskColor(dropoutRisk)}`}>
          <div className="card-icon"><FiTrendingDown /></div>
          <div className="card-info">
            <span className="card-label">Dropout Risk</span>
            <span className="card-value">{dropoutRisk}</span>
          </div>
        </div>

        <div className={`ai-insight-card ${getRiskColor(vaccineRisk)}`}>
          <div className="card-icon"><FiCalendar /></div>
          <div className="card-info">
            <span className="card-label">Vaccination Status</span>
            <span className="card-value">{vaccineRisk}</span>
          </div>
        </div>

        <div className={`ai-insight-card ${getRiskColor(growthAnomaly)}`}>
          <div className="card-icon"><FiAlertCircle /></div>
          <div className="card-info">
            <span className="card-label">Growth Pattern</span>
            <span className="card-value">{growthAnomaly}</span>
          </div>
        </div>

        <div className={`ai-insight-card deep-card ${getRiskColor(deepRisk)}`}>
          <div className="card-icon"><FiActivity /></div>
          <div className="card-info">
            <span className="card-label">Deep Health Risk (AI)</span>
            <span className="card-value">{deepRisk}</span>
            <span className="deep-badge">TensorFlow</span>
          </div>
          {deepConfidence > 0 && (
            <div className="deep-confidence-mini">
              {Math.round(deepConfidence * 100)}%
            </div>
          )}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="ai-recommendations">
          <div className="rec-header">
            <FiInfo />
            <span>Smart Recommendations</span>
          </div>
          <ul className="rec-list">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="rec-item">
                <FiCheckCircle className="check-icon" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel;
