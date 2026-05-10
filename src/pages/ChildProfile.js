import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ChildProfile.css';

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { children, growthRecords, vaccinationRecords, alerts } = useData();
  
  const child = children.find(c => c.id === id);
  const childGrowth = growthRecords.filter(r => r.childId === id);
  const childVaccinations = vaccinationRecords.filter(v => v.childId === id);
  const childAlerts = alerts.filter(a => a.childId === id);

  if (!child) return <div>Child not found</div>;

  const growthData = childGrowth.map(r => ({
    date: new Date(r.recordedAt).toLocaleDateString(),
    weight: r.weight,
    height: r.height
  }));

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="profile-header">
          <div className="profile-avatar">{child.name.charAt(0)}</div>
          <div className="profile-info">
            <h1>{child.name}</h1>
            <p>{child.age} years • {child.gender}</p>
            <p>{child.centre}</p>
          </div>
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={() => navigate(`/growth/${id}`)}>
              Add Growth Record
            </button>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-section">
            <h2>Basic Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Date of Birth</label>
                <p>{new Date(child.dob).toLocaleDateString()}</p>
              </div>
              <div className="info-item">
                <label>Parent Name</label>
                <p>{child.parentName}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{child.parentPhone}</p>
              </div>
              <div className="info-item">
                <label>Address</label>
                <p>{child.address}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Growth Chart</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#FF6B35" name="Weight (kg)" />
                <Line type="monotone" dataKey="height" stroke="#4CAF50" name="Height (cm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="profile-section">
            <h2>Vaccination Status</h2>
            <div className="vaccination-list">
              {childVaccinations.slice(0, 5).map(v => (
                <div key={v.id} className="vaccination-item">
                  <span className={`status-badge status-${v.status}`}>{v.status}</span>
                  <span>{v.vaccineName}</span>
                  <span>{new Date(v.dueDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h2>Active Alerts</h2>
            {childAlerts.length > 0 ? (
              childAlerts.map(alert => (
                <div key={alert.id} className={`alert-box alert-${alert.severity}`}>
                  <h4>{alert.type}</h4>
                  <p>{alert.message}</p>
                </div>
              ))
            ) : (
              <p>No active alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProfile;
