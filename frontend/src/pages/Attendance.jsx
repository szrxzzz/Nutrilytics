import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle2, XCircle, Search, Filter, Save, Users } from 'lucide-react';
import { useSync } from '../context/SyncContext';
import './Attendance.css';

import { API_URL } from '../config';

const Attendance = () => {
  const { isOnline, addToSyncQueue } = useSync();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const resp = await axios.get(`${API_URL}/children`);
      setChildren(resp.data);
      
      // Initialize attendance state (all present by default for demo)
      const initialAttendance = {};
      resp.data.forEach(child => {
        initialAttendance[child.id] = true;
      });
      setAttendanceData(initialAttendance);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch children", err);
      setLoading(false);
    }
  };

  const toggleAttendance = (id) => {
    setAttendanceData(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const date = new Date().toISOString().split('T')[0];
    const records = Object.entries(attendanceData).map(([childId, present]) => ({
      childId,
      date,
      present
    }));

    if (isOnline) {
      try {
        // In a real app, this would hit a batch attendance endpoint
        console.log("Saving attendance to server...", records);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
        alert("Attendance saved successfully!");
      } catch (err) {
        console.error("Save failed", err);
        addToSyncQueue('attendance', records);
        alert("Offline: Saved to local sync queue.");
      }
    } else {
      addToSyncQueue('attendance', records);
      alert("Offline: Saved to local sync queue.");
    }
    setSaving(false);
  };

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         child.id.includes(searchTerm);
    if (filterStatus === 'present') return matchesSearch && attendanceData[child.id];
    if (filterStatus === 'absent') return matchesSearch && !attendanceData[child.id];
    return matchesSearch;
  });

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="attendance-container page-transition">
      <div className="attendance-header">
        <div>
          <h1 className="heading-1">Daily Attendance</h1>
          <p className="text-muted">Mark attendance for {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <button 
          className="poshan-btn poshan-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : <><Save size={18} /> Save Attendance</>}
        </button>
      </div>

      <div className="attendance-controls poshan-card">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            className="poshan-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} className="filter-icon" />
          <select 
            className="poshan-input filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Children</option>
            <option value="present">Present Only</option>
            <option value="absent">Absent Only</option>
          </select>
        </div>
      </div>

      <div className="attendance-stats-row">
        <div className="mini-stat">
          <Users size={16} />
          <span>Total: {children.length}</span>
        </div>
        <div className="mini-stat present">
          <CheckCircle2 size={16} />
          <span>Present: {Object.values(attendanceData).filter(v => v).length}</span>
        </div>
        <div className="mini-stat absent">
          <XCircle size={16} />
          <span>Absent: {Object.values(attendanceData).filter(v => !v).length}</span>
        </div>
      </div>

      <div className="attendance-grid">
        {filteredChildren.map(child => (
          <div 
            key={child.id} 
            className={`attendance-card poshan-card ${attendanceData[child.id] ? 'present' : 'absent'}`}
            onClick={() => toggleAttendance(child.id)}
          >
            <div className="child-avatar">
              {child.name[0]}
            </div>
            <div className="child-info">
              <h4 className="child-name">{child.name}</h4>
              <span className="child-id">ID: {child.id}</span>
            </div>
            <div className="status-indicator">
              {attendanceData[child.id] ? (
                <CheckCircle2 className="status-icon present" />
              ) : (
                <XCircle className="status-icon absent" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredChildren.length === 0 && (
        <div className="empty-state poshan-card">
          <p>No children found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;
