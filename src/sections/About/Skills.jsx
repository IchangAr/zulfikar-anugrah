import React from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '../../data/skills';

const Skills = () => {
  return (
    <motion.div 
      className="about-v2-skills"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="skills-section-title">
        <h3>Keahlian & Tools</h3>
      </div>
      <div className="skills-grid-v2">
        {skillsData.map((skill, index) => (
          <motion.div 
            key={index} 
            className="skill-card-v2 glass"
            whileHover={{ 
              y: -8, 
              scale: 1.02, 
              boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.15)"
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              default: { type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 },
              hover: { type: "spring", stiffness: 400, damping: 25 }
            }}
          >
            <div className="skill-card-inner">
              <div className="skill-icon-circle" style={{ background: skill.gradient }}>
                {skill.icon}
              </div>
              <div className="skill-card-text">
                <h4>{skill.title}</h4>
                <p>{skill.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Skills;
