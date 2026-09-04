import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import ExperienceCard from './ExperienceCard';
import TimelineNode from './TimelineNode';

const ExperienceTimeline = ({ experiences }) => {
  const containerRef = useRef(null);

  // Track scroll progress within this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Add a smooth spring to the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // Calculate SVG Path dynamically based on number of items
  // We'll create a sine-wave like path that snakes left and right
  const generatePath = () => {
    const numItems = experiences.length;
    if (numItems <= 1) return "M 50 0 L 50 100";
    
    let path = "M 50 0 ";
    const step = 100 / numItems;
    
    for (let i = 0; i < numItems; i++) {
      const yStart = i * step;
      const yEnd = (i + 1) * step;
      const yMid = yStart + (step / 2);
      
      // Alternate curve direction (wide curve shape, passes under cards)
      const isRight = i % 2 === 0;
      const xControl = isRight ? 80 : 20;
      
      // If it's the last item
      if (i === numItems - 1) {
        path += `C ${xControl} ${yStart + step/3}, 50 ${yEnd - step/3}, 50 ${yEnd} `;
      } else {
        path += `C ${xControl} ${yStart + step/3}, ${xControl} ${yEnd - step/3}, 50 ${yEnd} `;
      }
    }
    return path;
  };

  return (
    <div className="relative w-full mx-auto max-w-6xl py-10" ref={containerRef}>
      
      {/* Background SVG Curve (Base) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0">
        <svg 
          className="w-full h-full drop-shadow-2xl" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          {/* Soft outer glow */}
          <path 
            d={generatePath()} 
            fill="none" 
            stroke="url(#glowGradient)" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="blur-[6px] opacity-70"
          />
          
          {/* Solid Core Line */}
          <path 
            d={generatePath()} 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Dotted Trail (parallel) */}
          <path 
            d={generatePath()} 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="2" 
            strokeDasharray="1 8"
            strokeLinecap="round" 
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="opacity-80"
            style={{ transform: 'translate(1.5%, 1.5%)' }}
          />
          
          {/* Animated Highlight Line */}
          <motion.path 
            d={generatePath()} 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: smoothProgress }}
            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          />

          <defs>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
              <stop offset="50%" stopColor="rgba(216, 180, 254, 0.6)" />
              <stop offset="100%" stopColor="rgba(147, 197, 253, 0.8)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Mobile straight line */}
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-white/10 md:hidden rounded-full">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"
          style={{ height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
        />
      </div>

      {/* Experience Items */}
      <div className="relative z-10 flex flex-col gap-12 md:gap-0">
        {experiences.map((exp, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div 
              key={exp.id || index} 
              className={`relative flex items-center md:min-h-[300px] ${isEven ? 'md:justify-start' : 'md:justify-end'} pl-16 md:pl-0`}
            >
              {/* Desktop Node */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <TimelineNode scrollYProgress={scrollYProgress} index={index} total={experiences.length} />
              </div>

              {/* Mobile Node */}
              <div className="md:hidden absolute left-6 top-8 -translate-x-1/2 z-20">
                <TimelineNode scrollYProgress={scrollYProgress} index={index} total={experiences.length} mobile />
              </div>

              {/* Card - Narrower to leave margin from the center line */}
              <div className="w-full md:w-[40%]">
                <ExperienceCard exp={exp} index={index} isEven={isEven} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceTimeline;
