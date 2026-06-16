import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import API from '../../api/API';

const DEFAULT_AVATAR = '/gowtham_ava.jpg';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail'));
  const [user, setUser] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [bookingCount, setBookingCount] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Fetch user data from localStorage
  useEffect(() => {
    if (!userEmail) {
      setUser({});
      return;
    }
    const userData = JSON.parse(localStorage.getItem(`user_${userEmail}`)) || {};
    setUser(userData);
  }, [userEmail]);

  // Listen for localStorage changes (e.g., login/logout in another tab)
  useEffect(() => {
    const handleStorage = () => {
      const updatedEmail = localStorage.getItem('userEmail');
      setUserEmail(updatedEmail);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Update user if profile was edited and passed via location.state
  useEffect(() => {
    if (!userEmail) return;
    if (location.state?.updatedUser) {
      setUser(location.state.updatedUser);
      setSuccessMessage(location.state.successMessage || '');
      localStorage.setItem(`user_${userEmail}`, JSON.stringify(location.state.updatedUser));
    }
  }, [location.state, userEmail]);

  // Fetch booking count for this user
  useEffect(() => {
    if (!userEmail) {
      setBookingCount(null);
      setBookingError('');
      return;
    }
    const load = async () => {
      setLoadingBookings(true);
      setBookingError('');
      try {
        const res = await API.get(`/api/bookings/email/${userEmail}`);
        const data = res.data;
        const bookings = data.bookings || data;
        if (!Array.isArray(bookings)) throw new Error('Invalid bookings data');
        setBookingCount(bookings.length);
      } catch (err) {
        setBookingCount(0);
        setBookingError('Could not fetch bookings');
        console.error(err);
      } finally {
        setLoadingBookings(false);
      }
    };
    load();
  }, [userEmail]);

  if (!userEmail) {
    return (
      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>
        <div style={{ color: 'red', textAlign: 'center' }}>Please log in first.</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header-inline">
        <img 
          src={user.avatar || DEFAULT_AVATAR} 
          alt="Profile Avatar" 
          className="profile-avatar-small"
        />
        <div style={{ marginLeft: "1rem", color: "#555", fontSize: "1rem" }}>
          Logged in as: <b>{userEmail}</b>
          <div style={{ color: "#1976d2", fontWeight: 600, fontSize: "1.1rem" }}>
            {loadingBookings
              ? 'Loading bookings...'
              : bookingError
                ? bookingError
                : `Bookings: ${bookingCount}`}
          </div>
        </div>
      </div>

      <h2 className="profile-title">My Profile</h2>
      {successMessage && <div className="profile-success">{successMessage}</div>}
      <div className="profile-details">
        <div className="profile-item">
          <span className="profile-label">First Name:</span>
          <span className="profile-value">{user.firstName}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Last Name:</span>
          <span className="profile-value">{user.lastName}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{user.email}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Phone:</span>
          <span className="profile-value">{user.phone}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">License Number:</span>
          <span className="profile-value">{user.licenseNumber}</span>
        </div>
      </div>
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          className="save-button"
          style={{ padding: "0.6rem 1.5rem", fontSize: "1rem" }}
          onClick={() => navigate('/edit-profile')}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
