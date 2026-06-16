import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Mock authentication for admin
      if (email === 'admin@carrental.com' && password === 'Admin@123') {
        // Store admin auth status (in real app, use proper auth tokens)
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error("Admin login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/login_car.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>
      
      <div className="login-card admin-login-card" role="main" aria-label="Admin login form">
        <header className="login-header">
          <h2>Admin Portal</h2>
          <p>Restricted access to authorized personnel only</p>
        </header>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="login-form" noValidate>
          <div className="input-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              type="email"
              id="admin-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="admin-password">Password</label>
            <input
              type="password"
              id="admin-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>
          
          <div className="security-notice">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>This system is monitored. Unauthorized access is prohibited.</span>
          </div>
          
          <button type="submit" className="login-button admin-login-button" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? (
              <span className="spinner" aria-label="Loading"></span>
            ) : (
              'Login as Admin'
            )}
          </button>
          
          <div className="back-to-main">
            <button 
              type="button" 
              className="back-button"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              ← Back to User Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}