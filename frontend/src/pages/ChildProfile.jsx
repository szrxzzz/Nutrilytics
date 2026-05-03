import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, Calendar, ShieldCheck, AlertCircle, RefreshCcw, User, Phone, MapPin, Milestone, ChevronRight, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ChildProfile.css';

const ChildProfile = () => {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [ruleAlerts, setRuleAlerts] = useState([]);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const resp = await axios.get(`http://localhost:8000/children/${id}`);
      setChild(resp.data);
      setLoading(false);
      runPrediction();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const runPrediction = async () => {
    setPredicting(true);
    try {
      const resp = await axios.post(`http://localhost:8000/predict-risk`, { child_id: id });
      setRiskData(resp.data);
      
      const forecastResp = await axios.post(`http://localhost:8000/forecast-growth`, { child_id: id });
      setForecastData(forecastResp.data);

      const rulesResp = await axios.post(`http://localhost:8000/evaluate-rules`, { child_id: id });
      setRuleAlerts(rulesResp.data.alerts);
    } catch (err) {
      console.error("Prediction failed", err);
    } finally {
      setPredicting(false);
    }
  };

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="profile-container page-transition">
      <div className="profile-hero">
        <div className="poshan-card profile-hero-card">
          <div className="profile-avatar-large">
            {child.name[0]}
          </div>
          <div className="profile-hero-info">
            <h1 className="heading-1 mb-2">{child.name}</h1>
            <div className="profile-badges">
              <span className="profile-badge">
                <Milestone size={14} className="badge-icon" /> {child.id}
              </span>
              <span className="profile-badge">
                <Calendar size={14} className="badge-icon" /> {child.age_months} Months
              </span>
              <span className={`gender-badge ${child.gender === 'Male' ? 'gender-male' : 'gender-female'}`}>
                {child.gender}
              </span>
            </div>
          </div>
          <button 
            onClick={runPrediction}
            disabled={predicting}
            className="poshan-btn poshan-btn-primary analyze-btn"
          >
            {predicting ? <RefreshCcw className="icon-spin" size={20}/> : <ShieldCheck size={20}/>}
            <span>{predicting ? "ANALYZING..." : "ANALYZE RISK"}</span>
          </button>
        </div>

        <div className={`poshan-card ai-risk-card ${
          riskData?.risk_label === 'High Risk' ? 'risk-high' : 
          riskData?.risk_label === 'Medium Risk' ? 'risk-medium' : 
          'risk-low'
        }`}>
          <div className="ai-risk-content">
            <p className="risk-eyebrow">ML Prediction Output</p>
            <h3 className="risk-title">
              {predicting ? "Calculating..." : (riskData?.risk_label || "No active risk")}
            </h3>
            
            <div className="confidence-meter-container">
              <p className="confidence-label">Confidence Score</p>
              <div className="confidence-meter-row">
                <span className="confidence-value">{predicting ? "--" : (riskData?.risk_score ? (riskData.risk_score * 100).toFixed(0) + '%' : '0%')}</span>
                <div className="confidence-bar-bg">
                  <div className="confidence-bar-fill" style={{ width: predicting ? '0%' : (riskData?.risk_score * 100) + '%' }}></div>
                </div>
              </div>
            </div>

            <div className="risk-recommendation">
              <InfoCircle className="info-icon" />
              <p className="recommendation-text">{riskData?.recommendation || "Maintain regular health checkups every month."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="poshan-card contact-card">
          <h3 className="card-heading">
            <User size={20} className="text-teal" /> Contact Details
          </h3>
          <div className="contact-details-list">
            <div className="contact-item">
              <div className="contact-icon-wrapper"><User size={18} /></div>
              <div className="contact-info">
                <span className="contact-label">Parent Name</span>
                <span className="contact-value">{child.parent_name}</span>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon-wrapper"><Phone size={18} /></div>
              <div className="contact-info">
                <span className="contact-label">Phone Number</span>
                <span className="contact-value">{child.parent_phone}</span>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon-wrapper"><MapPin size={18} /></div>
              <div className="contact-info">
                <span className="contact-label">Address</span>
                <span className="contact-value">{child.address}</span>
              </div>
            </div>
          </div>
          <Link to={`/notifications?childId=${child.id}`} className="notify-parent-btn">
            Send SMS Notification <ChevronRight size={16} />
          </Link>
        </div>

        <div className="poshan-card profile-main-card">
          <div className="card-header-flex">
            <h3 className="card-heading">
              <Activity size={20} className="text-teal" /> Recent Health Profile
            </h3>
            <span className="last-updated">Last Updated: Today</span>
          </div>
          
          <div className="vitals-grid">
            <div className="vital-box">
              <span className="vital-label">Weight</span>
              <div className="vital-value-row">
                <span className="vital-value">{riskData?.features?.weight?.toFixed(1) || '--'}</span>
                <span className="vital-unit">KG</span>
              </div>
            </div>
            <div className="vital-box">
              <span className="vital-label">Height</span>
              <div className="vital-value-row">
                <span className="vital-value">{riskData?.features?.height?.toFixed(0) || '--'}</span>
                <span className="vital-unit">CM</span>
              </div>
            </div>
            <div className="vital-box">
              <span className="vital-label">MUAC</span>
              <div className="vital-value-row">
                <span className="vital-value">{riskData?.features?.muac?.toFixed(1) || '--'}</span>
                <span className="vital-unit">CM</span>
              </div>
            </div>
            <div className="vital-box">
              <span className="vital-label">BMI</span>
              <div className="vital-value-row">
                <span className="vital-value">{riskData?.features?.bmi?.toFixed(1) || '--'}</span>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                {month: 'Jan', weight: 12.1},
                {month: 'Feb', weight: 12.3},
                {month: 'Mar', weight: 12.4},
                {month: 'Apr', weight: 12.6},
                {month: 'May', weight: 12.4},
                {month: 'Jun', weight: riskData?.features?.weight || 12.5}
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-secondary)'}} dy={10} />
                <YAxis hide domain={[10, 15]} />
                <Tooltip 
                  contentStyle={{borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-sm)', fontFamily: 'var(--font-primary)'}}
                />
                <Line type="monotone" dataKey="weight" stroke="var(--color-orange)" strokeWidth={4} dot={{r: 5, fill: 'var(--color-orange)'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="forecast-alerts-grid">
            <div className="forecast-box">
              <h4 className="forecast-title"><Milestone size={16} /> Growth Forecast</h4>
              <p className="forecast-subtitle">Linear Regression trend for next month:</p>
              <div className="forecast-values">
                <div className="forecast-item">
                  <span className="forecast-label">Weight</span>
                  <span className="forecast-value">{forecastData?.expected_weight || '--'} <small>kg</small></span>
                </div>
                <div className="forecast-item">
                  <span className="forecast-label">Height</span>
                  <span className="forecast-value">{forecastData?.expected_height || '--'} <small>cm</small></span>
                </div>
              </div>
              {forecastData?.warning && (
                <div className="forecast-warning">
                   <AlertCircle size={16} /> {forecastData.warning}
                </div>
              )}
            </div>

            <div className="rules-box">
               <h4 className="rules-title"><AlertCircle size={16} /> Rule-Based Alerts</h4>
               {ruleAlerts?.length > 0 ? (
                 <ul className="rules-list">
                   {ruleAlerts.map((a, i) => (
                     <li key={i} className="rule-item">
                       <span className="rule-dot"></span> {a}
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="rules-empty">
                    <CheckCircle2 size={16} className="text-sage" />
                    No active rule alerts. Attendance and vaccinations are on track.
                 </p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCircle = ({ ...props }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

export default ChildProfile;
