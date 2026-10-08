import { Code2, Mail } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

const GithubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const { profile } = usePortfolio();
  const currentYear = new Date().getFullYear();
  const name = profile?.name || 'Anshika Gupta';

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 pt-12 sm:pt-16 pb-8 sm:pb-9 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 sm:gap-12 pb-8 sm:pb-12 border-b border-zinc-200">
          
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-display font-bold text-lg text-zinc-950 mb-3">
              <Code2 size={18} />
              <span>{name.toLowerCase().replace(/\s+/g, '')}.dev</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {profile?.headline || 'Engineering reliable, scalable web applications and intuitive digital experiences.'}
            </p>
          </div>

          <div className="flex gap-10 sm:gap-16 flex-wrap">
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-zinc-950 mb-1">
                Navigation
              </span>
              <a href="#hero" className="text-xs sm:text-sm text-zinc-600 hover:text-zinc-950 transition-colors py-0.5">Home</a>
              <a href="#projects" className="text-xs sm:text-sm text-zinc-600 hover:text-zinc-950 transition-colors py-0.5">Projects</a>
              <a href="#about" className="text-xs sm:text-sm text-zinc-600 hover:text-zinc-950 transition-colors py-0.5">About</a>
              <a href="#experience" className="text-xs sm:text-sm text-zinc-600 hover:text-zinc-950 transition-colors py-0.5">Experience</a>
              <a href="#skills" className="text-xs sm:text-sm text-zinc-600 hover:text-zinc-950 transition-colors py-0.5">Skills</a>
              <a href="#contact" className="text-xs sm:text-sm text-zinc-600 hover:text-zinc-950 transition-colors py-0.5">Contact</a>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-zinc-950 mb-1">
                Connect
              </span>
              <a href={profile?.github || 'https://github.com'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 hover:text-[#367C8E] transition-colors py-0.5">
                <GithubIcon size={15} />
                <span>GitHub</span>
              </a>
              <a href={profile?.linkedin || 'https://linkedin.com'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 hover:text-[#367C8E] transition-colors py-0.5">
                <LinkedinIcon size={15} />
                <span>LinkedIn</span>
              </a>
              <a href={`mailto:${profile?.email || 'anshika@example.com'}`} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 hover:text-[#367C8E] transition-colors py-0.5">
                <Mail size={15} />
                <span>Email</span>
              </a>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 text-xs text-zinc-400 gap-2 sm:gap-4 text-center sm:text-left">
          <p>© {currentYear} {name}. All rights reserved.</p>
          <p>Designed & Built with precision</p>
        </div>
      </div>
    </footer>
  );
}
