import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../user/contexts/AuthContext';
import { 
  FiShield, 
  FiLock, 
  FiMail, 
  FiEye, 
  FiEyeOff, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiAlertTriangle 
} from 'react-icons/fi';
import '../styles/AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [email, setEmail] = useState('admin@rentaro.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.message || 'Authentication failed. Please verify credentials or contact sysadmin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page-wrapper">
      {/* Soft Ambient Glows */}
      <div className="ambient-glow-pink" style={{ top: '15%', left: '10%' }}></div>
      <div className="ambient-glow-blue" style={{ bottom: '15%', right: '10%' }}></div>

      <div className="admin-auth-card card-light">
        <div className="admin-header-badge">
          <div className="admin-shield-icon">
            <FiShield />
          </div>
          <span className="section-tag">MANAGEMENT CONSOLE</span>
          <h1 className="admin-title font-mono">Rentaro Admin Portal</h1>
          <p className="admin-subtitle">Authorized fleet controllers only. Sessions are monitored and encrypted.</p>
        </div>

        {error && (
          <div className="admin-error-box">
            <FiAlertTriangle className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminSubmit} className="admin-form" noValidate>
          <div className="form-group-item">
            <label htmlFor="adminEmail" className="form-label">Administrator Email</label>
            <div className="input-with-icon">
              <FiMail className="input-prefix-icon text-coral" />
              <input 
                type="email"
                id="adminEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rentaro.com"
                className="form-input font-mono"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group-item">
            <label htmlFor="adminPassword" className="form-label">Master Password</label>
            <div className="input-with-icon">
              <FiLock className="input-prefix-icon text-coral" />
              <input 
                type={showPassword ? 'text' : 'password'}
                id="adminPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
                disabled={loading}
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full admin-submit-btn"
          >
            {loading ? 'Verifying Authorization...' : 'Access Admin Console'}
          </button>
        </form>

        <div className="admin-demo-creds card-light">
          <p className="demo-creds-title font-mono">Pre-filled Demo Credentials:</p>
          <p className="demo-creds-body">Email: <code>admin@rentaro.com</code> | Password: <code>Admin@123</code></p>
        </div>

        <div className="admin-footer-back">
          <NavLink to="/" className="btn btn-outline btn-sm">
            <FiArrowLeft /> Return to Customer Website
          </NavLink>
        </div>
      </div>
    </div>
  );
}