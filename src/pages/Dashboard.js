import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { children, growthRecords, attendanceRecords, vaccinationRecords, alerts } = useData();

  // Calculate stats
  const totalChildren = children.length;
  const atRiskChildren = alerts.filter(a => !a.resolved && a.severity === 'high').length;
  const vaccinationsDue = vaccinationRecords.filter(v => v.status === 'due').length;
  
  const todayAttendance = attendanceRecords.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.date).toDateString() === today;
  });
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;
  const attendanceRate = todayAttendance.length > 0 ? Math.round((presentToday / todayAttendance.length) * 100) : 0;

  // Growth trend data
  const growthTrendData = [
    { month: 'Jan', children: 18 },
    { month: 'Feb', children: 19 },
    { month: 'Mar', children: 19 },
    { month: 'Apr', children: 20 },
    { month: 'May', children: 20 },
    { month: 'Jun', children: 20 }
  ];

  // Risk distribution
  const riskData = [
    { name: 'Normal', value: totalChildren - atRiskChildren - 3, color: '#4CAF50' },
    { name: 'Moderate', value: 3, color: '#FFC107' },
    { name: 'High Risk', value: atRiskChildren, color: '#F44336' }
  ];

  // Vaccination coverage
  const vaccinationData = [
    { name: 'BCG', coverage: 98 },
    { name: 'DPT', coverage: 95 },
    { name: 'OPV', coverage: 96 },
    { name: 'Measles', coverage: 92 }
  ];

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of child health monitoring</p>
        </div>

        <div className="stats-grid">
          <StatCard
            icon="👶"
            title="Total Children"
            value={totalChildren}
            color="primary"
            onClick={() => navigate('/children')}
          />
          <StatCard
            icon="🚨"
            title="At Risk"
            value={atRiskChildren}
            subtitle="Require attention"
            color="danger"
            onClick={() => navigate('/alerts')}
          />
          <StatCard
            icon="💉"
            title="Vaccinations Due"
            value={vaccinationsDue}
            subtitle="This week"
            color="warning"
            onClick={() => navigate('/vaccinations')}
          />
          <StatCard
            icon="✅"
            title="Attendance Today"
            value={`${attendanceRate}%`}
            subtitle={`${presentToday} present`}
            color="success"
            onClick={() => navigate('/attendance')}
          />
        </div>

        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => navigate('/register-child')}>
              <span className="action-icon">➕</span>
              <span>Register Child</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/attendance')}>
              <span className="action-icon">✅</span>
              <span>Mark Attendance</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/vaccinations')}>
              <span className="action-icon">💉</span>
              <span>Update Vaccination</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/notifications')}>
              <span className="action-icon">📱</span>
              <span>Send Notification</span>
            </button>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Growth Monitoring Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={growthTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="children" stroke="#FF6B35" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Vaccination Coverage</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={vaccinationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="coverage" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-alerts">
          <h2 className="section-title">Recent Alerts</h2>
          <div className="alerts-list">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
                <div className="alert-icon">
                  {alert.severity === 'high' ? '🔴' : alert.severity === 'medium' ? '🟡' : '🟢'}
                </div>
                <div className="alert-content">
                  <h4>{children.find(c => c.id === alert.childId)?.name}</h4>
                  <p>{alert.message}</p>
                  <span className="alert-time">{new Date(alert.createdAt).toLocaleDateString()}</span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/child/${alert.childId}`)}>
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
