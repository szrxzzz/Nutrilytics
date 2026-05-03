import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, AlertTriangle, Syringe, CalendarCheck, TrendingUp, Info, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalChildren: 0,
    atRisk: 0,
    vaccinationsDue: 0,
    attendanceToday: 0,
    pendingSync: 0
  });

  const [riskData, setRiskData] = useState([
    { name: 'Low Risk', value: 15, color: 'var(--color-teal)' },
    { name: 'Medium Risk', value: 7, color: 'var(--color-orange)' },
    { name: 'High Risk', value: 3, color: 'var(--color-danger)' }
  ]);

  const [growthTrend, setGrowthTrend] = useState([
    { month: 'Jan', avgWeight: 12.5 },
    { month: 'Feb', avgWeight: 12.8 },
    { month: 'Mar', avgWeight: 12.7 },
    { month: 'Apr', avgWeight: 13.1 },
    { month: 'May', avgWeight: 13.4 },
    { month: 'Jun', avgWeight: 13.6 }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const resp = await axios.get('http://localhost:8000/children');
      const children = resp.data;
      
      const alertsResp = await axios.get('http://localhost:8000/alerts');
      const alerts = alertsResp.data;

      setStats({
        totalChildren: children.length,
        atRisk: alerts.filter(a => a.severity === 'high').length,
        vaccinationsDue: 12, // Placeholder
        attendanceToday: 85, // Percentage placeholder
        pendingSync: 5
      });
    } catch (err) {
      console.error("Dashboard fetch error", err);
    }
  };

  const StatCard = ({ title, value, icon, type, subtitle }) => (
    <div className={`poshan-card stat-card stat-${type}`}>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
        {subtitle && (
          <p className="stat-subtitle">
            <Info size={12} /> {subtitle}
          </p>
        )}
      </div>
      <div className="stat-icon-wrapper">
        {icon}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container page-transition">
      <div className="dashboard-header">
        <div>
          <h1 className="heading-1">Dashboard</h1>
          <p className="text-muted">Welcome to the Nutrilytics Command Center. System is online and syncing.</p>
        </div>
        <div className="dashboard-actions">
          <div className="sync-status">
            <span className="sync-dot pulse-animation"></span>
            Sync Active
          </div>
          <button className="poshan-btn poshan-btn-outline date-btn">
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Children" 
          value={stats.totalChildren} 
          icon={<Users size={28} />} 
          type="primary" 
          subtitle="Enrolled in centre" 
        />
        <StatCard 
          title="At-Risk Children" 
          value={stats.atRisk} 
          icon={<AlertTriangle size={28} />} 
          type="danger" 
          subtitle="Requires attention" 
        />
        <StatCard 
          title="Vaccinations Due" 
          value={stats.vaccinationsDue} 
          icon={<Syringe size={28} />} 
          type="warning" 
          subtitle="Next 7 days" 
        />
        <StatCard 
          title="Attendance Today" 
          value={`${stats.attendanceToday}%`} 
          icon={<CalendarCheck size={28} />} 
          type="success" 
          subtitle="Average this week" 
        />
        <StatCard 
          title="Pending Sync" 
          value={stats.pendingSync} 
          icon={<Activity size={28} />} 
          type="neutral" 
          subtitle="Offline records" 
        />
      </div>

      <div className="charts-grid">
        <div className="poshan-card chart-card">
          <div className="chart-header">
            <h3 className="heading-2">Growth Trend Analysis</h3>
            <span className="chart-badge">
              <TrendingUp size={14} /> AVG WEIGHT (KG)
            </span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-secondary)'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-secondary)'}} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-primary)', fontWeight: '600'}}
                />
                <Line type="monotone" dataKey="avgWeight" stroke="var(--color-orange)" strokeWidth={4} dot={{r: 6, fill: 'var(--color-orange)', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="poshan-card chart-card">
          <div className="chart-header border-bottom">
            <h3 className="heading-2">Risk Severity Distribution</h3>
          </div>
          <div className="chart-body pie-chart-body">
            <div className="pie-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-primary)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="pie-legend">
              {riskData.map((item) => (
                <div key={item.name} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="poshan-card chart-card">
          <div className="chart-header">
            <h3 className="heading-2">Attendance Pattern</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'Mon', attendance: 85 },
                { day: 'Tue', attendance: 90 },
                { day: 'Wed', attendance: 88 },
                { day: 'Thu', attendance: 92 },
                { day: 'Fri', attendance: 82 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-secondary)'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-secondary)'}} dx={-10} domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: 'rgba(42, 157, 143, 0.05)'}}
                  contentStyle={{borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-primary)', fontWeight: '600'}}
                />
                <Bar dataKey="attendance" fill="var(--color-teal)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="poshan-card chart-card">
          <div className="chart-header">
            <h3 className="heading-2">Vaccination Coverage</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { age: '0-3m', coverage: 95 },
                { age: '3-6m', coverage: 88 },
                { age: '6-9m', coverage: 85 },
                { age: '9-12m', coverage: 92 }
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-secondary)'}} domain={[0, 100]} />
                <YAxis type="category" dataKey="age" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-secondary)'}} dx={-10} />
                <Tooltip 
                  cursor={{fill: 'rgba(132, 169, 140, 0.05)'}}
                  contentStyle={{borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-primary)', fontWeight: '600'}}
                />
                <Bar dataKey="coverage" fill="var(--color-sage)" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
