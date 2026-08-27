import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../../services/api';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiAward, 
  FiCalendar, 
  FiShield, 
  FiEdit2, 
  FiCheckCircle, 
  FiArrowRight,
  FiClock,
  FiFileText
} from 'react-icons/fi';
import '../styles/Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(user || {});
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authApi.getProfile();
        if (res.user) {
          setProfileData(res.user);
          setBookingCount(res.bookingCount || 0);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.name || profileData?.email || 'User')}&background=F9DDE1&color=E85D6A&size=200`;

  return (
    <div className="profile-page-wrapper page-wrapper">
      <div className="container-custom">
        <div className="profile-content-container">
          {/* Top Banner & Header Card */}
          <div className="profile-hero-card card-light">
            <div className="profile-avatar-wrap">
              <img 
                src={profileData?.avatar || defaultAvatar} 
                alt="Profile Avatar" 
                className="profile-avatar-large"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
              <span className="online-indicator" title="Active"></span>
            </div>

            <div className="profile-header-info">
              <div className="profile-name-role">
                <h1 className="profile-user-name">{profileData?.name || 'Rentaro Member'}</h1>
                <span className={`badge ${profileData?.role === 'admin' ? 'badge-pending' : 'badge-active'}`}>
                  {profileData?.role === 'admin' ? 'Administrator' : 'Verified Driver'}
                </span>
              </div>
              <p className="profile-user-email"><FiMail className="text-coral" /> {profileData?.email}</p>
              <p className="profile-joined-text">
                <FiCalendar className="text-muted" /> Member since {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2026'}
              </p>
            </div>

            <button 
              onClick={() => navigate('/edit-profile')} 
              className="btn btn-primary edit-profile-btn"
            >
              <FiEdit2 /> Edit Profile
            </button>
          </div>

          {/* Metrics & Personal Information Split */}
          <div className="profile-grid-layout">
            {/* Left Col: Account Details */}
            <div className="profile-details-card card-light">
              <h3 className="card-section-title font-mono"><FiUser className="text-coral" /> Account Information</h3>

              <div className="profile-info-row">
                <span className="profile-info-label">Full Legal Name:</span>
                <span className="profile-info-value">{profileData?.name || 'Not provided'}</span>
              </div>

              <div className="profile-info-row">
                <span className="profile-info-label">Email Address:</span>
                <span className="profile-info-value font-mono">{profileData?.email}</span>
              </div>

              <div className="profile-info-row">
                <span className="profile-info-label">Phone Number:</span>
                <span className="profile-info-value">{profileData?.phone || 'Not provided'}</span>
              </div>

              <div className="profile-info-row">
                <span className="profile-info-label">Driving Licence No:</span>
                <span className="profile-info-value font-mono">{profileData?.licenseNumber || 'DL-PENDING-VERIFY'}</span>
              </div>

              <div className="profile-info-row">
                <span className="profile-info-label">Account Privilege:</span>
                <span className="profile-info-value" style={{ textTransform: 'capitalize' }}>{profileData?.role || 'User'}</span>
              </div>
            </div>

            {/* Right Col: Trip Statistics & Quick Actions */}
            <div className="profile-stats-card card-light">
              <h3 className="card-section-title font-mono"><FiAward className="text-coral" /> Driving Activity</h3>

              <div className="profile-stat-box">
                <span className="stat-big-num font-mono">{bookingCount}</span>
                <span className="stat-sub-label">Completed & Active Reservations</span>
              </div>

              <div className="account-safety-badge">
                <FiShield className="text-green" size={24} />
                <div>
                  <h4 className="safety-title">Identity & License Verified</h4>
                  <p className="safety-desc">Your profile is approved for instant vehicle reservations without extra verification deposit.</p>
                </div>
              </div>

              <div className="profile-actions-list">
                <NavLink to="/bookings" className="btn btn-outline w-full">
                  <FiClock /> View All Reservations <FiArrowRight />
                </NavLink>
                <NavLink to="/cars" className="btn btn-primary w-full">
                  Rent Another Vehicle <FiArrowRight />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
