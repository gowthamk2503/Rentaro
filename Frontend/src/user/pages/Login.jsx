import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiShield, 
  FiInfo
} from 'react-icons/fi';
import '../styles/Login.css';

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/home';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both your email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth 2.0 Flow using useGoogleLogin hook (Bypasses GSI button origin restrictions)
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setLoading(true);
      try {
        // Fetch verified user profile directly from Google OAuth API
        const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const googleUser = userInfoRes.data;
        const payload = {
          email: googleUser.email,
          name: googleUser.name || googleUser.given_name,
          avatar: googleUser.picture,
          googleId: googleUser.sub,
        };

        const data = await googleLogin(payload);
        if (data.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirectPath);
        }
      } catch (err) {
        console.error('Google profile processing error:', err);
        setError(err.message || 'Google authentication failed. Please try again or use standard login.');
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.warn('Google Sign-In popup error/dismissal:', errorResponse);
      setError('Google Sign-In was cancelled or origin is not yet whitelisted in Google Cloud Console.');
    }
  });

  return (
    <div className="login-video-wrapper">
      {/* 1. Full-screen login background video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        preload="auto"
        disablePictureInPicture
        className="login-bg-video"
      >
        <source src="/login_car.mp4" type="video/mp4" />
      </video>

      {/* 2. Dark / Semi-transparent Overlay */}
      <div className="login-video-overlay"></div>

      {/* 3. Login Card Container */}
      <div className="login-card-container">
        <div className="login-card-glass">
          {/* Brand Header */}
          <div className="login-brand-header">
            <NavLink to="/" className="brand-logo mb-2">
              <div className="logo-icon-wrap">
                <span className="logo-r">R</span>
              </div>
              <span className="brand-name">RENTARO<span className="brand-dot">.</span></span>
            </NavLink>
            <h1 className="login-headline font-mono">Welcome Back</h1>
            <p className="login-subtext">Sign in to manage your bookings and exclusive fleet perks.</p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="login-alert-error">
              <FiInfo className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Normal Email / Password Form */}
          <form onSubmit={handleLogin} className="login-form-inner" noValidate>
            <div className="form-group-item">
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <div className="input-with-icon">
                <FiMail className="input-prefix-icon text-coral" />
                <input 
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="form-input"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group-item">
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className="input-with-icon">
                <FiLock className="input-prefix-icon text-coral" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  required
                  autoComplete="current-password"
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
              className="btn btn-primary w-full login-btn"
            >
              {loading ? 'Authenticating...' : <>Sign In <FiArrowRight /></>}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="demo-credentials-row">
            <span className="demo-hint-title font-mono">Quick Demo Fill:</span>
            <div className="demo-chips-group">
              <button 
                type="button" 
                className="demo-chip-btn"
                onClick={() => {
                  setEmail('customer@example.com');
                  setPassword('Password@123');
                }}
              >
                👤 Customer (Alex)
              </button>
              <button 
                type="button" 
                className="demo-chip-btn"
                onClick={() => {
                  setEmail('admin@rentaro.com');
                  setPassword('Admin@123');
                }}
              >
                🛡️ Admin (Rentaro)
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="login-social-divider font-mono">
            <span>OR CONTINUE WITH</span>
          </div>

          {/* Custom Google OAuth Button */}
          <div className="google-auth-container">
            <button 
              type="button" 
              onClick={() => triggerGoogleLogin()} 
              disabled={loading}
              className="custom-google-btn font-mono"
            >
              <FcGoogle size={22} />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Footer Links */}
          <div className="login-card-footer">
            <p className="signup-prompt">
              Don't have an account?{' '}
              <NavLink to="/register" className="text-coral font-bold">
                Sign Up Free
              </NavLink>
            </p>

            <NavLink to="/admin-login" className="admin-portal-shortcut font-mono">
              <FiShield /> Administrator Login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
