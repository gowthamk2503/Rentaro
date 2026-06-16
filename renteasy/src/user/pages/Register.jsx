import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Import axios
import API from '../../api/API';
import '../styles/Register.css';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    licenseNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // For showing loading state
  const [errorMessage, setErrorMessage] = useState(''); // For showing error messages

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      newErrors.email = 'Invalid email address';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.licenseNumber) newErrors.licenseNumber = 'Driver license is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true); // Start loading
        const response = await API.post('/api/users/register', formData); // Send form data to backend
        if (response.data.success) {
          login();
          navigate('/');
        } else {
          // setErrorMessage('Registration failed. Please try again.');
        }
        navigate('/');
      } catch (err) {
        setErrorMessage('Error registering. Please try again.');
        console.error(err);
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="register-container">
      <h2>Create Your Car Rental Account</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        {/* Video Background */}
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src="/login_car.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Driver's License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            placeholder="Enter your driver's license number"
          />
          {errors.licenseNumber && <span className="error">{errors.licenseNumber}</span>}
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/">Log in</Link>
      </p>
    </div>
  );
}
