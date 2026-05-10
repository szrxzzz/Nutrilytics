import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Syringe, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import './VaccinationTracker.css';

const VaccinationTracker = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVaccinations = useCallback(async () => {
    try {
      const resp = await axios.get('http://localhost:8000/children');
      const mockVaccines = [];
      resp.data.forEach(child => {
        mockVaccines.push({
          id: `v-${child.id}`,
          childName: child.name,
          childId: child.id,
          vaccine: 'BCG',
          dueDate: '2024-05-10',
          status: Math.random() > 0.3 ? 'completed' : 'due',
          overdue: Math.random() > 0.8
        });
        mockVaccines.push({
          id: `v2-${child.id}`,
          childName: child.name,
          childId: child.id,
          vaccine: 'OPV-1',
          dueDate: '2024-06-15',
          status: 'due',
          overdue: false
        });
      });
      setRecords(mockVaccines);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVaccinations();
  }, [fetchVaccinations]);

  const handleGenerateCSV = () => {
    const headers = ['Child Name', 'Child ID', 'Vaccine', 'Due Date', 'Status'];
    const rows = records.map(record => [
      `"${record.childName}"`,
      `"${record.childId}"`,
      `"${record.vaccine}"`,
      `"${record.dueDate}"`,
      `"${record.status === 'completed' ? 'Immunized' : record.overdue ? 'Overdue' : 'Upcoming'}"`
    ]);

    // Add BOM for Excel compatibility
    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vaccine_summary.csv';
    document.body.appendChild(link);
    link.click();
    
    // Small delay to ensure the browser handles the download before cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);
  };

  const calculateStats = () => {
    if (records.length === 0) return { fully: 0, partial: 0, atRisk: 0 };
    
    const childrenMap = {};
    records.forEach(r => {
      if (!childrenMap[r.childId]) {
        childrenMap[r.childId] = { total: 0, completed: 0, overdue: false };
      }
      childrenMap[r.childId].total++;
      if (r.status === 'completed') childrenMap[r.childId].completed++;
      if (r.overdue) childrenMap[r.childId].overdue = true;
    });

    const children = Object.values(childrenMap);
    const totalChildren = children.length;
    
    const fully = children.filter(c => c.completed === c.total).length;
    const atRisk = children.filter(c => c.overdue).length;
    const partial = totalChildren - fully - atRisk;

    return {
      fully: Math.round((fully / totalChildren) * 100) || 0,
      partial: Math.max(0, Math.round((partial / totalChildren) * 100)) || 0,
      atRisk: Math.round((atRisk / totalChildren) * 100) || 0
    };
  };

  const stats = calculateStats();

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="vaccination-container page-transition">
      <div className="vaccination-header">
        <div>
          <h1 className="heading-1">Vaccination Tracker</h1>
          <p className="text-muted text-uppercase">Monitoring immunization coverage and overdue alerts</p>
        </div>
      </div>

      <div className="vaccination-content-grid">
        <div className="vaccination-table-container">
          <div className="poshan-card table-card">
            <table className="vaccination-table">
              <thead>
                <tr>
                  <th>Child Details</th>
                  <th>Vaccine</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id} className="table-row">
                    <td>
                      <div className="child-cell-info">
                        <div className="child-avatar-small">
                          {record.childName[0]}
                        </div>
                        <div className="child-text-info">
                          <p className="child-name">{record.childName}</p>
                          <p className="child-id">{record.childId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="vaccine-name">{record.vaccine}</td>
                    <td className="due-date">{record.dueDate}</td>
                    <td>
                      <span className={`status-badge ${
                        record.status === 'completed' ? 'badge-completed' : record.overdue ? 'badge-overdue' : 'badge-upcoming'
                      }`}>
                        {record.status === 'completed' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                        {record.status === 'completed' ? 'Immunized' : record.overdue ? 'Overdue' : 'Upcoming'}
                      </span>
                    </td>
                    <td>
                      <button className="update-action-btn">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="vaccination-summary-sidebar">
          <div className="poshan-card summary-card">
            <Syringe className="summary-bg-icon" size={120}/>
            <h3 className="summary-title">Status Summary</h3>
            <div className="summary-stats-list">
              <div className="summary-stat-item">
                <span className="stat-label">Fully Vaccinated</span>
                <span className="stat-value">{stats.fully}%</span>
              </div>
              <div className="summary-stat-item">
                <span className="stat-label">Partial</span>
                <span className="stat-value">{stats.partial}%</span>
              </div>
              <div className={`summary-stat-item ${stats.atRisk > 0 ? 'stat-item-danger' : ''}`}>
                <span className="stat-label">At Risk (Overdue)</span>
                <span className="stat-value">{stats.atRisk}%</span>
              </div>
            </div>
            <button className="generate-list-btn" onClick={handleGenerateCSV}>Generate List</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationTracker;
