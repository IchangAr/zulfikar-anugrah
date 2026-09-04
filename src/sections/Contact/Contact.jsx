import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Aurora from '../../components/Aurora';
import { supabase } from '../../utils/supabase';
import { useProfile } from '../../hooks/useProfile';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { profile } = useProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.user_id) return;

    setLoading(true);
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          name,
          email,
          message,
          user_id: profile.user_id
        }
      ]);

    setLoading(false);
    if (!error) {
      setSubmitted(true);
    } else {
      alert("Gagal mengirim pesan: " + error.message);
    }
  };

  return (
    <section id="contact" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* WebGL Aurora Background for Footer Bookend */}
      <div className="contact-bg-aurora" style={{ 
        position: 'absolute', 
        inset: 0, 
        pointerEvents: 'none', 
        zIndex: 0, 
        opacity: 0.5, 
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
      }}>
        <div style={{ transform: 'scaleY(-1)', width: '100%', height: '100%' }}>
          <Aurora 
            colorStops={["#8b5cf6", "#3b82f6", "#8b5cf6"]} 
            blend={0.6} 
            amplitude={1.4} 
            speed={0.7} 
          />
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          className="section-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow">Hubungi Saya</div>
          <h2>Mari Bangun Sesuatu yang Berdampak</h2>
        </motion.div>

        <motion.div 
          className="contact-progress"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="progress-line"></div>
          <div className="progress-dot"></div>
        </motion.div>

        <motion.div 
          className="contact-card-v2 glass"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="contact-v2-grid">
            {/* Left: CTA / Illustration */}
            <div className="contact-v2-left">
              <div className="contact-illustration">
                <div className="contact-icon-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
                <div className="sparkle sparkle-1">✦</div>
                <div className="sparkle sparkle-2">✦</div>
                <div className="sparkle sparkle-3">·</div>
                <div className="sparkle sparkle-4">✦</div>
              </div>
              <h3 className="contact-cta-title">Saya terbuka untuk<br/><span className="cta-highlight">kolaborasi</span> menarik!</h3>
              <p className="contact-cta-desc">Baik itu project freelance, kerja sama, atau sekadar ngobrol tentang ide, saya siap terhubung.</p>
              <div className="contact-cta-line"></div>
            </div>

            {/* Right: Form */}
            <div className="contact-v2-right">
              {!submitted ? (
                <form id="contactForm" onSubmit={handleSubmit}>
                  <div className="field-v2">
                    <label htmlFor="name">Nama</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input type="text" id="name" placeholder="Nama lengkap Anda" required />
                    </div>
                  </div>
                  <div className="field-v2">
                    <label htmlFor="email">Email</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <input type="email" id="email" placeholder="nama@email.com" required />
                    </div>
                  </div>
                  <div className="field-v2">
                    <label htmlFor="message">Pesan</label>
                    <textarea id="message" placeholder="Ceritakan sedikit tentang project Anda" required></textarea>
                  </div>
                  <button type="submit" className="btn-send-v2" disabled={loading}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                  </button>
                </form>
              ) : (
                <div className="success-box" id="successBox" style={{ display: 'block', opacity: 1, visibility: 'visible', transform: 'translateY(0)' }}>
                  <div className="success-icon">✓</div>
                  <h3 style={{ marginBottom: '6px' }}>Pesan terkirim</h3>
                  <p style={{ color: 'var(--t-secondary)', fontSize: '14px' }}>Terima kasih, saya akan membalas secepatnya.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
