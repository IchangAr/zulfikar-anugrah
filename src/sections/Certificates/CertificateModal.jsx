import React from 'react';
import { motion } from 'framer-motion';

const CertificateModal = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const urlObj = certificate.image_url;
  const isPdf = urlObj && urlObj.toLowerCase().split('?')[0].endsWith('.pdf');

  return (
    <div className="lightbox show" id="lightbox" onClick={onClose} style={{ display: 'flex', opacity: 1, pointerEvents: 'auto' }}>
      <motion.div 
        className="lightbox-inner glass"
        layoutId={`cert-card-${certificate.id}`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '1100px', width: '95%', maxHeight: '95vh', overflowY: 'auto', padding: '40px' }}
      >
        <h3 id="lightboxTitle" style={{ fontSize: '24px', marginBottom: '8px' }}>{certificate.title}</h3>
        <p id="lightboxIssuer" style={{ fontSize: '15px', marginBottom: '24px', opacity: 0.8 }}>{certificate.issuer}</p>
        
        <div id="lightboxImage">
          {urlObj ? (
            isPdf ? (
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1.414/1', marginTop: '16px', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                <iframe 
                  src={`${urlObj}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  style={{ position: 'absolute', top: '-1px', left: '-1px', width: 'calc(100% + 2px)', height: 'calc(100% + 2px)', border: 'none', pointerEvents: 'none' }}
                  title={certificate.title}
                  tabIndex="-1"
                ></iframe>
                {/* Invisible overlay to block all right-clicks and interactions */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}></div>
              </div>
            ) : (
              <img src={urlObj} alt={certificate.title} style={{ width: '100%', borderRadius: '12px' }} />
            )
          ) : (
            <div className="cert-icon-fallback" style={{ fontSize: '48px', textAlign: 'center', padding: '40px' }}>📄</div>
          )}
        </div>

        {certificate.link && certificate.link !== '#' && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <a href={certificate.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-block' }}>
              Buka Tautan Asli
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CertificateModal;
