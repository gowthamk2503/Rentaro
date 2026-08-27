import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiPhone, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiInfo
} from 'react-icons/fi';
import '../styles/Login.css';

export default function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !name) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        phone,
      });
      navigate('/home');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth 2.0 Flow using useGoogleLogin hook
  const triggerGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setLoading(true);
      try {
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

        await googleLogin(payload);
        navigate('/home');
      } catch (err) {
        console.error('Google registration error:', err);
        setError(err.message || 'Google registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.warn('Google Sign-In popup error/dismissal:', errorResponse);
      setError('Google Sign-In was cancelled or origin is not authorized in Google Cloud Console.');
    }
  });

  return (
    <div className="login-video-wrapper">
      {/* Background Video */}
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

      {/* Dark Overlay */}
      <div className="login-video-overlay"></div>

      {/* Register Card */}
      <div className="login-card-container">
        <div className="login-card-glass">
          <div className="login-brand-header">
            <NavLink to="/" className="brand-logo mb-2">
              <div className="logo-icon-wrap">
                <span className="logo-r">R</span>
              </div>
              <span className="brand-name">RENTARO<span className="brand-dot">.</span></span>
            </NavLink>
            <h1 className="login-headline font-mono">Create Account</h1>
            <p className="login-subtext">Join Rentaro to reserve premium cars with instant verification.</p>
          </div>

          {error && (
            <div className="login-alert-error">
              <FiInfo className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="login-form-inner" noValidate>
            <div className="form-group-item">
              <label htmlFor="reg-name" className="form-label">Full Legal Name</label>
              <div className="input-with-icon">
                <FiUser className="input-prefix-icon text-coral" />
                <input 
                  type="text"
                  id="reg-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group-item">
              <label htmlFor="reg-email" className="form-label">Email Address</label>
              <div className="input-with-icon">
                <FiMail className="input-prefix-icon text-coral" />
                <input 
                  type="email"
                  id="reg-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group-item">
              <label htmlFor="reg-password" className="form-label">Password</label>
              <div className="input-with-icon">
                <FiLock className="input-prefix-icon text-coral" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
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

            <div className="form-group-item">
              <label htmlFor="reg-phone" className="form-label">Phone Number (Optional)</label>
              <div className="input-with-icon">
                <FiPhone className="input-prefix-icon text-coral" />
                <input 
                  type="tel"
                  id="reg-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full login-btn"
            >
              {loading ? 'Creating Account...' : <>Sign Up Free <FiArrowRight /></>}
            </button>
          </form>

          <div className="login-social-divider font-mono">
            <span>OR SIGN UP WITH</span>
          </div>

          {/* Custom Google OAuth Button */}
          <div className="google-auth-container">
            <button 
              type="button" 
              onClick={() => triggerGoogleRegister()} 
              disabled={loading}
              className="custom-google-btn font-mono"
            >
              <FcGoogle size={22} />
              <span>Sign Up with Google</span>
            </button>
          </div>

          <div className="login-card-footer">
            <p className="signup-prompt">
              Already have an account?{' '}
              <NavLink to="/login" className="text-coral font-bold">
                Sign In
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
