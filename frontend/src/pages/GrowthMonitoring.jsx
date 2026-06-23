import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSync } from '../context/SyncContext';
import { Activity, Beaker, Ruler, Save, RefreshCw, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import './GrowthMonitoring.css';

import { API_URL } from '../config';

const GrowthMonitoring = () => {
  const { addToSyncQueue, isOnline } = useSync();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    muac: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [riskFeedback, setRiskFeedback] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  // Real-time AI analysis with 500ms debounce
  useEffect(() => {
    if (formData.weight && formData.height && selectedChild) {
      const timer = setTimeout(() => {
        handlePredict();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setRiskFeedback(null);
    }
  }, [formData.weight, formData.height, formData.muac, selectedChild]);

  const fetchChildren = async () => {
    try {
      const resp = await axios.get(`${API_URL}/children`);
      setChildren(resp.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    if (!selectedChild || !formData.weight || !formData.height) return;
    
    try {
      const resp = await axios.post(`${API_URL}/predict-risk`, {
        features: {
          age_months: 24, // Simplified for demo
          gender: 0,
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          muac: parseFloat(formData.muac) || 12.5,
          bmi: parseFloat(formData.weight) / ((parseFloat(formData.height)/100)**2),
          weight_delta: 0.2,
          height_delta: 0.5,
          attendance_pct: 85,
          missed_vaccines: 0,
          overdue_vaccines: 0
        }
      });
      setRiskFeedback(resp.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const record = { ...formData, child_id: selectedChild };
    await addToSyncQueue('growth', record);
    
    setTimeout(() => {
      setSaving(false);
      setRiskFeedback(null);
      setFormData({ weight: '', height: '', muac: '', date: new Date().toISOString().split('T')[0], notes: '' });
      alert('Growth record saved to sync queue');
    }, 1000);
  };

  return (
    <div className="growth-container page-transition">
      <div className="growth-header">
        <div>
          <h1 className="heading-1">Growth Entry</h1>
          <p className="text-muted text-uppercase">Record anthropometric data & predict nutrition status</p>
        </div>
      </div>

      <div className="growth-content">
        <form onSubmit={handleSubmit} className="growth-form-section">
          <div className="poshan-card growth-form-card">
            
            <div className="form-group mb-6">
              <label className="poshan-label">Select Child</label>
              <select
                required
                className="poshan-input select-input"
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
              >
                <option value="">Choose a child...</option>
                {children.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="poshan-label">Weight (kg)</label>
                <div className="input-with-icon">
                  <div className="input-icon"><Beaker size={20}/></div>
                  <input
                    required
                    type="number"
                    step="0.1"
                    className="poshan-input icon-padded-input"
                    placeholder="0.0"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="poshan-label">Height (cm)</label>
                <div className="input-with-icon">
                  <div className="input-icon"><Ruler size={20}/></div>
                  <input
                    required
                    type="number"
                    step="0.1"
                    className="poshan-input icon-padded-input"
                    placeholder="0.0"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="poshan-label">MUAC (cm)</label>
                <div className="input-with-icon">
                  <div className="input-icon"><Activity size={20}/></div>
                  <input
                    required
                    type="number"
                    step="0.1"
                    className="poshan-input icon-padded-input"
                    placeholder="0.0"
                    value={formData.muac}
                    onChange={(e) => setFormData({...formData, muac: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="poshan-label">Visit Date</label>
                <input
                  required
                  type="date"
                  className="poshan-input"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group mt-6">
              <textarea
                className="poshan-input textarea-input"
                rows="3"
                placeholder="Observation notes..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="poshan-btn poshan-btn-primary commit-btn"
          >
            {saving ? <div className="spinner-small"></div> : <Save size={24}/>}
            <span>{saving ? 'Processing Sync...' : 'Commit Health Status'}</span>
          </button>
        </form>

        <div className="growth-ai-section">
          <div className={`ai-feedback-card ${
            riskFeedback ? (
              riskFeedback.risk_label === 'High Risk' ? 'feedback-high' : 
              riskFeedback.risk_label === 'Medium Risk' ? 'feedback-medium' : 'feedback-low'
            ) : 'feedback-empty'
          }`}>
            {riskFeedback ? (
              <div className="feedback-content">
                <div className="feedback-header-info">
                  <div className="ai-active-badge">
                    <ShieldCheck size={24}/>
                    <span>AI Assessment Active</span>
                  </div>
                  <h3 className="feedback-title">{riskFeedback.risk_label}</h3>
                  <div className="confidence-meter-container mt-4">
                    <div className="confidence-bar-bg">
                      <div className="confidence-bar-fill" style={{ width: (riskFeedback.risk_score * 100) + '%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="feedback-details">
                  <div className="recommendation-box">
                    <p className="recommendation-label">Recommendation</p>
                    <p className="recommendation-text">{riskFeedback.recommendation}</p>
                  </div>
                  <div className="feedback-footer">
                    <span>Score: {(riskFeedback.risk_score * 100).toFixed(0)}%</span>
                    <Info size={16}/>
                  </div>
                </div>
              </div>
            ) : (
              <div className="feedback-empty-content">
                <RefreshCw size={56} className="empty-icon" />
                <p className="empty-text">Input weight & height to activate live AI analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthMonitoring;
