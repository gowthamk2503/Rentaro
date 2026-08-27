import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { statsApi, bookingsApi } from '../../services/api';
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
  FiTruck, 
  FiCalendar, 
  FiDollarSign, 
  FiUsers, 
  FiCheckCircle, 
  FiPlus, 
  FiArrowRight, 
  FiTrendingUp, 
  FiActivity,
  FiRefreshCw
} from 'react-icons/fi';
import '../styles/Dashboard.css';

const CHART_COLORS = ['#E85D6A', '#75AF8B', '#F59E0B', '#3B82F6', '#8B5CF6'];

export default function Dashboard() {
  const [data, setData] = useState({
    stats: {
      totalCars: 0,
      availableCars: 0,
      totalBookings: 0,
      activeBookings: 0,
      totalRevenue: 0,
      totalUsers: 0,
    },
    monthlyRevenue: [],
    bookingStatusData: [],
    carAvailabilityData: [],
    categoryData: [],
    recentBookings: [],
    recentUsers: [],
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadDashboardData = async () => {
    try {
      const res = await statsApi.getDashboardStats();
      setData(res);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleQuickStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await bookingsApi.updateStatus(bookingId, newStatus);
      loadDashboardData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page-container">
        <div className="skeleton" style={{ height: '40px', width: '250px', marginBottom: '2rem' }}></div>
        <div className="dashboard-stats-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton" style={{ height: '110px', borderRadius: '16px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  const { stats, monthlyRevenue, bookingStatusData, carAvailabilityData, recentBookings, recentUsers } = data;

  return (
    <div className="dashboard-page-container">
      {/* Top Header & Actions */}
      <div className="dashboard-header-toolbar">
        <div>
          <span className="section-tag">OVERVIEW METRICS</span>
          <h1 className="dashboard-title font-mono">Fleet Intelligence Dashboard</h1>
          <p className="dashboard-subtitle">Real-time revenue, fleet utilization, and reservation pipelines.</p>
        </div>

        <div className="dashboard-actions-group">
          <button onClick={loadDashboardData} className="btn btn-outline btn-sm">
            <FiRefreshCw /> Sync Data
          </button>
          <NavLink to="/admin/cars/add" className="btn btn-primary btn-sm">
            <FiPlus /> Add New Vehicle
          </NavLink>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="dashboard-stats-grid">
        <div className="kpi-stat-card card-light">
          <div className="kpi-icon-wrap" style={{ background: 'var(--soft-pink)', color: 'var(--accent-red)' }}>
            <FiDollarSign />
          </div>
          <div className="kpi-content">
            <span className="kpi-label font-mono">Total Revenue</span>
            <h3 className="kpi-value font-mono">₹{Number(stats.totalRevenue || 0).toLocaleString()}</h3>
            <span className="kpi-subtext text-green"><FiTrendingUp /> Live Gross Bookings</span>
          </div>
        </div>

        <div className="kpi-stat-card card-light">
          <div className="kpi-icon-wrap" style={{ background: 'var(--soft-blue)', color: '#3B82F6' }}>
            <FiCalendar />
          </div>
          <div className="kpi-content">
            <span className="kpi-label font-mono">Total Bookings</span>
            <h3 className="kpi-value font-mono">{stats.totalBookings}</h3>
            <span className="kpi-subtext">All Time Reservations</span>
          </div>
        </div>

        <div className="kpi-stat-card card-light">
          <div className="kpi-icon-wrap" style={{ background: '#EAF6EF', color: '#2D7A4D' }}>
            <FiActivity />
          </div>
          <div className="kpi-content">
            <span className="kpi-label font-mono">Active Trips</span>
            <h3 className="kpi-value font-mono">{stats.activeBookings}</h3>
            <span className="kpi-subtext text-green">● Vehicles On Road</span>
          </div>
        </div>

        <div className="kpi-stat-card card-light">
          <div className="kpi-icon-wrap" style={{ background: '#FEF9C3', color: '#A16207' }}>
            <FiTruck />
          </div>
          <div className="kpi-content">
            <span className="kpi-label font-mono">Fleet Available</span>
            <h3 className="kpi-value font-mono">{stats.availableCars} / {stats.totalCars}</h3>
            <span className="kpi-subtext">Ready for Dispatch</span>
          </div>
        </div>

        <div className="kpi-stat-card card-light">
          <div className="kpi-icon-wrap" style={{ background: 'var(--soft-blue)', color: '#6366F1' }}>
            <FiUsers />
          </div>
          <div className="kpi-content">
            <span className="kpi-label font-mono">Registered Customers</span>
            <h3 className="kpi-value font-mono">{stats.totalUsers}</h3>
            <span className="kpi-subtext">Verified Accounts</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="dashboard-charts-grid">
        {/* Monthly Revenue Chart */}
        <div className="dashboard-chart-card card-light">
          <div className="chart-header">
            <h3 className="chart-title font-mono">Monthly Revenue Trend</h3>
            <span className="chart-sub">Fiscal Year 2026</span>
          </div>
          <div className="chart-stage">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E85D6A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E85D6A" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#71757D" fontSize={12} tickLine={false} />
                <YAxis stroke="#71757D" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip 
                  formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E9EBF0', borderRadius: '8px', color: '#25252B', fontFamily: 'Space Mono' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E85D6A" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="dashboard-chart-card card-light">
          <div className="chart-header">
            <h3 className="chart-title font-mono">Reservation Status Breakdown</h3>
            <span className="chart-sub">Current distribution</span>
          </div>
          <div className="chart-stage">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E9EBF0', borderRadius: '8px', color: '#25252B' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(val) => <span style={{ color: '#71757D', fontSize: '12px' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="dashboard-tables-grid">
        {/* Recent Bookings Table */}
        <div className="dashboard-table-card card-light">
          <div className="table-header-row">
            <div>
              <h3 className="table-title font-mono">Recent Trip Reservations</h3>
              <p className="table-subtitle">Latest incoming requests across all hubs.</p>
            </div>
            <NavLink to="/admin/bookings" className="btn btn-outline btn-sm">
              All Bookings <FiArrowRight />
            </NavLink>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>REF</th>
                  <th>Vehicle</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No recent reservations recorded.</td>
                  </tr>
                ) : (
                  recentBookings.slice(0, 5).map((booking) => (
                    <tr key={booking._id}>
                      <td className="font-mono text-xs font-bold text-coral">{booking.bookingRef || booking._id.slice(-6).toUpperCase()}</td>
                      <td>
                        <strong>{booking.car}</strong>
                      </td>
                      <td>{booking.name}</td>
                      <td className="font-mono font-bold">₹{Number(booking.totalCost || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${(booking.status || 'pending').toLowerCase()}`}>
                          {booking.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={booking.status}
                          disabled={updatingId === booking._id}
                          onChange={(e) => handleQuickStatusChange(booking._id, e.target.value)}
                          className="admin-inline-select"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="dashboard-table-card card-light">
          <div className="table-header-row">
            <div>
              <h3 className="table-title font-mono">New Registered Drivers</h3>
              <p className="table-subtitle">Recently verified user profiles.</p>
            </div>
            <NavLink to="/admin/users" className="btn btn-outline btn-sm">
              All Users <FiArrowRight />
            </NavLink>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">No recent users.</td>
                  </tr>
                ) : (
                  recentUsers.slice(0, 5).map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-mini-cell">
                          <img 
                            src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=F9DDE1&color=E85D6A`} 
                            alt={u.name} 
                            className="user-cell-avatar" 
                          />
                          <span className="user-cell-name font-bold">{u.name}</span>
                        </div>
                      </td>
                      <td className="text-xs font-mono">{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-pending' : 'badge-active'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="text-xs text-muted">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
