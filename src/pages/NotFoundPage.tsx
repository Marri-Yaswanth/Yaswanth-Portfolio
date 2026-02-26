import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

/* ---------- tiny inline CSS-in-JS keyframes (no extra file needed) ---------- */
const floatKeyframes = `
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25%      { transform: translateY(-18px) rotate(-3deg); }
  50%      { transform: translateY(-8px) rotate(2deg); }
  75%      { transform: translateY(-22px) rotate(-1deg); }
}
@keyframes drift {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(32px); }
  100% { transform: translateX(0); }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50%      { opacity: 1; }
}
@keyframes wander {
  0%   { transform: translate(0, 0) rotate(0deg); }
  25%  { transform: translate(40px, -20px) rotate(10deg); }
  50%  { transform: translate(-10px, -40px) rotate(-5deg); }
  75%  { transform: translate(-30px, -10px) rotate(8deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes pulse404 {
  0%, 100% { text-shadow: 0 0 20px rgba(245,158,11,0.3); }
  50%      { text-shadow: 0 0 40px rgba(245,158,11,0.6), 0 0 80px rgba(245,158,11,0.2); }
}
`;

/* ---------- star field (pure SVG dots) ---------- */
const Star: React.FC<{ cx: number; cy: number; r: number; delay: number }> = ({ cx, cy, r, delay }) => (
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill="currentColor"
    className="text-gray-400 dark:text-gray-500"
    style={{ animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${delay}s infinite` }}
  />
);

const starsData = Array.from({ length: 40 }, () => ({
  cx: Math.random() * 500,
  cy: Math.random() * 400,
  r: Math.random() * 1.6 + 0.4,
  delay: Math.random() * 4,
}));

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = '404 – Lost in Space | Yaswanth Portfolio';
  }, []);

  return (
    <>
      {/* inject keyframes once */}
      <style>{floatKeyframes}</style>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 px-4 py-20 relative overflow-hidden select-none">

        {/* ---- starfield background ---- */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 500 400"
          preserveAspectRatio="none"
        >
          {starsData.map((s, i) => (
            <Star key={i} {...s} />
          ))}
        </svg>

        {/* ---- floating lost astronaut illustration (pure SVG) ---- */}
        <div
          className="relative z-10 mb-6"
          style={{ animation: 'wander 12s ease-in-out infinite' }}
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            {/* helmet */}
            <circle cx="100" cy="80" r="42" fill="#1b263b" stroke="#778da9" strokeWidth="3" />
            <circle cx="100" cy="80" r="32" fill="#0d1b2a" />
            {/* visor reflection */}
            <ellipse cx="90" cy="72" rx="14" ry="10" fill="#415a77" opacity="0.5" />
            {/* body */}
            <rect x="72" y="118" width="56" height="50" rx="14" fill="#1b263b" stroke="#778da9" strokeWidth="2.5" />
            {/* backpack */}
            <rect x="60" y="124" width="14" height="36" rx="5" fill="#415a77" />
            {/* left arm */}
            <rect
              x="48"
              y="130"
              width="28"
              height="10"
              rx="5"
              fill="#1b263b"
              stroke="#778da9"
              strokeWidth="2"
              style={{ transformOrigin: '76px 135px', animation: 'float 4s ease-in-out 0.5s infinite' }}
            />
            {/* right arm (waving!) */}
            <rect
              x="128"
              y="118"
              width="28"
              height="10"
              rx="5"
              fill="#1b263b"
              stroke="#778da9"
              strokeWidth="2"
              transform="rotate(-35 128 123)"
              style={{ transformOrigin: '128px 123px', animation: 'float 3s ease-in-out 1s infinite' }}
            />
            {/* legs */}
            <rect x="80" y="164" width="12" height="26" rx="5" fill="#1b263b" stroke="#778da9" strokeWidth="2" />
            <rect x="108" y="164" width="12" height="26" rx="5" fill="#1b263b" stroke="#778da9" strokeWidth="2" />
            {/* boots */}
            <ellipse cx="86" cy="192" rx="10" ry="5" fill="#415a77" />
            <ellipse cx="114" cy="192" rx="10" ry="5" fill="#415a77" />
            {/* antenna */}
            <line x1="100" y1="38" x2="100" y2="24" stroke="#778da9" strokeWidth="2" />
            <circle cx="100" cy="21" r="4" fill="#f59e0b" style={{ animation: 'twinkle 2s ease-in-out infinite' }} />
            {/* small "?" on visor */}
            <text x="95" y="86" fontSize="18" fontWeight="bold" fill="#e0e1dd" opacity="0.8">?</text>
          </svg>
        </div>

        {/* ---- drifting signpost ---- */}
        <div
          className="relative z-10 mb-8"
          style={{ animation: 'drift 8s ease-in-out infinite' }}
        >
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
            {/* pole */}
            <rect x="56" y="20" width="4" height="40" rx="2" fill="#778da9" />
            {/* sign */}
            <polygon points="20,8 100,8 94,20 20,20" fill="#415a77" />
            <text x="34" y="17" fontSize="9" fill="#e0e1dd" fontWeight="bold">LOST ?</text>
          </svg>
        </div>

        {/* ---- 404 text ---- */}
        <h1
          className="relative z-10 text-8xl sm:text-9xl font-black text-amber-500 tracking-tight"
          style={{ animation: 'pulse404 3s ease-in-out infinite' }}
        >
          404
        </h1>

        <h2 className="relative z-10 text-2xl sm:text-3xl font-bold text-white mt-4 text-center">
          Lost in Space
        </h2>
        <p className="relative z-10 text-gray-400 mt-3 text-center max-w-md text-sm sm:text-base">
          The page you're looking for has drifted into the void.
          <br />
          Let's get you back on course.
        </p>

        {/* ---- action buttons ---- */}
        <div className="relative z-10 flex flex-wrap gap-4 mt-8 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors shadow-lg hover:shadow-amber-500/25"
          >
            <Home size={18} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 font-medium transition-colors"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>

        {/* ---- subtle orbit ring ---- */}
        <div
          className="absolute z-0 w-[600px] h-[600px] rounded-full border border-gray-700/30 pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute z-0 w-[400px] h-[400px] rounded-full border border-gray-700/20 pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </>
  );
};

export default NotFoundPage;
