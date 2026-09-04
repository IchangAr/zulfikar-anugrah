import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  
  const images = project.image_urls && project.image_urls.length > 0 
    ? project.image_urls 
    : (project.thumbnail_url ? [project.thumbnail_url] : []);

  // Auto hide info after 3 seconds
  useEffect(() => {
    let timer;
    if (showInfo) {
      timer = setTimeout(() => {
        setShowInfo(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showInfo]);

  // Hide navbar when modal opens
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <motion.div 
      className="project-modal show" 
      id="projectModal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="project-modal-inner"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button 
          className="pm-close" 
          id="pmClose" 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{ zIndex: 9999, pointerEvents: 'auto', left: '40px', right: 'auto', width: 'auto', padding: '0 20px', borderRadius: '100px' }}
        >
          ← Kembali
        </button>
        {/* We removed the old toggle button since we will place it on the left now */}
        
        <div className="pm-main-image" id="pmMainImage" style={{ 
          backgroundImage: images.length > 0 ? `url(${images[currentImageIndex]})` : 'none',
          backgroundColor: images.length === 0 ? 'var(--c-primary)' : 'transparent'
        }}></div>
        
        <div className={`pm-overlay ${!showInfo ? 'info-hidden' : ''}`} id="pmOverlay"></div>
        
        <div className="pm-content" id="pmContent">
          <div className="pm-bottom-row">
            <div className={`pm-info-col ${!showInfo ? 'info-hidden' : ''}`} id="pmInfoCol">
              <h2 id="pmTitle">{project.title}</h2>
              <p id="pmDesc">{project.description}</p>
              <div className="tag-row" id="pmTags">
                {project.tags && project.tags.map((tag, i) => (
                  <span key={i} className="tag glass-tag">{tag}</span>
                ))}
              </div>
            </div>
            
            {/* When info is hidden, show Detail button in the same position */}
            {!showInfo && (
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pm-toggle-info" 
                style={{ position: 'absolute', bottom: '80px', left: '80px', top: 'auto', right: 'auto', zIndex: 20 }}
                onClick={() => setShowInfo(true)}
              >
                Lihat Detail
              </motion.button>
            )}
            
            {images.length > 1 && (
              <div className="pm-thumbs-wrapper" id="pmThumbsWrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '45%', justifyContent: 'flex-end' }}>
                <button className="pm-thumb-nav prev" onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}>‹</button>
                <div className="pm-thumbs" id="pmThumbs" style={{ width: 'auto', maxWidth: '100%' }}>
                  {images.map((img, i) => (
                    <div 
                      key={i} 
                      className={`pm-thumb ${i === currentImageIndex ? 'active' : ''}`} 
                      style={{ backgroundImage: `url(${img})` }}
                      onClick={() => setCurrentImageIndex(i)}
                    ></div>
                  ))}
                </div>
                <button className="pm-thumb-nav next" onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}>›</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
