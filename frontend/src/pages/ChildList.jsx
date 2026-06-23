import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, ChevronRight, User, MapPin } from 'lucide-react';
import './ChildList.css';

import { API_URL } from '../config';

const ChildList = () => {
  const [children, setChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

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

  const filteredChildren = children.filter(child => 
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="childlist-container page-transition">
      <div className="childlist-header">
        <div>
          <h1 className="heading-1">Children Directory</h1>
          <p className="text-muted text-uppercase">Manage and monitor {children.length} registered children</p>
        </div>
        <Link to="/register" className="poshan-btn poshan-btn-primary register-btn">
          <User size={20} className="btn-icon" /> Register New Child
        </Link>
      </div>

      <div className="childlist-controls">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by name or child ID..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={24} />
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="child-grid">
          {filteredChildren.map((child) => (
            <Link 
              to={`/child/${child.id}`} 
              key={child.id}
              className="child-card poshan-card"
            >
              <div className="child-card-bg-shape"></div>
              
              <div className="child-card-header">
                <div className="child-avatar">
                  {child.name[0]}
                </div>
                <div className="child-title-info">
                  <h3 className="child-name">{child.name}</h3>
                  <div className="child-status-row">
                    <p className="child-id">{child.id}</p>
                    <span className={`status-pill ${Math.random() > 0.3 ? 'status-present' : 'status-absent'}`}>
                      {Math.random() > 0.3 ? 'Present' : 'Absent'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="child-card-details">
                <div className="detail-row">
                  <span className="detail-label">Age</span>
                  <span className="detail-value">{child.age_months} Months</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Gender</span>
                  <span className={`gender-badge ${child.gender === 'Male' ? 'gender-male' : 'gender-female'}`}>
                    {child.gender}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Centre</span>
                  <span className="detail-value flex-value">
                    <MapPin size={12} className="pin-icon"/> {child.centre_name}
                  </span>
                </div>
              </div>

              <div className="child-card-footer">
                <span className="view-details-text">View Profile</span>
                <ChevronRight className="chevron-icon" size={20} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredChildren.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <Search size={40} className="empty-icon" />
          </div>
          <h3 className="empty-title">No children found</h3>
          <p className="empty-subtitle">Try a different search term or register a new child.</p>
        </div>
      )}
    </div>
  );
};

export default ChildList;
