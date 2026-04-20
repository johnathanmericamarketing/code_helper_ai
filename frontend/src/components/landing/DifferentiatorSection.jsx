import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const DifferentiatorSection = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card cta-shimmer reveal">
          <div className="cta-inner">
            <span className="eyebrow"><span className="dot"></span>Sign up</span>
            <h2>
              Start improving your website with{' '}
              <span style={{ background: 'linear-gradient(120deg,#ffffff,#e9d5ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                safer AI workflows.
              </span>
            </h2>
            <p>Create a project, load your current site, and generate your first guided preview in minutes. No credit card. No destructive edits. Just a cleaner way to ship.</p>
            <div className="cta-checks">
              <span className="cta-check"><CheckIcon />Free to start</span>
              <span className="cta-check"><CheckIcon />Full version history</span>
              <span className="cta-check"><CheckIcon />Bring your own keys</span>
            </div>
            <div className="cta-actions">
              <button className="btn-white" onClick={() => navigate('/auth')}>Create free account</button>
              <button className="btn-white-ghost" onClick={() => navigate('/auth')}>Book a demo</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
