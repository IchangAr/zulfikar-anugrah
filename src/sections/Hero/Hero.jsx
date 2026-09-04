import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useProfile } from '../../hooks/useProfile';
import Aurora from '../../components/Aurora';
import Lanyard from '../../components/Lanyard';

const Hero = () => {
  const { profile, loading } = useProfile();
  
  const role = profile?.role || "Membangun produk digital yang rapi, cepat, dan elegan.";
  const bio = profile?.bio_short || "Saya Cank, Full-Stack Developer yang fokus pada detail interaksi kecil yang membuat sebuah produk terasa premium — dari sistem desain hingga baris kode terakhir.";
  const cvUrl = profile?.cv_url;
  const avatarUrl = profile?.avatar_url;
  const initials = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'C';
  const fullName = profile?.full_name || "Iccank";

  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 3D Hover Tilt for the Visual ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const lanyardAnchor = isMobile ? [0, 4, 0] : isTablet ? [1.8, 3, 0] : [2.6, 2.6, 0];
  const lanyardPosition = isMobile ? [0, 0, 20] : isTablet ? [0, 0, 17] : [0, 0, 14.5];

  return (
    <section 
      className="hero" 
      id="home" 
      style={{ position: 'relative', overflow: 'hidden', perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* WebGL Aurora Background */}
      <div className="hero-bg-aurora" style={{ 
        position: 'absolute', 
        inset: 0, 
        pointerEvents: 'none', 
        zIndex: -1, 
        opacity: 0.85,
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
      }}>
        <Aurora 
          colorStops={["#93C5FD", "#C084FC", "#ffffff", "#A78BFA"]} 
          blend={0.6} 
          amplitude={1.3} 
          speed={0.8} 
        />
      </div>

      {/* Lanyard Full Page 3D Component */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
        <Lanyard 
          key="lanyard-pos-anchor26"
          position={lanyardPosition} 
          anchor={lanyardAnchor}
          gravity={[0, -40, 0]} 
          frontImage={avatarUrl} 
          backImage={avatarUrl}
          lanyardImage="/lanyard-logo.png"
          lanyardWidth={0.8}
        />
      </div>

      <div className="container hero-grid" style={{ position: 'relative', alignItems: 'center' }}>
        <motion.div 
          style={{ position: 'relative', rotateX, rotateY, transformStyle: 'preserve-3d' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div 
            className="eyebrow"
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.1 }}
            style={{ translateZ: '20px' }}
          >
            <span className="dot"></span> Tersedia untuk project baru
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.25 }}
            style={{ translateZ: '40px' }}
          >
            <span id="heroRoleText">{loading ? 'Memuat profil...' : role}</span>
          </motion.h1>
          <motion.p 
            id="heroBioShortText" 
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.4 }}
            style={{ translateZ: '30px' }}
          >
            {bio}
          </motion.p>
          <motion.div 
            className="hero-actions"
            style={{ position: 'relative', zIndex: 20, pointerEvents: 'auto', translateZ: '50px' }}
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.55 }}
          >
            <a href="#projects" className="btn btn-primary shadow-lg shadow-blue-500/20">Lihat Project →</a>
            {cvUrl && (
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost hover:bg-white/50 backdrop-blur-sm transition-all" id="heroCvBtn">Unduh CV</a>
            )}
          </motion.div>
        </motion.div>
      </div>
      <div className="scroll-cue"><span>Scroll</span>
        <div className="line"></div>
      </div>
    </section>
  );
};

export default Hero;
