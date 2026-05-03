import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const VaccinationTracker = () => {
  const navigate = useNavigate();
  const { children, vaccinationRecords } = useData();

  const dueVaccinations = vaccinationRecords.filter(v => v.status === 'due');

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Vaccination Tracker</h1>
          <p className="page-subtitle">Monitor and update vaccination status</p>
        </div>

        <div className="card">
          <h2 className="section-title">Due Vaccinations</h2>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #E0E0E0'}}>
                <th style={{padding: '12px', textAlign: 'left'}}>Child Name</th>
                <th style={{padding: '12px', textAlign: 'left'}}>Vaccine</th>
                <th style={{padding: '12px', textAlign: 'left'}}>Due Date</th>
                <th style={{padding: '12px', textAlign: 'left'}}>Status</th>
                <th style={{padding: '12px', textAlign: 'left'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {dueVaccinations.map(v => {
                const child = children.find(c => c.id === v.childId);
                return (
                  <tr key={v.id} style={{borderBottom: '1px solid #E0E0E0'}}>
                    <td style={{padding: '12px'}}>{child?.name}</td>
                    <td style={{padding: '12px'}}>{v.vaccineName}</td>
                    <td style={{padding: '12px'}}>{new Date(v.dueDate).toLocaleDateString()}</td>
                    <td style={{padding: '12px'}}>
                      <span className="badge badge-warning">{v.status}</span>
                    </td>
                    <td style={{padding: '12px'}}>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/child/${v.childId}`)}>
                        View Child
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VaccinationTracker;
