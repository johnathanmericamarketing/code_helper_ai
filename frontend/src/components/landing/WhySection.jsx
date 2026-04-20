import React, { useEffect } from 'react';

export const WhySection = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    const t = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 4000);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  const cards = [
    {
      num: '01 · Today',
      title: 'The problem with normal AI chat',
      body: "Open-ended prompts return open-ended output. You paste code you don't fully understand into a live product, hope styling doesn't drift, and only notice the regression after it's shipped. There's no diff, no preview, no rollback — just vibes.",
    },
    {
      num: '02 · The difference',
      title: 'Structured, visual, reversible',
      body: "Every request produces a targeted diff, a rendered preview, and a versioned draft. You see exactly what will change before it changes, compare it side-by-side with your live site, and approve when you're ready. Not before.",
    },
    {
      num: '03 · The promise',
      title: 'The core promise',
      body: "Your website becomes a surface your whole team can ship to — safely. Founders can iterate copy. Designers can tune layouts. Developers stay in control of the system. Nobody has to be afraid of the \"Publish\" button again.",
    },
  ];

  return (
    <section id="why">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot"></span>Why this system exists</span>
          <h2>Most teams don't need more website tools.<br/>They need a <span className="gradient-text">safer way to make changes.</span></h2>
          <p>Marketing wants to move. Design wants consistency. Engineering wants the deploy to be boring. Free-form AI chat doesn't solve that — it just shifts the risk. Code Helper Studio turns every change into a reviewable, reversible step with your brand rules on by default.</p>
        </div>
        <div className="why-cards">
          {cards.map((card, i) => (
            <div className="why-card reveal" key={i}>
              <div className="why-num">{card.num}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
