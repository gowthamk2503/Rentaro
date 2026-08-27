import React, { useEffect, useState } from 'react';
import { statsApi } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiDollarSign, 
  FiPercent, 
  FiClock, 
  FiTruck, 
  FiAward,
  FiRefreshCw
} from 'react-icons/fi';
import '../styles/Dashboard.css';

const CHART_COLORS = ['#E85D6A', '#75AF8B', '#F59E0B', '#3B82F6', '#8B5CF6', '#06B6D4'];

export default function Analytics() {
  const [data, setData] = useState({
    stats: { totalCars: 0, availableCars: 0, totalBookings: 0, activeBookings: 0, totalRevenue: 0, totalUsers: 0 },
    monthlyRevenue: [],
    bookingStatusData: [],
    carAvailabilityData: [],
    categoryData: []
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const res = await statsApi.getDashboardStats();
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page-container">
        <div className="skeleton" style={{ height: '40px', width: '220px', marginBottom: '2rem' }}></div>
        <div className="dashboard-charts-grid">
          <div className="skeleton" style={{ height: '320px', borderRadius: '18px' }}></div>
          <div className="skeleton" style={{ height: '320px', borderRadius: '18px' }}></div>
        </div>
      </div>
    );
  }

  const { stats, monthlyRevenue, bookingStatusData, carAvailabilityData, categoryData } = data;
  const utilizationRate = stats.totalCars > 0 
    ? Math.round(((stats.totalCars - stats.availableCars) / stats.totalCars) * 100) 
    : 0;

  return (
    <div className="dashboard-page-container">
      {/* Header */}
      <div className="dashboard-header-toolbar">
        <div>
          <span className="section-tag">INTELLIGENCE & REPORTS</span>
          <h1 className="dashboard-title font-mono">Analytics & Fleet Telemetry</h1>
          <p className="dashboard-subtitle">Long-term earnings trajectory, category popularity, and utilization index.</p>
        </div>

        <button onClick={loadAnalytics} className="btn btn-outline btn-sm">
          <FiRefreshCw /> Refresh Reports
        </button>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-stats-grid">
        <div className="kpi-stat-card card-light">
          <div className="kpi-icon-wrap" style={{ background: '#EAF6EF', color: '#2D7A4D' }}>
            <FiPercent />
          </div>
          <div className="kpi-content">
            <span className="kpi-label font-mono">Fleet Utilization</span>
            <h3 className="kpi-value font-mono">{utilizationRate}%</h3>
            <span className="kpi-subtext">{stats.totalCars - stats.availableCars} active / {stats.totalCars} total</span>
          </div>
        </div>

        <div className="kpi-stat-card card-light">
          <div className="kpi-icon-wrap" style={{ background: 'var(--soft-pink)', color: 'var(--accent-red)' }}>
            <FiDollarSign />
          </div>
          <div className="kpi-content">
            <span className="kpi-label font-mono">Gross Fleet Revenue</span>
            <h3 className="kpi-value font-mono">₹{Number(stats.totalRevenue || 0).toLocaleString()}</h3>
            <span className="kpi-subtext text-green">● Lifetime Volume</span>
          </div>
        </div>

        <div className="kpi-stat-card card-light">
          <div className="kpi-icon-wrap" style={{ background: '#FEF9C3', color: '#A16207' }}>
            <FiClock />
          </div>
          <div className="kpi-content">
            <span className="kpi-label font-mono">Avg Rental Duration</span>
            <h3 className="kpi-value font-mono">3.4 Days</h3>
            <span className="kpi-subtext">Across all categories</span>
          </div>
        </div>

        <div className="kpi-stat-card card-light">
          <div className="kpi-icon-wrap" style={{ background: 'var(--soft-blue)', color: '#8B5CF6' }}>
            <FiAward />
          </div>
          <div className="kpi-content">
            <span className="kpi-label font-mono">Top Category</span>
            <h3 className="kpi-value font-mono">Electric & SUV</h3>
            <span className="kpi-subtext">Highest demand segment</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-charts-grid">
        {/* Revenue Area Chart */}
        <div className="dashboard-chart-card card-light">
          <div className="chart-header">
            <h3 className="chart-title font-mono">Revenue Trajectory (Area View)</h3>
            <span className="chart-sub">Monthly earnings distribution</span>
          </div>
          <div className="chart-stage">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E85D6A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E85D6A" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#71757D" fontSize={12} tickLine={false} />
                <YAxis stroke="#71757D" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E9EBF0', borderRadius: '8px', color: '#25252B', fontFamily: 'Space Mono' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E85D6A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Inventory Bar Chart */}
        <div className="dashboard-chart-card card-light">
          <div className="chart-header">
            <h3 className="chart-title font-mono">Category Fleet Distribution</h3>
            <span className="chart-sub">Number of registered vehicles per class</span>
          </div>
          <div className="chart-stage">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="category" stroke="#71757D" fontSize={12} tickLine={false} />
                <YAxis stroke="#71757D" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E9EBF0', borderRadius: '8px', color: '#25252B', fontFamily: 'Space Mono' }} 
                />
                <Bar dataKey="count" fill="#E85D6A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
