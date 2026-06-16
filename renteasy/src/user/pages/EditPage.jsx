import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=eee&color=888&size=128';

const EditProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const currentEmail = localStorage.getItem('currentUserEmail');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    avatar: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentEmail) {
      navigate('/edit-profile');
      return;
    }
    // Immediately load user data (no setTimeout)
    const userData = JSON.parse(localStorage.getItem(`user_${currentEmail}`)) || {
      firstName: 'John',
      lastName: 'Doe',
      email: currentEmail,
      phone: '+91737392501',
      licenseNumber: 'TN76G2304',
      avatar: '',
    };
    setFormData(userData);
    setAvatarPreview(userData.avatar || DEFAULT_AVATAR);
    setIsLoading(false);
  }, [currentEmail, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save immediately (no setTimeout)
    if (currentEmail) {
      localStorage.setItem(`user_${currentEmail}`, JSON.stringify(formData));
    }
    navigate('/profile', {
      state: {
        updatedUser: formData,
        successMessage: 'Profile updated successfully!',
      },
      replace: true,
    });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="edit-profile-loading" role="status" aria-live="polite">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h1>Edit Profile</h1>
        <button
          className="back-button"
          onClick={() => navigate('/profile')}
        >
          Back to Profile
        </button>
      </div>
      <form onSubmit={handleSubmit} className="edit-profile-form" noValidate>
        <div className="form-group" style={{ alignItems: "center" }}>
          <label htmlFor="avatar" style={{ marginBottom: "0.5rem" }}>Profile Image</label>
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="profile-avatar"
            style={{ marginBottom: "0.7rem" }}
            onClick={() => fileInputRef.current.click()}
          />
          <input
            type="file"
            id="avatar"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <button
            type="button"
            className="back-button"
            style={{ fontSize: "0.95rem" }}
            onClick={() => fileInputRef.current.click()}
          >
            Change Image
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email (read-only)</label>
          <input
            name="email"
            id="email"
            value={formData.email}
            readOnly
            className="readonly"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label htmlFor="licenseNumber">License Number</label>
          <input
            name="licenseNumber"
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            placeholder="License Number"
            autoComplete="off"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-button" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
