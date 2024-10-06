import React from 'react';
import './header.css';
import Logo from './imageFolder/logo.png';
import Menu from './icons/menu-svgrepo-com.svg';
import Search from './icons/search-svgrepo-com.svg';
import Account from './icons/account-svgrepo-com.svg';

const Header = ({ toggleSidebar }) => {
  return (
    <header className='Header-section'>
      <div className='left-logo'>
        <img className='Ham-Menu' src={Menu} alt='Menu-svg' onClick={toggleSidebar} /> {/* Toggle sidebar on click */}
        <img className='logo' src={Logo} alt="logo-svg" />
      </div>
      <div className='search-section'>
        <input className='input-search' type='text' placeholder='Search' />
        <button className='search-button'>
          <img className='search-svg' src={Search} alt='Search' />
        </button>
      </div>
      <div className='account-section'>
        <img className='account-svg' src={Account} alt='Account' />
      </div>
    </header>
  );
};

export default Header;
