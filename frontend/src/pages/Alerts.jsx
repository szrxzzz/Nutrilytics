import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2, Calendar, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const resp = await axios.get('http://localhost:8000/alerts');
      setAlerts(resp.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'alert-high';
      case 'medium': return 'alert-medium';
      default: return 'alert-low';
    }
  };

  return (
    <div className="alerts-container page-transition">
      <div className="alerts-header">
        <div>
          <h1 className="heading-1">AI Health Alerts</h1>
          <p className="text-muted text-uppercase">Real-time risk detection & early warnings</p>
        </div>
        <div className="alerts-status-badge">
          <Bell size={18} className="bell-icon pulse-animation" />
          <span>{alerts.length} Active Notifications</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`poshan-card alert-card ${getSeverityStyles(alert.severity)}`}
            >
              <div className="alert-severity-indicator">
                {alert.severity?.toLowerCase() === 'high' ? (
                  <ShieldAlert size={36} className="severity-icon" />
                ) : (
                  <AlertTriangle size={36} className="severity-icon" />
                )}
                <span className="severity-label">{alert.severity} Risk</span>
              </div>
              
              <div className="alert-content">
                <div className="alert-meta">
                  <span className="alert-type-badge">{alert.alert_type}</span>
                  <span className="alert-source">Source: {alert.source}</span>
                </div>
                
                <h3 className="alert-child-id">Child ID: {alert.child_id}</h3>
                <p className="alert-message">{alert.message}</p>
                
                <div className="alert-footer">
                  <div className="alert-date">
                    <Calendar size={14} />
                    <span>{new Date(alert.created_at).toLocaleDateString()}</span>
                  </div>
                  {!alert.resolved && (
                    <div className="alert-status pending">
                      <Activity size={14} />
                      <span>Pending Action</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="alert-actions">
                <Link to={`/child/${alert.child_id}`} className="alert-action-btn">
                  <span>View Profile</span>
                  <ArrowRight size={20} />
                </Link>
                <div className="alert-quick-actions">
                  <button className="poshan-btn alert-quick-btn notify-btn">Notify Parent</button>
                  <button className="poshan-btn alert-quick-btn resolve-btn">Resolve</button>
                </div>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="empty-state alerts-empty-state">
              <div className="empty-icon-wrapper success-wrapper">
                <CheckCircle2 size={48} className="success-icon" />
              </div>
              <h3 className="empty-title">Clear Skies!</h3>
              <p className="empty-subtitle">No critical alerts detected in the system right now. All children are showing stable indicators.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Alerts;
