import React, { useState, useEffect, useRef } from 'react';
import './header.css';
import Logo from './imageFolder/logo.png';
import Menu from './icons/menu_open_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import Search from './icons/search_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import Account from './icons/account_circle_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const handleAccountClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className='Header-section'>
      <div className='left-logo'>
        <img className='Ham-Menu' src={Menu} alt='Menu-svg' onClick={toggleSidebar}  />
        <img className='logo' src={Logo} alt="logo-svg" />
      </div>
      <div className='search-section'>
        <input className='input-search' type='text' placeholder='Search' />
        <button className='search-button'>
          <img className='search-svg' src={Search} alt='Search' />
        </button>
      </div>
      <div className='account-section'>
        <img className='account-svg' src={Account} alt='Account' onClick={handleAccountClick} />
        
        {dropdownOpen && (
          <div ref={dropdownRef} className="dropdown-menu">
            <ul>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/appearance">Appearance</Link></li>
              <li><Link to="/settings">Settings</Link></li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
