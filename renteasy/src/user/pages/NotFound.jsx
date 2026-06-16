import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>Sorry, we couldn't find what you were looking for.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
