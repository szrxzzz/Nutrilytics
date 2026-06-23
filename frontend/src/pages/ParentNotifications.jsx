import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import './ParentNotifications.css';

import { API_URL } from '../config';

const ParentNotifications = () => {
  const [children, setChildren] = useState([]);
  const [searchParams] = useSearchParams();
  const preSelectedChild = searchParams.get('childId') || '';
  
  const [selectedChild, setSelectedChild] = useState(preSelectedChild);
  const [messageType, setMessageType] = useState('vaccination');
  const [customMessage, setCustomMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (preSelectedChild && children.length > 0) {
      setSelectedChild(preSelectedChild);
    }
  }, [preSelectedChild, children]);

  const fetchChildren = async () => {
    try {
      const resp = await axios.get(`${API_URL}/children`);
      setChildren(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const messageTemplates = {
    vaccination: "Your child's vaccination is due. Please visit the Anganwadi centre soon.",
    growth: "Growth monitoring indicates your child needs a check-up. Please visit the centre.",
    attendance: "We noticed your child has been absent. Please ensure regular attendance for their well-being.",
    general: "Please visit the Anganwadi centre for an important update regarding your child."
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedChild) return;
    
    const childInfo = children.find(c => c.id === selectedChild);
    if (!childInfo || !childInfo.parent_phone) {
      alert("Selected child does not have a valid parent phone number.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/send-sms`, {
        phone: childInfo.parent_phone,
        message: customMessage || messageTemplates[messageType]
      });

      if (response.data.success) {
        setSent(true);
        setTimeout(() => {
          setSent(false);
          setSelectedChild('');
          setCustomMessage('');
        }, 3000);
      } else {
        alert("Failed to send SMS: " + response.data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error sending SMS.");
    }
  };

  return (
    <div className="notifications-container page-transition">
      <div className="notifications-header">
        <div>
          <h1 className="heading-1">Parent Notifications</h1>
          <p className="text-muted text-uppercase">Send automated SMS alerts to parents</p>
        </div>
      </div>

      <div className="poshan-card notifications-card">
        <div className="notifications-card-bg"></div>
        
        {sent ? (
          <div className="success-state">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="success-title">Message Sent!</h2>
            <p className="success-desc">The SMS notification has been successfully delivered to the parent.</p>
            <button onClick={() => setSent(false)} className="send-another-btn">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="notifications-form">
            <div className="form-group">
              <label className="poshan-label">Select Child</label>
              <select 
                required
                className="poshan-input select-input padding-normal"
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
              >
                <option value="">Choose a child...</option>
                {children.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - Parent: {c.parent_name} ({c.parent_phone})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="poshan-label">Message Category</label>
              <div className="category-grid">
                {['vaccination', 'growth', 'attendance', 'general'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMessageType(type)}
                    className={`category-btn ${messageType === type ? 'active' : ''}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="poshan-label">Message Preview</label>
              <textarea 
                rows="4"
                className="poshan-input textarea-input padding-normal"
                value={customMessage || messageTemplates[messageType]}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="poshan-btn poshan-btn-primary dispatch-btn"
            >
              <Send size={24} /> <span>Dispatch SMS</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ParentNotifications;
