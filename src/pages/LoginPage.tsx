import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

/* ------------------------------------------------------------------ */
/*  Space-theme keyframes                                              */
/* ------------------------------------------------------------------ */
const spaceKeyframes = `
@keyframes lp-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25%      { transform: translateY(-18px) rotate(-3deg); }
  50%      { transform: translateY(-8px) rotate(2deg); }
  75%      { transform: translateY(-22px) rotate(-1deg); }
}
@keyframes lp-twinkle {
  0%, 100% { opacity: 0.2; }
  50%      { opacity: 1; }
}
@keyframes lp-wander {
  0%   { transform: translate(0, 0) rotate(0deg); }
  25%  { transform: translate(20px, -10px) rotate(5deg); }
  50%  { transform: translate(-8px, -20px) rotate(-3deg); }
  75%  { transform: translate(-16px, -6px) rotate(4deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes lp-pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgb(var(--accent) / 0.15); }
  50%      { box-shadow: 0 0 40px rgb(var(--accent) / 0.3), 0 0 80px rgb(var(--accent) / 0.1); }
}
`;

/* ---------- Star field ---------- */
const Star: React.FC<{ cx: number; cy: number; r: number; delay: number }> = ({ cx, cy, r, delay }) => (
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill="currentColor"
    className="text-gray-400"
    style={{ animation: `lp-twinkle ${2 + Math.random() * 3}s ease-in-out ${delay}s infinite` }}
  />
);

const starsData = Array.from({ length: 40 }, () => ({
  cx: Math.random() * 500,
  cy: Math.random() * 400,
  r: Math.random() * 1.6 + 0.4,
  delay: Math.random() * 4,
}));

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Admin Login | Yaswanth Portfolio';
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate('/yashu', { replace: true });
  }, [isAuthenticated, navigate]);

  /* ---------- Handler ---------- */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = login(identifier, password);
      setLoading(false);
      if (ok) {
        showToast('Login successful!', 'success');
        navigate('/yashu', { replace: true });
      } else {
        showToast('Invalid credentials', 'error');
      }
    }, 600);
  };

  /* ---------- Shared styles ---------- */
  const inputClass =
    'w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 text-white placeholder-gray-500 text-sm outline-none transition-all';
  const btnClass =
    'w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  /* ---------- Render ---------- */
  return (
    <>
      <style>{spaceKeyframes}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 px-4 py-20 relative overflow-hidden select-none">
        {/* starfield */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 500 400"
          preserveAspectRatio="none"
        >
          {starsData.map((s, i) => (
            <Star key={i} {...s} />
          ))}
        </svg>

        {/* orbit rings */}
        <div
          className="absolute z-0 w-[600px] h-[600px] rounded-full border border-gray-700/30 pointer-events-none"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
        <div
          className="absolute z-0 w-[400px] h-[400px] rounded-full border border-gray-700/20 pointer-events-none"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />

        {/* floating astronaut */}
        <div
          className="absolute top-16 right-8 z-0 opacity-30 hidden sm:block"
          style={{ animation: 'lp-wander 14s ease-in-out infinite' }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'lp-float 6s ease-in-out infinite' }}
          >
            <circle cx="100" cy="80" r="42" fill="#1b263b" stroke="#778da9" strokeWidth="3" />
            <circle cx="100" cy="80" r="32" fill="#0d1b2a" />
            <ellipse cx="90" cy="72" rx="14" ry="10" fill="#415a77" opacity="0.5" />
            <rect x="72" y="118" width="56" height="50" rx="14" fill="#1b263b" stroke="#778da9" strokeWidth="2.5" />
            <rect x="60" y="124" width="14" height="36" rx="5" fill="#415a77" />
            <rect x="48" y="130" width="28" height="10" rx="5" fill="#1b263b" stroke="#778da9" strokeWidth="2" />
            <rect x="128" y="118" width="28" height="10" rx="5" fill="#1b263b" stroke="#778da9" strokeWidth="2" transform="rotate(-35 128 123)" />
            <rect x="80" y="164" width="12" height="26" rx="5" fill="#1b263b" stroke="#778da9" strokeWidth="2" />
            <rect x="108" y="164" width="12" height="26" rx="5" fill="#1b263b" stroke="#778da9" strokeWidth="2" />
            <ellipse cx="86" cy="192" rx="10" ry="5" fill="#415a77" />
            <ellipse cx="114" cy="192" rx="10" ry="5" fill="#415a77" />
            <line x1="100" y1="38" x2="100" y2="24" stroke="#778da9" strokeWidth="2" />
            <circle cx="100" cy="21" r="4" fill="rgb(var(--accent))" style={{ animation: 'lp-twinkle 2s ease-in-out infinite' }} />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4"
              style={{ animation: 'lp-pulseGlow 3s ease-in-out infinite' }}
            >
              <ShieldCheck size={32} className="text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to access the admin panel</p>
          </div>

          {/* Card */}
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* identifier */}
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Username, Email, or Phone"
                  className={inputClass}
                  autoFocus
                />
              </div>

              {/* password */}
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? <RefreshCw size={18} className="animate-spin" /> : <Lock size={18} />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* footer */}
          <p className="text-center text-xs text-gray-600 mt-6">
            Yaswanth Portfolio &middot; Admin Access
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
