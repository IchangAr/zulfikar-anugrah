import React from 'react';
import { Users, Briefcase, MessageCircle, FileText, PenTool } from 'lucide-react';

export const skillsData = [
  {
    title: 'HUMAN RESOURCES',
    description: 'Administrasi HR • Recruitment Support • Employee Administration • Basic HR',
    icon: <Users size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
  },
  {
    title: 'LEGAL & HUKUM',
    description: 'Legal Research • Analisis Dokumen • Perizinan • Hukum Ketenagakerjaan',
    icon: <Briefcase size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
  },
  {
    title: 'KOMUNIKASI',
    description: 'Public Relations • Customer Service • Koordinasi • Komunikasi Profesional',
    icon: <MessageCircle size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
  },
  {
    title: 'OFFICE & DATA',
    description: 'Microsoft Office • Google Workspace',
    icon: <FileText size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
  },
  {
    title: 'CREATIVE TOOLS',
    description: 'Canva • CapCut',
    icon: <PenTool size={20} color="white" />,
    gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)',
  },
];
