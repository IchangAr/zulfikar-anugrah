import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AchievementModal = ({ achievement, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = achievement.image_urls && achievement.image_urls.length > 0
    ? achievement.image_urls
    : (achievement.image_url ? [achievement.image_url] : []);

  return (
    <motion.div 
      className="achievement-modal show" 
      id="achievementModal" 
      onClick={onClose}
      layoutId={`ach-card-${achievement.id}`}
      style={{ background: 'rgba(15, 23, 42, 0.95)', overflow: 'hidden' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <div className="am-cover-flow-container">
        <div className="am-cover-flow" id="amCoverFlow">
          {images.length > 0 ? images.map((img, idx) => {
            const offset = idx - currentIndex;
            const absOffset = Math.abs(offset);
            const scale = Math.max(0, 1 - (absOffset * 0.1));
            const tx = offset * 220;
            const tz = -absOffset * 100;
            const zIndex = 100 - absOffset;
            const opacity = absOffset > 2 ? 0 : (1 - absOffset * 0.15);

            return (
              <div 
                key={idx}
                className={`am-card ${idx === currentIndex ? 'active' : ''}`}
                style={{
                  backgroundImage: `url('${img}')`,
                  transform: `translate3d(${tx}px, 0, ${tz}px) scale(${scale})`,
                  zIndex,
                  opacity
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
              ></div>
            );
          }) : (
            <div 
              className="am-card active"
              style={{
                background: 'var(--c-primary)',
                transform: `translate3d(0, 0, 0) scale(1)`,
                zIndex: 100,
                opacity: 1
              }}
              onClick={(e) => e.stopPropagation()}
            ></div>
          )}
        </div>
      </div>
      
      <motion.div 
        className="am-info" 
        id="amInfo"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 id="amTitle">{achievement.title}</h2>
        <div className="am-meta" id="amMeta">{achievement.meta}</div>
        <p id="amDesc">{achievement.description}</p>
      </motion.div>
    </motion.div>
  );
};

export default AchievementModal;
