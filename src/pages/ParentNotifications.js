import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const ParentNotifications = () => {
  const { children } = useData();
  const [selectedChild, setSelectedChild] = useState('');
  const [messageType, setMessageType] = useState('vaccination');
  const [customMessage, setCustomMessage] = useState('');

  const messageTemplates = {
    vaccination: 'Your child\'s vaccination is due tomorrow. Please visit the Anganwadi centre.',
    growth: 'Growth monitoring suggests your child needs a nutrition check-up. Please visit the centre.',
    attendance: 'Your child has been absent for several days. Please ensure regular attendance.',
    general: 'Please visit the Anganwadi centre for an important update regarding your child.'
  };

  const handleSend = () => {
    if (!selectedChild) {
      alert('Please select a child');
      return;
    }
    const message = customMessage || messageTemplates[messageType];
    alert(`Notification sent successfully!\n\nMessage: ${message}`);
    setSelectedChild('');
    setCustomMessage('');
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Parent Notifications</h1>
          <p className="page-subtitle">Send SMS alerts to parents</p>
        </div>

        <div className="registration-form-container">
          <div className="registration-form">
            <div className="form-group">
              <label>Select Child *</label>
              <select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)}>
                <option value="">Choose a child...</option>
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name} - {child.parentName} ({child.parentPhone})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Message Type</label>
              <select value={messageType} onChange={(e) => setMessageType(e.target.value)}>
                <option value="vaccination">Vaccination Reminder</option>
                <option value="growth">Growth Check-up</option>
                <option value="attendance">Attendance Concern</option>
                <option value="general">General Message</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message Preview</label>
              <textarea
                value={customMessage || messageTemplates[messageType]}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows="4"
                placeholder="Edit message or use template..."
              />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSend}>
                📱 Send Notification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentNotifications;
