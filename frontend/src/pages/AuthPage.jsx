import React, { useState, useEffect, useRef } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Google icon SVG
───────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ─────────────────────────────────────────────
   Animated logo icon (orbiting atom)
───────────────────────────────────────────── */
const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 80 80" width="48" height="48"
    style={{ overflow: 'visible' }} aria-label="Code Helper Studio logo">
    <defs>
      <radialGradient id="auth-core-g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c4b5fd"/>
        <stop offset="100%" stopColor="#7c3aed"/>
      </radialGradient>
      <radialGradient id="auth-orb1-g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a78bfa"/>
        <stop offset="100%" stopColor="#6366f1"/>
      </radialGradient>
      <filter id="auth-glow">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <ellipse cx="40" cy="40" rx="34" ry="14" fill="none" stroke="rgba(167,139,250,0.25)" strokeWidth="1.5"/>
    <ellipse cx="40" cy="40" rx="34" ry="14" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="1" transform="rotate(60,40,40)"/>
    <ellipse cx="40" cy="40" rx="34" ry="14" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="1" transform="rotate(-60,40,40)"/>
    <circle cx="40" cy="40" r="7" fill="url(#auth-core-g)" filter="url(#auth-glow)"/>
    <circle r="4" fill="url(#auth-orb1-g)" filter="url(#auth-glow)">
      <animateMotion dur="3s" repeatCount="indefinite">
        <mpath xlinkHref="#auth-path1"/>
      </animateMotion>
    </circle>
    <path id="auth-path1" d="M74,40 A34,14 0 1,1 73.99,40.01" fill="none"/>
    <circle r="3" fill="#c4b5fd" opacity="0.9" filter="url(#auth-glow)">
      <animateMotion dur="4.5s" repeatCount="indefinite" begin="-1.5s">
        <mpath xlinkHref="#auth-path2"/>
      </animateMotion>
    </circle>
    <path id="auth-path2" d="M74,40 A34,14 0 1,1 73.99,40.01" fill="none" transform="rotate(60,40,40)"/>
    <circle r="2.5" fill="#818cf8" opacity="0.8" filter="url(#auth-glow)">
      <animateMotion dur="3.8s" repeatCount="indefinite" begin="-2s">
        <mpath xlinkHref="#auth-path3"/>
      </animateMotion>
    </circle>
    <path id="auth-path3" d="M74,40 A34,14 0 1,1 73.99,40.01" fill="none" transform="rotate(-60,40,40)"/>
  </svg>
);

/* ─────────────────────────────────────────────
   Eye / Eye-off SVG icons
───────────────────────────────────────────── */
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ─────────────────────────────────────────────
   Particle canvas hook
───────────────────────────────────────────── */
function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const COLORS = [
      'rgba(124,58,237,',
      'rgba(99,102,241,',
      'rgba(167,139,250,',
      'rgba(148,163,184,',
    ];

    function rand(a, b) { return a + Math.random() * (b - a); }

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function makeParticle() {
      return {
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        r: rand(0.8, 2.2),
        vx: rand(-0.18, 0.18),
        vy: rand(-0.22, 0.22),
        alpha: rand(0.15, 0.45),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: 50 }, makeParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
        if (p.y < -4) p.y = canvas.height + 4;
        if (p.y > canvas.height + 4) p.y = -4;
      }
      animId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
}

/* ─────────────────────────────────────────────
   Password field component
───────────────────────────────────────────── */
function PasswordField({ id, label, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div style={styles.field}>
      <label htmlFor={id} style={styles.fieldLabel}>{label}</label>
      <div style={styles.fieldWrap}>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          autoComplete={autoComplete}
          required
          style={{ ...styles.fieldInput, paddingRight: '44px' }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={styles.pwToggle}
          aria-label="Toggle password visibility"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main AuthPage component
───────────────────────────────────────────── */
export const AuthPage = () => {
  const [isLogin, setIsLogin]             = useState(true);
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [panelVisible, setPanelVisible]   = useState(true);
  const [formData, setFormData]           = useState({ email: '', password: '', confirm: '' });
  const canvasRef = useRef(null);
  const navigate  = useNavigate();

  // Force dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Particle canvas
  useParticles(canvasRef);

  /* ── Helpers ── */
  const update = (key) => (e) => setFormData(f => ({ ...f, [key]: e.target.value }));

  const switchMode = () => {
    setPanelVisible(false);
    setTimeout(() => {
      setIsLogin(v => !v);
      setFormData({ email: '', password: '', confirm: '' });
      setPanelVisible(true);
    }, 220);
  };

  /* ── Email/password submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success('Welcome back');
      } else {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success('Account created');
      }
      navigate('/app');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  /* ── Google sign-in ── */
  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      toast.success('Signed in with Google');
      navigate('/app');
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  /* ─────────────── RENDER ─────────────── */
  return (
    <>
      {/* Inject page styles */}
      <style>{AUTH_CSS}</style>

      {/* Particle layer */}
      <canvas ref={canvasRef} className="auth-particle-canvas" />

      {/* Radial violet glow */}
      <div className="auth-page-glow" />

      {/* Content */}
      <div className="auth-content-wrap">

        {/* Header */}
        <header className="auth-site-header">
          <div className="auth-logo-row">
            <LogoIcon />
            <span className="auth-wordmark">Code Helper Studio</span>
          </div>
          <p className="auth-subtitle">Your personal AI software engineer</p>
        </header>

        {/* Card */}
        <div className="auth-card">
          {/* Top shimmer line */}
          <div className="auth-card-shimmer-line" />

          <div
            className="auth-form-panel"
            style={{
              opacity:   panelVisible ? 1 : 0,
              transform: panelVisible ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
            }}
          >
            <h1 className="auth-card-title">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="auth-card-subtitle">
              {isLogin
                ? 'Sign in to your account to continue'
                : 'Get started — it only takes a minute'}
            </p>

            {/* Google */}
            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogle}
              disabled={googleLoading}
            >
              {googleLoading
                ? <div className="auth-spinner-sm" />
                : <GoogleIcon />}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="auth-or-divider">
              <div className="auth-or-line" />
              <span className="auth-or-text">or continue with email</span>
              <div className="auth-or-line" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="auth-email" className="auth-field-label">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  value={formData.email}
                  onChange={update('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="auth-field-input"
                />
              </div>

              <PasswordField
                id="auth-password"
                label="Password"
                value={formData.password}
                onChange={update('password')}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />

              {!isLogin && (
                <PasswordField
                  id="auth-confirm"
                  label="Confirm Password"
                  value={formData.confirm}
                  onChange={update('confirm')}
                  autoComplete="new-password"
                />
              )}

              <button
                type="submit"
                className={`auth-submit-btn${loading ? ' loading' : ''}`}
                disabled={loading}
              >
                <span className="auth-btn-label">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </span>
                <div className="auth-spinner" />
              </button>
            </form>

            {/* Footer toggle */}
            <p className="auth-form-footer">
              {isLogin ? "Don't have an account?\u00a0" : 'Already have an account?\u00a0'}
              <button type="button" className="auth-toggle-link" onClick={switchMode}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   Inline CSS  (scoped with auth- prefix)
───────────────────────────────────────────── */
const AUTH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: #080c18;
    color: #f1f5f9;
    min-height: 100vh;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-x: hidden;
    padding: 32px 16px;
    position: relative;
    -webkit-font-smoothing: antialiased;
  }

  .auth-particle-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .auth-page-glow {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: radial-gradient(ellipse 600px 400px at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%);
  }

  .auth-content-wrap {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 420px;
    animation: authFadeUp 0.5s ease both;
  }

  @keyframes authFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-site-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
  }

  .auth-logo-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .auth-wordmark {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  .auth-subtitle {
    font-size: 13px;
    color: #64748b;
    font-weight: 400;
    letter-spacing: 0.01em;
    margin: 0;
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
    background: rgba(15,23,42,0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(148,163,184,0.12);
    border-radius: 20px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.50), 0 0 0 1px rgba(124,58,237,0.10);
    padding: 40px;
    position: relative;
    overflow: hidden;
  }

  .auth-card-shimmer-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.25), transparent);
  }

  .auth-card-title {
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.02em;
    margin: 0 0 6px;
    line-height: 1.3;
  }

  .auth-card-subtitle {
    font-size: 14px;
    color: #94a3b8;
    margin: 0 0 24px;
  }

  .auth-google-btn {
    width: 100%;
    height: 48px;
    border-radius: 999px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(148,163,184,0.15);
    color: #f1f5f9;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
    transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .auth-google-btn:hover:not(:disabled) {
    background: rgba(255,255,255,0.08);
    border-color: rgba(148,163,184,0.28);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  }
  .auth-google-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .auth-or-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .auth-or-line {
    flex: 1;
    height: 1px;
    background: rgba(148,163,184,0.15);
  }
  .auth-or-text {
    font-size: 12px;
    color: #64748b;
    white-space: nowrap;
  }

  .auth-field { margin-bottom: 16px; }

  .auth-field-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #94a3b8;
    margin-bottom: 6px;
  }

  .auth-field-input {
    width: 100%;
    height: 44px;
    background: #0f172a;
    border: 1px solid rgba(148,163,184,0.12);
    border-radius: 12px;
    padding: 0 14px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #f1f5f9;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
    box-sizing: border-box;
  }
  .auth-field-input::placeholder {
    color: #64748b;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  }
  .auth-field-input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.20);
  }

  .auth-submit-btn {
    position: relative;
    width: 100%;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
    border: none;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.01em;
    overflow: hidden;
    margin: 4px 0 20px;
    transition: filter 0.2s, box-shadow 0.2s, transform 0.15s;
  }
  .auth-submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
    background-size: 200% 100%;
    background-position: 200% 0;
    animation: authShimmer 2.8s infinite;
  }
  @keyframes authShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .auth-submit-btn:hover:not(:disabled) {
    filter: brightness(1.1);
    box-shadow: 0 8px 24px rgba(124,58,237,0.40);
    transform: translateY(-1px);
  }
  .auth-submit-btn:disabled { cursor: not-allowed; opacity: 0.8; }
  .auth-submit-btn.loading .auth-btn-label { display: none; }
  .auth-submit-btn.loading .auth-spinner   { display: block; }

  .auth-btn-label { position: relative; z-index: 1; }

  .auth-spinner {
    display: none;
    position: relative;
    z-index: 1;
    width: 20px;
    height: 20px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: authSpin 0.75s linear infinite;
    margin: 0 auto;
  }
  .auth-spinner-sm {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: #f1f5f9;
    border-radius: 50%;
    animation: authSpin 0.75s linear infinite;
  }
  @keyframes authSpin {
    to { transform: rotate(360deg); }
  }

  .auth-form-footer {
    text-align: center;
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
  }
  .auth-toggle-link {
    background: none;
    border: none;
    color: #a78bfa;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s;
  }
  .auth-toggle-link:hover {
    color: #c4b5fd;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* Password field wrapper */
  .auth-pw-wrap {
    position: relative;
  }
  .auth-pw-toggle {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    background: none;
    border: none;
    padding: 0;
    transition: color 0.15s;
  }
  .auth-pw-toggle:hover { color: #94a3b8; }

  @media (max-width: 480px) {
    .auth-card { padding: 28px 20px; border-radius: 16px; }
    .auth-card-title { font-size: 20px; }
  }
`;

/* Inline style objects used by PasswordField */
const styles = {
  field:      { marginBottom: '16px' },
  fieldLabel: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' },
  fieldWrap:  { position: 'relative' },
  fieldInput: {
    width: '100%', height: '44px', background: '#0f172a',
    border: '1px solid rgba(148,163,184,0.12)', borderRadius: '12px',
    padding: '0 14px', fontFamily: "'Inter', sans-serif", fontSize: '14px',
    color: '#f1f5f9', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  pwToggle: {
    position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
    width: '44px', height: '44px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', color: '#64748b',
    background: 'none', border: 'none', padding: 0,
  },
};
