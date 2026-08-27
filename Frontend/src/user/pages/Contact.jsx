import React, { useState } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiSend, 
  FiCheckCircle, 
  FiHelpCircle,
  FiChevronDown,
  FiUser,
  FiAlertCircle
} from 'react-icons/fi';
import '../styles/Contact.css';

const faqs = [
  {
    q: 'What documents are required to rent a vehicle?',
    a: 'You will need a valid government-issued Driving License and a valid Identity Proof (Passport, Aadhaar, or National ID). International drivers can provide an International Driving Permit (IDP).'
  },
  {
    q: 'What is the security deposit policy?',
    a: 'Security deposits are fully refundable and processed automatically within 24 hours of successful vehicle inspection upon return.'
  },
  {
    q: 'Is doorstep delivery and pickup available?',
    a: 'Yes! We provide complimentary doorstep delivery across metro areas for rentals of 2 days or more. You can specify your preferred drop location during booking.'
  },
  {
    q: 'Can I extend my reservation during the trip?',
    a: 'Absolutely. You can extend your active rental directly from your "My Bookings" dashboard, subject to vehicle availability.'
  },
  {
    q: 'What happens in case of an on-road breakdown or flat tire?',
    a: 'All Rentaro rentals include 24/7 Roadside Assistance. Our emergency hotline is available around the clock with rapid on-site support across India.'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const validateForm = () => {
    const errs = {};

    // 1. Full Name: Required
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your full name (at least 2 characters).';
    }

    // 2. Email: Required and valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // 3. Phone: Required and appropriate Indian phone number validation
    // Matches 10 digits starting with 6-9, or prefixed with +91/91/0
    const cleanPhone = formData.phone.replace(/[\s\-()]/g, '');
    const indianPhoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    if (!formData.phone.trim() || !indianPhoneRegex.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit Indian phone number (e.g. 7373692501).';
    }

    // 4. Subject: Required
    if (!formData.subject.trim()) {
      errs.subject = 'Please select an inquiry subject.';
    }

    // 5. Message: Required (at least 10 chars)
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide a detailed message (minimum 10 characters).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setSubmitted(true);
    setErrors({});
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    }, 5000);
  };

  return (
    <div className="contact-page-wrapper page-wrapper">
      {/* Decorative ambient background glows */}
      <div className="ambient-glow-pink" style={{ top: '10%', right: '5%' }}></div>
      <div className="ambient-glow-blue" style={{ bottom: '15%', left: '5%' }}></div>

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
        {/* Page Header */}
        <div className="contact-header-section text-center">
          <span className="section-tag">GET IN TOUCH</span>
          <h1 className="section-title font-mono">We're Here to Help Your Journey</h1>
          <p className="section-subtitle mx-auto">
            Have questions regarding vehicle reservations, custom schedules, or corporate mobility? Contact our operations specialist directly.
          </p>
        </div>

        {/* Contact Grid: Info Cards + Form */}
        <div className="contact-layout-grid">
          {/* Left Column: Direct Info */}
          <div className="contact-info-col">
            <div className="contact-card-box card-light">
              <h2 className="contact-col-title font-mono">Contact Information</h2>
              <p className="contact-col-desc">Reach out directly to our fleet management lead.</p>

              <div className="contact-channels-list">
                {/* Contact Lead Name */}
                <div className="channel-item">
                  <div className="channel-icon-wrap">
                    <FiUser />
                  </div>
                  <div>
                    <span className="channel-label">Lead Mobility Specialist</span>
                    <strong className="channel-val">Gowtham</strong>
                    <span className="channel-sub">Customer Fleet Operations Lead</span>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="channel-item">
                  <div className="channel-icon-wrap">
                    <FiPhone />
                  </div>
                  <div>
                    <span className="channel-label">Phone & Hotline</span>
                    <strong className="channel-val font-mono">
                      <a href="tel:7373692501" style={{ color: 'inherit' }}>7373692501</a>
                    </strong>
                    <span className="channel-sub">Direct call and WhatsApp assistance</span>
                  </div>
                </div>

                {/* Customer Support Email Card */}
                <div className="channel-item">
                  <div className="channel-icon-wrap">
                    <FiMail />
                  </div>
                  <div>
                    <span className="channel-label">Customer Support Email</span>
                    <strong className="channel-val font-mono">
                      <a href="mailto:vijaygowtham2530@gmail.com" style={{ color: 'inherit' }}>vijaygowtham2530@gmail.com</a>
                    </strong>
                    <span className="channel-sub">Direct response from operations lead</span>
                  </div>
                </div>

                {/* Mobility Hub Card */}
                <div className="channel-item">
                  <div className="channel-icon-wrap">
                    <FiMapPin />
                  </div>
                  <div>
                    <span className="channel-label">Fleet Operations Hub</span>
                    <strong className="channel-val">Rentaro Mobility Hub & Doorstep Delivery Dispatch Center</strong>
                    <span className="channel-sub">Sanitized vehicle delivery across metropolitan zones</span>
                  </div>
                </div>

                {/* Operational Hours */}
                <div className="channel-item">
                  <div className="channel-icon-wrap">
                    <FiClock />
                  </div>
                  <div>
                    <span className="channel-label">Operational Hours</span>
                    <strong className="channel-val font-mono">Mon – Sun: 24 Hours Open</strong>
                    <span className="channel-sub">Doorstep delivery and returns around the clock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="contact-form-col">
            <div className="contact-form-card card-light">
              <h2 className="contact-col-title font-mono">Send an Inquiry</h2>
              <p className="contact-col-desc">Fill out the inquiry form and Gowtham will get in touch with you promptly.</p>

              {submitted && (
                <div className="contact-success-alert">
                  <FiCheckCircle size={24} className="flex-shrink-0" />
                  <div>
                    <strong>Inquiry Sent Successfully!</strong>
                    <p>Thank you for reaching out. We will review your message and contact you via phone or email shortly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form-inner" noValidate>
                {/* Full Name */}
                <div className="form-group-item">
                  <label htmlFor="contact-name" className="form-label">Full Name *</label>
                  <input 
                    type="text"
                    id="contact-name"
                    className={`form-input ${errors.name ? 'input-invalid' : ''}`}
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    required
                  />
                  {errors.name && <span className="field-error-msg"><FiAlertCircle /> {errors.name}</span>}
                </div>

                {/* Email and Phone */}
                <div className="form-row-2">
                  <div className="form-group-item">
                    <label htmlFor="contact-email" className="form-label">Email Address *</label>
                    <input 
                      type="email"
                      id="contact-email"
                      className={`form-input ${errors.email ? 'input-invalid' : ''}`}
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      required
                    />
                    {errors.email && <span className="field-error-msg"><FiAlertCircle /> {errors.email}</span>}
                  </div>

                  <div className="form-group-item">
                    <label htmlFor="contact-phone" className="form-label">Phone Number *</label>
                    <input 
                      type="tel"
                      id="contact-phone"
                      className={`form-input font-mono ${errors.phone ? 'input-invalid' : ''}`}
                      placeholder="e.g. 7373692501"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: null });
                      }}
                      required
                    />
                    {errors.phone && <span className="field-error-msg"><FiAlertCircle /> {errors.phone}</span>}
                  </div>
                </div>

                {/* Subject Selection */}
                <div className="form-group-item">
                  <label htmlFor="contact-subject" className="form-label">Subject *</label>
                  <select 
                    id="contact-subject"
                    className="form-select"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Booking Assistance">Booking Assistance</option>
                    <option value="Corporate Fleet">Corporate Fleet</option>
                    <option value="Billing & Refund">Billing & Refund</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>

                {/* Your Message */}
                <div className="form-group-item">
                  <label htmlFor="contact-message" className="form-label">Your Message *</label>
                  <textarea 
                    id="contact-message"
                    rows="5"
                    className={`form-textarea ${errors.message ? 'input-invalid' : ''}`}
                    placeholder="Tell us how we can assist your journey or event requirements..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: null });
                    }}
                    required
                  ></textarea>
                  {errors.message && <span className="field-error-msg"><FiAlertCircle /> {errors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary w-full contact-submit-btn">
                  <FiSend /> Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="contact-faq-section">
          <div className="text-center mb-4">
            <span className="section-tag">FREQUENTLY ASKED</span>
            <h2 className="section-title font-mono">Common Questions</h2>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`faq-accordion-item card-light ${activeFaq === idx ? 'open' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
              >
                <div className="faq-question-row">
                  <span className="faq-q-text"><FiHelpCircle className="text-coral" /> {faq.q}</span>
                  <FiChevronDown className={`faq-chevron ${activeFaq === idx ? 'rotated' : ''}`} />
                </div>
                {activeFaq === idx && (
                  <div className="faq-answer-body">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
