import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoIcon } from '@/components/landing/LogoIcon';
import { useAuth } from '@/context/AuthContext';

export const LandingHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const navRef = useRef(null);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    // Nav active state tracking
    const ids = ['why', 'how', 'features', 'faq'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const links = nav.querySelectorAll('.nav-links a[data-nav]');

    const handleNavActive = () => {
      const y = window.scrollY + 120;
      let current = null;
      sections.forEach(s => {
        if (s.offsetTop <= y) current = s.id;
      });
      links.forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-nav') === current);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleNavActive, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleNavActive);
    };
  }, []);

  return (
    <nav className="nav" ref={navRef}>
      <div className="container nav-inner">
        <a href="#top" className="logo" aria-label="Code Helper Studio" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <LogoIcon prefix="nav" size={32} />
          <span>
            <span className="logo-brand">Code Helper</span>{' '}
            <span className="logo-studio">· STUDIO</span>
          </span>
        </a>

        <div className="nav-links">
          <a data-nav="why" onClick={() => scrollTo('why')}>Why it works</a>
          <a data-nav="how" onClick={() => scrollTo('how')}>How it works</a>
          <a data-nav="features" onClick={() => scrollTo('features')}>Features</a>
          <a data-nav="faq" onClick={() => scrollTo('faq')}>FAQ</a>
        </div>

        <div className="nav-actions">
          {user ? (
            <button className="btn-primary" onClick={() => navigate('/workspace')}>
              Open Workspace
            </button>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate('/auth')}>Sign in</button>
              <button className="btn-primary" onClick={() => navigate('/auth')}>Start free</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
