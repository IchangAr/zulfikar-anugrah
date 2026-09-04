import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../utils/supabase';
import ExperienceTimeline from './ExperienceTimeline';
import { useProfile } from '../../hooks/useProfile';

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    const fetchExperiences = async () => {
      if (profileLoading) return;

      if (!profile?.user_id) {
        setExperiences([]);
        setLoading(false);
        return;
      }

      const query = supabase
        .from('experiences')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('sort_order', { ascending: true });

      const { data, error } = await query;
      
      if (!error && data) {
        setExperiences(data);
      }
      setLoading(false);
    };

    fetchExperiences();
  }, [profile, profileLoading]);

  return (
    <section id="experience" className="relative overflow-hidden py-24">
      <div className="container relative z-10">
        <motion.div 
          className="section-head text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow inline-block">Pengalaman</div>
          <h2 className="mt-4 mb-4">Ringkasan pengalaman kerja</h2>
          <p className="max-w-2xl mx-auto">Jejak pengalaman yang menunjukkan bagaimana saya menerapkan keterampilan teknis untuk menghasilkan solusi yang berdampak.</p>
        </motion.div>
        
        {loading ? (
          <p className="data-status text-center">Memuat pengalaman…</p>
        ) : experiences.length === 0 ? (
          <p className="data-status text-center">Belum ada pengalaman ditambahkan.</p>
        ) : (
          <ExperienceTimeline experiences={experiences} />
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
