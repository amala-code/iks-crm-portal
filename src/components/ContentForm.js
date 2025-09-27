import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ContentForm.css';
import Sidebar from './SideBar';
// You'll need to install react-icons or use your preferred icon library
// npm install react-icons
import { 
  FaImage, 
  FaCalendar, 
  FaUpload, 
  FaSave, 
  FaUser, 
  FaMapMarkerAlt, 
  FaHashtag, 
  FaFlag, 
  FaClock,
  FaUsers,
  FaTag,
  FaGlobe,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaNewspaper
} from 'react-icons/fa';



const ContentForm = () => {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [section, setSection] = useState('news');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSectionChange = (newSection) => {
    setSection(newSection);
    setFormData({});
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      if (file) formDataToSend.append('file', file);
      formDataToSend.append('payload', JSON.stringify(formData));

      const response = await axios.post(
        `http://localhost:8000/api/content/${section}`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      showNotification(response.data.message || `${section.replace('_', ' ')} content created successfully!`, 'success');
      setFormData({});
      setFile(null);
    } catch (error) {
      showNotification(error.response?.data?.detail || 'Error creating content. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionConfig = {
    news: {
      title: 'News Article',
      icon: FaNewspaper,
      description: 'Create and publish news articles'
    },
    photo_gallery: {
      title: 'Photo Gallery',
      icon: FaImage,
      description: 'Upload and organize photo collections'
    },
    event_info: {
      title: 'Event Information',
      icon: FaCalendar,
      description: 'Manage event details and scheduling'
    }
  };

  const renderFormFields = () => {
    const commonFields = (
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
            className={`form-input ${section}`}
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
            className={`form-textarea ${section}`}
            required 
          />
        </div>
      </div>
    );

    switch (section) {
      case 'news':
        return (
          <div className="form-fields">
            {commonFields}
            
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
                  className={`form-input ${section}`}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <FaGlobe className="form-label-icon" />
                  Source
                </label>
                <input 
                  name="source" 
                  placeholder="News source..." 
                  onChange={handleInputChange}
                  value={formData.source || ''}
                  className={`form-input ${section}`}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <FaFlag className="form-label-icon" />
                Priority Level
              </label>
              <select 
                name="priority" 
                onChange={handleInputChange}
                value={formData.priority || ''}
                className={`form-select ${section}`}
              >
                <option value="">Select Priority</option>
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>
            </div>
          </div>
        );
        
      case 'photo_gallery':
        return (
          <div className="form-fields">
            {commonFields}
            
            <div className="form-grid two-columns">
              <div className="form-group">
                <label className="form-label">
                  <FaClock className="form-label-icon" />
                  Event Date
                </label>
                <input 
                  name="event_date" 
                  type="datetime-local" 
                  onChange={handleInputChange}
                  value={formData.event_date || ''}
                  className={`form-input ${section}`}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <FaTag className="form-label-icon" />
                  Tags
                </label>
                <input 
                  name="tags" 
                  placeholder="wedding, celebration, party..." 
                  onChange={handleInputChange}
                  value={formData.tags || ''}
                  className={`form-input ${section}`}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <FaUpload className="form-label-icon" />
                Upload Images
              </label>
              <div 
                className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept="image/*"
                  className="file-upload-input"
                />
                <FaUpload className="file-upload-icon" />
                <p className="file-upload-text">
                  {file ? file.name : 'Drop images here or click to browse'}
                </p>
                <p className="file-upload-subtext">Support for JPG, PNG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        );
        
      case 'event_info':
        return (
          <div className="form-fields">
            {commonFields}
            
            <div className="form-grid two-columns">
              <div className="form-group">
                <label className="form-label">
                  <FaCalendar className="form-label-icon" />
                  Event Date *
                </label>
                <input 
                  name="event_date" 
                  type="datetime-local" 
                  onChange={handleInputChange}
                  value={formData.event_date || ''}
                  className={`form-input ${section}`}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <FaMapMarkerAlt className="form-label-icon" />
                  Location *
                </label>
                <input 
                  name="location" 
                  placeholder="Event venue..." 
                  onChange={handleInputChange}
                  value={formData.location || ''}
                  className={`form-input ${section}`}
                  required 
                />
              </div>
            </div>
            
            <div className="form-grid two-columns">
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="form-label-icon" />
                  Organizer *
                </label>
                <input 
                  name="organizer" 
                  placeholder="Event organizer..." 
                  onChange={handleInputChange}
                  value={formData.organizer || ''}
                  className={`form-input ${section}`}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <FaUsers className="form-label-icon" />
                  Capacity
                </label>
                <input 
                  name="capacity" 
                  type="number" 
                  placeholder="Maximum attendees..." 
                  onChange={handleInputChange}
                  value={formData.capacity || ''}
                  className={`form-input ${section}`}
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const currentConfig = sectionConfig[section];
  const IconComponent = currentConfig?.icon;

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
          <div className={`header-badge ${section}`}>
            {IconComponent && <IconComponent className="header-icon" />}
            <h1 className="header-title">Create {currentConfig?.title}</h1>
          </div>
          <p className="header-description">{currentConfig?.description}</p>
        </div>

        {/* Section Selector */}
        <div className="section-selector">
          <h2 className="section-selector-title">Content Type</h2>
          <div className="section-buttons">
            {Object.entries(sectionConfig).map(([key, config]) => {
              const IconComp = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => handleSectionChange(key)}
                  className={`section-button ${section === key ? `active ${key}` : ''}`}
                >
                  <IconComp className="section-button-icon" />
                  {config.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="form-container">
          <div className="form-content">
            {renderFormFields()}
            
            {/* Submit Button */}
            <div className="submit-container">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`submit-button ${section} ${isSubmitting ? 'disabled' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="submit-button-icon" />
                    Create Content
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

export default ContentForm;