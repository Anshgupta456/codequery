import { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  Code, 
  Grid, 
  Upload, 
  Check, 
  Sparkles, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import Modal from '../common/Modal';
import { TECH_ICON_PRESETS, SkillIconRenderer, extractAndCleanSvg } from './techIcons';

export default function SkillIconPickerModal({
  isOpen,
  onClose,
  skillItem, // string "React.js" or object { name: "React.js", icon: "react", svg: "..." }
  onSave
}) {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'code'
  const [searchQuery, setSearchQuery] = useState('');

  // Extract initial name and svg/icon
  const initialName = typeof skillItem === 'string' ? skillItem : (skillItem?.name || '');
  const [name, setName] = useState(initialName);
  const [selectedIconId, setSelectedIconId] = useState(
    typeof skillItem === 'object' ? (skillItem?.icon || '') : ''
  );
  const [customSvg, setCustomSvg] = useState(
    typeof skillItem === 'object' ? (skillItem?.svg || '') : ''
  );
  const [svgError, setSvgError] = useState('');

  // Reset when opening with a new skillItem
  useEffect(() => {
    if (skillItem) {
      setName(typeof skillItem === 'string' ? skillItem : (skillItem?.name || ''));
      setSelectedIconId(typeof skillItem === 'object' ? (skillItem?.icon || '') : '');
      setCustomSvg(typeof skillItem === 'object' ? (skillItem?.svg || '') : '');
      setSvgError('');
    }
  }, [skillItem]);

  const filteredPresets = useMemo(() => {
    if (!searchQuery.trim()) return TECH_ICON_PRESETS;
    const q = searchQuery.toLowerCase().trim();
    return TECH_ICON_PRESETS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.keywords.some((kw) => kw.includes(q))
    );
  }, [searchQuery]);

  const handleSelectPreset = (preset) => {
    setSelectedIconId(preset.id);
    setCustomSvg(preset.svg);
    setSvgError('');
  };

  const handleSvgCodeChange = (e) => {
    const code = e.target.value;
    setCustomSvg(code);
    setSelectedIconId('');
    if (code.trim() && !code.toLowerCase().includes('<svg') && !code.startsWith('data:image')) {
      setSvgError('Please ensure the snippet includes <svg>...</svg> tags or is a valid image URL.');
    } else {
      setSvgError('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isSvg = file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml';
    const isImage = file.type.startsWith('image/');

    if (!isSvg && !isImage) {
      setSvgError('Please upload an SVG file or a PNG/WebP image.');
      return;
    }

    const reader = new FileReader();
    if (isSvg) {
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          const cleaned = extractAndCleanSvg(content) || content;
          setCustomSvg(cleaned);
          setSelectedIconId('');
          setActiveTab('code');
          setSvgError('');
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          setCustomSvg(content);
          setSelectedIconId('');
          setActiveTab('code');
          setSvgError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearIcon = () => {
    setSelectedIconId('');
    setCustomSvg('');
    setSvgError('');
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const cleaned = customSvg ? (extractAndCleanSvg(customSvg) || customSvg.trim()) : null;

    const result = {
      name: name.trim(),
      icon: selectedIconId || null,
      svg: cleaned
    };

    onSave(result);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Tech Stack Icon"
      subtitle={`Configure the vector or colored image icon for "${name || 'Skill'}" shown across the portfolio.`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Top Preview & Name Row */}
        <div className="flex items-center gap-4 p-4 bg-[#18181b] border border-zinc-800 rounded-2xl">
          {/* Live Icon Preview - with authentic full color rendering */}
          <div className="w-14 h-14 rounded-2xl bg-[#09090b] border border-zinc-700/80 flex items-center justify-center text-white shadow-sm shrink-0">
            <SkillIconRenderer 
              skill={{ name, icon: selectedIconId, svg: customSvg }} 
              className="w-8 h-8 [&>svg]:w-8 [&>svg]:h-8" 
              fallbackText={name}
            />
          </div>

          <div className="flex-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-yellow-400 mb-1 font-semibold">
              Skill Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React.js"
              className="w-full px-3.5 py-2 bg-[#09090b] border border-zinc-700 rounded-xl text-sm font-semibold text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
            />
          </div>

          {(customSvg || selectedIconId) && (
            <button
              type="button"
              onClick={handleClearIcon}
              className="p-2 text-zinc-400 hover:text-red-400 rounded-xl hover:bg-red-950/40 transition-colors"
              title="Reset to default icon"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'library'
                ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20'
                : 'bg-zinc-800/80 text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800'
            }`}
          >
            <Grid size={13} />
            <span>Preset Library ({TECH_ICON_PRESETS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'code'
                ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20'
                : 'bg-zinc-800/80 text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800'
            }`}
          >
            <Code size={13} />
            <span>Paste Raw SVG</span>
          </button>

          <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800/80 text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 transition-colors cursor-pointer">
            <Upload size={13} />
            <span>Upload SVG / PNG</span>
            <input
              type="file"
              accept=".svg,image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Tab 1: Preset Library */}
        {activeTab === 'library' && (
          <div className="space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search presets (e.g. React, Docker, Python, MongoDB, Redis)..."
                className="w-full pl-9 pr-4 py-2 bg-[#09090b] border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => {
                const isSelected = selectedIconId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-yellow-400 text-black border-yellow-400 shadow-md ring-2 ring-yellow-400/40'
                        : 'bg-[#18181b] border-zinc-800 text-zinc-300 hover:border-yellow-400/60 hover:text-yellow-400'
                    }`}
                  >
                    <div 
                      className={`w-6 h-6 mb-1.5 flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6 ${
                        isSelected ? 'text-black' : 'text-zinc-200'
                      }`}
                      dangerouslySetInnerHTML={{ __html: preset.svg }}
                    />
                    <span className="text-[11px] font-medium truncate w-full">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Paste Raw SVG Code */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-yellow-400 font-semibold">
                Paste &lt;svg&gt;...&lt;/svg&gt; Markup or Image Data URL
              </label>
              <span className="text-[11px] text-zinc-400">
                Colored SVGs from SimpleIcons, SVGL, or Figma
              </span>
            </div>

            <textarea
              rows={6}
              value={customSvg}
              onChange={handleSvgCodeChange}
              placeholder="<svg viewBox='0 0 24 24' fill='currentColor'>...</svg>"
              className="w-full p-3 font-mono text-xs bg-[#09090b] border border-zinc-700 text-zinc-100 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 resize-none"
            />

            {svgError && (
              <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-red-400" />
                <span>{svgError}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold rounded-xl shadow-lg shadow-yellow-400/20 transition-all cursor-pointer"
          >
            <Check size={14} />
            <span>Save Skill & Icon</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
