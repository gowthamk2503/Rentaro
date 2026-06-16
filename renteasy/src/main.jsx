import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="56876991932-se4hvqv2np49klmgf6vu101j705g690g.apps.googleusercontent.com">

      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
