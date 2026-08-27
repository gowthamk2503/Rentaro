import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCreditCard, 
  FiSave, 
  FiCheckCircle, 
  FiImage 
} from 'react-icons/fi';
import '../styles/EditProfile.css';

export default function EditPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setLicenseNumber(user.licenseNumber || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await updateProfile({
        name,
        phone,
        licenseNumber,
        avatar,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1200);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const presetAvatars = [
    '/gowtham_ava.jpg',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="edit-profile-page-wrapper page-wrapper">
      <div className="container-custom">
        <div className="edit-profile-container">
          <div className="edit-profile-top-bar">
            <button onClick={() => navigate('/profile')} className="btn btn-outline btn-sm">
              <FiArrowLeft /> Back to Profile
            </button>
            <h1 className="edit-page-title font-mono">Edit Account Information</h1>
          </div>

          <div className="edit-form-card card-light">
            {success && (
              <div className="edit-alert-success">
                <FiCheckCircle size={20} /> Profile updated successfully! Redirecting...
              </div>
            )}

            {error && (
              <div className="edit-alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="edit-profile-form">
              {/* Avatar Selection */}
              <div className="avatar-picker-section">
                <label className="form-label">Profile Avatar</label>
                <div className="avatar-preview-row">
                  <img 
                    src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=F9DDE1&color=E85D6A&size=200`}
                    alt="Current Avatar" 
                    className="avatar-preview-img"
                  />
                  <div className="avatar-presets-col">
                    <span className="text-xs text-muted mb-2 block">Choose preset or enter custom image URL below:</span>
                    <div className="preset-avatars-row">
                      {presetAvatars.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(p)}
                          className={`preset-thumb-btn ${avatar === p ? 'active' : ''}`}
                        >
                          <img src={p} alt={`Preset ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <input 
                  type="url"
                  className="form-input mt-2"
                  placeholder="https://example.com/your-custom-photo.jpg"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>

              {/* Legal Name */}
              <div className="form-group-item">
                <label className="form-label"><FiUser className="text-coral" /> Full Legal Name</label>
                <input 
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                />
              </div>

              {/* Email (Read-Only) */}
              <div className="form-group-item">
                <label className="form-label"><FiMail className="text-coral" /> Registered Email Address</label>
                <input 
                  type="email"
                  className="form-input input-readonly font-mono"
                  value={user?.email || ''}
                  disabled
                />
                <span className="text-xs text-muted mt-1 block">Email is permanently linked to your verified account credentials.</span>
              </div>

              {/* Phone */}
              <div className="form-group-item">
                <label className="form-label"><FiPhone className="text-coral" /> Phone Number</label>
                <input 
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                />
              </div>

              {/* License Number */}
              <div className="form-group-item">
                <label className="form-label"><FiCreditCard className="text-coral" /> Driving License Number</label>
                <input 
                  type="text"
                  className="form-input font-mono"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="DL-0420110012345"
                />
                <span className="text-xs text-muted mt-1 block">Required for on-site vehicle handover and insurance activation.</span>
              </div>

              {/* Action Buttons */}
              <div className="edit-actions-row">
                <button 
                  type="button" 
                  onClick={() => navigate('/profile')}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn btn-primary"
                >
                  <FiSave /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
