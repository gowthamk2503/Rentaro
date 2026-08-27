import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
  return (
    <header className="app-header">
      <nav className="nav-container">
        <Link to="/" className="logo">
          RentEasy
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>
    </header>
  );
}