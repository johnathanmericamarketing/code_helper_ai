import React from 'react';

const audienceCards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3l18 9-18 9V3z"/>
      </svg>
    ),
    title: 'Founders & marketers',
    body: "Launch pages, update messaging, and run tests without waiting on a dev queue. Ship a new CTA before lunch — and know you didn't break anything.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 3a9 9 0 019 9M12 12l6-3"/>
      </svg>
    ),
    title: 'Designers & operators',
    body: 'Tweak layouts, refine copy, and protect the brand with tokens Studio actually respects. Every change looks like it belongs.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/>
      </svg>
    ),
    title: 'Developers',
    body: 'Stop being the single point of failure for copy edits. Set guardrails, review diffs, approve with confidence — and keep the production system clean.',
  },
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

export const AudienceSection = () => {
  return (
    <section id="who">
      <div className="container">
        <div className="section-head reveal" style={{textAlign:'left', marginLeft:0}}>
          <span className="eyebrow"><span className="dot"></span>Who this is for</span>
          <h2 style={{marginTop:'18px'}}>Built for mixed teams, <span className="gradient-text">not just developers.</span></h2>
        </div>
        <div className="who-grid">
          <div className="audience-cards">
            {audienceCards.map((card, i) => (
              <div className="audience-card reveal" key={i}>
                <div className="a-icon">
                  {card.icon}
                </div>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="who-sticky reveal">
            <h3>Less friction.<br/>More confidence.<br/>Faster shipping.</h3>
            <ul>
              <li><CheckIcon />Anyone on the team can propose a change, safely.</li>
              <li><CheckIcon />Every draft is a reviewable, reversible step.</li>
              <li><CheckIcon />Brand tokens are enforced — not suggested.</li>
              <li><CheckIcon />Roll back instantly if something ever feels off.</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};
