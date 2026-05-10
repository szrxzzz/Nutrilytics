import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './ChildRegistration.css';

const ChildRegistration = () => {
  const navigate = useNavigate();
  const { addChild } = useData();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    parentName: '',
    parentPhone: '',
    address: '',
    centre: 'Anganwadi Centre 1',
    aadhaar: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = Math.floor((new Date() - new Date(formData.dob)) / (365.25 * 24 * 60 * 60 * 1000));
    await addChild({ ...formData, age });
    alert('Child registered successfully!');
    navigate('/children');
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Register New Child</h1>
          <p className="page-subtitle">Add a new child to the monitoring system</p>
        </div>

        <div className="registration-form-container">
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Child Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter child's full name"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Anganwadi Centre *</label>
                <select name="centre" value={formData.centre} onChange={handleChange}>
                  <option value="Anganwadi Centre 1">Anganwadi Centre 1</option>
                  <option value="Anganwadi Centre 2">Anganwadi Centre 2</option>
                  <option value="Anganwadi Centre 3">Anganwadi Centre 3</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Parent/Guardian Name *</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                  placeholder="Enter parent's name"
                />
              </div>
              <div className="form-group">
                <label>Parent Phone Number *</label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  required
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter complete address"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Aadhaar Number (Optional)</label>
              <input
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="XXXX XXXX XXXX"
              />
            </div>

            <div className="form-group">
              <label>Health Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any health concerns or notes"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/children')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Register Child
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChildRegistration;
