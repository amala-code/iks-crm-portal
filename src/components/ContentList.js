// src/components/ContentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ContentList.css';

const ContentList = ({ activeSection }) => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    fetchContents();
  }, [activeSection]);

  const fetchContents = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/content/${activeSection}`);
      setContents(response.data);
    } catch (error) {
      console.error('Error fetching contents:', error);
    }
  };

  return (
    <div className="content-list">
      <div className="content-header">
        <h2>{activeSection.replace('_', ' ').toUpperCase()}</h2>
        <div className="stats">
          <span>Total: {contents.length}</span>
        </div>
      </div>
      <div className="content-grid">
        {contents.map((content) => (
          <div key={content.id} className="content-card">
            <h3>{content.title}</h3>
            <p>{content.description}</p>
            {activeSection === 'photo_gallery' && content.images && (
              <img src={`data:image/jpeg;base64,${content.images[0]}`} alt={content.title} />
            )}
            <div className="card-footer">
              <small>{new Date(content.created_at).toLocaleString()}</small>
              <button className="view-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentList;