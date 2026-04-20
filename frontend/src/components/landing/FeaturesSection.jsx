import React from 'react';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
        <path d="M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>
      </svg>
    ),
    title: 'AI website changes',
    body: 'Turn plain-language requests into real, on-brand UI. No copy-paste loop, no broken styles.',
    featured: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="8" height="16" rx="2"/>
        <rect x="13" y="4" width="8" height="16" rx="2"/>
      </svg>
    ),
    title: 'Before & after review',
    body: 'Compare live vs. preview side-by-side, with a pixel diff and an element-by-element breakdown.',
    featured: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13" cy="12" r="8"/>
        <path d="M13 4v16M21 12H5"/>
      </svg>
    ),
    title: 'Brand-aware output',
    body: "Colors, fonts, spacing, and tone stay consistent — Studio reads your tokens so the AI can't drift.",
    featured: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0118 0 9 9 0 01-18 0z"/>
        <path d="M12 7v5l3 2"/>
      </svg>
    ),
    title: 'Version confidence',
    body: 'Every draft is stored and reversible. Restore any past state instantly — no "undo" anxiety.',
    featured: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="8" width="14" height="10" rx="2"/>
        <path d="M16 12h5M18 10l-2 2 2 2"/>
        <circle cx="8" cy="13" r="1.5"/>
      </svg>
    ),
    title: 'Bring your own keys',
    body: 'Use your own OpenAI, Anthropic, or Gemini keys — or let Studio handle billing on a managed plan.',
    featured: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3l7 17 2.5-7.5L20 10z"/>
      </svg>
    ),
    title: 'Visual inspector',
    body: 'Click any element to target it exactly. One precise prompt = one clean change. Fewer API calls = lower cost.',
    featured: true,
    iconStyle: { background: 'rgba(167,139,250,0.18)', borderColor: 'rgba(167,139,250,0.45)', color: '#c4b5fd' },
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>What you can do</span>
          <h2>One workspace for AI generation, visual review, <span className="gradient-text">brand control, and publishing.</span></h2>
          <p>Everything you need to go from idea to shipped, without leaving the page — and without touching anything you shouldn't.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className={`feature-card reveal${f.featured ? ' featured' : ''}`} key={i}>
              <div className="feature-icon" style={f.iconStyle || {}}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
