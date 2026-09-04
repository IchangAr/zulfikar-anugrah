import React from 'react';
import { Code, Database, Layout, PenTool, Wifi, Layers } from 'lucide-react';

export const skillsData = [
  {
    title: 'CORE TECH',
    description: 'Laravel • PHP • REST API',
    icon: <Code size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
  },
  {
    title: 'DATABASES',
    description: 'MySQL • Supabase • Firebase',
    icon: <Database size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
  },
  {
    title: 'FRONTEND',
    description: 'HTML • CSS • JavaScript • Tailwind CSS',
    icon: <Layout size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
  },
  {
    title: 'DEV TOOLS',
    description: 'Git • GitHub • VS Code • Figma',
    icon: <PenTool size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
  },
  {
    title: 'IOT',
    description: 'ESP32 • Arduino IDE • Blynk',
    icon: <Wifi size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)',
  },
  {
    title: 'AI & DATA',
    description: 'Python • Scikit-learn • TensorFlow',
    icon: <Layers size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  },
];
