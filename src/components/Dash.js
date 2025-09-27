

import React, { useEffect, useState } from "react";
import "./ContentDashboard.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Import minimal icons
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

const API_BASE = "https://new-admin-backend.vercel.app"; // adjust if needed

const ContentDashboard = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null); // event being edited
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date_time: "",
    location: "",
    category: "",
    image: null,
  });

  const sidebarItems = [
    { icon: "⊞", label: "Dashboard", path: "/dashboard" },
    { icon: "📄", label: "Upload Events", path: "/events" },
    { icon: "🖼️", label: "Upload Photos", path: "/photos" },
    { icon: "🚪", label: "Logout", action: "logout" },
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

  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }
  
  // Function to get auth headers
  const getAuthHeaders = () => {
    const token = getAuthToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  
  // Fetch events from backend
  const fetchEvents = async (category = "All") => {
    try {
      setLoading(true);
      let res;
      if (category === "All") {
        res = await axios.get(`${API_BASE}/all_events`);
      } else {
        res = await axios.get(`${API_BASE}/events/${category}`);
      }
      setEvents(res.data.events);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents("All");
  }, []);

  // Delete Event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`${API_BASE}/delete_event/${id}`, { headers: getAuthHeaders() });
      fetchEvents(activeTab); // refresh current tab
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete event");
    }
  };

  // Edit Event (open modal with existing data)
  const handleEdit = (event) => {
    setEditEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date_time: event.date_time,
      location: event.location,
      category: event.category,
      image: null,
    });
  };

  // Submit Edit Event
  const handleEditSubmit = async () => {
    try {
      const data = new FormData();
      
      // Always append all text fields, even if empty
      data.append('title', formData.title || '');
      data.append('description', formData.description || '');
      data.append('date_time', formData.date_time || '');
      data.append('location', formData.location || '');
      data.append('category', formData.category || '');
      
      // Only append image if a new one is selected
      if (formData.image) {
        data.append('image', formData.image);
      }

      await axios.put(`${API_BASE}/update_event/${editEvent.id}`, data, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" }
      });

      fetchEvents(activeTab);
      setEditEvent(null);
      alert("Event updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update event.");
    }
  };

  // Show Full Event
  const handleView = (event) => {
    setSelectedEvent(event);
  };

  // Handle Tab Switch
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    fetchEvents(tab);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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
                className={`sidebar-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">/</span>
            <span>{activeTab}</span>
          </div>
        </header>

        <div className="dashboard-content">
          <h1>Events & News</h1>

          {loading && <p>Loading...</p>}

          {/* Tabs */}
          <div className="content-tabs">
            {["All", "event", "news"].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="cards-grid">
            {events.length === 0 && !loading && <p>No {activeTab} found.</p>}
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <img
                  src={`${API_BASE}/static/images/${event.image}`}
                  alt={event.title}
                  className="event-image"
                  loading="eager"
                />
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="event-meta">
                    📍 {event.location} | 🗓 {event.date_time}
                  </p>
                  <p className="event-category">{event.category}</p>
                  <p className="event-author">
                    Posted by: {event.posted_by || "Admin"}
                  </p>
                </div>
                <div className="event-actions">
                  <button
                    className="icon-btn edit"
                    onClick={() => handleEdit(event)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="icon-btn view"
                    onClick={() => handleView(event)}
                  >
                    <FiEye />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(event.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Full Event Modal */}
          {selectedEvent && (
            <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
              <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={`${API_BASE}/static/images/${selectedEvent.image}`}
                  alt={selectedEvent.title}
                  className="modal-image"
                />
                <h2>{selectedEvent.title}</h2>
                <p>{selectedEvent.description}</p>
                <p>
                  📍 {selectedEvent.location} | 🗓 {selectedEvent.date_time}
                </p>
                <p>Category: {selectedEvent.category}</p>
                <p>Posted by: {selectedEvent.posted_by || "Admin"}</p>
                <button onClick={() => setSelectedEvent(null)}>Close</button>
              </div>
            </div>
          )}

          {/* Edit Event Modal */}
          {editEvent && (
            <div className="modal-overlay" onClick={() => setEditEvent(null)}>
              <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Edit Event</h2>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Date & Time"
                  value={formData.date_time}
                  onChange={(e) =>
                    setFormData({ ...formData, date_time: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
                <div className="modal-actions">
                  <button onClick={handleEditSubmit}>Save</button>
                  <button onClick={() => setEditEvent(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContentDashboard;