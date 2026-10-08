import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className={`relative w-full ${maxWidth} bg-[#121215] rounded-2xl border border-zinc-800/90 text-zinc-100 shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-200`}>
        {/* Header */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-3.5 sm:py-5 border-b border-zinc-800/80 bg-[#16161a]">
          <div className="min-w-0 pr-2">
            <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight truncate">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 sm:line-clamp-none">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
