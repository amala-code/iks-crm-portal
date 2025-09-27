import React from 'react';

const Header = ({ title = 'Content', showPublish = false }) => {
  return (
    <header className="header">
      <div className="breadcrumb">
        <span>Dashboard</span>
        <span className="breadcrumb-separator">/</span>
        <span>{title}</span>
      </div>
      <div className="header-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="save-status">
          <span className="save-icon">✓</span>
          <span>All changes saved</span>
        </div>
        {showPublish && (
          <button className="publish-button">Publish</button>
        )}
        <div className="user-avatar">
          <img src="/api/placeholder/40/40" alt="User" />
        </div>
      </div>
    </header>
  );
};

export default Header;