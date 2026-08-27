import React, { useEffect, useState } from 'react';
import { adminUsersApi } from '../../services/api';
import { 
  FiUsers, 
  FiSearch, 
  FiShield, 
  FiUser, 
  FiCalendar, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiMail, 
  FiPhone,
  FiRefreshCw
} from 'react-icons/fi';
import '../styles/AllUsers.css';

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminUsersApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError('Failed to retrieve registered users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleUserStatus = async (user) => {
    const newStatus = !user.isActive;
    setUpdatingId(user._id);
    try {
      await adminUsersApi.updateStatus(user._id, { isActive: newStatus });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: newStatus } : u));
    } catch (err) {
      alert('Failed to update user status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    setUpdatingId(user._id);
    try {
      await adminUsersApi.updateStatus(user._id, { role: newRole });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to change user role: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete account ${userEmail}?`)) return;
    try {
      await adminUsersApi.delete(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      alert('User deleted.');
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.toLowerCase().includes(term))
    );
  });

  return (
    <div className="admin-users-page">
      {/* Header */}
      <div className="users-page-header">
        <div>
          <span className="section-tag">DRIVER DIRECTORY</span>
          <h1 className="users-admin-title font-mono">Customer Management</h1>
          <p className="users-admin-subtitle">
            View registered customers, booking records, verified licenses, and manage roles.
          </p>
        </div>

        <button onClick={fetchUsers} className="btn btn-outline btn-sm">
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Toolbar */}
      <div className="users-toolbar card-light">
        <div className="users-search-box">
          <FiSearch className="search-icon-pos text-coral" />
          <input 
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="users-search-input"
          />
        </div>
        <div className="users-count-badge font-mono">
          {users.length} Total Accounts
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="skeleton" style={{ height: '350px', borderRadius: '18px' }}></div>
      ) : error ? (
        <div className="empty-users-box card-light">
          <p className="text-coral">{error}</p>
          <button onClick={fetchUsers} className="btn btn-primary mt-3">Retry</button>
        </div>
      ) : (
        <div className="admin-users-table-card card-light">
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Customer Profile</th>
                  <th>Contact Info</th>
                  <th>Driving License</th>
                  <th>Total Bookings</th>
                  <th>Account Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No customer accounts matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-profile-cell">
                          <img 
                            src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.email)}&background=F9DDE1&color=E85D6A`} 
                            alt="Avatar" 
                            className="table-user-avatar"
                            onError={(e) => { e.target.src = '/gowtham_ava.jpg'; }}
                          />
                          <div>
                            <strong className="user-full-name">{u.name || 'Member'}</strong>
                            <div className="text-xs text-muted">Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '2026'}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="user-contact-cell">
                          <span className="font-mono text-xs">{u.email}</span>
                          <span className="text-xs text-muted">{u.phone || 'No phone set'}</span>
                        </div>
                      </td>

                      <td>
                        <span className="license-cell font-mono text-xs">{u.licenseNumber || 'Pending'}</span>
                      </td>

                      <td>
                        <span className="booking-count-badge font-mono">
                          {u.bookingsCount !== undefined ? u.bookingsCount : 0} Trips
                        </span>
                      </td>

                      <td>
                        <select 
                          value={u.role || 'user'}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          disabled={updatingId === u._id}
                          className="role-dropdown-select font-mono"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td>
                        <button 
                          onClick={() => handleToggleUserStatus(u)}
                          disabled={updatingId === u._id}
                          className={`badge-toggle-btn ${u.isActive !== false ? 'badge-available' : 'badge-booked'}`}
                        >
                          {u.isActive !== false ? '● Active' : '● Inactive'}
                        </button>
                      </td>

                      <td>
                        <button 
                          onClick={() => handleDeleteUser(u._id, u.email)}
                          className="btn-icon-action delete-btn"
                          title="Delete User Account"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}