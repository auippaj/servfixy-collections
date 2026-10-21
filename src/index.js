import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Auto-logout: if the API rejects the saved token, clear the login and return to the login screen
const originalFetch = window.fetch.bind(window);
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  try {
    if ((response.status === 401 || response.status === 403) && localStorage.getItem('collections_token')) {
      const body = await response.clone().json().catch(() => null);
      const message = body && (body.error || body.message);
      if (typeof message === 'string' && /invalid or expired token/i.test(message)) {
        localStorage.removeItem('collections_token');
        localStorage.removeItem('collections_user');
        window.location.reload();
      }
    }
  } catch (e) { /* never block the original response */ }
  return response;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
