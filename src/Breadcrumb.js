// Breadcrumb.js
import React from 'react';
import { Link } from 'react-router-dom';
import './breadcrumb.css'; // Create this CSS file for styles

const Breadcrumb = ({ links }) => {
  return (
    <nav className="breadcrumb">
      {links.map((link, index) => (
        <span key={index}>
          {index > 0 && ' > '}
          <Link to={link.path}>{link.label}</Link>
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
