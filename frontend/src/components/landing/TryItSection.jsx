import React, { useEffect, useRef } from 'react';

export const TryItSection = () => {
  const inputRef = useRef(null);
  const runBtnRef = useRef(null);
  const responseRef = useRef(null);
  const trStatusRef = useRef(null);
  const trRiskRef = useRef(null);
  const trPlanRef = useRef(null);
  const trDiffRef = useRef(null);
  const trDiffBodyRef = useRef(null);
  const trActionsRef = useRef(null);
  const trPublishRef = useRef(null);
  const trResetRef = useRef(null);
  const liveDotRef = useRef(null);
  const tclListRef = useRef(null);
  const inspBtnRef = useRef(null);
  const trySiteRef = useRef(null);
  const inspCursorRef = useRef(null);
  const inspTipRef = useRef(null);
  const ttNameRef = useRef(null);
  const ttPromptRef = useRef(null);
  const modeBadgeRef = useRef(null);
  const timeoutsRef = useRef([]);

  // --- Try It Engine ---
  useEffect(() => {
    const input = inputRef.current;
    const runBtn = runBtnRef.current;
    const response = responseRef.current;
    const trStatus = trStatusRef.current;
    const trRisk = trRiskRef.current;
    const trPlan = trPlanRef.current;
    const trDiff = trDiffRef.current;
    const trDiffBody = trDiffBodyRef.current;
    const trActions = trActionsRef.current;
    const trPublish = trPublishRef.current;
    const trReset = trResetRef.current;
    const liveDot = liveDotRef.current;
    const tclList = tclListRef.current;
    if (!input || !runBtn || !response) return;

    let versionNum = 12;
    let isRunning = false;
    let pendingReset = null;

    // NLP keyword → mutation map
    const rules = [
      {
        keys: ['headline', 'title', 'heading', 'font', 'bold', 'bigger', 'larger', 'text'],
        risk: 'low',
        plan: 'Targeting the hero headline. Increasing weight, adjusting scale, and applying gradient text fill.',
        diff: [
          { type: 'minus', text: 'font-size: 15px; font-weight: 700; color: #f1f5f9;' },
          { type: 'plus',  text: 'font-size: 19px; font-weight: 900; letter-spacing: -0.04em;' },
          { type: 'plus',  text: 'background: linear-gradient(135deg,#f1f5f9,#a78bfa); -webkit-background-clip: text;' }
        ],
        apply: () => {
          const h = document.getElementById('tsHeadline');
          if (!h) return () => {};
          const prev = { fontSize: h.style.fontSize, fontWeight: h.style.fontWeight, background: h.style.background, webkitBackgroundClip: h.style.webkitBackgroundClip, webkitTextFillColor: h.style.webkitTextFillColor, backgroundClip: h.style.backgroundClip, letterSpacing: h.style.letterSpacing };
          tsHighlight(h);
          const t = setTimeout(() => {
            h.style.fontSize = '19px'; h.style.fontWeight = '900'; h.style.letterSpacing = '-0.04em';
            h.style.background = 'linear-gradient(135deg,#f1f5f9,#a78bfa)';
            h.style.webkitBackgroundClip = 'text'; h.style.webkitTextFillColor = 'transparent'; h.style.backgroundClip = 'text';
            h.style.transition = 'all 0.6s cubic-bezier(0.16,1,0.3,1)';
          }, 400);
          timeoutsRef.current.push(t);
          return () => { Object.assign(h.style, prev); h.style.webkitTextFillColor = ''; };
        }
      },
      {
        keys: ['button', 'cta', 'violet', 'purple', 'glow', 'primary', 'action'],
        risk: 'low',
        plan: 'Targeting the primary CTA button. Applying violet gradient, pill border-radius, and ambient glow.',
        diff: [
          { type: 'minus', text: 'background: #7c3aed; border-radius: 6px;' },
          { type: 'plus',  text: 'background: linear-gradient(135deg,#8b5cf6,#4f46e5);' },
          { type: 'plus',  text: 'border-radius: 999px; box-shadow: 0 0 22px rgba(139,92,246,0.6);' }
        ],
        apply: () => {
          const b = document.getElementById('tsCtaPrimary');
          if (!b) return () => {};
          const prev = { background: b.style.background, borderRadius: b.style.borderRadius, boxShadow: b.style.boxShadow };
          tsHighlight(b);
          const t = setTimeout(() => {
            b.style.background = 'linear-gradient(135deg,#8b5cf6,#4f46e5)';
            b.style.borderRadius = '999px';
            b.style.boxShadow = '0 0 22px rgba(139,92,246,0.6)';
            b.style.transition = 'all 0.55s cubic-bezier(0.16,1,0.3,1)';
          }, 400);
          timeoutsRef.current.push(t);
          return () => { Object.assign(b.style, prev); };
        }
      },
      {
        keys: ['dark', 'background', 'gradient', 'hero', 'section', 'bg'],
        risk: 'low',
        plan: 'Targeting the hero section background. Applying a deep violet-to-dark radial gradient overlay.',
        diff: [
          { type: 'minus', text: 'background: #0d1117;' },
          { type: 'plus',  text: 'background: radial-gradient(ellipse at 50% 0%, #1a0b35 0%, #0d1117 70%);' },
          { type: 'plus',  text: 'border-bottom: 1px solid rgba(139,92,246,0.2);' }
        ],
        apply: () => {
          const s = trySiteRef.current;
          if (!s) return () => {};
          const prev = { background: s.style.background, borderBottom: s.style.borderBottom };
          tsHighlight(s);
          const t = setTimeout(() => {
            s.style.background = 'radial-gradient(ellipse at 50% 0%, #1a0b35 0%, #0d1117 70%)';
            s.style.borderBottom = '1px solid rgba(139,92,246,0.2)';
            s.style.transition = 'background 0.7s ease';
          }, 400);
          timeoutsRef.current.push(t);
          return () => { Object.assign(s.style, prev); };
        }
      },
      {
        keys: ['card', 'feature', 'border', 'round', 'rounded'],
        risk: 'low',
        plan: 'Targeting the feature cards. Adding rounded corners, violet glowing border, and surface lift.',
        diff: [
          { type: 'minus', text: 'border: 1px solid rgba(148,163,184,0.1); border-radius: 8px;' },
          { type: 'plus',  text: 'border: 1px solid rgba(139,92,246,0.35); border-radius: 14px;' },
          { type: 'plus',  text: 'box-shadow: 0 0 18px rgba(139,92,246,0.2); background: rgba(139,92,246,0.06);' }
        ],
        apply: () => {
          const cards = ['tsFeat1', 'tsFeat2', 'tsFeat3'].map(id => document.getElementById(id));
          const prevs = cards.map(c => c ? { border: c.style.border, borderRadius: c.style.borderRadius, boxShadow: c.style.boxShadow, background: c.style.background } : {});
          cards.forEach(c => { if (c) tsHighlight(c); });
          const t = setTimeout(() => {
            cards.forEach((c, idx) => {
              if (!c) return;
              const t2 = setTimeout(() => {
                c.style.border = '1px solid rgba(139,92,246,0.35)';
                c.style.borderRadius = '14px';
                c.style.boxShadow = '0 0 18px rgba(139,92,246,0.2)';
                c.style.background = 'rgba(139,92,246,0.06)';
                c.style.transition = 'all 0.5s ease';
              }, idx * 80);
              timeoutsRef.current.push(t2);
            });
          }, 400);
          timeoutsRef.current.push(t);
          return () => { cards.forEach((c, idx) => { if (c) Object.assign(c.style, prevs[idx]); }); };
        }
      },
      {
        keys: ['orange', 'amber', 'warm', 'theme', 'color'],
        risk: 'medium',
        plan: 'Applying a warm orange and amber color theme across the hero, CTA, and accent elements.',
        diff: [
          { type: 'minus', text: '--accent: #7c3aed; --cta-bg: linear-gradient(135deg,#8b5cf6,#4f46e5);' },
          { type: 'plus',  text: '--accent: #f97316; --cta-bg: linear-gradient(135deg,#f97316,#eab308);' },
          { type: 'plus',  text: 'eyebrow color: #f97316; headline gradient: amber → orange;' }
        ],
        apply: () => {
          const b = document.getElementById('tsCtaPrimary');
          const ey = document.getElementById('tsEyebrow');
          const h = document.getElementById('tsHeadline');
          const prevB = b ? { background: b.style.background } : {};
          const prevEy = ey ? { color: ey.style.color, background: ey.style.background } : {};
          const prevH = h ? { background: h.style.background, webkitTextFillColor: h.style.webkitTextFillColor } : {};
          if (trySiteRef.current) tsHighlight(trySiteRef.current);
          const t = setTimeout(() => {
            if (b) { b.style.background = 'linear-gradient(135deg,#f97316,#eab308)'; b.style.boxShadow = '0 0 20px rgba(249,115,22,0.5)'; b.style.transition = 'all 0.6s ease'; }
            if (ey) { ey.style.color = '#f97316'; ey.style.background = 'rgba(249,115,22,0.12)'; }
            if (h) { h.style.background = 'linear-gradient(135deg,#fed7aa,#f97316)'; h.style.webkitBackgroundClip = 'text'; h.style.webkitTextFillColor = 'transparent'; h.style.backgroundClip = 'text'; }
          }, 400);
          timeoutsRef.current.push(t);
          return () => {
            if (b) Object.assign(b.style, prevB);
            if (ey) Object.assign(ey.style, prevEy);
            if (h) { h.style.background = prevH.background; h.style.webkitTextFillColor = prevH.webkitTextFillColor || ''; }
          };
        }
      },
      {
        keys: ['nav', 'navigation', 'sticky', 'glass', 'blur', 'frosted'],
        risk: 'low',
        plan: 'Targeting the navigation bar. Adding frosted glass blur, sticky positioning, and a subtle border.',
        diff: [
          { type: 'minus', text: 'background: rgba(255,255,255,0.04); border-radius: 6px;' },
          { type: 'plus',  text: 'background: rgba(13,17,23,0.7); backdrop-filter: blur(16px);' },
          { type: 'plus',  text: 'border: 1px solid rgba(139,92,246,0.2); border-radius: 8px;' }
        ],
        apply: () => {
          const nav = trySiteRef.current ? trySiteRef.current.querySelector('.ts-nav') : null;
          if (!nav) return () => {};
          const prev = { background: nav.style.background, backdropFilter: nav.style.backdropFilter, border: nav.style.border };
          tsHighlight(nav);
          const t = setTimeout(() => {
            nav.style.background = 'rgba(13,17,23,0.7)';
            nav.style.backdropFilter = 'blur(16px)';
            nav.style.border = '1px solid rgba(139,92,246,0.2)';
            nav.style.transition = 'all 0.5s ease';
          }, 400);
          timeoutsRef.current.push(t);
          return () => { Object.assign(nav.style, prev); };
        }
      }
    ];

    const fallbackRule = {
      risk: 'low',
      plan: 'Analyzing your request... applying best-match visual change to the site.',
      diff: [
        { type: 'minus', text: '/* current styles */' },
        { type: 'plus',  text: '/* updated styles applied */' }
      ],
      apply: () => {
        const h = document.getElementById('tsHeadline');
        if (!h) return () => {};
        const prev = { color: h.style.color, textShadow: h.style.textShadow };
        tsHighlight(h);
        const t = setTimeout(() => {
          h.style.textShadow = '0 0 30px rgba(139,92,246,0.8)';
          h.style.transition = 'all 0.6s ease';
        }, 400);
        timeoutsRef.current.push(t);
        return () => { Object.assign(h.style, prev); };
      }
    };

    function tsHighlight(el) {
      document.querySelectorAll('.ts-highlight').forEach(e => e.classList.remove('ts-highlight'));
      if (el) el.classList.add('ts-highlight');
      const t = setTimeout(() => { if (el) el.classList.remove('ts-highlight'); }, 1800);
      timeoutsRef.current.push(t);
    }

    function matchRule(prompt) {
      const lower = prompt.toLowerCase();
      for (let i = 0; i < rules.length; i++) {
        for (let j = 0; j < rules[i].keys.length; j++) {
          if (lower.indexOf(rules[i].keys[j]) !== -1) return rules[i];
        }
      }
      return fallbackRule;
    }

    function typeText(el, text, speed, cb) {
      el.textContent = '';
      let i = 0;
      function tick() {
        if (i < text.length) {
          el.textContent += text[i++];
          const t = setTimeout(tick, speed + Math.random() * 10);
          timeoutsRef.current.push(t);
        } else if (cb) cb();
      }
      tick();
    }

    function addLog(promptText, ver) {
      if (!tclList) return;
      const empty = tclList.querySelector('.tcl-empty');
      if (empty) empty.remove();
      const entry = document.createElement('div');
      entry.className = 'tcl-entry';
      const short = promptText.slice(0, 48) + (promptText.length > 48 ? '…' : '');
      entry.innerHTML = `<span class="tcl-dot"></span><span class="tcl-text">${short}</span><span class="tcl-ver">v${ver}</span>`;
      tclList.insertBefore(entry, tclList.firstChild);
    }

    function runPrompt(promptText) {
      if (isRunning || !promptText.trim()) return;
      isRunning = true;
      runBtn.disabled = true;
      if (liveDot) liveDot.classList.add('active');

      const rule = matchRule(promptText);

      response.style.display = 'block';
      if (trDiff) trDiff.style.display = 'none';
      if (trActions) trActions.style.display = 'none';
      if (trRisk) trRisk.className = 'tr-risk';

      // Phase 1
      if (trStatus) trStatus.innerHTML = '<span class="ds-spin" style="border-color:rgba(167,139,250,0.3);border-top-color:#a78bfa"></span> Analyzing your request...';
      if (trPlan) trPlan.textContent = '';

      const t1 = setTimeout(() => {
        // Phase 2
        if (trStatus) trStatus.innerHTML = '<span class="ds-spin" style="border-color:rgba(167,139,250,0.3);border-top-color:#a78bfa"></span> Planning changes...';
        typeText(trPlan, rule.plan, 18, () => {

          // Phase 3: show diff
          if (trDiff) trDiff.style.display = 'block';
          if (trDiffBody) trDiffBody.innerHTML = '';
          rule.diff.forEach((line, idx) => {
            const t2 = setTimeout(() => {
              if (!trDiffBody) return;
              const d = document.createElement('div');
              d.className = 'tr-diff-line ' + line.type;
              d.textContent = (line.type === 'minus' ? '- ' : '+ ') + line.text;
              trDiffBody.appendChild(d);
            }, idx * 180);
            timeoutsRef.current.push(t2);
          });

          const t3 = setTimeout(() => {
            // Phase 4: apply
            if (trStatus) trStatus.innerHTML = '⚡ Applying changes to site...';
            if (trRisk) { trRisk.className = 'tr-risk ' + rule.risk; trRisk.textContent = rule.risk + ' risk'; }

            const undoFn = rule.apply();
            pendingReset = undoFn;

            const t4 = setTimeout(() => {
              // Phase 5: done
              versionNum++;
              if (trStatus) trStatus.innerHTML = '✓ Done — v' + versionNum + ' saved';
              if (trActions) trActions.style.display = 'flex';
              if (liveDot) liveDot.classList.remove('active');
              addLog(promptText, versionNum);
              isRunning = false;
              runBtn.disabled = false;

              const vEl = document.getElementById('fcVerTitle');
              if (vEl) { vEl.textContent = 'v' + versionNum + ' saved'; }
              const fc = document.getElementById('fcVersion');
              if (fc) {
                fc.style.transform = 'translateY(-6px) scale(1.06)';
                const t5 = setTimeout(() => { fc.style.transform = ''; }, 700);
                timeoutsRef.current.push(t5);
              }
            }, 700);
            timeoutsRef.current.push(t4);
          }, rule.diff.length * 180 + 300);
          timeoutsRef.current.push(t3);
        });
      }, 900);
      timeoutsRef.current.push(t1);
    }

    // Expose globally for inspector
    window._tryRunPrompt = runPrompt;

    const handleRunClick = () => runPrompt(input.value);
    const handleKeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runPrompt(input.value); }
    };
    const handlePublish = () => {
      if (trStatus) trStatus.innerHTML = '🎉 Change approved and saved!';
      if (trActions) trActions.style.display = 'none';
      pendingReset = null;
      input.value = '';
    };
    const handleReset = () => {
      if (pendingReset) { pendingReset(); pendingReset = null; }
      if (trStatus) trStatus.innerHTML = '↩ Site reset to previous version';
      if (trActions) trActions.style.display = 'none';
      input.value = '';
    };

    runBtn.addEventListener('click', handleRunClick);
    input.addEventListener('keydown', handleKeydown);
    if (trPublish) trPublish.addEventListener('click', handlePublish);
    if (trReset) trReset.addEventListener('click', handleReset);

    return () => {
      runBtn.removeEventListener('click', handleRunClick);
      input.removeEventListener('keydown', handleKeydown);
      if (trPublish) trPublish.removeEventListener('click', handlePublish);
      if (trReset) trReset.removeEventListener('click', handleReset);
      delete window._tryRunPrompt;
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  // --- Visual Inspector Engine ---
  useEffect(() => {
    const inspBtn = inspBtnRef.current;
    const trySite = trySiteRef.current;
    const inspCursor = inspCursorRef.current;
    const inspTip = inspTipRef.current;
    const ttName = ttNameRef.current;
    const ttPromptEl = ttPromptRef.current;
    const modeBadge = modeBadgeRef.current;
    const tryInput = inputRef.current;
    const tryRunBtn = runBtnRef.current;
    if (!inspBtn || !trySite) return;

    let inspActive = false;
    let hoveredEl = null;

    const setMode = (on) => {
      inspActive = on;
      inspBtn.classList.toggle('active', on);
      trySite.classList.toggle('insp-active', on);
      if (modeBadge) modeBadge.style.display = on ? 'inline' : 'none';
      if (inspCursor) inspCursor.style.opacity = on ? '1' : '0';
      if (!on) {
        if (inspTip) inspTip.style.opacity = '0';
        if (inspCursor) inspCursor.style.opacity = '0';
        if (hoveredEl) {
          hoveredEl.style.removeProperty('outline');
          hoveredEl.style.removeProperty('outline-offset');
          hoveredEl = null;
        }
      }
    };

    const handleInspBtnClick = () => setMode(!inspActive);

    const handleMouseMove = (e) => {
      if (!inspActive) return;
      if (inspCursor) { inspCursor.style.left = e.clientX + 'px'; inspCursor.style.top = e.clientY + 'px'; }
      if (inspTip) {
        const tipW = inspTip.offsetWidth;
        const tipH = inspTip.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let x = e.clientX + 18;
        let y = e.clientY + 18;
        if (x + tipW > vw - 10) x = e.clientX - tipW - 14;
        if (y + tipH > vh - 10) y = e.clientY - tipH - 14;
        inspTip.style.left = x + 'px';
        inspTip.style.top = y + 'px';
      }
    };

    const handleSiteMouseOver = (e) => {
      if (!inspActive) return;
      const target = e.target.closest('[data-inspect]');
      if (!target) { if (inspTip) inspTip.style.opacity = '0'; hoveredEl = null; return; }
      hoveredEl = target;
      if (ttName) ttName.textContent = target.dataset.inspectName || 'Element';
      if (ttPromptEl) ttPromptEl.textContent = '"' + (target.dataset.inspectPrompt || '') + '"';
      if (inspTip) inspTip.style.opacity = '1';
    };

    const handleSiteMouseOut = (e) => {
      if (!inspActive) return;
      const target = e.target.closest('[data-inspect]');
      if (target && inspTip) inspTip.style.opacity = '0';
    };

    const handleSiteClick = (e) => {
      if (!inspActive) return;
      const target = e.target.closest('[data-inspect]');
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      const prompt = target.dataset.inspectPrompt;
      if (!prompt) return;

      inspBtn.style.transform = 'scale(0.9)';
      const t1 = setTimeout(() => { inspBtn.style.transform = ''; }, 200);
      timeoutsRef.current.push(t1);

      if (inspCursor) { inspCursor.style.width = '44px'; inspCursor.style.height = '44px'; }
      const t2 = setTimeout(() => {
        if (inspCursor) { inspCursor.style.width = '28px'; inspCursor.style.height = '28px'; }
      }, 250);
      timeoutsRef.current.push(t2);

      setMode(false);
      if (tryInput) { tryInput.value = prompt; tryInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); tryInput.focus(); }

      const t3 = setTimeout(() => {
        if (typeof window._tryRunPrompt === 'function') {
          window._tryRunPrompt(prompt);
        } else if (tryRunBtn) {
          tryRunBtn.click();
        }
      }, 200);
      timeoutsRef.current.push(t3);
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape' && inspActive) setMode(false);
    };

    inspBtn.addEventListener('click', handleInspBtnClick);
    document.addEventListener('mousemove', handleMouseMove);
    trySite.addEventListener('mouseover', handleSiteMouseOver);
    trySite.addEventListener('mouseout', handleSiteMouseOut);
    trySite.addEventListener('click', handleSiteClick);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      inspBtn.removeEventListener('click', handleInspBtnClick);
      document.removeEventListener('mousemove', handleMouseMove);
      trySite.removeEventListener('mouseover', handleSiteMouseOver);
      trySite.removeEventListener('mouseout', handleSiteMouseOut);
      trySite.removeEventListener('click', handleSiteClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  // Chip click handler
  const handleChipClick = (prompt) => {
    if (inputRef.current) inputRef.current.value = prompt;
    if (typeof window._tryRunPrompt === 'function') {
      window._tryRunPrompt(prompt);
    }
  };

  return (
    <>
      {/* Global inspector cursor (fixed position) */}
      <div id="inspCursor" ref={inspCursorRef}></div>
      <div id="inspTooltip" ref={inspTipRef}>
        <span className="tt-name" id="ttName" ref={ttNameRef}></span>
        <span className="tt-prompt" id="ttPrompt" ref={ttPromptRef}></span>
      </div>

      <section className="section try-section" id="try">
        <div className="container">
          <div className="try-head">
            <span className="section-tag">Interactive demo</span>
            <h2 className="try-title">Try it yourself</h2>
            <p className="try-sub">
              Type a change — or click{' '}
              <strong style={{color:'#a78bfa', fontWeight:700}}>Inspect</strong>{' '}
              and point directly at any element. Precise targeting means one clean change, not a guessing game.
            </p>
            <div className="try-value-bar">
              <div className="tvb-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>
                <span>Click any element to target it exactly</span>
              </div>
              <div className="tvb-dot"></div>
              <div className="tvb-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.2 6.6L21 10l-6.8 1.4L12 18l-2.2-6.6L3 10l6.8-1.4L12 2z"/></svg>
                <span>One precise prompt → one clean change</span>
              </div>
              <div className="tvb-dot"></div>
              <div className="tvb-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="15" r="4"/><path d="M10 12l11-11M17 5l3 3M15 7l3 3"/></svg>
                <span>Fewer API calls &rarr; lower cost</span>
              </div>
            </div>
          </div>

          <div className="try-layout">

            {/* Left: mini site live preview */}
            <div className="try-preview-col">
              <div className="try-browser">
                <div className="try-browser-bar">
                  <span className="mock-dot"></span><span className="mock-dot"></span><span className="mock-dot"></span>
                  <span className="try-url">yoursite.com / home</span>
                  <span className="insp-mode-badge" id="inspModeBadge" ref={modeBadgeRef}>INSPECT</span>
                  <span className="try-live-dot" id="tryLiveDot" ref={liveDotRef}></span>
                  <button
                    className="insp-btn"
                    id="inspToggleBtn"
                    ref={inspBtnRef}
                    title="Click any element in the preview to target it"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>
                    Inspect
                  </button>
                </div>
                <div className="try-site" id="trySite" ref={trySiteRef}>
                  <div
                    className="ts-nav"
                    data-inspect="true"
                    data-inspect-name="Nav Bar"
                    data-inspect-prompt="Make the navigation bar sticky with a frosted glass blur effect"
                  >
                    <span className="ts-logo">Acme<span style={{color:'#8b5cf6'}}>.</span></span>
                    <div className="ts-nav-links">
                      <span>Home</span><span>Features</span><span>Pricing</span><span>About</span>
                    </div>
                  </div>
                  <div className="ts-hero">
                    <div
                      className="ts-eyebrow"
                      id="tsEyebrow"
                      data-inspect="true"
                      data-inspect-name="Eyebrow Tag"
                      data-inspect-prompt="Change the color scheme to a warm orange and amber theme"
                    >New · AI-powered</div>
                    <div
                      className="ts-headline"
                      id="tsHeadline"
                      data-inspect="true"
                      data-inspect-name="Hero Headline"
                      data-inspect-prompt="Make the headline much bigger and bolder with a gradient color"
                    >Build faster with AI</div>
                    <div className="ts-sub" id="tsSub">The smartest way to ship your product.</div>
                    <div className="ts-ctas">
                      <button
                        className="ts-cta-primary"
                        id="tsCtaPrimary"
                        data-inspect="true"
                        data-inspect-name="Primary CTA"
                        data-inspect-prompt="Change the primary CTA button to violet with a glow effect"
                      >Get started free</button>
                      <button
                        className="ts-cta-ghost"
                        id="tsCtaGhost"
                        data-inspect="true"
                        data-inspect-name="Ghost Button"
                        data-inspect-prompt="Make the CTA button outlined with a violet border"
                      >Watch demo</button>
                    </div>
                  </div>
                  <div className="ts-features" id="tsFeatures">
                    <div
                      className="ts-feat-card"
                      id="tsFeat1"
                      data-inspect="true"
                      data-inspect-name="Feature Card"
                      data-inspect-prompt="Make the feature cards have rounded corners and a glowing border"
                    >
                      <div className="ts-feat-icon">⚡</div>
                      <div className="ts-feat-name">Fast</div>
                      <div className="ts-feat-desc">Ship in hours</div>
                    </div>
                    <div
                      className="ts-feat-card"
                      id="tsFeat2"
                      data-inspect="true"
                      data-inspect-name="Feature Card"
                      data-inspect-prompt="Make the feature cards have rounded corners and a glowing border"
                    >
                      <div className="ts-feat-icon">🛡️</div>
                      <div className="ts-feat-name">Safe</div>
                      <div className="ts-feat-desc">Preview first</div>
                    </div>
                    <div
                      className="ts-feat-card"
                      id="tsFeat3"
                      data-inspect="true"
                      data-inspect-name="Feature Card"
                      data-inspect-prompt="Make the feature cards have rounded corners and a glowing border"
                    >
                      <div className="ts-feat-icon">✨</div>
                      <div className="ts-feat-name">Smart</div>
                      <div className="ts-feat-desc">Brand-aware</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change log beneath preview */}
              <div className="try-changelog" id="tryChangelog">
                <div className="tcl-head">Change history</div>
                <div className="tcl-list" id="tclList" ref={tclListRef}>
                  <div className="tcl-empty">No changes yet — type a prompt to start</div>
                </div>
              </div>
            </div>

            {/* Right: input + response panel */}
            <div className="try-input-col">

              {/* Prompt input box */}
              <div className="try-input-wrap" id="tryInputWrap">
                <div className="try-input-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.2 6.6L21 10l-6.8 1.4L12 18l-2.2-6.6L3 10l6.8-1.4L12 2z"/></svg>
                  <span>Describe a change to your site</span>
                  <span className="try-model-tag">claude opus-4.5</span>
                </div>
                <textarea
                  id="tryInput"
                  ref={inputRef}
                  className="try-textarea"
                  placeholder={"e.g. Make the hero headline bigger and bolder\ne.g. Change the CTA button to violet\ne.g. Add a dark gradient background"}
                  rows={3}
                  maxLength={200}
                />
                <div className="try-input-footer">
                  <span className="try-hint" id="tryHint">Press Enter or click Run to apply</span>
                  <button className="try-run-btn" id="tryRunBtn" ref={runBtnRef}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Run
                  </button>
                </div>
              </div>

              {/* Suggestion chips */}
              <div className="try-chips" id="tryChips">
                <span className="try-chip-label">Try one of these:</span>
                {[
                  { label: 'Bigger headline', prompt: 'Make the headline much bigger and bolder with a gradient color' },
                  { label: 'Violet CTA',      prompt: 'Change the primary CTA button to violet with a glow effect' },
                  { label: 'Dark hero',       prompt: 'Add a dark gradient background to the hero section' },
                  { label: 'Glow cards',      prompt: 'Make the feature cards have rounded corners and a glowing border' },
                  { label: 'Orange theme',    prompt: 'Change the color scheme to a warm orange and amber theme' },
                  { label: 'Glass nav',       prompt: 'Make the navigation bar sticky with a frosted glass blur effect' },
                ].map((chip, i) => (
                  <button
                    key={i}
                    className="try-chip"
                    data-prompt={chip.prompt}
                    onClick={() => handleChipClick(chip.prompt)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* AI response panel */}
              <div className="try-response" id="tryResponse" ref={responseRef} style={{display:'none'}}>
                <div className="tr-header">
                  <span className="tr-status" id="trStatus" ref={trStatusRef}>Thinking...</span>
                  <span className="tr-risk" id="trRisk" ref={trRiskRef}></span>
                </div>
                <div className="tr-plan" id="trPlan" ref={trPlanRef}></div>
                <div className="tr-diff" id="trDiff" ref={trDiffRef} style={{display:'none'}}>
                  <div className="tr-diff-head">Changes applied</div>
                  <div className="tr-diff-body" id="trDiffBody" ref={trDiffBodyRef}></div>
                </div>
                <div className="tr-actions" id="trActions" ref={trActionsRef} style={{display:'none'}}>
                  <button className="tr-btn-publish" id="trPublish" ref={trPublishRef}>✓ Approve &amp; keep</button>
                  <button className="tr-btn-reset" id="trReset" ref={trResetRef}>↩ Reset site</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};
