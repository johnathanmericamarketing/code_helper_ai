import React, { useState, useEffect, useRef } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

/* ─── Styles (scoped via className prefix "ap-") ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .ap-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #080c18;
    color: #f1f5f9;
    font-family: 'Inter', system-ui, sans-serif;
    overflow-x: hidden;
    position: relative;
    padding: 32px 16px;
  }

  #ap-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .ap-glow {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: radial-gradient(ellipse 600px 400px at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%);
  }

  .ap-wrap {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 420px;
  }

  /* Header */
  .ap-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
    animation: apFadeUp 0.5s ease both;
  }

  .ap-logo-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ap-wordmark {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  .ap-subtitle {
    font-size: 13px;
    color: #64748b;
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  /* Card */
  .ap-card {
    width: 100%;
    max-width: 420px;
    background: rgba(15, 23, 42, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(148,163,184,0.12);
    border-radius: 20px;
    box-shadow:
      0 24px 64px rgba(0,0,0,0.50),
      0 0 0 1px rgba(124,58,237,0.10);
    padding: 40px;
    animation: apFadeUp 0.4s ease both 0.08s;
    position: relative;
    overflow: hidden;
  }

  .ap-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.25), transparent);
  }

  /* Panel transitions */
  .ap-panel {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  /* Card title */
  .ap-card-title {
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
    line-height: 1.3;
  }

  .ap-card-sub {
    font-size: 14px;
    color: #94a3b8;
    font-weight: 400;
    margin-bottom: 24px;
  }

  /* Google button */
  .ap-google-btn {
    width: 100%;
    height: 48px;
    border-radius: 999px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(148,163,184,0.15);
    color: #f1f5f9;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    margin-bottom: 20px;
  }

  .ap-google-btn:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(148,163,184,0.28);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  }

  .ap-google-btn:active { transform: translateY(0); }

  .ap-google-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  /* Divider */
  .ap-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .ap-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(148,163,184,0.15);
  }

  .ap-divider-text {
    font-size: 12px;
    color: #64748b;
    white-space: nowrap;
    font-weight: 400;
  }

  /* Fields */
  .ap-field {
    margin-bottom: 16px;
  }

  .ap-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #94a3b8;
    margin-bottom: 6px;
    font-family: 'Inter', system-ui, sans-serif;
  }

  .ap-field-wrap {
    position: relative;
  }

  .ap-input {
    width: 100%;
    height: 44px;
    background: #0f172a;
    border: 1px solid rgba(148,163,184,0.12);
    border-radius: 12px;
    padding: 0 14px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    color: #f1f5f9;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    -webkit-appearance: none;
    appearance: none;
  }

  .ap-input::placeholder {
    color: #475569;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  }

  .ap-input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.20);
  }

  .ap-input.has-toggle {
    padding-right: 44px;
  }

  /* Password toggle */
  .ap-pw-toggle {
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
    transition: color 0.15s ease;
  }

  .ap-pw-toggle:hover { color: #94a3b8; }

  /* Submit button */
  .ap-submit-btn {
    position: relative;
    width: 100%;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
    border: none;
    color: #fff;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.01em;
    transition: filter 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
    overflow: hidden;
    margin-top: 4px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .ap-submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
    background-size: 200% 100%;
    background-position: 200% 0;
    animation: apShimmer 2.8s infinite;
  }

  @keyframes apShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .ap-submit-btn:hover {
    filter: brightness(1.1);
    box-shadow: 0 8px 24px rgba(124,58,237,0.40);
    transform: translateY(-1px);
  }

  .ap-submit-btn:active { transform: translateY(0); filter: brightness(0.97); }

  .ap-submit-btn:disabled {
    cursor: not-allowed;
    opacity: 0.8;
    transform: none;
  }

  .ap-btn-label { position: relative; z-index: 1; }

  .ap-spinner {
    position: relative;
    z-index: 1;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: apSpin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes apSpin { to { transform: rotate(360deg); } }

  /* Toggle footer */
  .ap-footer {
    text-align: center;
    font-size: 14px;
    color: #94a3b8;
  }

  .ap-toggle-link {
    background: none;
    border: none;
    color: #a78bfa;
    font-size: 14px;
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s ease;
  }

  .ap-toggle-link:hover {
    color: #c4b5fd;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* Error message */
  .ap-error {
    font-size: 13px;
    color: #f87171;
    margin-bottom: 12px;
    padding: 10px 12px;
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: 8px;
    display: none;
  }

  .ap-error.visible { display: block; }

  /* Entrance animation */
  @keyframes apFadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Panel fade */
  @keyframes apPanelIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ap-panel-enter { animation: apPanelIn 0.3s ease both; }

  @media (max-width: 480px) {
    .ap-card { padding: 28px 20px; border-radius: 16px; }
    .ap-card-title { font-size: 20px; }
  }
`;

/* ─── SVG Logo (atom) ─── */
const AtomLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 80 80" width="48" height="48" style={{overflow:'visible'}} aria-label="Code Helper Studio logo">
    <defs>
      <radialGradient id="ap-core-g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c4b5fd"/>
        <stop offset="100%" stopColor="#7c3aed"/>
      </radialGradient>
      <radialGradient id="ap-orb1-g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a78bfa"/>
        <stop offset="100%" stopColor="#6366f1"/>
      </radialGradient>
      <filter id="ap-glow">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <ellipse cx="40" cy="40" rx="34" ry="14" fill="none" stroke="rgba(167,139,250,0.25)" strokeWidth="1.5"/>
    <ellipse cx="40" cy="40" rx="34" ry="14" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="1" transform="rotate(60,40,40)"/>
    <ellipse cx="40" cy="40" rx="34" ry="14" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="1" transform="rotate(-60,40,40)"/>
    <circle cx="40" cy="40" r="7" fill="url(#ap-core-g)" filter="url(#ap-glow)"/>
    <circle r="4" fill="url(#ap-orb1-g)" filter="url(#ap-glow)">
      <animateMotion dur="3s" repeatCount="indefinite">
        <mpath xlinkHref="#ap-path1"/>
      </animateMotion>
    </circle>
    <path id="ap-path1" d="M74,40 A34,14 0 1,1 73.99,40.01" fill="none"/>
    <circle r="3" fill="#c4b5fd" opacity="0.9" filter="url(#ap-glow)">
      <animateMotion dur="4.5s" repeatCount="indefinite" begin="-1.5s">
        <mpath xlinkHref="#ap-path2"/>
      </animateMotion>
    </circle>
    <path id="ap-path2" d="M74,40 A34,14 0 1,1 73.99,40.01" fill="none" transform="rotate(60,40,40)"/>
    <circle r="2.5" fill="#818cf8" opacity="0.8" filter="url(#ap-glow)">
      <animateMotion dur="3.8s" repeatCount="indefinite" begin="-2s">
        <mpath xlinkHref="#ap-path3"/>
      </animateMotion>
    </circle>
    <path id="ap-path3" d="M74,40 A34,14 0 1,1 73.99,40.01" fill="none" transform="rotate(-60,40,40)"/>
  </svg>
);

/* ─── Google Icon ─── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ─── Eye / EyeOff icons ─── */
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ─── Password field with show/hide ─── */
const PasswordField = ({ id, label, value, onChange, autoComplete }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="ap-field">
      <label className="ap-label" htmlFor={id}>{label}</label>
      <div className="ap-field-wrap">
        <input
          id={id}
          className="ap-input has-toggle"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          className="ap-pw-toggle"
          aria-label="Toggle password visibility"
          onClick={() => setShow(s => !s)}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

/* ─── Main AuthPage ─── */
export const AuthPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [panelKey, setPanelKey] = useState(0); // force re-mount for animation
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  /* ─── Particle canvas ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, animId;
    const particles = [];
    const COLORS = ['rgba(124,58,237,', 'rgba(99,102,241,', 'rgba(167,139,250,', 'rgba(148,163,184,'];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * 2000, y: Math.random() * 1200,
        r: 0.8 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.22,
        alpha: 0.15 + Math.random() * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        if (p.y < -4) p.y = H + 4;
        if (p.y > H + 4) p.y = -4;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);

  /* ─── Mode switch ─── */
  const switchMode = (next) => {
    setError('');
    setEmail(''); setPassword(''); setConfirm('');
    setMode(next);
    setPanelKey(k => k + 1);
  };

  /* ─── Clean firebase error messages ─── */
  const friendlyError = (err) => {
    const code = err?.code || '';
    if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) return 'Incorrect email or password.';
    if (code.includes('email-already-in-use')) return 'An account with this email already exists.';
    if (code.includes('weak-password')) return 'Password must be at least 6 characters.';
    if (code.includes('invalid-email')) return 'Please enter a valid email address.';
    if (code.includes('too-many-requests')) return 'Too many attempts. Please try again later.';
    if (code.includes('popup-closed')) return 'Sign-in popup was closed. Please try again.';
    return err?.message || 'Authentication failed. Please try again.';
  };

  /* ─── Email / password submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created — welcome!');
      }
      navigate('/app');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  /* ─── Google sign-in ─── */
  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Signed in with Google!');
      navigate('/app');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const isSignIn = mode === 'signin';

  return (
    <>
      {/* Inject scoped CSS */}
      <style>{CSS}</style>

      <div className="ap-root">
        <canvas id="ap-canvas" ref={canvasRef} />
        <div className="ap-glow" />

        <div className="ap-wrap">
          {/* Header */}
          <header className="ap-header">
            <div className="ap-logo-row">
              <AtomLogo />
              <span className="ap-wordmark">Code Helper Studio</span>
            </div>
            <p className="ap-subtitle">Your personal AI software engineer</p>
          </header>

          {/* Card */}
          <div className="ap-card">
            <div key={panelKey} className="ap-panel ap-panel-enter">

              <h1 className="ap-card-title">
                {isSignIn ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="ap-card-sub">
                {isSignIn ? 'Sign in to your account to continue' : 'Get started — it only takes a minute'}
              </p>

              {/* Error */}
              {error && (
                <div className="ap-error visible">{error}</div>
              )}

              {/* Google */}
              <button
                type="button"
                className="ap-google-btn"
                onClick={handleGoogle}
                disabled={googleLoading || loading}
                aria-label="Continue with Google"
              >
                {googleLoading
                  ? <div className="ap-spinner" />
                  : <GoogleIcon />
                }
                Continue with Google
              </button>

              {/* Divider */}
              <div className="ap-divider">
                <div className="ap-divider-line" />
                <span className="ap-divider-text">or continue with email</span>
                <div className="ap-divider-line" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="ap-email">Email</label>
                  <div className="ap-field-wrap">
                    <input
                      id="ap-email"
                      className="ap-input"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <PasswordField
                  id="ap-password"
                  label="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={isSignIn ? 'current-password' : 'new-password'}
                />

                {!isSignIn && (
                  <PasswordField
                    id="ap-confirm"
                    label="Confirm Password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                )}

                <button
                  type="submit"
                  className="ap-submit-btn"
                  disabled={loading || googleLoading}
                >
                  {loading && <div className="ap-spinner" />}
                  <span className="ap-btn-label">
                    {isSignIn ? 'Sign In' : 'Create Account'}
                  </span>
                </button>
              </form>

              {/* Footer toggle */}
              <p className="ap-footer">
                {isSignIn ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  className="ap-toggle-link"
                  onClick={() => switchMode(isSignIn ? 'signup' : 'signin')}
                >
                  {isSignIn ? 'Sign up' : 'Sign in'}
                </button>
              </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};
