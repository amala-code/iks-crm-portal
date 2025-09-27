// src/components/Dashboard.js
import React, { useState } from 'react';
import ContentForm from './ContentForm';
import ContentList from './ContentList';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('news');

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1 className="logo">Dashboard</h1>
        <nav>
          <ul>
            {[ 'event_info','photo_gallery'].map((section) => (
              <li 
                key={section}
                className={activeSection === section ? 'active' : ''}
                onClick={() => setActiveSection(section)}
              >
                {section.replace('_', ' ').toUpperCase()}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="dashboard-header">
          <h2>Welcome to CMS Dashboard</h2>
          <div className="user-profile">
            <span>Admin User</span>
            <div className="avatar">AU</div>
          </div>
        </header>
        
        <div className="content-container">
          <ContentForm activeSection={activeSection} />
          <ContentList activeSection={activeSection} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;