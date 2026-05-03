import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSync } from '../context/SyncContext';
import { UserPlus, Save, ChevronLeft, Calendar, User, Phone, MapPin, Building, FileText } from 'lucide-react';
import './ChildRegistration.css';

const InputWrapper = ({ label, icon, children }) => (
  <div className="form-group">
    <label className="poshan-label">{label}</label>
    {icon ? (
      <div className="input-with-icon">
        <div className="input-icon">
          {icon}
        </div>
        {children}
      </div>
    ) : (
      children
    )}
  </div>
);

const ChildRegistration = () => {
  const navigate = useNavigate();
  const { addToSyncQueue, isOnline } = useSync();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age_months: '',
    gender: 'Male',
    parent_name: '',
    parent_phone: '',
    address: '',
    centre_name: 'Anganwadi Centre 1',
    notes: ''
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Auto-generate ID for demo
    const childId = `CH-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalData = { ...formData, id: childId };

    // Offline-first logic: Always add to sync queue
    await addToSyncQueue('child', finalData);
    
    // Simulate some delay
    setTimeout(() => {
      setSaving(false);
      navigate('/children');
    }, 1000);
  };

  return (
    <div className="registration-container page-transition">
      <div className="registration-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ChevronLeft size={24}/>
        </button>
        <div>
          <h1 className="heading-1">Register New Child</h1>
          <p className="text-muted text-uppercase">Digital enrollment for health and nutrition tracking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="registration-form-wrapper">
        <div className="poshan-card registration-card">
          <div className="registration-card-bg"></div>
          
          <div className="form-grid relative z-10">
            <InputWrapper label="Full Name" icon={<User size={18}/>}>
              <input
                required
                type="text"
                className="poshan-input icon-padded-input"
                placeholder="e.g. Aarav Kumar"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </InputWrapper>

            <InputWrapper label="Date of Birth" icon={<Calendar size={18}/>}>
              <input
                required
                type="date"
                className="poshan-input icon-padded-input"
                value={formData.dob}
                onChange={(e) => {
                  const dob = new Date(e.target.value);
                  const diff = new Date().getTime() - dob.getTime();
                  const age_months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
                  setFormData({...formData, dob: e.target.value, age_months: age_months});
                }}
              />
            </InputWrapper>

            <InputWrapper label="Gender">
              <div className="gender-selector">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'Male'})}
                  className={`gender-btn ${formData.gender === 'Male' ? 'active' : ''}`}
                >Male</button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'Female'})}
                  className={`gender-btn ${formData.gender === 'Female' ? 'active' : ''}`}
                >Female</button>
              </div>
            </InputWrapper>

            <InputWrapper label="Age (Months)" icon={<Calendar size={18}/>}>
              <input
                type="number"
                readOnly
                className="poshan-input icon-padded-input disabled-input"
                value={formData.age_months}
                placeholder="Calculated from DOB"
              />
            </InputWrapper>

            <InputWrapper label="Parent/Guardian Name" icon={<User size={18}/>}>
              <input
                required
                type="text"
                className="poshan-input icon-padded-input"
                value={formData.parent_name}
                onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
              />
            </InputWrapper>

            <InputWrapper label="Parent Phone" icon={<Phone size={18}/>}>
              <input
                required
                type="tel"
                className="poshan-input icon-padded-input"
                placeholder="+91"
                value={formData.parent_phone}
                onChange={(e) => setFormData({...formData, parent_phone: e.target.value})}
              />
            </InputWrapper>

            <InputWrapper label="Address" icon={<MapPin size={18}/>}>
              <input
                required
                type="text"
                className="poshan-input icon-padded-input"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </InputWrapper>

            <InputWrapper label="Anganwadi Centre" icon={<Building size={18}/>}>
              <select
                className="poshan-input icon-padded-input select-input"
                value={formData.centre_name}
                onChange={(e) => setFormData({...formData, centre_name: e.target.value})}
              >
                <option>Anganwadi Centre 1</option>
                <option>Anganwadi Centre 2</option>
                <option>Anganwadi Centre 3</option>
              </select>
            </InputWrapper>
          </div>

          <div className="full-width-input relative z-10">
            <InputWrapper label="Additional Notes" icon={<FileText size={18}/>}>
              <textarea
                rows="3"
                className="poshan-input icon-padded-input textarea-input"
                placeholder="Health history, allergies, etc."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </InputWrapper>
          </div>
        </div>

        <div className="registration-actions">
          <button
            type="submit"
            disabled={saving}
            className="poshan-btn poshan-btn-primary save-submit-btn"
          >
            {saving ? <div className="spinner-small"></div> : <Save size={24}/>}
            <span>{saving ? 'Processing...' : (isOnline ? 'Save and Register' : 'Save Locally (Offline Mode)')}</span>
          </button>
          
          {!isOnline && (
            <div className="offline-mode-badge">
              <span className="pulse-dot"></span>
              <span>Offline Mode Active</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChildRegistration;
