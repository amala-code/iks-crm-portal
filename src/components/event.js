import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ContentForm.css';
import Sidebar from './SideBar';
import { 
  FaSave, 
  FaHashtag, 
  FaGlobe, 
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaNewspaper,
  FaUpload
} from 'react-icons/fa';

const NewsForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date_time: '',
    location: '',
    category: 'News', // default
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('date_time', formData.date_time);
      data.append('location', formData.location);
      data.append('category', formData.category);
      if (file) data.append('image', file);

      const response = await axios.post(
        `https://new-admin-backend.vercel.app/create_event`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      showNotification(response.data.message || 'Created successfully!', 'success');
      setFormData({ title: '', description: '', date_time: '', location: '', category: 'News' });
      setFile(null);
    } catch (error) {
      showNotification(error.response?.data?.detail || 'Error creating entry. Try again.', 'error');
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
            <h1 className="header-title">Create Content</h1>
          </div>
          <p className="header-description">Create and publish News / Events</p>
        </div>

        {/* Form */}
        <div className="form-container">
          <form className="form-content" onSubmit={handleSubmit}>
            <div className="form-fields">
              <div className="form-group group">
                <label className="form-label">
                  Title *
                </label>
                <input 
                  name="title"
                  placeholder="Enter a compelling title..." 
                  onChange={handleInputChange}
                  value={formData.title}
                  className="form-input news"
                  required 
                />
              </div>
              
              <div className="form-group group">
                <label className="form-label">
                  Description *
                </label>
                <textarea 
                  name="description"
                  placeholder="Provide a detailed description..." 
                  onChange={handleInputChange}
                  value={formData.description}
                  className="form-textarea news"
                  required 
                />
              </div>
              
              <div className="form-grid two-columns">
                <div className="form-group">
                  <label className="form-label">Date & Time</label>
                  <input 
                    name="date_time" 
                    placeholder="YYYY-MM-DD HH:MM" 
                    onChange={handleInputChange}
                    value={formData.date_time}
                    className="form-input news"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input 
                    name="location" 
                    placeholder="Location..." 
                    onChange={handleInputChange}
                    value={formData.location}
                    className="form-input news"
                  />
                </div>
              </div>

              {/* Radio Buttons for Category */}
              <div className="form-group">
                <label className="form-label">Category *</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="News"
                      checked={formData.category === 'News'}
                      onChange={handleInputChange}
                    />
                    News
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="Event"
                      checked={formData.category === 'Event'}
                      onChange={handleInputChange}
                    />
                    Event
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="Both"
                      checked={formData.category === 'Both'}
                      onChange={handleInputChange}
                    />
                    Both
                  </label>
                </div>
              </div>

              {/* File Upload */}
              <div className="form-group">
                <label className="form-label">
                  <FaUpload className="form-label-icon" /> Upload Image
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="form-input"
                />
                {file && <p className="file-selected">Selected: {file.name}</p>}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="submit-container">
              <button
                type="submit"
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
                    Create
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsForm;
