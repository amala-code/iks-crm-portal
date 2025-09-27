

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../styles/ContentForm.css';
// import Sidebar from './SideBar';
// import { 
//   FaImage, 
//   FaUpload, 
//   FaSave, 
//   FaHashtag, 
//   FaClock,
//   FaTag,
//   FaCheckCircle,
//   FaExclamationCircle,
//   FaTimes,
//   FaTrash,
//   FaEye
// } from 'react-icons/fa';

// const PhotoGalleryForm = () => {
//   const [formData, setFormData] = useState({});
//   const [files, setFiles] = useState([]);
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [fetchedImages, setFetchedImages] = useState([]); // New state for fetched images
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isFetching, setIsFetching] = useState(false); // New state for fetching
//   const [notification, setNotification] = useState(null);
//   const [dragActive, setDragActive] = useState(false);

//   const API_BASE_URL = 'https://new-admin-backend.vercel.app';

//   // Fetch existing images when component loads
//   useEffect(() => {
//     fetchExistingImages();
//   }, []);

//   const showNotification = (message, type = 'success') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 4000);
//   };

//   // Function to fetch existing images
//   const fetchExistingImages = async () => {
//     setIsFetching(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/images`);
      
//       // Convert relative URLs to absolute URLs
//       const imagesWithFullUrls = response.data.images.map(image => ({
//         ...image,
//         fullUrl: `${API_BASE_URL}${image.url}`
//       }));
      
//       setFetchedImages(imagesWithFullUrls);
//       console.log('Fetched images:', imagesWithFullUrls);
//     } catch (error) {
//       console.error('Error fetching images:', error);
//       showNotification('Error fetching existing images', 'error');
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(prev => [...prev, ...selectedFiles]);
//   };

//   const removeFile = (indexToRemove) => {
//     setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
//   };

//   const removeUploadedImage = (indexToRemove) => {
//     setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const droppedFiles = Array.from(e.dataTransfer.files);
//       setFiles(prev => [...prev, ...droppedFiles]);
//     }
//   };

//   const uploadImages = async () => {
//     if (files.length === 0) {
//       showNotification('Please select some images to upload', 'error');
//       return;
//     }

//     setIsUploading(true);
    
//     try {
//       const formDataToSend = new FormData();
//       files.forEach(file => {
//         formDataToSend.append('files', file);
//       });

//       const response = await axios.post(
//         `${API_BASE_URL}/images/upload_bulk`,
//         formDataToSend,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );

//       const imageUrls = response.data.urls.map(url => `${API_BASE_URL}${url}`);
      
//       setUploadedImages(prev => [...prev, ...imageUrls]);
//       setFiles([]);
      
//       showNotification(`Successfully uploaded ${response.data.urls.length} images!`, 'success');

//       if (response.data.failed && response.data.failed.length > 0) {
//         console.warn('Some uploads failed:', response.data.failed);
//       }
      
//     } catch (error) {
//       console.error('Upload error:', error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (uploadedImages.length === 0) {
//       showNotification('Please upload at least one image before creating the gallery', 'error');
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       // Use POST request to create gallery
//       const galleryData = {
//         ...formData,
//         image_urls: uploadedImages
//       };

//       const response = await axios.post(
//         `${API_BASE_URL}/api/content/photos`, // Fixed: use POST not GET
//         galleryData,
//         { headers: { 'Content-Type': 'application/json' } }
//       );
      
//       showNotification(response.data.message || 'Photo gallery created successfully!', 'success');
//       setFormData({});
//       setFiles([]);
//       setUploadedImages([]);
      
//       // Refresh the fetched images after creating gallery
//       fetchExistingImages();
      
//     } catch (error) {
//       showNotification(error.response?.data?.detail || 'Error creating photo gallery. Please try again.', 'error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="content-form-layout">
//       <Sidebar />
      
//       <div className="content-area">
//         {/* Notification */}
//         {notification && (
//           <div className={`notification ${notification.type}`}>
//             {notification.type === 'success' ? (
//               <FaCheckCircle className="notification-icon" />
//             ) : (
//               <FaExclamationCircle className="notification-icon" />
//             )}
//             <span>{notification.message}</span>
//             <button onClick={() => setNotification(null)} className="notification-close">
//               <FaTimes />
//             </button>
//           </div>
//         )}

//         {/* Header */}
//         <div className="content-header">
//           <div className="header-badge photo_gallery">
//             <FaImage className="header-icon" />
//             <h1 className="header-title">Photo Gallery Manager</h1>
//           </div>
//           <p className="header-description">Upload new images and view existing gallery</p>
//         </div>

//         {/* Existing Images Section */}
//         <div className="form-container">
//           <div className="form-content">
//             <div className="form-group">
//               <label className="form-label">
//                 <FaEye className="form-label-icon" />
//                 Existing Images ({fetchedImages.length})
//                 <button 
//                   onClick={fetchExistingImages} 
//                   disabled={isFetching}
//                   style={{ 
//                     marginLeft: '10px', 
//                     padding: '5px 10px', 
//                     border: 'none', 
//                     borderRadius: '4px',
//                     background: '#007bff',
//                     color: 'white',
//                     cursor: 'pointer' 
//                   }}
//                 >
//                   {isFetching ? 'Refreshing...' : 'Refresh'}
//                 </button>
//               </label>
              
//               {fetchedImages.length > 0 ? (
//                 <div className="uploaded-images-grid">
//                   {fetchedImages.map((image, index) => (
//                     <div key={image.id} className="uploaded-image-item">
//                       <img
//                         src={image.fullUrl}
//                         alt={`Gallery image ${index + 1}`}
//                         className="uploaded-image"
//                         onError={(e) => {
//                           console.error('Failed to load image:', image.fullUrl);
//                           e.target.style.border = '2px solid red';
//                           e.target.alt = 'Failed to load';
//                         }}
//                         onLoad={() => {
//                           console.log('Successfully loaded:', image.fullUrl);
//                         }}
//                       />
//                       <div className="image-info">
//                         <small>ID: {image.id}</small>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
//                   {isFetching ? 'Loading images...' : 'No images found. Upload some images to get started!'}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Upload New Images Form */}
//         <div className="form-container">
//           <div className="form-content">
//             <h3>Upload New Images</h3>
//             <div className="form-fields">
//               {/* <div className="form-group group">
//                 <label className="form-label">
//                   <FaImage className="form-label-icon" />
//                   Title *
//                 </label>
//                 <input 
//                   name="title" 
//                   placeholder="Enter a compelling title..." 
//                   onChange={handleInputChange}
//                   value={formData.title || ''}
//                   className="form-input photo_gallery"
//                   required 
//                 />
//               </div>
//                */}
//               {/* <div className="form-group group">
//                 <label className="form-label">
//                   <FaHashtag className="form-label-icon" />
//                   Description *
//                 </label>
//                 <textarea 
//                   name="description" 
//                   placeholder="Provide a detailed description..." 
//                   onChange={handleInputChange}
//                   value={formData.description || ''}
//                   className="form-textarea photo_gallery"
//                   required 
//                 />
//               </div>
//                */}
//               {/* File Upload Section */}
//               <div className="form-group">
//                 <label className="form-label">
//                   <FaUpload className="form-label-icon" />
//                   Select Images
//                 </label>
//                 <div 
//                   className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
//                   onDragEnter={handleDrag}
//                   onDragLeave={handleDrag}
//                   onDragOver={handleDrag}
//                   onDrop={handleDrop}
//                 >
//                   <input 
//                     type="file" 
//                     onChange={handleFileChange} 
//                     accept="image/*"
//                     multiple
//                     className="file-upload-input"
//                   />
//                   <FaUpload className="file-upload-icon" />
//                   <p className="file-upload-text">
//                     {files.length > 0 
//                       ? `${files.length} files selected` 
//                       : 'Drop images here or click to browse'
//                     }
//                   </p>
//                   <p className="file-upload-subtext">Support for JPG, PNG, GIF up to 10MB each</p>
//                 </div>

//                 {/* Selected Files Preview */}
//                 {files.length > 0 && (
//                   <div className="selected-files">
//                     <h4>Selected Files ({files.length}):</h4>
//                     <div className="files-list">
//                       {files.map((file, index) => (
//                         <div key={index} className="file-item">
//                           <span className="file-name">{file.name}</span>
//                           <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
//                           <button 
//                             type="button"
//                             onClick={() => removeFile(index)}
//                             className="remove-file-btn"
//                           >
//                             <FaTimes />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
                    
//                     <button
//                       type="button"
//                       onClick={uploadImages}
//                       disabled={isUploading}
//                       className={`upload-images-btn ${isUploading ? 'disabled' : ''}`}
//                     >
//                       {isUploading ? (
//                         <>
//                           <div className="loading-spinner"></div>
//                           Uploading...
//                         </>
//                       ) : (
//                         <>
//                           <FaUpload />
//                           Upload {files.length} Images
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Uploaded Images Display */}
//               {uploadedImages.length > 0 && (
//                 <div className="form-group">
//                   <label className="form-label">
//                     <FaEye className="form-label-icon" />
//                     New Uploaded Images ({uploadedImages.length})
//                   </label>
//                   <div className="uploaded-images-grid">
//                     {uploadedImages.map((imageUrl, index) => (
//                       <div key={index} className="uploaded-image-item">
//                         <img
//                           src={imageUrl}
//                           alt={`Uploaded image ${index + 1}`}
//                           className="uploaded-image"
//                           onError={(e) => {
//                             console.error('Failed to load image:', imageUrl);
//                             e.target.style.display = 'none';
//                           }}
//                         />
//                         <button 
//                           type="button"
//                           onClick={() => removeUploadedImage(index)}
//                           className="remove-image-btn"
//                           title="Remove image"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             {/* Submit Button */}
  
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PhotoGalleryForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ContentForm.css';
import Sidebar from './SideBar';
import { 
  FaImage, 
  FaUpload, 
  FaSave, 
  FaHashtag, 
  FaClock,
  FaTag,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaTrash,
  FaEye
} from 'react-icons/fa';

const PhotoGalleryForm = () => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [notification, setNotification] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For modal/preview

  const API_BASE_URL = 'https://new-admin-backend.vercel.app';

  // Fetch existing images when component loads
  useEffect(() => {
    fetchExistingImages();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Function to fetch existing images
  const fetchExistingImages = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/images`);
      
      // Convert relative URLs to absolute URLs
      const imagesWithFullUrls = response.data.images.map(image => ({
        ...image,
        fullUrl: `${API_BASE_URL}${image.url}`
      }));
      
      setFetchedImages(imagesWithFullUrls);
      console.log('Fetched images:', imagesWithFullUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
      showNotification('Error fetching existing images', 'error');
    } finally {
      setIsFetching(false);
    }
  };

  // Delete existing image from server
  const deleteExistingImage = async (imageId, index) => {
    try {
      await axios.delete(`${API_BASE_URL}/images/${imageId}`);
      setFetchedImages(prev => prev.filter((_, i) => i !== index));
      showNotification('Image deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting image:', error);
      showNotification('Error deleting image', 'error');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeUploadedImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const uploadImages = async () => {
    if (files.length === 0) {
      showNotification('Please select some images to upload', 'error');
      return;
    }

    setIsUploading(true);
    
    try {
      const formDataToSend = new FormData();
      files.forEach(file => {
        formDataToSend.append('files', file);
      });

      const response = await axios.post(
        `${API_BASE_URL}/images/upload_bulk`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const imageUrls = response.data.urls.map(url => `${API_BASE_URL}${url}`);
      
      setUploadedImages(prev => [...prev, ...imageUrls]);
      
      // Clear files after successful upload
      setFiles([]);
      
      showNotification(`Successfully uploaded ${response.data.urls.length} images!`, 'success');

      if (response.data.failed && response.data.failed.length > 0) {
        console.warn('Some uploads failed:', response.data.failed);
      }
      
      // Refresh existing images after upload
      fetchExistingImages();
      
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('Upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadedImages.length === 0) {
      showNotification('Please upload at least one image before creating the gallery', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Use POST request to create gallery
      const galleryData = {
        ...formData,
        image_urls: uploadedImages
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/content/photos`,
        galleryData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      showNotification(response.data.message || 'Photo gallery created successfully!', 'success');
      setFormData({});
      setFiles([]);
      setUploadedImages([]);
      
      // Refresh the fetched images after creating gallery
      fetchExistingImages();
      
    } catch (error) {
      showNotification(error.response?.data?.detail || 'Error creating photo gallery. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image click for preview
  const handleImageClick = (imageUrl, imageData = null) => {
    setSelectedImage({ url: imageUrl, data: imageData });
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
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
            <button onClick={() => setNotification(null)} className="notification-close">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="content-header">
          <div className="header-badge photo_gallery">
            <FaImage className="header-icon" />
            <h1 className="header-title">Photo Gallery Manager</h1>
          </div>
          <p className="header-description">Upload new images and view existing gallery</p>
        </div>

        {/* Upload New Images Form - MOVED TO TOP */}
        <div className="form-container">
          <div className="form-content">
            <h3>Upload New Images</h3>
            <div className="form-fields">
              {/* File Upload Section - AT TOP */}
              <div className="form-group">
                <label className="form-label">
                  <FaUpload className="form-label-icon" />
                  Select Images
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
                    multiple
                    className="file-upload-input"
                  />
                  <FaUpload className="file-upload-icon" />
                  <p className="file-upload-text">
                    {files.length > 0 
                      ? `${files.length} files selected` 
                      : 'Drop images here or click to browse'
                    }
                  </p>
                  <p className="file-upload-subtext">Support for JPG, PNG, GIF up to 10MB each</p>
                </div>

                {/* Selected Files Preview */}
                {files.length > 0 && (
                  <div className="selected-files">
                    <h4>Selected Files ({files.length}):</h4>
                    <div className="files-list">
                      {files.map((file, index) => (
                        <div key={index} className="file-item">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          <button 
                            type="button"
                            onClick={() => removeFile(index)}
                            className="remove-file-btn"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={uploadImages}
                      disabled={isUploading}
                      className={`upload-images-btn ${isUploading ? 'disabled' : ''}`}
                    >
                      {isUploading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaUpload />
                          Upload {files.length} Images
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* New Uploaded Images Display - MOVED TO BOTTOM */}
        {uploadedImages.length > 0 && (
          <div className="form-container">
            <div className="form-content">
              <div className="form-group">
                <label className="form-label">
                  <FaEye className="form-label-icon" />
                  Recently Uploaded Images ({uploadedImages.length})
                </label>
                <div className="uploaded-images-grid">
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className="uploaded-image-item">
                      <img
                        src={imageUrl}
                        alt={`Uploaded image ${index + 1}`}
                        className="uploaded-image clickable-image"
                        onClick={() => handleImageClick(imageUrl)}
                        onError={(e) => {
                          console.error('Failed to load image:', imageUrl);
                          e.target.style.display = 'none';
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeUploadedImage(index);
                        }}
                        className="remove-image-btn"
                        title="Remove image"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Existing Images Section - MOVED TO BOTTOM */}
        <div className="form-container">
          <div className="form-content">
            <div className="form-group">
              <label className="form-label">
                <FaEye className="form-label-icon" />
                Existing Images ({fetchedImages.length})
                <button 
                  onClick={fetchExistingImages} 
                  disabled={isFetching}
                  style={{ 
                    marginLeft: '10px', 
                    padding: '5px 10px', 
                    border: 'none', 
                    borderRadius: '4px',
                    background: '#007bff',
                    color: 'white',
                    cursor: 'pointer' 
                  }}
                >
                  {isFetching ? 'Refreshing...' : 'Refresh'}
                </button>
              </label>
              
              {fetchedImages.length > 0 ? (
                <div className="uploaded-images-grid">
                  {fetchedImages.map((image, index) => (
                    <div key={image.id} className="uploaded-image-item">
                      <img
                        src={image.fullUrl}
                        alt={`Gallery image ${index + 1}`}
                        className="uploaded-image clickable-image"
                        onClick={() => handleImageClick(image.fullUrl, image)}
                        onError={(e) => {
                          console.error('Failed to load image:', image.fullUrl);
                          e.target.style.border = '2px solid red';
                          e.target.alt = 'Failed to load';
                        }}
                        onLoad={() => {
                          console.log('Successfully loaded:', image.fullUrl);
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <div className="image-info">
                        <small>ID: {image.id}</small>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this image?')) {
                            deleteExistingImage(image.id, index);
                          }
                        }}
                        className="remove-image-btn"
                        title="Delete image"
                        style={{ backgroundColor: '#dc3545' }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  {isFetching ? 'Loading images...' : 'No images found. Upload some images to get started!'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Image Modal for Preview */}
        {selectedImage && (
          <div 
            className="image-modal-overlay"
            onClick={closeImageModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              cursor: 'pointer'
            }}
          >
            <div 
              className="image-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '90vh',
                cursor: 'default'
              }}
            >
              <img
                src={selectedImage.url}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
              <button
                onClick={closeImageModal}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                <FaTimes />
              </button>
              {selectedImage.data && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '5px'
                }}>
                  <small>ID: {selectedImage.data.id}</small>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGalleryForm;