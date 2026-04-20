import React from 'react';
import { LogoIcon } from '@/components/landing/LogoIcon';

export const LandingFooter = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a
              href="#top"
              className="logo"
              aria-label="Code Helper Studio"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <LogoIcon prefix="footer" size={32} />
              <span><span className="logo-brand">Code Helper Studio</span></span>
            </a>
            <p>AI website workspace for safer changes — preview every edit, enforce your brand, and publish with full version history.</p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a onClick={() => scrollTo('features')} style={{cursor:'pointer'}}>Features</a></li>
              <li><a onClick={() => scrollTo('how')} style={{cursor:'pointer'}}>How it works</a></li>
              <li><a onClick={() => scrollTo('faq')} style={{cursor:'pointer'}}>FAQ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Code Helper AI</span>
          <span>Built securely on Google Cloud Platform &amp; Firebase</span>
        </div>
      </div>
    </footer>
  );
};
