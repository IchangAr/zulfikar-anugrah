import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { supabase } from '../../utils/supabase';
import CertificateModal from './CertificateModal';
import { useProfile } from '../../hooks/useProfile';

const CertificateCard = ({ cert, index, onClick }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const bgGlow = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`;

  return (
    <motion.div 
      ref={cardRef}
      key={cert.id || index}
      layoutId={`cert-card-${cert.id}`}
      className="premium-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(cert)}
      style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
    >
      <motion.div 
        style={{
          position: 'absolute',
          inset: 0,
          background: bgGlow,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: 10,
          pointerEvents: "none"
        }}
      />
      <div className="premium-img-wrapper">
        {(() => {
          const urlObj = cert.image_url;
          const isPdf = urlObj && urlObj.toLowerCase().split('?')[0].endsWith('.pdf');
          if (urlObj) {
            if (isPdf) {
              return (
                <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                  <iframe 
                    src={`${urlObj}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    style={{ position: 'absolute', top: '-10%', left: '-5%', width: '110%', height: '120%', border: 'none', pointerEvents: 'none' }}
                    tabIndex="-1"
                  ></iframe>
                  <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}></div>
                </div>
              );
            }
            return <img src={urlObj} alt={cert.title} style={{ position: 'relative', zIndex: 1 }} />;
          }
          return <div className="cert-icon-fallback" style={{ position: 'relative', zIndex: 1 }}>📄</div>;
        })()}
      </div>
      <div className="premium-info" style={{ position: 'relative', zIndex: 2 }}>
        <div className="premium-icon-circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <div className="premium-text-col">
          <h3 className="premium-title">{cert.title}</h3>
          <span className="premium-issuer">{cert.issuer} &middot; {cert.year}</span>
        </div>
      </div>
    </motion.div>
  );
};

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const { profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    const fetchCertificates = async () => {
      if (profileLoading) return;
      
      if (!profile?.user_id) {
        setCertificates([]);
        setLoading(false);
        return;
      }

      const query = supabase
        .from('certificates')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('sort_order', { ascending: true });

      const { data, error } = await query;
      
      if (!error && data) {
        setCertificates(data);
      }
      setLoading(false);
    };

    fetchCertificates();
  }, [profile, profileLoading]);
  return (
    <section id="certificates">
      <div className="container">
        <motion.div 
          className="section-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow">Sertifikat</div>
          <h2>Sertifikasi &amp; Pelatihan</h2>
        </motion.div>
        
        <div className="cert-grid">
          {loading ? (
            <p className="data-status">Memuat sertifikat…</p>
          ) : certificates.length === 0 ? (
            <p className="data-status">Belum ada sertifikat ditambahkan.</p>
          ) : (
            certificates.map((cert, index) => (
              <CertificateCard 
                key={cert.id || index}
                cert={cert}
                index={index}
                onClick={setSelectedCertificate}
              />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedCertificate && (
          <CertificateModal 
            certificate={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
