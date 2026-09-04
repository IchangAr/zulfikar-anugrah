import React from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';

const TimelineNode = ({ scrollYProgress, index, total, mobile = false }) => {
  // Calculate the approximate position of this node along the scroll progress
  // total-1 because the nodes span from 0 to 1
  const targetProgress = total > 1 ? index / (total - 1) : 0.5;
  
  // Create a springy progress value for smoother animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate opacity and scale based on scroll position
  // The node glows and scales up when the scroll passes its position
  const glowOpacity = useTransform(
    smoothProgress,
    [Math.max(0, targetProgress - 0.1), targetProgress, Math.min(1, targetProgress + 0.1)],
    [0, 1, 0]
  );
  
  const scale = useTransform(
    smoothProgress,
    [Math.max(0, targetProgress - 0.1), targetProgress, Math.min(1, targetProgress + 0.1)],
    [0.8, 1.2, 1]
  );
  
  const isActive = useTransform(
    smoothProgress,
    (v) => v >= targetProgress
  );

  const activeColor = useTransform(
    isActive,
    (active) => active ? 'rgba(59, 130, 246, 1)' : 'rgba(255, 255, 255, 0.2)'
  );

  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div 
        className="absolute inset-0 rounded-full blur-md"
        style={{ 
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(216,180,254,0.4) 100%)',
          opacity: glowOpacity 
        }}
      />
      
      {/* Outer Ring */}
      <motion.div 
        className="absolute inset-0 rounded-full border-[3px]"
        style={{ 
          borderColor: 'rgba(255, 255, 255, 0.9)',
          background: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 0 12px rgba(255,255,255,0.4)',
          scale 
        }}
      />
      
      {/* Inner Dot */}
      <motion.div 
        className="w-2.5 h-2.5 rounded-full z-10"
        style={{ 
          background: '#3b82f6',
          boxShadow: '0 0 8px rgba(59,130,246,0.6)',
          scale 
        }}
      />
    </div>
  );
};

export default TimelineNode;
