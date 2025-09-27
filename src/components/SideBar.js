// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const location = useLocation();

//   const sidebarItems = [
//     { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
//     { icon: '📄', label: 'Upload Events', path: '/events' },

//     { icon: '📄', label: 'Upload Photos', path: '/photos' },

//   ];

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-header">
//         <h1 className="logo">ContentFlow</h1>
//       </div>
//       <nav className="sidebar-nav">
//         {sidebarItems.map((item, index) => (
//           <Link
//             key={index}
//             to={item.path}
//             className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
//           >
//             <span className="sidebar-icon">{item.icon}</span>
//             <span className="sidebar-label">{item.label}</span>
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
    { icon: '📄', label: 'Upload Events', path: '/events' },
    { icon: '📄', label: 'Upload Photos', path: '/photos' },
    { icon: '🚪', label: 'Logout', action: 'logout' },
  ];

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    
    // Call the onLogout function from App.js
    if (onLogout) {
      onLogout();
    }
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">IKS CRM Portal</h1>
      </div>
      
      <nav className="sidebar-nav">
        {sidebarItems.map((item, index) => {
          if (item.action === 'logout') {
            return (
              <button
                key={index}
                onClick={handleLogout}
                className="sidebar-item logout-item"
                title="Logout"
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            );
          }
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;