import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './ChildList.css';

const ChildList = () => {
  const navigate = useNavigate();
  const { children } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCentre, setFilterCentre] = useState('all');

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCentre = filterCentre === 'all' || child.centre === filterCentre;
    return matchesSearch && matchesCentre;
  });

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Children List</h1>
          <p className="page-subtitle">View and manage all registered children</p>
        </div>

        <div className="filters-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by child name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="filter-select" value={filterCentre} onChange={(e) => setFilterCentre(e.target.value)}>
            <option value="all">All Centres</option>
            <option value="Anganwadi Centre 1">Centre 1</option>
            <option value="Anganwadi Centre 2">Centre 2</option>
            <option value="Anganwadi Centre 3">Centre 3</option>
          </select>
        </div>

        <div className="children-grid">
          {filteredChildren.map(child => (
            <div key={child.id} className="child-card" onClick={() => navigate(`/child/${child.id}`)}>
              <div className="child-avatar">{child.name.charAt(0)}</div>
              <div className="child-info">
                <h3>{child.name}</h3>
                <p>Age: {child.age} years</p>
                <p>Parent: {child.parentName}</p>
                <p className="child-centre">{child.centre}</p>
              </div>
              <div className="child-actions">
                <button className="btn btn-primary btn-sm">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildList;
