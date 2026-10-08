import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const { profile } = usePortfolio();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = useMemo(() => [
    { id: 'projects', label: 'Projects', href: isHomePage ? '#projects' : '/#projects' },
    { id: 'about', label: 'About', href: isHomePage ? '#about' : '/#about' },
    { id: 'experience', label: 'Experience', href: isHomePage ? '#experience' : '/#experience' },
    { id: 'skills', label: 'Skills', href: isHomePage ? '#skills' : '/#skills' },
    { id: 'contact', label: 'Contact', href: isHomePage ? '#contact' : '/#contact' },
  ], [isHomePage]);

  // Scroll spy to highlight active section only when scrolled to it (not on hero/homepage by default)
  useEffect(() => {
    if (!isHomePage) {
      setActiveTab('');
      return;
    }

    const handleScroll = () => {
      // If user is at top of page / hero section, no section nav link should be highlighted
      if (window.scrollY < 320) {
        setActiveTab('');
        return;
      }

      const scrollPosition = window.scrollY + 180;
      // Checked from bottom to top according to page order:
      // Hero -> Projects -> About (About & Education) -> Experience -> Skills -> Contact
      const sectionIds = ['contact', 'skills', 'experience', 'education', 'about', 'projects', 'work'];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            // Map education to about, and work to projects
            const mappedId = id === 'education' ? 'about' : (id === 'work' ? 'projects' : id);
            setActiveTab(mappedId);
            return;
          }
        }
      }

      setActiveTab('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial evaluation
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-100 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Brand & Status */}
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="group/brand py-1 truncate">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-zinc-950 hover:text-[#367C8E] transition-colors truncate">
                {profile?.name || 'Anshika Gupta'}
              </span>
            </Link>

            <div className="group/status hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B2D8E2] bg-[#E8F4F7]/40 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></span>
              <span className="text-[11px] font-medium text-zinc-800 tracking-tight">Available for full-time opportunities</span>
            </div>
          </div>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="group/link inline-flex items-center text-sm font-medium py-1 transition-colors"
                onClick={() => setActiveTab(link.id)}
              >
                <span className={`transition-all ${
                  activeTab === link.id 
                    ? 'text-[#367C8E] font-bold border-b-2 border-[#367C8E] pb-0.5' 
                    : 'text-zinc-600 hover:text-[#367C8E]'
                }`}>
                  {link.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <a
              href={isHomePage ? '#contact' : '/#contact'}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#367C8E] hover:bg-[#235B6A] px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs shadow-[#367C8E]/25 transition-all duration-300 group/btn"
            >
              <span>Let's Talk</span>
              <ArrowUpRight size={15} strokeWidth={2.4} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>

            {/* Mobile Toggle */}
            <button
              type="button"
              className="flex md:hidden items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 active:scale-95 transition-all"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown with Backdrop Blur */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop overlay to close when tapping outside on mobile */}
          <div 
            className="fixed inset-0 top-16 sm:top-20 bg-black/30 z-40 backdrop-blur-[2px] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-50 md:hidden flex flex-col gap-4 bg-white/98 backdrop-blur-lg border-b border-zinc-200 px-5 py-5 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B2D8E2] w-fit bg-[#E8F4F7]/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-medium text-zinc-700">Available for Opportunities</span>
            </div>

            <div className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="flex justify-between items-center py-3 text-sm font-medium text-zinc-800 border-b border-zinc-100 active:bg-zinc-50 px-1 rounded-lg"
                  onClick={() => {
                    setActiveTab(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className={activeTab === link.id ? 'text-[#367C8E] font-bold' : 'text-zinc-800'}>
                    {link.label}
                  </span>
                  <ArrowUpRight size={14} className="text-zinc-400" />
                </a>
              ))}
            </div>

            <a
              href={isHomePage ? '#contact' : '/#contact'}
              className="flex items-center justify-center gap-2 rounded-full bg-[#367C8E] hover:bg-[#235B6A] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#367C8E]/25 active:scale-[0.99] transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Let's Talk</span>
              <ArrowUpRight size={16} strokeWidth={2.4} />
            </a>
          </div>
        </>
      )}
    </header>

      {/* Spacer to preserve document flow height so content starts below fixed navbar */}
      <div className="h-16 sm:h-20 w-full shrink-0" aria-hidden="true" />
    </>
  );
}
