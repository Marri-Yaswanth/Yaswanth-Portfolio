import React, { useState } from 'react';
import { Plus, Trash2, Check, Palette, X } from 'lucide-react';
import { useColorTheme, ColorTheme } from '../context/ColorThemeContext';
import { useToast } from '../components/Toast';

/* ── Helper: parse "r g b" → hex ── */
function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.split(/[\s,]+/).filter(Boolean).map((s) => parseInt(s.trim()));
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/* ── Helper: hex → "r g b" ── */
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function lighten(rgb: string, amount = 40): string {
  const [r, g, b] = rgb.split(/[\s,]+/).filter(Boolean).map((s) => Math.min(255, parseInt(s.trim()) + amount));
  return `${r} ${g} ${b}`;
}
function darken(rgb: string, amount = 30): string {
  const [r, g, b] = rgb.split(/[\s,]+/).filter(Boolean).map((s) => Math.max(0, parseInt(s.trim()) - amount));
  return `${r} ${g} ${b}`;
}

/* ── Swatch ── */
const ThemeCard: React.FC<{
  theme: ColorTheme;
  isActive: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}> = ({ theme, isActive, onSelect, onDelete }) => {
  const bg = `rgb(${theme.accent})`;
  const bgLight = `rgb(${theme.accentLight})`;
  const bgDark = `rgb(${theme.accentDark})`;

  return (
    <button
      onClick={onSelect}
      className={`relative group rounded-xl p-4 border-2 transition-all duration-200 text-left ${
        isActive
          ? 'border-amber-500 shadow-lg scale-[1.02]'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {/* Active check */}
      {isActive && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white shadow"
          style={{ backgroundColor: bg }}
        >
          <Check size={14} />
        </div>
      )}

      {/* Color swatches row */}
      <div className="flex gap-1.5 mb-3">
        <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: bgLight }} title="Light" />
        <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: bg }} title="Accent" />
        <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: bgDark }} title="Dark" />
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{theme.name}</p>
      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{rgbToHex(theme.accent)}</p>

      {/* Delete (custom only) */}
      {!theme.preset && onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-2 right-2 p-1 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
          title="Delete theme"
        >
          <Trash2 size={12} />
        </button>
      )}
    </button>
  );
};

/* ── Add Theme Modal ── */
const AddThemeModal: React.FC<{ onClose: () => void; onAdd: (name: string, hex: string) => void }> = ({
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#3b82f6');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Palette size={20} className="text-amber-500" /> New Theme
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={18} />
          </button>
        </div>

        {/* Name */}
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Theme Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Theme"
          className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
          autoFocus
        />

        {/* Colour picker */}
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Accent Colour</label>
        <div className="flex items-center gap-3 mb-4">
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="w-12 h-10 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
          />
          <input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#3b82f6"
            className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Preview swatches */}
        <div className="flex gap-2 mb-5">
          <div className="flex-1 h-10 rounded-lg" style={{ backgroundColor: `rgb(${lighten(hexToRgb(hex))})` }} />
          <div className="flex-1 h-10 rounded-lg" style={{ backgroundColor: hex }} />
          <div className="flex-1 h-10 rounded-lg" style={{ backgroundColor: `rgb(${darken(hexToRgb(hex))})` }} />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (name.trim()) onAdd(name.trim(), hex); }}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: hex }}
          >
            Add Theme
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Profile Settings Component ── */
const ProfileSettings: React.FC = () => {
  const { activeThemeId, themes, setActiveTheme, addTheme, deleteTheme } = useColorTheme();
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (name: string, hex: string) => {
    const rgb = hexToRgb(hex);
    const id = addTheme({
      name,
      accent: rgb,
      accentLight: lighten(rgb),
      accentDark: darken(rgb),
    });
    setActiveTheme(id);
    setShowAddModal(false);
    showToast(`Theme "${name}" created & applied!`, 'success');
  };

  const handleDelete = (theme: ColorTheme) => {
    deleteTheme(theme.id);
    showToast(`Theme "${theme.name}" deleted`, 'success');
  };

  const presets = themes.filter((t) => t.preset);
  const customs = themes.filter((t) => !t.preset);

  return (
    <div className="space-y-6">
      {/* Section: Preset Themes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3">
          Preset Themes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presets.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={theme.id === activeThemeId}
              onSelect={() => {
                setActiveTheme(theme.id);
                showToast(`Theme "${theme.name}" applied`, 'success');
              }}
            />
          ))}
        </div>
      </div>

      {/* Section: Custom Themes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3">
          Custom Themes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {customs.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={theme.id === activeThemeId}
              onSelect={() => {
                setActiveTheme(theme.id);
                showToast(`Theme "${theme.name}" applied`, 'success');
              }}
              onDelete={() => handleDelete(theme)}
            />
          ))}

          {/* Add new theme button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-400 flex flex-col items-center justify-center gap-2 py-6 text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors min-h-[100px]"
          >
            <Plus size={24} />
            <span className="text-xs font-medium">Add Theme</span>
          </button>
        </div>
      </div>

      {/* Active theme info */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Theme</p>
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-full shadow-inner"
            style={{ backgroundColor: `rgb(${themes.find((t) => t.id === activeThemeId)?.accent || '245 158 11'})` }}
          />
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            {themes.find((t) => t.id === activeThemeId)?.name || 'Amber'}
          </span>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && <AddThemeModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
    </div>
  );
};

export default ProfileSettings;
