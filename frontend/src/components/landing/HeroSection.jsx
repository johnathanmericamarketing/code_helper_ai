import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const demoColRef = useRef(null);

  // Phrase cycling effect
  useEffect(() => {
    const phrases = document.querySelectorAll('.cycle-wrap .phrase');
    if (!phrases.length) return;
    let i = 0;
    const interval = setInterval(() => {
      phrases[i].classList.remove('active');
      i = (i + 1) % phrases.length;
      phrases[i].classList.add('active');
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Particles canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;
    const particles = [];
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', handleMouseMove);

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * 2000, y: Math.random() * 1200,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.4 + 0.1,
        c: Math.random() > 0.5 ? 'rgba(139,92,246,' : 'rgba(99,102,241,'
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { p.vx += dx / dist * 0.08; p.vy += dy / dist * 0.08; }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.99; p.vy *= 0.99;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + p.o + ')';
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Live demo cycling engine
  useEffect(() => {
    const scenes = [
      {
        prompt: 'Make the CTA button violet with a glow and round it up',
        steps: [
          { delay: 0,    fn: () => { scanning(); } },
          { delay: 900,  fn: () => { highlight('dsCtaBtn'); } },
          { delay: 1600, fn: () => {
            const b = document.getElementById('dsCtaBtn');
            if (!b) return;
            b.style.background = 'linear-gradient(135deg,#8b5cf6,#4f46e5)';
            b.style.borderRadius = '999px';
            b.style.boxShadow = '0 0 22px 4px rgba(139,92,246,0.55)';
            b.style.color = '#fff';
            b.style.transform = 'scale(1.07)';
            flash(b);
          }},
          { delay: 2200, fn: () => { done('v13 saved · 1 file changed'); } }
        ]
      },
      {
        prompt: 'Add a free trial badge to the Pro card and make it pop',
        steps: [
          { delay: 0,    fn: () => { scanning(); } },
          { delay: 900,  fn: () => { highlight('dsCard2'); } },
          { delay: 1600, fn: () => {
            const b = document.getElementById('dsBadge');
            if (!b) return;
            b.textContent = '🎉 Free 14-day trial';
            b.style.background = 'linear-gradient(90deg,#7c3aed,#4f46e5)';
            b.style.color = '#fff';
            b.style.padding = '3px 10px';
            b.style.borderRadius = '999px';
            b.style.fontSize = '9px';
            b.style.fontWeight = '700';
            b.style.letterSpacing = '0.03em';
            b.style.display = 'inline-block';
            b.style.animation = 'badge-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards';
            flash(b);
          }},
          { delay: 2200, fn: () => { done('v14 saved · 1 file changed'); } }
        ]
      },
      {
        prompt: 'Change the headline font to something bolder and increase spacing',
        steps: [
          { delay: 0,    fn: () => { scanning(); } },
          { delay: 900,  fn: () => { highlight('dsHeadline'); } },
          { delay: 1600, fn: () => {
            const h = document.getElementById('dsHeadline');
            if (!h) return;
            h.style.fontWeight = '900';
            h.style.fontSize = '16px';
            h.style.letterSpacing = '-0.04em';
            h.style.lineHeight = '1.1';
            h.style.background = 'linear-gradient(135deg,#f1f5f9,#a78bfa)';
            h.style.webkitBackgroundClip = 'text';
            h.style.webkitTextFillColor = 'transparent';
            h.style.backgroundClip = 'text';
            flash(h);
          }},
          { delay: 2200, fn: () => { done('v15 saved · 1 file changed'); } }
        ]
      },
      {
        prompt: 'Make the Pro card background a dark gradient so it stands out more',
        steps: [
          { delay: 0,    fn: () => { scanning(); } },
          { delay: 900,  fn: () => { highlight('dsCard2'); } },
          { delay: 1600, fn: () => {
            const c = document.getElementById('dsCard2');
            if (!c) return;
            c.style.background = 'linear-gradient(145deg,#1e1040,#2d1b6e)';
            c.style.borderColor = 'rgba(139,92,246,0.5)';
            c.style.boxShadow = '0 0 40px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.08)';
            c.style.transform = 'scale(1.03)';
            flash(c);
          }},
          { delay: 2200, fn: () => { done('v16 saved · 1 file changed'); } }
        ]
      }
    ];

    let sceneIdx = 0;
    let timeouts = [];

    const scanning = () => {
      const statusEl = document.getElementById('demoStatus');
      if (!statusEl) return;
      statusEl.innerHTML = '<span class="ds-scanning"><span class="ds-spin"></span> Analyzing site…</span>';
      statusEl.style.opacity = '1';
    };

    const done = (msg) => {
      const statusEl = document.getElementById('demoStatus');
      const verEl = document.getElementById('fcVerTitle');
      if (statusEl) statusEl.innerHTML = '<span class="ds-done">✓ ' + msg + '</span>';
      if (verEl) verEl.textContent = msg.split('·')[0].trim();
      const fc = document.getElementById('fcVersion');
      if (fc) {
        fc.style.transform = 'translateY(-6px) scale(1.06)';
        const t = setTimeout(() => { fc.style.transform = ''; }, 600);
        timeouts.push(t);
      }
    };

    const highlight = (id) => {
      document.querySelectorAll('.ds-highlight').forEach(el => el.classList.remove('ds-highlight'));
      const el = document.getElementById(id);
      if (el) el.classList.add('ds-highlight');
    };

    const flash = (el) => {
      el.style.transition = 'all 0.55s cubic-bezier(0.16,1,0.3,1)';
      document.querySelectorAll('.ds-highlight').forEach(e => e.classList.remove('ds-highlight'));
    };

    const typePrompt = (text, cb) => {
      const typedEl = document.getElementById('dtTyped');
      const cursorEl = document.getElementById('dtCursor');
      const statusEl = document.getElementById('demoStatus');
      if (!typedEl) return;
      typedEl.textContent = '';
      if (cursorEl) cursorEl.style.opacity = '1';
      if (statusEl) statusEl.style.opacity = '0';
      let i = 0;
      const speed = Math.max(28, 800 / text.length);
      const next = () => {
        if (i < text.length) {
          typedEl.textContent += text[i++];
          const t = setTimeout(next, speed + Math.random() * 18);
          timeouts.push(t);
        } else {
          if (cursorEl) cursorEl.style.opacity = '0';
          const t = setTimeout(cb, 300);
          timeouts.push(t);
        }
      };
      next();
    };

    const runScene = (s) => {
      typePrompt(s.prompt, () => {
        s.steps.forEach(step => {
          const t = setTimeout(step.fn, step.delay);
          timeouts.push(t);
        });
      });
    };

    let mainTimeout;
    const nextScene = () => {
      const s = scenes[sceneIdx % scenes.length];
      sceneIdx++;
      runScene(s);
      const totalMs = (s.prompt.length * 42) + 2200 + 3200;
      mainTimeout = setTimeout(nextScene, totalMs);
    };

    const startTimeout = setTimeout(nextScene, 1200);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(mainTimeout);
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <section className="hero" id="top">
      <canvas
        ref={canvasRef}
        id="particleCanvas"
        style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:0.5}}
      />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow"><span className="dot"></span>Built for safer AI website changes</span>
          <h1>
            Change your site.<br/>
            <span className="cycle-wrap">
              <span className="phrase gradient-text active">preview, approve, ship.</span>
              <span className="phrase gradient-text">no surprises, ever.</span>
              <span className="phrase gradient-text">faster than a dev queue.</span>
              <span className="phrase gradient-text">your brand, enforced.</span>
              <span className="phrase gradient-text">one prompt. one change.</span>
            </span>
          </h1>
          <p className="lead">Describe any change in plain language. Get a structured diff, a live visual preview, and a one-click publish — with full version history and brand rules enforced automatically.</p>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={() => navigate('/auth')}>Start building for free</button>
            <button className="btn-ghost" onClick={() => navigate('/auth')}>Watch the workflow →</button>
          </div>
          <div className="trust-badges">
            <span className="trust-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Safe before &amp; after preview
            </span>
            <span className="trust-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 21 12 16.5 5.8 21l2.4-7.1L2 9.4h7.6z"/></svg>
              Brand-aware AI changes
            </span>
            <span className="trust-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></svg>
              Drafts, versions &amp; restore
            </span>
          </div>
        </div>

        {/* LIVE DEMO WIDGET */}
        <div className="mock-col" id="demo-col" ref={demoColRef}>

          {/* Browser chrome preview */}
          <div className="demo-browser">
            <div className="demo-browser-bar">
              <span className="mock-dot"></span><span className="mock-dot"></span><span className="mock-dot"></span>
              <span className="demo-url">marketing-site.com / pricing</span>
            </div>
            {/* Mini site preview that gets visually transformed */}
            <div className="demo-site" id="demoSite">
              <div className="ds-nav">
                <span className="ds-logo">Acme<span className="ds-logo-dot">.</span></span>
                <span className="ds-nav-links"><span>Home</span><span>Features</span><span>Pricing</span></span>
              </div>
              <div className="ds-hero">
                <div className="ds-headline" id="dsHeadline">Simple pricing.<br/>No surprises.</div>
                <div className="ds-sub" id="dsSub">Start free. Upgrade when you're ready.</div>
                <button className="ds-cta" id="dsCtaBtn">Get started</button>
              </div>
              <div className="ds-cards">
                <div className="ds-card" id="dsCard1">
                  <div className="ds-plan">Starter</div>
                  <div className="ds-price" id="dsPrice1">$0<span>/mo</span></div>
                  <div className="ds-features">
                    <div className="ds-feat">5 projects</div>
                    <div className="ds-feat">10GB storage</div>
                    <div className="ds-feat">Community support</div>
                  </div>
                  <button className="ds-plan-btn" id="dsPlanBtn1">Start free</button>
                </div>
                <div className="ds-card ds-card-pro" id="dsCard2">
                  <div className="ds-badge" id="dsBadge">Most popular</div>
                  <div className="ds-plan">Pro</div>
                  <div className="ds-price" id="dsPrice2">$29<span>/mo</span></div>
                  <div className="ds-features">
                    <div className="ds-feat">Unlimited projects</div>
                    <div className="ds-feat">100GB storage</div>
                    <div className="ds-feat">Priority support</div>
                  </div>
                  <button className="ds-plan-btn ds-plan-btn-pro" id="dsPlanBtn2">Get started</button>
                </div>
              </div>
            </div>
          </div>

          {/* AI prompt terminal below */}
          <div className="demo-terminal" id="demoTerminal">
            <div className="demo-terminal-bar">
              <span className="dt-dot dt-red"></span><span className="dt-dot dt-yellow"></span><span className="dt-dot dt-green"></span>
              <span className="dt-label">Code Helper Studio — AI prompt</span>
              <span className="dt-model" id="dtModel">claude opus-4.5</span>
            </div>
            <div className="demo-terminal-body">
              <span className="dt-prompt-sym">›</span>
              <span className="dt-typed" id="dtTyped"></span><span className="dt-cursor" id="dtCursor">|</span>
            </div>
            <div className="demo-status" id="demoStatus"></div>
          </div>

          {/* Floating cards */}
          <div className="float-card float-brand" id="fcBrand" aria-hidden="true">
            <span className="fc-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.2 6.6L21 10l-6.8 1.4L12 18l-2.2-6.6L3 10l6.8-1.4L12 2z"/></svg>
            </span>
            <div>
              <div className="fc-title" id="fcBrandTitle">Brand match</div>
              <div className="fc-sub" id="fcBrandSub">Uses your violet accent</div>
            </div>
          </div>

          <div className="float-card float-version" id="fcVersion" aria-hidden="true">
            <span className="fc-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <div>
              <div className="fc-title" id="fcVerTitle">Version saved</div>
              <div className="fc-sub">Restore anytime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
