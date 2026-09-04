import React from 'react';
import { motion } from 'framer-motion';

const ExperienceCard = ({ exp, index, isEven }) => {
  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
      style={{
        padding: '2.5rem',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
      }}
      initial={{ opacity: 0, x: isEven ? -20 : 20, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        type: "spring",
        stiffness: 40,
        damping: 15,
        mass: 1,
        delay: 0.1
      }}
      whileHover={{ y: -5 }}
    >
      {/* Subtle Glow Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-slate-800 mb-1">{exp.position}</h3>
        <div className="text-blue-600 font-semibold mb-3">{exp.company}</div>
        
        <div className="inline-block text-sm text-slate-500 mb-4 font-medium">
          {exp.period}
        </div>

        <ul className="space-y-3 text-slate-700 text-sm md:text-base mt-2">
          {exp.achievements && exp.achievements.map((ach, i) => (
            <li key={i} className="flex items-start">
              <span className="mr-3 text-blue-500 mt-1">▹</span>
              <span className="leading-relaxed">{ach}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;
