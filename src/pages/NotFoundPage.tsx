import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useColorTheme } from '../context/ColorThemeContext';

/* ================================================================== */
/*  Shared keyframes used by every theme variant                       */
/* ================================================================== */
const sharedKeyframes = `
@keyframes nf-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25%      { transform: translateY(-18px) rotate(-3deg); }
  50%      { transform: translateY(-8px) rotate(2deg); }
  75%      { transform: translateY(-22px) rotate(-1deg); }
}
@keyframes nf-drift {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(32px); }
  100% { transform: translateX(0); }
}
@keyframes nf-twinkle {
  0%, 100% { opacity: 0.2; }
  50%      { opacity: 1; }
}
@keyframes nf-wander {
  0%   { transform: translate(0, 0) rotate(0deg); }
  25%  { transform: translate(40px, -20px) rotate(10deg); }
  50%  { transform: translate(-10px, -40px) rotate(-5deg); }
  75%  { transform: translate(-30px, -10px) rotate(8deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes nf-pulse404 {
  0%, 100% { text-shadow: 0 0 20px rgb(var(--accent) / 0.3); }
  50%      { text-shadow: 0 0 40px rgb(var(--accent) / 0.6), 0 0 80px rgb(var(--accent) / 0.2); }
}
@keyframes nf-bubble {
  0%   { transform: translateY(0) scale(1); opacity: 0.7; }
  50%  { transform: translateY(-80px) scale(1.15); opacity: 0.35; }
  100% { transform: translateY(-160px) scale(0.7); opacity: 0; }
}
@keyframes nf-swim {
  0%   { transform: translate(0, 0) scaleX(1); }
  25%  { transform: translate(70px, -15px) scaleX(1); }
  50%  { transform: translate(140px, 5px) scaleX(-1); }
  75%  { transform: translate(70px, 20px) scaleX(-1); }
  100% { transform: translate(0, 0) scaleX(1); }
}
@keyframes nf-blink-cursor {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
@keyframes nf-fall-char {
  0%   { transform: translateY(-40px); opacity: 0; }
  10%  { opacity: 0.12; }
  100% { transform: translateY(110vh); opacity: 0; }
}
@keyframes nf-seaweed {
  0%, 100% { transform: rotate(-5deg); }
  50%      { transform: rotate(5deg); }
}
@keyframes nf-jellyfish {
  0%, 100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-30px) scale(1.05); }
}
`;

/* ================================================================== */
/*  Star field (re-used by Space + Default)                           */
/* ================================================================== */
const starsData = Array.from({ length: 45 }, () => ({
  cx: Math.random() * 500,
  cy: Math.random() * 400,
  r: Math.random() * 1.6 + 0.4,
  delay: Math.random() * 4,
}));

const StarField: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 400" preserveAspectRatio="none">
    {starsData.map((s, i) => (
      <circle
        key={i}
        cx={s.cx}
        cy={s.cy}
        r={s.r}
        fill="currentColor"
        className="text-gray-400 dark:text-gray-500"
        style={{ animation: `nf-twinkle ${2 + Math.random() * 3}s ease-in-out ${s.delay}s infinite` }}
      />
    ))}
  </svg>
);

/* ================================================================== */
/*  SPACE  –  Lost in Space                                            */
/* ================================================================== */
const SpaceScene: React.FC = () => (
  <>
    <StarField />

    {/* orbit rings */}
    <div className="absolute z-0 w-[600px] h-[600px] rounded-full border border-gray-700/30 pointer-events-none"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
    <div className="absolute z-0 w-[400px] h-[400px] rounded-full border border-gray-700/20 pointer-events-none"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

    {/* floating astronaut */}
    <div className="relative z-10 mb-6" style={{ animation: 'nf-wander 12s ease-in-out infinite' }}>
      <svg width="180" height="180" viewBox="0 0 200 200" fill="none"
        style={{ animation: 'nf-float 6s ease-in-out infinite' }}>
        {/* helmet */}
        <circle cx="100" cy="80" r="42" fill="#1b263b" stroke="#778da9" strokeWidth="3" />
        <circle cx="100" cy="80" r="32" fill="#0d1b2a" />
        <ellipse cx="90" cy="72" rx="14" ry="10" fill="#415a77" opacity="0.5" />
        {/* body */}
        <rect x="72" y="118" width="56" height="50" rx="14" fill="#1b263b" stroke="#778da9" strokeWidth="2.5" />
        {/* backpack */}
        <rect x="60" y="124" width="14" height="36" rx="5" fill="#415a77" />
        {/* left arm */}
        <rect x="48" y="130" width="28" height="10" rx="5" fill="#1b263b" stroke="#778da9" strokeWidth="2"
          style={{ transformOrigin: '76px 135px', animation: 'nf-float 4s ease-in-out 0.5s infinite' }} />
        {/* right arm (waving) */}
        <rect x="128" y="118" width="28" height="10" rx="5" fill="#1b263b" stroke="#778da9" strokeWidth="2"
          transform="rotate(-35 128 123)"
          style={{ transformOrigin: '128px 123px', animation: 'nf-float 3s ease-in-out 1s infinite' }} />
        {/* legs */}
        <rect x="80" y="164" width="12" height="26" rx="5" fill="#1b263b" stroke="#778da9" strokeWidth="2" />
        <rect x="108" y="164" width="12" height="26" rx="5" fill="#1b263b" stroke="#778da9" strokeWidth="2" />
        {/* boots */}
        <ellipse cx="86" cy="192" rx="10" ry="5" fill="#415a77" />
        <ellipse cx="114" cy="192" rx="10" ry="5" fill="#415a77" />
        {/* antenna */}
        <line x1="100" y1="38" x2="100" y2="24" stroke="#778da9" strokeWidth="2" />
        <circle cx="100" cy="21" r="4" fill="rgb(var(--accent))"
          style={{ animation: 'nf-twinkle 2s ease-in-out infinite' }} />
        {/* question on visor */}
        <text x="95" y="86" fontSize="18" fontWeight="bold" fill="#e0e1dd" opacity="0.8">?</text>
      </svg>
    </div>

    {/* drifting signpost */}
    <div className="relative z-10 mb-8" style={{ animation: 'nf-drift 8s ease-in-out infinite' }}>
      <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
        <rect x="56" y="20" width="4" height="40" rx="2" fill="#778da9" />
        <polygon points="20,8 100,8 94,20 20,20" fill="#415a77" />
        <text x="34" y="17" fontSize="9" fill="#e0e1dd" fontWeight="bold">LOST ?</text>
      </svg>
    </div>
  </>
);

/* ================================================================== */
/*  DEEP SEA  –  Lost in the Deep                                     */
/* ================================================================== */
const bubblesData = Array.from({ length: 20 }, (_, i) => ({
  cx: Math.random() * 100,
  size: Math.random() * 10 + 4,
  delay: Math.random() * 6,
  dur: 4 + Math.random() * 4,
  key: i,
}));

const DeepSeaScene: React.FC = () => (
  <>
    {/* animated waves at top */}
    <svg className="absolute top-0 left-0 w-full h-48 pointer-events-none opacity-30" viewBox="0 0 500 200" preserveAspectRatio="none">
      <path d="M0,80 C80,60 160,100 240,80 C320,60 400,100 500,80 L500,0 L0,0 Z" fill="rgb(var(--accent) / 0.15)">
        <animate attributeName="d"
          values="M0,80 C80,60 160,100 240,80 C320,60 400,100 500,80 L500,0 L0,0 Z;
                  M0,90 C80,110 160,70 240,90 C320,110 400,70 500,90 L500,0 L0,0 Z;
                  M0,80 C80,60 160,100 240,80 C320,60 400,100 500,80 L500,0 L0,0 Z"
          dur="6s" repeatCount="indefinite" />
      </path>
    </svg>

    {/* bubbles */}
    {bubblesData.map((b) => (
      <div
        key={b.key}
        className="absolute rounded-full border border-white/20 bg-white/5"
        style={{
          width: b.size,
          height: b.size,
          left: `${b.cx}%`,
          bottom: '5%',
          animation: `nf-bubble ${b.dur}s ease-in-out ${b.delay}s infinite`,
        }}
      />
    ))}

    {/* seaweed on bottom */}
    <svg className="absolute bottom-0 left-0 w-full h-40 pointer-events-none opacity-40"
      viewBox="0 0 500 160" preserveAspectRatio="none">
      {[60, 140, 200, 300, 380, 450].map((x, i) => (
        <path
          key={i}
          d={`M${x},160 Q${x + 8},120 ${x - 5},80 Q${x + 12},50 ${x},20`}
          stroke="rgb(var(--accent) / 0.5)"
          strokeWidth="3"
          fill="none"
          style={{ transformOrigin: `${x}px 160px`, animation: `nf-seaweed ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}
        />
      ))}
    </svg>

    {/* swimming fish */}
    <div className="absolute z-10" style={{ top: '28%', left: '12%', animation: 'nf-swim 10s ease-in-out infinite' }}>
      <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
        <ellipse cx="25" cy="15" rx="20" ry="10" fill="rgb(var(--accent) / 0.6)" />
        <polygon points="45,15 55,5 55,25" fill="rgb(var(--accent) / 0.5)" />
        <circle cx="18" cy="13" r="2" fill="white" />
      </svg>
    </div>
    <div className="absolute z-10" style={{ top: '55%', right: '18%', animation: 'nf-swim 13s ease-in-out 3s infinite' }}>
      <svg width="40" height="20" viewBox="0 0 60 30" fill="none">
        <ellipse cx="25" cy="15" rx="20" ry="10" fill="rgb(var(--accent-light) / 0.4)" />
        <polygon points="45,15 55,5 55,25" fill="rgb(var(--accent-light) / 0.3)" />
        <circle cx="18" cy="13" r="2" fill="white" />
      </svg>
    </div>

    {/* jellyfish */}
    <div className="absolute z-10 opacity-50"
      style={{ top: '18%', right: '14%', animation: 'nf-jellyfish 5s ease-in-out infinite' }}>
      <svg width="50" height="70" viewBox="0 0 50 70" fill="none">
        <ellipse cx="25" cy="20" rx="20" ry="16" fill="rgb(var(--accent-light) / 0.3)"
          stroke="rgb(var(--accent-light) / 0.5)" strokeWidth="1" />
        {[10, 18, 26, 34, 40].map((x, i) => (
          <path key={i} d={`M${x},36 Q${x + 3},50 ${x - 2},65`}
            stroke="rgb(var(--accent-light) / 0.3)" strokeWidth="1.5" fill="none"
            style={{ animation: `nf-seaweed ${2 + i * 0.2}s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </svg>
    </div>

    {/* diver (lost!) */}
    <div className="relative z-10 mb-6" style={{ animation: 'nf-wander 14s ease-in-out infinite' }}>
      <svg width="160" height="160" viewBox="0 0 200 200" fill="none"
        style={{ animation: 'nf-float 5s ease-in-out infinite' }}>
        {/* diving helmet */}
        <circle cx="100" cy="75" r="38" fill="#0d2137" stroke="rgb(var(--accent) / 0.6)" strokeWidth="3" />
        <circle cx="100" cy="75" r="28" fill="#0a1628" />
        <ellipse cx="92" cy="70" rx="12" ry="8" fill="rgb(var(--accent) / 0.15)" />
        {/* breathing tube */}
        <path d="M138,70 Q150,60 148,45 Q146,30 160,25" stroke="rgb(var(--accent) / 0.5)" strokeWidth="3" fill="none" />
        <circle cx="162" cy="22" r="5" fill="rgb(var(--accent) / 0.3)"
          style={{ animation: 'nf-bubble 3s ease-in-out infinite' }} />
        {/* body */}
        <rect x="74" y="110" width="52" height="46" rx="12" fill="#0d2137" stroke="rgb(var(--accent) / 0.5)" strokeWidth="2" />
        {/* arms */}
        <rect x="50" y="118" width="26" height="8" rx="4" fill="#0d2137" stroke="rgb(var(--accent) / 0.4)" strokeWidth="1.5"
          style={{ transformOrigin: '76px 122px', animation: 'nf-float 3s ease-in-out 0.5s infinite' }} />
        <rect x="126" y="118" width="26" height="8" rx="4" fill="#0d2137" stroke="rgb(var(--accent) / 0.4)" strokeWidth="1.5"
          style={{ transformOrigin: '126px 122px', animation: 'nf-float 3.5s ease-in-out 1s infinite' }} />
        {/* legs + flippers */}
        <rect x="82" y="154" width="10" height="22" rx="4" fill="#0d2137" stroke="rgb(var(--accent) / 0.4)" strokeWidth="1.5" />
        <rect x="108" y="154" width="10" height="22" rx="4" fill="#0d2137" stroke="rgb(var(--accent) / 0.4)" strokeWidth="1.5" />
        <ellipse cx="87" cy="178" rx="14" ry="4" fill="rgb(var(--accent) / 0.3)" />
        <ellipse cx="113" cy="178" rx="14" ry="4" fill="rgb(var(--accent) / 0.3)" />
        {/* question on mask */}
        <text x="95" y="80" fontSize="16" fontWeight="bold" fill="rgb(var(--accent-light))" opacity="0.7">?</text>
      </svg>
    </div>
  </>
);

/* ================================================================== */
/*  CODE  –  Lost in Code                                              */
/* ================================================================== */
const codeChars = '{}[]()<>/*=!&|;:+-#$@%^~01ABCDEFabcdef'.split('');
const matrixCols = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i / 28) * 100}%`,
  delay: Math.random() * 8,
  dur: 4 + Math.random() * 5,
  chars: Array.from({ length: 12 }, () => codeChars[Math.floor(Math.random() * codeChars.length)]),
  key: i,
}));

const codeSnippets = [
  'const page = null;',
  'if (!found) throw 404;',
  '// TODO: fix route',
  'return <NotFound />;',
  'catch (err) { ... }',
  'path="*" -> void',
  'segfault at 0x404',
  'ERR_PAGE_NOT_FOUND',
];

const CodeScene: React.FC = () => (
  <>
    {/* matrix rain */}
    {matrixCols.map((col) => (
      <div
        key={col.key}
        className="absolute top-0 text-xs font-mono pointer-events-none select-none"
        style={{
          left: col.left,
          animation: `nf-fall-char ${col.dur}s linear ${col.delay}s infinite`,
          color: 'rgb(var(--accent))',
          opacity: 0.1,
        }}
      >
        {col.chars.map((ch, j) => (
          <div key={j} className="leading-5">{ch}</div>
        ))}
      </div>
    ))}

    {/* floating code snippets */}
    {codeSnippets.map((snippet, i) => (
      <div
        key={i}
        className="absolute font-mono text-xs pointer-events-none select-none"
        style={{
          top: `${10 + (i * 11)}%`,
          left: `${5 + (i % 2 === 0 ? i * 8 : 100 - i * 10)}%`,
          color: 'rgb(var(--accent) / 0.12)',
          animation: `nf-drift ${8 + i * 2}s ease-in-out ${i}s infinite`,
        }}
      >
        {snippet}
      </div>
    ))}

    {/* terminal window */}
    <div className="relative z-10 mb-6 w-full max-w-md mx-auto px-4">
      <div className="bg-[#0d1117] border border-gray-700/60 rounded-xl overflow-hidden shadow-2xl">
        {/* title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-gray-700/40">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-gray-500 font-mono">terminal</span>
        </div>
        {/* terminal body */}
        <div className="p-4 font-mono text-sm space-y-2">
          <div>
            <span style={{ color: 'rgb(var(--accent))' }}>$</span>{' '}
            <span className="text-gray-400">navigate --to /this-page</span>
          </div>
          <div className="text-red-400">
            Error: Route not found in routing table
          </div>
          <div>
            <span style={{ color: 'rgb(var(--accent))' }}>$</span>{' '}
            <span className="text-gray-400">grep -r &quot;page&quot; ./routes/</span>
          </div>
          <div className="text-gray-500 text-xs">
            0 results. Page does not exist.
          </div>
          <div className="flex items-center">
            <span style={{ color: 'rgb(var(--accent))' }}>$</span>
            <span className="text-gray-400 ml-1">_</span>
            <span
              className="inline-block w-2 h-4 ml-0.5"
              style={{ backgroundColor: 'rgb(var(--accent))', animation: 'nf-blink-cursor 1s step-end infinite' }}
            />
          </div>
        </div>
      </div>
    </div>
  </>
);

/* ================================================================== */
/*  DEFAULT  –  Compass / Map scene (Amber, Emerald, custom)          */
/* ================================================================== */
const DefaultScene: React.FC = () => (
  <>
    <StarField />

    {/* orbit rings */}
    <div className="absolute z-0 w-[600px] h-[600px] rounded-full border border-gray-700/30 pointer-events-none"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
    <div className="absolute z-0 w-[400px] h-[400px] rounded-full border border-gray-700/20 pointer-events-none"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

    {/* floating compass */}
    <div className="relative z-10 mb-6" style={{ animation: 'nf-wander 10s ease-in-out infinite' }}>
      <svg width="160" height="160" viewBox="0 0 200 200" fill="none"
        style={{ animation: 'nf-float 5s ease-in-out infinite' }}>
        {/* outer ring */}
        <circle cx="100" cy="100" r="80" fill="none" stroke="rgb(var(--accent) / 0.3)" strokeWidth="2" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="rgb(var(--accent) / 0.15)" strokeWidth="1" />
        {/* compass face */}
        <circle cx="100" cy="100" r="60" fill="#1b263b" stroke="rgb(var(--accent) / 0.5)" strokeWidth="2" />
        {/* needle */}
        <polygon points="100,50 95,100 105,100" fill="rgb(var(--accent) / 0.8)" />
        <polygon points="100,150 95,100 105,100" fill="rgb(var(--accent-dark) / 0.5)" />
        {/* center dot */}
        <circle cx="100" cy="100" r="6" fill="rgb(var(--accent))" />
        {/* cardinal directions */}
        <text x="95" y="44" fontSize="12" fontWeight="bold" fill="rgb(var(--accent-light))" opacity="0.7">N</text>
        <text x="95" y="168" fontSize="12" fontWeight="bold" fill="rgb(var(--accent-light) / 0.4)">S</text>
        <text x="160" y="105" fontSize="12" fontWeight="bold" fill="rgb(var(--accent-light) / 0.4)">E</text>
        <text x="32" y="105" fontSize="12" fontWeight="bold" fill="rgb(var(--accent-light) / 0.4)">W</text>
        {/* question mark */}
        <text x="88" y="108" fontSize="22" fontWeight="bold" fill="rgb(var(--accent-light))" opacity="0.6">?</text>
      </svg>
    </div>
  </>
);

/* ================================================================== */
/*  Theme → scene mapping + metadata                                   */
/* ================================================================== */
interface ThemeConfig {
  title: string;
  subtitle: string;
  description: string;
  bgClass: string;
  Scene: React.FC;
}

function getThemeConfig(themeId: string): ThemeConfig {
  switch (themeId) {
    case 'space':
      return {
        title: 'Lost in Space',
        subtitle: 'Houston, we have a problem…',
        description: 'The page you\'re looking for has drifted into the void. Let\'s get you back on course.',
        bgClass: 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800',
        Scene: SpaceScene,
      };
    case 'deepsea':
      return {
        title: 'Lost in the Deep',
        subtitle: 'Sonar can\'t find this page…',
        description: 'This page has sunk into the abyss. Let\'s surface you back to safety.',
        bgClass: 'bg-gradient-to-b from-[#0a1628] via-[#0d2137] to-[#0a2a3f]',
        Scene: DeepSeaScene,
      };
    case 'code':
      return {
        title: 'Lost in Code',
        subtitle: 'ERR_PAGE_NOT_FOUND',
        description: 'Error 404: The requested resource could not be located in the routing table.',
        bgClass: 'bg-gradient-to-b from-[#0a0a0a] via-[#0d1117] to-[#161b22]',
        Scene: CodeScene,
      };
    default:
      // amber, emerald, custom themes
      return {
        title: 'Page Not Found',
        subtitle: 'You seem a bit lost…',
        description: 'The page you\'re looking for doesn\'t exist. Let\'s navigate you back home.',
        bgClass: 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800',
        Scene: DefaultScene,
      };
  }
}

/* ================================================================== */
/*  NotFoundPage Component                                             */
/* ================================================================== */
const NotFoundPage: React.FC = () => {
  const { activeThemeId } = useColorTheme();
  const config = getThemeConfig(activeThemeId);
  const { Scene } = config;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `404 – ${config.title} | Yaswanth Portfolio`;
  }, [config.title]);

  return (
    <>
      <style>{sharedKeyframes}</style>

      <div className={`min-h-screen flex flex-col items-center justify-center ${config.bgClass} px-4 py-20 relative overflow-hidden select-none`}>

        {/* theme-specific scene */}
        <Scene />

        {/* 404 text */}
        <h1
          className="relative z-10 text-8xl sm:text-9xl font-black tracking-tight"
          style={{ color: 'rgb(var(--accent))', animation: 'nf-pulse404 3s ease-in-out infinite' }}
        >
          404
        </h1>

        <h2 className="relative z-10 text-2xl sm:text-3xl font-bold text-white mt-4 text-center">
          {config.title}
        </h2>
        <p className="relative z-10 text-gray-400 mt-2 text-sm italic">
          {config.subtitle}
        </p>
        <p className="relative z-10 text-gray-400 mt-3 text-center max-w-md text-sm sm:text-base">
          {config.description}
        </p>

        {/* action buttons */}
        <div className="relative z-10 flex flex-wrap gap-4 mt-8 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all shadow-lg hover:scale-105"
            style={{ backgroundColor: 'rgb(var(--accent))', boxShadow: '0 4px 20px rgb(var(--accent) / 0.25)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgb(var(--accent-dark))'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgb(var(--accent))'; }}
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
      </div>
    </>
  );
};

export default NotFoundPage;
