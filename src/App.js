
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import ContentForm from './components/ContentForm';
// import ContentDashboard from './components/Dash';
// import NewsForm from './components/NewsForm';
// import EventForm from './components/event';
// import PhotoGalleryForm from './components/Photgallery';
// import LoginPage from './components/LoginPage';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/dashboard" element={<ContentDashboard />} />
//         <Route path="/login" element={<LoginPage />} />

//         <Route path="/dashboard" element={<ContentDashboard />} />
//         {/* <Route path="/news" element={<NewsForm />} /> */}
//         <Route path="/events" element={<EventForm />} />
//         <Route path="/photos" element={<PhotoGalleryForm />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ContentForm from './components/ContentForm';
import ContentDashboard from './components/Dash';
import NewsForm from './components/NewsForm';
import EventForm from './components/event';
import PhotoGalleryForm from './components/Photgallery';
import LoginPage from './components/LoginPage';


// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      // Check if there's a stored authentication token or session
      const token = localStorage.getItem('token');
      const authToken = localStorage.getItem('authToken');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if ((token || authToken) && isLoggedIn === 'true') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Function to handle login
  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Route - Login Page */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ContentDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/content" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ContentForm onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/news" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NewsForm onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/events" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EventForm onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/photos" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PhotoGalleryForm onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        {/* Default Route - Redirect based on authentication status */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch all other routes and redirect */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;


