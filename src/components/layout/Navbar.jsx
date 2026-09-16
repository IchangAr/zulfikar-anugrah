import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container nav-inner">
        <a 
          href="#hero" 
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img src="/Logo zul.png" alt="Zul Logo" style={{ height: '5.5em', verticalAlign: 'middle', margin: '-1.5em 0', transform: 'scale(1.3)' }} />
        </a>
        <ul id="mobile-navigation" className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#about" onClick={() => setIsMenuOpen(false)}>Tentang</a></li>
          <li><a href="#experience" onClick={() => setIsMenuOpen(false)}>Pengalaman</a></li>
          <li><a href="#projects" onClick={() => setIsMenuOpen(false)}>Project</a></li>
          <li><a href="#achievements" onClick={() => setIsMenuOpen(false)}>Pencapaian</a></li>
          <li><a href="#certificates" onClick={() => setIsMenuOpen(false)}>Sertifikat</a></li>
          <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Kontak</a></li>
        </ul>
        <div className="nav-cta hidden md:block">
          <a href="#contact" className="btn btn-ghost btn-sm">Hubungi Saya</a>
        </div>
        <button
          className="menu-toggle block md:hidden"
          type="button"
          aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
