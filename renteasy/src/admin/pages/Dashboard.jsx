import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import "../styles/Dashboard.css";

// Simple stat card
const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <div className="stat-title">{title}</div>
    <div className="stat-value">{value}</div>
  </div>
);

// Recent bookings table
const RecentBookings = ({ bookings }) => (
  <div className="recent-table">
    <h3>Recent Bookings</h3>
    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Car</th>
          <th>Date</th>
          <th>Status</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {bookings.slice(0, 5).map(b => (
          <tr key={b._id}>
            <td>{b.name}</td>
            <td>{b.car}</td>
            <td>{new Date(b.date).toLocaleDateString()}</td>
            <td>
              <span className={`badge badge-${b.status.toLowerCase()}`}>
                {b.status}
              </span>
            </td>
            <td>₹{b.totalCost.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Recent users table
const RecentUsers = ({ users }) => (
  <div className="recent-table">
    <h3>Recent Users</h3>
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Registered</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.slice(0, 5).map(u => (
          <tr key={u._id}>
            <td>{u.email}</td>
            <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</td>
            <td>
              <span className={`badge badge-${u.isActive ? "active" : "inactive"}`}>
                {u.isActive ? "Active" : "Inactive"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [bookingStatusData, setBookingStatusData] = useState([]);
  const [carAvailabilityData, setCarAvailabilityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all data in parallel
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, carsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/bookings"),
          axios.get("http://localhost:5000/api/cars"),
          axios.get("http://localhost:5000/api/users"),
        ]);

        // Bookings
        const bookings = bookingsRes.data.bookings || bookingsRes.data;
        const totalBookings = bookings.length;
        const activeBookings = bookings.filter(
          b => b.status && b.status.toLowerCase() === "active"
        ).length;
        const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);

        // Monthly revenue for chart
        const revenueByMonth = {};
        bookings.forEach(b => {
          const date = new Date(b.date);
          const month = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
          revenueByMonth[month] = (revenueByMonth[month] || 0) + (b.totalCost || 0);
        });
        const monthlyRevenueData = Object.entries(revenueByMonth).map(([month, total]) => ({
          month,
          total,
        }));

        // Booking status breakdown for pie chart
        const statusCounts = {};
        bookings.forEach(b => {
          const status = b.status || "Unknown";
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        const bookingStatusData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status,
          value: count,
        }));

        // Cars
        const cars = carsRes.data.cars || carsRes.data;
        const totalCars = cars.length;
        const availableCars = cars.filter(c => c.available).length;
        // Car availability for chart
        const carAvailabilityData = [
          { name: "Available", value: availableCars },
          { name: "Unavailable", value: totalCars - availableCars },
        ];

        // Users
        const users = Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data.users || [];
        const totalUsers = users.length;

        // Set state
        setStats({
          totalCars,
          availableCars,
          totalBookings,
          activeBookings,
          totalRevenue,
          totalUsers,
        });
        setRecentBookings(bookings.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setRecentUsers(users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setMonthlyRevenue(monthlyRevenueData);
        setBookingStatusData(bookingStatusData);
        setCarAvailabilityData(carAvailabilityData);
      } catch (err) {
        alert("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      {/* Overview Cards */}
      <div className="dashboard-stats-row">
        <StatCard title="Total Cars" value={stats.totalCars} />
        <StatCard title="Available Cars" value={stats.availableCars} />
        <StatCard title="Total Bookings" value={stats.totalBookings} />
        <StatCard title="Active Bookings" value={stats.activeBookings} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} />
        <StatCard title="Registered Users" value={stats.totalUsers} />
      </div>

      {/* Charts */}
      <div className="dashboard-charts-row">
        <div className="dashboard-chart-card">
          <h4>Monthly Revenue</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-chart-card">
          <h4>Booking Status</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {bookingStatusData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-chart-card">
          <h4>Car Availability</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={carAvailabilityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {carAvailabilityData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-activity-row">
        <RecentBookings bookings={recentBookings} />
        <RecentUsers users={recentUsers} />
      </div>

     
    </div>
  );
};

export default Dashboard;
