import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import '../styles/NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page-wrapper page-wrapper">
      <div className="container-custom">
        <div className="notfound-card card-light">
          <div className="notfound-icon-wrap">
            <span className="notfound-404 font-mono">404</span>
          </div>
          <h1 className="notfound-title font-mono">Destination Not Found</h1>
          <p className="notfound-sub">
            The page or route you are looking for has moved or does not exist on the Rentaro platform.
          </p>
          <div className="notfound-actions">
            <NavLink to="/" className="btn btn-primary">
              <FiArrowLeft /> Return to Home
            </NavLink>
            <NavLink to="/cars" className="btn btn-outline">
              Explore Fleet
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
