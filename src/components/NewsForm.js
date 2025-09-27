import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ContentForm.css';
import Sidebar from './SideBar';
import { 
  FaSave, 
  FaTag, 
  FaGlobe, 
  FaHashtag, 
  FaFlag,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaNewspaper
} from 'react-icons/fa';

const NewsForm = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `https://new-admin-backend.vercel.app/create_event`,
        formData, // Send formData directly as JSON
        { 
          headers: { 
            'Content-Type': 'application/json' // Change to JSON
          } 
        }
      );
      
      showNotification(response.data.message || 'News article created successfully!', 'success');
      setFormData({});
    } catch (error) {
      showNotification(error.response?.data?.detail || 'Error creating news article. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-form-layout">
      <Sidebar />
      
      <div className="content-area">
        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.type === 'success' ? (
              <FaCheckCircle className="notification-icon" />
            ) : (
              <FaExclamationCircle className="notification-icon" />
            )}
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="notification-close"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="content-header">
          <div className="header-badge news">
            <FaNewspaper className="header-icon" />
            <h1 className="header-title">Create News Article</h1>
          </div>
          <p className="header-description">Create and publish news articles</p>
        </div>

        {/* Form */}
        <div className="form-container">
          <div className="form-content">
            <div className="form-fields">
              <div className="form-group group">
                <label className="form-label">
                  <FaNewspaper className="form-label-icon" />
                  Title *
                </label>
                <input 
                  name="title" 
                  placeholder="Enter a compelling title..." 
                  onChange={handleInputChange}
                  value={formData.title || ''}
                  className="form-input news"
                  required 
                />
              </div>
              
              <div className="form-group group">
                <label className="form-label">
                  <FaHashtag className="form-label-icon" />
                  Description *
                </label>
                <textarea 
                  name="description" 
                  placeholder="Provide a detailed description..." 
                  onChange={handleInputChange}
                  value={formData.description || ''}
                  className="form-textarea news"
                  required 
                />
              </div>
              
              <div className="form-grid two-columns">
                <div className="form-group">
                  <label className="form-label">
                    <FaTag className="form-label-icon" />
                    Category *
                  </label>
                  <input 
                    name="category" 
                    placeholder="e.g., Technology, Sports..." 
                    onChange={handleInputChange}
                    value={formData.category || ''}
                    className="form-input news"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <FaGlobe className="form-label-icon" />
                    Date & Time
                  </label>
                  <input 
                    name="date_time" 
                    placeholder="News source..." 
                    onChange={handleInputChange}
                    value={formData.date_time || ''}
                    className="form-input news"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaGlobe className="form-label-icon" />
                   Location
                  </label>
                  <input 
                    name="location" 
                    placeholder="Location..." 
                    onChange={handleInputChange}
                    value={formData.location || ''}
                    className="form-input news"
                  />
                </div>
              </div>
{/*               
              <div className="form-group">
                <label className="form-label">
                  <FaFlag className="form-label-icon" />
                  Priority Level
                </label>
                <select 
                  name="priority" 
                  onChange={handleInputChange}
                  value={formData.priority || ''}
                  className="form-select news"
                >
                  <option value="">Select Priority</option>
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div> */}
            </div>
            
            {/* Submit Button */}
            <div className="submit-container">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`submit-button news ${isSubmitting ? 'disabled' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="submit-button-icon" />
                    Create Quick News 
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsForm;



