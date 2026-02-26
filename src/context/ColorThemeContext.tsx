import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface ColorTheme {
  id: string;
  name: string;
  /** Primary accent colour as "r, g, b" (no parentheses) */
  accent: string;
  /** Lighter variant for hover / bg tints */
  accentLight: string;
  /** Darker variant for active states */
  accentDark: string;
  /** Whether this is a built-in preset (can't be deleted) */
  preset?: boolean;
}

interface ColorThemeContextType {
  activeThemeId: string;
  activeTheme: ColorTheme;
  themes: ColorTheme[];
  setActiveTheme: (id: string) => void;
  addTheme: (theme: Omit<ColorTheme, 'id'>) => string;
  deleteTheme: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function lighten(rgb: string, amount = 40): string {
  const [r, g, b] = rgb.split(/[,\s]+/).filter(Boolean).map((s) => Math.min(255, parseInt(s.trim()) + amount));
  return `${r} ${g} ${b}`;
}
function darken(rgb: string, amount = 30): string {
  const [r, g, b] = rgb.split(/[,\s]+/).filter(Boolean).map((s) => Math.max(0, parseInt(s.trim()) - amount));
  return `${r} ${g} ${b}`;
}

/* ------------------------------------------------------------------ */
/*  Preset themes                                                      */
/* ------------------------------------------------------------------ */
export const PRESET_THEMES: ColorTheme[] = [
  {
    id: 'amber',
    name: 'Amber (Yellow)',
    accent: '245 158 11',       // #f59e0b
    accentLight: '252 211 77',  // #fcd34d
    accentDark: '217 119 6',    // #d97706
    preset: true,
  },
  {
    id: 'deepsea',
    name: 'Deep Sea',
    accent: '65 90 119',        // #415a77
    accentLight: '119 141 169', // #778da9
    accentDark: '52 75 101',    // #344b65
    preset: true,
  },
  {
    id: 'space',
    name: 'Space',
    accent: '99 102 241',       // #6366f1
    accentLight: '165 180 252', // #a5b4fc
    accentDark: '79 70 229',    // #4f46e5
    preset: true,
  },
  {
    id: 'code',
    name: 'Code',
    accent: '34 197 94',        // #22c55e
    accentLight: '134 239 172', // #86efac
    accentDark: '22 163 74',    // #16a34a
    preset: true,
  },
  {
    id: 'emerald-custom',
    name: 'Emerald',
    accent: '70 190 117',       // #46BE75
    accentLight: lighten('70 190 117'),
    accentDark: darken('70 190 117'),
    preset: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Storage                                                            */
/* ------------------------------------------------------------------ */
const THEME_STORAGE_KEY = 'portfolio_color_themes';
const ACTIVE_THEME_KEY = 'portfolio_active_theme';

function loadCustomThemes(): ColorTheme[] {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCustomThemes(themes: ColorTheme[]) {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themes));
}

/* ------------------------------------------------------------------ */
/*  URL-based theme persistence                                        */
/* ------------------------------------------------------------------ */
/** Read `?theme=<id>` from the current URL. */
function getThemeFromURL(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('theme');
  } catch {
    return null;
  }
}

/** Set / remove the `?theme=` query param without triggering navigation. */
function syncThemeToURL(themeId: string) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('theme', themeId);
    window.history.replaceState(null, '', url.toString());
  } catch {
    // ignore in non-browser environments
  }
}

/* ------------------------------------------------------------------ */
/*  Apply CSS custom properties                                        */
/* ------------------------------------------------------------------ */
function applyThemeVars(theme: ColorTheme) {
  // Use a dedicated <style> tag to set CSS variables — this is more robust
  // than inline styles on <html>, because it survives HMR re-injection and
  // avoids specificity edge-cases with Vite's style sheets.
  let styleEl = document.getElementById('color-theme-vars') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'color-theme-vars';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `:root{--accent:${theme.accent}!important;--accent-light:${theme.accentLight}!important;--accent-dark:${theme.accentDark}!important;}`;

  // Also set on documentElement.style as a belt-and-suspenders approach
  const root = document.documentElement;
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-light', theme.accentLight);
  root.style.setProperty('--accent-dark', theme.accentDark);
}

/* ------------------------------------------------------------------ */
/*  Resolve initial theme: URL param → localStorage → default          */
/* ------------------------------------------------------------------ */
function resolveInitialThemeId(): string {
  const customs = loadCustomThemes();
  const all = [...PRESET_THEMES, ...customs];

  // 1. URL param takes highest priority (enables cross-browser sharing)
  const urlTheme = getThemeFromURL();
  if (urlTheme && all.some((t) => t.id === urlTheme)) {
    // Also persist to localStorage so subsequent visits remember it
    localStorage.setItem(ACTIVE_THEME_KEY, urlTheme);
    return urlTheme;
  }

  // 2. localStorage
  const saved = localStorage.getItem(ACTIVE_THEME_KEY);
  if (saved && all.some((t) => t.id === saved)) return saved;

  // 3. fallback
  return 'amber';
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */
const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

// Apply the persisted (or default) theme immediately at module-load time
// so the right colours are visible before React hydrates.
(() => {
  const id = resolveInitialThemeId();
  const customs = loadCustomThemes();
  const all = [...PRESET_THEMES, ...customs];
  const theme = all.find((t) => t.id === id) || PRESET_THEMES[0];
  applyThemeVars(theme);
  syncThemeToURL(id);
})();

export const useColorTheme = (): ColorThemeContextType => {
  const ctx = useContext(ColorThemeContext);
  if (!ctx) throw new Error('useColorTheme must be used within a ColorThemeProvider');
  return ctx;
};

export const ColorThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customThemes, setCustomThemes] = useState<ColorTheme[]>(loadCustomThemes);
  const themes = [...PRESET_THEMES, ...customThemes];

  const [activeThemeId, setActiveThemeId] = useState<string>(resolveInitialThemeId);

  const activeTheme = themes.find((t) => t.id === activeThemeId) || PRESET_THEMES[0];

  // Apply on mount + change — persist to both localStorage and URL
  useEffect(() => {
    applyThemeVars(activeTheme);
    localStorage.setItem(ACTIVE_THEME_KEY, activeThemeId);
    syncThemeToURL(activeThemeId);
  }, [activeThemeId, activeTheme]);

  const setActiveTheme = useCallback((id: string) => {
    setActiveThemeId(id);
  }, []);

  const addTheme = useCallback((theme: Omit<ColorTheme, 'id'>): string => {
    const id = `custom-${Date.now()}`;
    const newTheme: ColorTheme = { ...theme, id };
    setCustomThemes((prev) => {
      const next = [...prev, newTheme];
      saveCustomThemes(next);
      return next;
    });
    return id;
  }, []);

  const deleteTheme = useCallback((id: string) => {
    setCustomThemes((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveCustomThemes(next);
      return next;
    });
    // If deleting the active theme, revert to default
    setActiveThemeId((prev) => (prev === id ? 'amber' : prev));
  }, []);

  return (
    <ColorThemeContext.Provider value={{ activeThemeId, activeTheme, themes, setActiveTheme, addTheme, deleteTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
};
