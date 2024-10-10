// Logout.js
import React from 'react';
import { logout } from './authService';

const Logout = () => {
  const handleLogout = async () => {
    await logout();
    // Redirect or show a success message
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
