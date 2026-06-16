import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../../api/API';
import '../styles/AllUsers.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get('/api/users');

        console.log('Fetched users:', res.data);

        // Handle possible data structures gracefully
        const userData = Array.isArray(res.data) ? res.data : res.data.users;

        setUsers(userData || []);
      } catch (err) {
        console.error('Failed to fetch users:', err.message);
        setError('Failed to fetch users. Please try again later.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="users-loading">Loading users...</div>;

  if (error) return <div className="users-error">{error}</div>;

  return (
    <div className="users-container">
      <div className="users-content-wrapper">
        <div className="users-header">
          <h2>User Management</h2>
          <div className="users-count">{users.length} Registered Users</div>
        </div>
        
        <div className="users-controls">
          <div className="users-search">
            <input 
              type="text" 
              placeholder="Search users by email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="users-empty">
            <div className="empty-icon">👤</div>
            <p className="empty-text">
              {searchTerm ? "No users match your search criteria." : "No users found in the system."}
            </p>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id || index}>
                    <td>{user.email}</td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                    <td>
                      <div className="user-actions">
                        <button className="user-action-btn edit" title="Edit User">
                          ✏️
                        </button>
                        <button className="user-action-btn delete" title="Delete User">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
       
      </div>
    </div>
  );
};

export default AllUsers;