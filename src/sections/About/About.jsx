import React from 'react';
import { motion } from 'framer-motion';
import Skills from './Skills';
import { useProfile } from '../../hooks/useProfile';

const About = () => {
  const { profile, loading } = useProfile();
  
  const name = profile?.full_name || "Baso Ummul Ikshan.";
  const role = profile?.role || "Fresh Graduate Informatika";
  const bioLong = profile?.bio_long ? profile.bio_long.split('\n').filter(p => p.trim()) : [
    "Saya adalah Fresh Graduate Informatika yang senang membangun solusi digital berbasis web dan data.",
    "Selama mengerjakan berbagai proyek akademik, organisasi, dan freelance, saya mengembangkan aplikasi full-stack, sistem automasi, serta solusi berbasis Machine Learning dan IoT. Saya percaya teknologi yang baik bukan hanya berjalan dengan benar, tetapi juga memberikan dampak nyata bagi pengguna."
  ];

  return (
    <section id="about">
      <div className="container">
        <div className="about-v2">
          {/* Centered Greeting Badge */}
          <motion.div 
            className="section-head" 
            style={{ marginBottom: 0 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <div className="about-greeting-badge">
              <span className="greeting-wave"></span> Halo, perkenalkan!
            </div>
          </motion.div>

          {/* Top Row: Left Bio + Right Principle */}
          <div className="about-v2-top">
            <motion.div 
              className="about-v2-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="about-v2-name">{loading ? 'Memuat...' : name}</h2>
              <p className="about-v2-subtitle">{role}</p>
              <div className="about-v2-bio" id="aboutBioLongText">
                {bioLong.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="about-v2-right"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="principle-card-v2 glass"
                whileHover={{ 
                  scale: 1.02, 
                  y: -5,
                  boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.15)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="principle-card-header">
                  <div className="principle-icon-circle">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <h3 className="principle-title-v2">Prinsip Saya</h3>
                </div>
                <div className="principle-quote-v2">
                  <span className="quote-mark quote-open">"</span>
                  <p>Saya percaya, setiap pekerjaan selalu punya sesuatu untuk dipelajari. Tidak harus langsung bisa semuanya, yang penting mau mencoba, mau belajar, dan bertanggung jawab dengan apa yang sudah dimulai.</p>
                  <span className="quote-mark quote-close">"</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Credential Chips */}
          <motion.div 
            className="about-v2-credentials"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <motion.div className="credential-chip glass" whileHover={{ y: -2 }}>
              <span className="credential-icon">🎓</span>
              <span>Universitas Muslim Indonesia • IPK 3.95</span>
            </motion.div>
            <motion.div className="credential-chip glass" whileHover={{ y: -2 }}>
              <span className="credential-icon">🚀</span>
              <span>Bangkit Academy Graduate</span>
            </motion.div>
            <motion.div className="credential-chip glass" whileHover={{ y: -2 }}>
              <span className="credential-icon">🏅</span>
              <span>BNSP Associate Data Scientist</span>
            </motion.div>
          </motion.div>

          <Skills />

        </div>
      </div>
    </section>
  );
};

export default About;
