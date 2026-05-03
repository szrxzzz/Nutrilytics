import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AIAlerts = () => {
  const navigate = useNavigate();
  const { children, alerts } = useData();

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">AI-Generated Alerts</h1>
          <p className="page-subtitle">Smart health risk detection and recommendations</p>
        </div>

        <div className="alerts-grid">
          {alerts.map(alert => {
            const child = children.find(c => c.id === alert.childId);
            return (
              <div key={alert.id} className={`card alert-card alert-${alert.severity}`}>
                <div className="alert-header">
                  <span className={`badge badge-${alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'success'}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="alert-type">{alert.type}</span>
                </div>
                <h3>{child?.name}</h3>
                <p className="alert-message">{alert.message}</p>
                <div className="alert-reason">
                  <strong>Reason:</strong> {alert.reason}
                </div>
                <div className="alert-action">
                  <strong>Recommended Action:</strong> {alert.action}
                </div>
                <div className="alert-footer">
                  <span className="alert-date">{new Date(alert.createdAt).toLocaleDateString()}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/child/${alert.childId}`)}>
                    View Child Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIAlerts;
