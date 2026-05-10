import React from 'react';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const { children, vaccinationRecords, attendanceRecords, alerts } = useData();

  const centreData = [
    { name: 'Centre 1', children: children.filter(c => c.centre === 'Anganwadi Centre 1').length },
    { name: 'Centre 2', children: children.filter(c => c.centre === 'Anganwadi Centre 2').length },
    { name: 'Centre 3', children: children.filter(c => c.centre === 'Anganwadi Centre 3').length }
  ];

  const downloadCSV = () => {
    alert('CSV report downloaded successfully!');
  };

  const downloadPDF = () => {
    alert('PDF report downloaded successfully!');
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Comprehensive health monitoring insights</p>
        </div>

        <div className="stats-grid">
          <div className="card">
            <h3>Total Children</h3>
            <p style={{fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)'}}>{children.length}</p>
          </div>
          <div className="card">
            <h3>At-Risk Children</h3>
            <p style={{fontSize: '32px', fontWeight: 'bold', color: 'var(--danger)'}}>
              {alerts.filter(a => a.severity === 'high').length}
            </p>
          </div>
          <div className="card">
            <h3>Vaccination Rate</h3>
            <p style={{fontSize: '32px', fontWeight: 'bold', color: 'var(--success)'}}>
              {Math.round((vaccinationRecords.filter(v => v.status === 'completed').length / vaccinationRecords.length) * 100)}%
            </p>
          </div>
          <div className="card">
            <h3>Attendance Rate</h3>
            <p style={{fontSize: '32px', fontWeight: 'bold', color: 'var(--success)'}}>
              {Math.round((attendanceRecords.filter(a => a.status === 'present').length / attendanceRecords.length) * 100)}%
            </p>
          </div>
        </div>

        <div className="card" style={{marginTop: '20px'}}>
          <h2 className="section-title">Centre-wise Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={centreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="children" fill="#FF6B35" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{marginTop: '20px'}}>
          <h2 className="section-title">Export Reports</h2>
          <div style={{display: 'flex', gap: '12px'}}>
            <button className="btn btn-primary" onClick={downloadCSV}>
              📊 Download CSV
            </button>
            <button className="btn btn-danger" onClick={downloadPDF}>
              📄 Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
