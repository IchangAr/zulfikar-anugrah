import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import AchievementModal from './AchievementModal';
import { supabase } from '../../utils/supabase';
import { useProfile } from '../../hooks/useProfile';

const AchievementCard = ({ ach, index, h, onClick }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Parallax image shift
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const masonryColors = ['#f97316', '#22c55e', '#eab308', '#3b82f6', '#14b8a6', '#f43f5e'];
  const images = ach.image_urls && ach.image_urls.length > 0
      ? ach.image_urls
      : (ach.image_url ? [ach.image_url] : []);
  const firstImg = images.length > 0 ? images[0] : '';
  const bgColor = masonryColors[index % masonryColors.length];

  return (
    <motion.div 
      ref={cardRef}
      layoutId={`ach-card-${ach.id}`}
      className="achievement-item"
      style={{ height: `${h}px`, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onClick(ach)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 60, damping: 20, delay: (index % 3) * 0.1 }}
    >
      <motion.div 
        className="achievement-item-img" 
        style={{ 
          backgroundImage: firstImg ? `url('${firstImg}')` : 'none',
          backgroundColor: bgColor,
          y: yParallax,
          scale: 1.25, // Scale up to hide edges during parallax shift
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="achievement-item-overlay">
        <h3>{ach.title}</h3>
        <p>{ach.meta || ach.issuer || 'Achievement'}</p>
        <div className="achievement-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>
      </div>
    </motion.div>
  );
};

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const { profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    const fetchAchievements = async () => {
      if (profileLoading) return;
      
      if (!profile?.user_id) {
        setAchievements([]);
        setLoading(false);
        return;
      }

      const query = supabase
        .from('achievements')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('sort_order', { ascending: true });

      const { data, error } = await query;
      
      if (!error && data) {
        setAchievements(data);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, [profile, profileLoading]);

  return (
    <section id="achievements">
      <div className="container">
        <motion.div 
          className="section-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow">Pencapaian</div>
          <h2>Penghargaan &amp; Kompetisi</h2>
          <p>Daftar pencapaian yang telah saya raih.</p>
        </motion.div>
        
        <div className="achievement-grid" id="achievementList">
          {loading ? (
            <p className="data-status">Memuat pencapaian…</p>
          ) : achievements.length === 0 ? (
            <p className="data-status">Belum ada pencapaian ditambahkan.</p>
          ) : (
            achievements.map((ach, index) => {
              const heights = [320, 420, 280, 480, 360, 400];
              const h = heights[index % heights.length];
              return (
                <AchievementCard 
                  key={ach.id || index}
                  ach={ach}
                  index={index}
                  h={h}
                  onClick={setSelectedAchievement}
                />
              );
            })
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedAchievement && (
          <AchievementModal 
            achievement={selectedAchievement} 
            onClose={() => setSelectedAchievement(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Achievements;
