import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Attendance.css';

const Attendance = () => {
  const { children } = useData();
  const [attendance, setAttendance] = useState({});

  const toggleAttendance = (childId) => {
    setAttendance(prev => ({
      ...prev,
      [childId]: prev[childId] === 'present' ? 'absent' : 'present'
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    children.forEach(child => {
      allPresent[child.id] = 'present';
    });
    setAttendance(allPresent);
  };

  const saveAttendance = () => {
    alert('Attendance saved successfully!');
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Mark Attendance</h1>
          <p className="page-subtitle">Today: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="attendance-actions">
          <button className="btn btn-primary" onClick={markAllPresent}>
            Mark All Present
          </button>
          <button className="btn btn-success" onClick={saveAttendance}>
            Save Attendance
          </button>
        </div>

        <div className="attendance-list">
          {children.map(child => (
            <div key={child.id} className="attendance-item">
              <div className="child-info">
                <h3>{child.name}</h3>
                <p>{child.centre}</p>
              </div>
              <div className="attendance-toggle">
                <button
                  className={`attendance-btn ${attendance[child.id] === 'present' ? 'present' : ''}`}
                  onClick={() => toggleAttendance(child.id)}
                >
                  {attendance[child.id] === 'present' ? '✓ Present' : 'Absent'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
