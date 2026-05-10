import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const GrowthMonitoring = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { children, addGrowthRecord } = useData();
  const child = children.find(c => c.id === id);
  
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    muac: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addGrowthRecord({
      childId: id,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      muac: parseFloat(formData.muac),
      notes: formData.notes
    });
    alert('Growth record added successfully!');
    navigate(`/child/${id}`);
  };

  if (!child) return <div>Child not found</div>;

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Growth Monitoring - {child.name}</h1>
          <p className="page-subtitle">Record growth measurements</p>
        </div>

        <div className="registration-form-container">
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Height (cm) *</label>
              <input
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>MUAC (cm) *</label>
              <input
                type="number"
                step="0.1"
                value={formData.muac}
                onChange={(e) => setFormData({...formData, muac: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(`/child/${id}`)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GrowthMonitoring;
