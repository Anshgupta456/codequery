import { ArrowUpRight, Mail, FileDown } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function HeroSection({ 
  bnwPhotoUrl, 
  colorPhotoUrl 
}) {
  const { profile } = usePortfolio();

  // Dynamic names
  const rawName = (profile?.name || 'Anshika Gupta').trim();
  const nameParts = rawName.split(' ');
  const firstName = nameParts[0]?.toUpperCase() || 'ANSHIKA';
  const lastName = nameParts.slice(1).join(' ').toUpperCase() || 'GUPTA';

  const role = profile?.title || 'Software Engineer';
  const bio = profile?.headline || profile?.summary || 'I build modern web applications with a focus on clean code, great user experiences, and real impact.';

  const displayBnw = bnwPhotoUrl || profile?.profileImageUrl || '/anshika_bnw.png';
  const displayColor = colorPhotoUrl || profile?.colorImageUrl || '/anshika_col.png';
  const resumeUrl = profile?.resumeFileUrl || '/Anshika_Gupta_Resume.pdf';

  const socialLinks = [
    { label: 'GitHub', href: profile?.github || 'https://github.com/anshikagupta', icon: <GithubIcon size={16} /> },
    { label: 'LinkedIn', href: profile?.linkedin || 'https://linkedin.com/in/anshikagupta', icon: <LinkedinIcon size={16} /> },
    { label: 'Email', href: `mailto:${profile?.email || 'anshikagupta.work@gmail.com'}`, icon: <Mail size={16} strokeWidth={2} /> },
  ];

  return (
    <section id="hero" className="group/hero relative w-full lg:h-[calc(100vh-80px)] lg:max-h-[660px] xl:max-h-[720px] flex items-center pt-3 pb-10 sm:pb-14 lg:py-0 bg-white overflow-hidden transition-colors duration-700">
      
      {/* Background shirt-matching teal ambient glow */}
      <div 
        className="absolute top-[18%] right-[16%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(178,216,226,0.45)_0%,rgba(232,244,247,0.22)_45%,transparent_80%)] blur-[70px] pointer-events-none opacity-70 lg:opacity-0 scale-95 lg:scale-90 transition-all duration-700 lg:group-hover/hero:opacity-100 lg:group-hover/hero:scale-100 z-0" 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-full flex flex-col lg:flex-row items-center justify-between">
        
        {/* Top-Right Floating Code Snippet (sitting right above the circle) */}
        <div className="absolute top-1 right-[8%] lg:right-[14%] xl:right-[18%] z-20 font-mono text-[11px] sm:text-xs text-zinc-500 leading-relaxed select-none pointer-events-none hidden lg:block" aria-label="Developer Code Snippet">
          <pre className="bg-transparent m-0">
            <code className="bg-transparent p-0">
              <span className="block">
                <span className="transition-colors duration-500 group-hover/hero:text-[#367C8E] group-hover/hero:font-semibold">const</span> developer = &#123;
              </span>
              <span className="block pl-4">
                <span className="transition-colors duration-500 group-hover/hero:text-[#4C8DA1]">problemSolver:</span> <span className="transition-colors duration-500 group-hover/hero:text-[#235B6A] group-hover/hero:font-semibold">true</span>,
              </span>
              <span className="block pl-4">
                <span className="transition-colors duration-500 group-hover/hero:text-[#4C8DA1]">alwaysLearning:</span> <span className="transition-colors duration-500 group-hover/hero:text-[#235B6A] group-hover/hero:font-semibold">true</span>,
              </span>
              <span className="block pl-4">
                <span className="transition-colors duration-500 group-hover/hero:text-[#4C8DA1]">building:</span> <span className="transition-colors duration-500 group-hover/hero:text-[#367C8E]">"better"</span>
              </span>
              <span className="block">&#125;</span>
            </code>
          </pre>
        </div>

        {/* Left Column: Typography, Bio & CTA */}
        <div className="relative order-2 lg:order-1 z-25 w-full max-w-[580px] flex flex-col items-start pt-4 pb-4 lg:py-0">
          
          {/* Giant Stacked Headline */}
          <div className="mb-3 sm:mb-4 max-w-full">
            <h1 className="m-0 tracking-tight leading-[0.9] max-w-full">
              {/* Outline / Stroke First Name */}
              <span className="block font-display text-[clamp(2.75rem,11.5vw,7.2rem)] font-extrabold uppercase text-transparent [-webkit-text-stroke:2px_#0A0A0A] sm:[-webkit-text-stroke:2.4px_#0A0A0A] transition-all duration-700 group-hover/hero:[-webkit-text-stroke:2px_#367C8E] sm:group-hover/hero:[-webkit-text-stroke:2.4px_#367C8E] group-hover/hero:drop-shadow-[0_2px_14px_rgba(54,124,142,0.28)]">
                {firstName}
              </span>
              {/* Solid Black Last Name */}
              <span className="block font-display text-[clamp(2.75rem,11.5vw,7.2rem)] font-extrabold uppercase text-[#0A0A0A] mt-0.5 sm:mt-1">
                {lastName}
              </span>
            </h1>
          </div>

          {/* Role & Bio */}
          <div className="flex flex-col items-start w-full">
            <h2 className="font-display text-lg sm:text-2xl font-bold text-zinc-950 tracking-tight mt-1 mb-2">
              {role}
            </h2>
            <p className="text-zinc-600 text-xs sm:text-[0.975rem] leading-relaxed max-w-[420px] mb-5 sm:mb-6 font-normal">
              {bio}
            </p>

            {/* View My Work Pill CTA + Download Resume + Mobile Socials */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap w-full sm:w-auto">
              <a 
                href="#work" 
                className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium shadow-sm transition-all duration-500 hover:-translate-y-0.5 group-hover/hero:bg-[#367C8E] group-hover/hero:shadow-lg group-hover/hero:shadow-[#367C8E]/35 group/btn active:scale-95"
              >
                <span>View My Work</span>
                <ArrowUpRight size={15} strokeWidth={2.4} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>

              {resumeUrl && (
                <a 
                  href={resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white text-zinc-900 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium shadow-xs transition-all duration-300 hover:border-zinc-400 hover:bg-zinc-50 hover:-translate-y-0.5 active:scale-95"
                >
                  <FileDown size={15} strokeWidth={2} />
                  <span>Resume</span>
                </a>
              )}

              {/* Mobile/Tablet inline social buttons */}
              <div className="flex lg:hidden items-center gap-2 mt-1 sm:mt-0">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-xs transition-all duration-500 group-hover/hero:border-[#367C8E] group-hover/hero:text-[#367C8E] active:scale-95"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Center / Right Visual Composition (Backdrop Circle + Subtle Orbital Ring + Portrait) */}
        <div className="relative order-1 lg:order-2 lg:absolute lg:right-[10%] xl:right-[14%] lg:bottom-0 w-[270px] sm:w-[380px] lg:w-[450px] xl:w-[490px] h-[300px] sm:h-[400px] lg:h-[490px] xl:h-[530px] flex items-end justify-center z-20 my-2 lg:my-0 max-w-full">
          
          {/* Soft Circle Backdrop (vibrant teal on mobile, subtle gray transitioning to teal on desktop hover) */}
          <div 
            className="absolute top-[10%] right-[2%] sm:right-[4%] lg:right-[2%] w-[220px] sm:w-[310px] lg:w-[370px] xl:w-[400px] h-[220px] sm:h-[310px] lg:h-[370px] xl:h-[400px] rounded-full bg-[radial-gradient(circle_at_35%_32%,#FFFFFF_0%,#E6F6F8_32%,#81A5B2_70%,#367C8E_100%)] lg:bg-[#EAEAE7] transition-all duration-700 lg:group-hover/hero:bg-[radial-gradient(circle_at_35%_32%,#FFFFFF_0%,#E6F6F8_32%,#81A5B2_70%,#367C8E_100%)] shadow-[0_0_50px_rgba(54,124,142,0.22),0_10px_30px_rgba(76,141,161,0.15)] lg:shadow-none lg:group-hover/hero:shadow-[0_0_80px_rgba(54,124,142,0.32),0_20px_50px_rgba(76,141,161,0.18)] lg:group-hover/hero:scale-105 z-10" 
            aria-hidden="true" 
          />

          {/* Delicate Wireframe Orbital Ring (tilted ellipse wrapping behind her through the circle) */}
          <div className="absolute top-[14%] left-1/2 -translate-x-[42%] w-[330px] sm:w-[480px] lg:w-[570px] xl:w-[610px] h-[165px] sm:h-[240px] lg:h-[285px] xl:h-[305px] pointer-events-none z-10" aria-hidden="true">
            <svg viewBox="0 0 650 325" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="tealRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4C8DA1" />
                  <stop offset="100%" stopColor="#235B6A" />
                </linearGradient>
              </defs>
              <ellipse 
                cx="325" 
                cy="162" 
                rx="310" 
                ry="115" 
                transform="rotate(-21 325 162)" 
                className="fill-none stroke-[url(#tealRingGrad)] lg:stroke-[#C6C6C2] stroke-[1.4] lg:stroke-[1.2] transition-all duration-700 lg:group-hover/hero:stroke-[url(#tealRingGrad)] lg:group-hover/hero:stroke-[1.6] lg:group-hover/hero:drop-shadow-[0_0_8px_rgba(76,141,161,0.4)]"
              />
            </svg>
          </div>

          {/* Portrait Image: Full color by default on mobile devices; interactive hover reveal on desktop */}
          <div className="relative z-20 w-full h-full flex items-end justify-center">
            <div className="relative w-full h-full">
              {/* Black & White image (hidden on mobile devices, active on desktop by default) */}
              <img 
                src={displayBnw} 
                alt={`${rawName} (Monochrome)`} 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full object-contain object-bottom scale-115 sm:scale-125 lg:scale-130 origin-bottom transition-all duration-700 pointer-events-none opacity-0 lg:opacity-100 lg:group-hover/hero:opacity-0 drop-shadow-sm" 
              />
              {/* Full Color image (visible by default on mobile devices; on desktop reveals on section hover) */}
              <img 
                src={displayColor} 
                alt={`${rawName} (Color)`} 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full object-contain object-bottom scale-115 sm:scale-125 lg:scale-130 origin-bottom transition-all duration-700 pointer-events-none opacity-100 lg:opacity-0 lg:group-hover/hero:opacity-100 drop-shadow-sm" 
              />
            </div>
          </div>

        </div>

        {/* Far-Right Floating Social Dock (stacked vertically on right, exactly as in reference) */}
        <div className="hidden lg:flex absolute right-4 lg:right-8 xl:right-10 bottom-8 xl:bottom-12 z-30 flex-col gap-2">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/social inline-flex items-center gap-2.5 bg-white border border-zinc-200 rounded-full px-4 py-2 text-xs font-medium text-zinc-800 shadow-xs transition-all duration-500 hover:-translate-y-0.5 group-hover/hero:border-[#B2D8E2] group-hover/hero:shadow-sm hover:!border-[#367C8E] hover:!text-[#367C8E]"
            >
              <span className="transition-colors duration-500 group-hover/hero:text-[#367C8E] group-hover/social:!text-[#367C8E]">{social.icon}</span>
              <span>{social.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
