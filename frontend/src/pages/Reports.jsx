import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Download, Filter, FileText, TrendingUp, Users, AlertCircle } from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const [reportType, setReportType] = useState('health');

  const healthData = [
    { category: 'Normal', count: 120, color: 'var(--color-primary)' },
    { category: 'MAM', count: 45, color: 'var(--color-sage)' },
    { category: 'SAM', count: 12, color: 'var(--color-danger)' },
  ];

  const monthlyTrend = [
    { month: 'Jan', attendance: 88, healthIndex: 72 },
    { month: 'Feb', attendance: 85, healthIndex: 75 },
    { month: 'Mar', attendance: 92, healthIndex: 78 },
    { month: 'Apr', attendance: 90, healthIndex: 82 },
    { month: 'May', attendance: 85, healthIndex: 80 },
    { month: 'Jun', attendance: 88, healthIndex: 85 },
  ];

  return (
    <div className="reports-container page-transition">
      <div className="reports-header">
        <div>
          <h1 className="heading-1">Analytical Reports</h1>
          <p className="text-muted">Generate and export centre performance and health metrics.</p>
        </div>
        <div className="header-actions">
          <button className="poshan-btn poshan-btn-outline">
            <Filter size={18} /> Filter Data
          </button>
          <button className="poshan-btn poshan-btn-primary">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="reports-grid">
        <div className="poshan-card report-stat-card">
          <div className="report-stat-icon primary">
            <Users size={24} />
          </div>
          <div className="report-stat-info">
            <span className="stat-label">Beneficiary Coverage</span>
            <h3 className="stat-value">94.2%</h3>
            <span className="stat-change positive">+2.1% from last month</span>
          </div>
        </div>

        <div className="poshan-card report-stat-card">
          <div className="report-stat-icon danger">
            <AlertCircle size={24} />
          </div>
          <div className="report-stat-info">
            <span className="stat-label">Critical Cases</span>
            <h3 className="stat-value">12</h3>
            <span className="stat-change negative">-3 from last month</span>
          </div>
        </div>

        <div className="poshan-card report-stat-card">
          <div className="report-stat-icon sage">
            <TrendingUp size={24} />
          </div>
          <div className="report-stat-info">
            <span className="stat-label">Avg Health Index</span>
            <h3 className="stat-value">82/100</h3>
            <span className="stat-change positive">+5 pts from last month</span>
          </div>
        </div>
      </div>

      <div className="charts-main-grid">
        <div className="poshan-card report-chart-large">
          <div className="chart-header">
            <h3 className="heading-2">Attendance vs Health Performance</h3>
            <p className="text-muted">Correlation between daily attendance and nutritional outcomes</p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="var(--color-primary)" strokeWidth={3} dot={{r: 4}} />
                <Line type="monotone" dataKey="healthIndex" stroke="var(--color-accent)" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="poshan-card report-chart-side">
          <div className="chart-header">
            <h3 className="heading-2">Nutritional Status</h3>
            <p className="text-muted">Current distribution</p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend-custom">
              {healthData.map(item => (
                <div key={item.category} className="legend-item">
                  <span className="dot" style={{backgroundColor: item.color}}></span>
                  <span className="label">{item.category}</span>
                  <span className="val">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
