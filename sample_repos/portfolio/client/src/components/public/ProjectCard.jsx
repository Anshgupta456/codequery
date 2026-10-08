import { ArrowUpRight, ExternalLink, Star } from 'lucide-react';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ProjectCard({ project }) {
  const {
    number = '01',
    title,
    duration = 'Full Stack',
    theme = 'light',
    tags = [],
    featured,
    verticalBadge = 'Production',
    liveLink,
    githubLink,
    imageUrl,
    description,
    mockup
  } = project;

  const isDark = theme === 'dark';
  const targetLink = liveLink || githubLink || '#';
  const isFeatured = Boolean(featured ?? project.featured ?? (verticalBadge === 'Featured'));

  return (
    <article
      className={`group/card relative flex flex-col rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 ${isDark
          ? 'bg-[#0E0E10] text-white border border-[#367C8E]/30 shadow-xl shadow-black/20 hover:border-[#367C8E]'
          : 'bg-white text-zinc-950 border border-[#B2D8E2]/80 shadow-xs hover:border-[#367C8E] hover:shadow-md'
        }`}
    >
      <div className="flex flex-col h-full">

        {/* Top Header: Featured Tag on Top Corner, Line meeting Number */}
        <div className="flex items-center gap-3 mb-3">
          {isFeatured && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase shrink-0 shadow-xs ${
                isDark
                  ? 'bg-[#367C8E]/25 text-[#B2D8E2] border border-[#367C8E]/50'
                  : 'bg-[#E8F4F7] text-[#235B6A] border border-[#B2D8E2]'
              }`}
            >
              <Star size={11} className="fill-current text-[#367C8E]" />
              <span>Featured</span>
            </span>
          )}
          <div className={`h-[1px] flex-1 ${isDark ? 'bg-[#367C8E]/50' : 'bg-[#367C8E]/30'}`} />
          <span className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-[#B2D8E2]' : 'text-[#367C8E]'}`}>
            {number}
          </span>
        </div>

        {/* Project Title & Links */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display text-xl sm:text-[1.65rem] font-bold tracking-tight min-w-0 break-words">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} GitHub Repository`}
                className={`p-1.5 rounded-full transition-colors ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'}`}
              >
                <GithubIcon size={16} />
              </a>
            )}
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} Live Site`}
                className={`p-1.5 rounded-full transition-colors ${isDark ? 'text-[#B2D8E2] hover:text-white hover:bg-zinc-800' : 'text-[#367C8E] hover:text-[#235B6A] hover:bg-[#E8F4F7]'}`}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Description or Duration */}
        <p className={`text-xs sm:text-[13px] line-clamp-2 leading-relaxed mb-3.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          {description || `{Stack: ${duration}}`}
        </p>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 flex-wrap mb-5">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-2.5 py-1 rounded-[3px] text-[11px] font-medium tracking-tight ${isDark
                  ? 'bg-zinc-800/90 text-[#B2D8E2] border border-zinc-700/60'
                  : 'bg-[#E8F4F7] border border-[#B2D8E2] text-[#235B6A]'
                }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Visual Preview Container */}
        <a 
          href={targetLink}
          target={targetLink.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className="relative block w-full aspect-[16/11] rounded-xl overflow-hidden bg-zinc-100 shadow-inner mt-auto group/img"
        >
          {/* Hover Action Circle (Subtle ↗ button) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 text-[#367C8E] flex items-center justify-center shadow-xl opacity-0 scale-75 group-hover/card:opacity-100 group-hover/card:scale-100 transition-all duration-300 pointer-events-none z-30" aria-hidden="true">
            <ArrowUpRight size={18} strokeWidth={2.4} />
          </div>

          {/* Render Mockup or Image */}
          <div className="w-full h-full transition-transform duration-700 group-hover/card:scale-[1.02]">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : mockup ? (
              mockup
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-zinc-500 font-mono text-xs">
                &lt;{title} /&gt;
              </div>
            )}
          </div>

        </a>

      </div>
    </article>
  );
}
