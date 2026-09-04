import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import ProjectModal from './ProjectModal';
import { supabase } from '../../utils/supabase';
import { useProfile } from '../../hooks/useProfile';

const MagneticButton = ({ children, className }) => {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Strength of magnetic pull
    mouseX.set((e.clientX - centerX) * 0.3);
    mouseY.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
    >
      {children}
    </motion.button>
  );
};

const ProjectCardItem = ({ project, index, total, onClick }) => {
  const cardRef = useRef(null);

  // --- Parallax 3D Stacking ---
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 100px", "start -300px"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  
  const scale = useTransform(smoothProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(smoothProgress, [0, 1], [1, 0]);
  // Use a slight y offset so it looks like it sinks backwards
  const ySink = useTransform(smoothProgress, [0, 1], [0, -30]);

  // --- 3D Glass Tilt ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

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

  return (
    <motion.div 
      ref={cardRef}
      className="project-card glass"
      style={{ 
        cursor: 'pointer',
        scale,
        opacity,
        y: ySink,
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d"
      }}
      onClick={() => onClick(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      <div className="project-thumb" style={{ transform: "translateZ(30px)" }}>
        {(() => {
          const images = project.image_urls && project.image_urls.length > 0 
            ? project.image_urls 
            : (project.thumbnail_url ? [project.thumbnail_url] : []);
          
          return images.length > 0 ? (
            <div className="project-slider">
              {images.map((img, i) => (
                <div key={i} className="project-slide" style={{ backgroundImage: `url('${img}')` }}></div>
              ))}
            </div>
          ) : (
            <div className="project-slide" style={{ background: 'var(--c-primary)' }}></div>
          );
        })()}
      </div>
      <div className="project-body" style={{ transform: "translateZ(40px)" }}>
        <div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="tag-row">
            {project.tags && project.tags.map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        </div>
        <MagneticButton className="btn view-detail-btn project-detail-btn">Lihat Detail →</MagneticButton>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const { profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    const fetchProjects = async () => {
      if (profileLoading) return; // Tunggu profile selesai dimuat
      
      if (!profile?.user_id) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const query = supabase
        .from('projects')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('sort_order', { ascending: true });

      const { data, error } = await query;
      
      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [profile, profileLoading]);

  return (
    <section id="projects">
      <div className="container">
        <motion.div 
          className="section-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow">Project Pilihan</div>
          <h2>Eksplorasi & Studi Kasus</h2>
        </motion.div>
        
        <div className="project-grid" id="projectGrid">
          {loading ? (
            <p className="data-status">Memuat project…</p>
          ) : projects.length === 0 ? (
            <p className="data-status">Belum ada project ditambahkan.</p>
          ) : (
            projects.map((project, index) => (
              <ProjectCardItem 
                key={project.id || index}
                project={project}
                index={index}
                total={projects.length}
                onClick={setSelectedProject}
              />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            key="project-modal"
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
