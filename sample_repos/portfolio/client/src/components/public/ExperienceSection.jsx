import { useState, useMemo } from 'react';
import { Briefcase, Calendar, MapPin, ChevronDown, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';

export default function ExperienceSection() {
  const [hoveredId, setHoveredId] = useState(null);
  const [openIds, setOpenIds] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const { experience: dbExperiences } = usePortfolio();

  // Detect whether device supports true hover (mouse/pointer) vs touch screen
  const isHoverDevice = () => {
    return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  };

  const toggleItem = (id, e) => {
    if (e) {
      e.stopPropagation();
    }
    if (expandAll) {
      setExpandAll(false);
      const nextOpen = {};
      experiences.forEach((item) => {
        nextOpen[item.id] = item.id !== id;
      });
      setOpenIds(nextOpen);
      return;
    }
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleAll = () => {
    if (expandAll) {
      setExpandAll(false);
      setOpenIds({});
    } else {
      setExpandAll(true);
      const allOpen = {};
      experiences.forEach((item) => {
        allOpen[item.id] = true;
      });
      setOpenIds(allOpen);
    }
  };

  const experiences = useMemo(() => {
    if (!Array.isArray(dbExperiences) || dbExperiences.length === 0) {
      return [];
    }
    return dbExperiences.map((exp, idx) => ({
      id: exp.id || exp._id,
      number: String(idx + 1).padStart(2, '0'),
      role: exp.role,
      company: exp.company,
      type: exp.isCurrent ? 'Full-time / Current' : 'Software Engineering',
      duration: [exp.startDate, exp.endDate || (exp.isCurrent ? 'Present' : '')].filter(Boolean).join(' — '),
      location: exp.location || 'India',
      summary: exp.bulletPoints?.[0] || 'Full-stack software engineering and scalable systems development.',
      bullets: Array.isArray(exp.bulletPoints) ? exp.bulletPoints : [],
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Cloud']
    }));
  }, [dbExperiences]);

  return (
    <section id="experience" className="relative py-16 sm:py-24 bg-[#FAFAFA] overflow-hidden select-none scroll-mt-16 sm:scroll-mt-20">

      {/* Background shirt-matching teal ambient glow (colored by default) */}
      <div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(178,216,226,0.35)_0%,rgba(232,244,247,0.18)_50%,transparent_85%)] blur-[90px] pointer-events-none opacity-80 z-0" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading with Expand/Collapse toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-12 gap-3 sm:gap-4">
          <div className="flex-1">
            <SectionHeading
              watermark="EXPERIENCE"
              title="WORK EXPERIENCE"
              variant="color"
              align="left"
              className="!mb-0"
            />
          </div>

          {/* Quick Toggle pill: Expand all details / Collapse */}
          <button
            type="button"
            onClick={handleToggleAll}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#367C8E] bg-[#E8F4F7]/40 text-xs font-semibold text-[#367C8E] shadow-xs transition-all duration-300 hover:bg-[#367C8E] hover:text-white cursor-pointer w-fit self-start sm:self-center active:scale-95"
          >
            <Sparkles size={13} className="text-[#367C8E]" />
            <span>{expandAll ? 'Collapse Details' : 'Expand All Details'}</span>
          </button>
        </div>

        {/* 
          Compact Timeline Container:
          All experiences fit in one screen view at first glance!
          Hovering on desktop or tapping on mobile smoothly expands/collapses full details.
        */}
        <div className="relative">
          
          {/* Continuous Vertical Timeline Spine */}
          <div 
            className="absolute top-6 bottom-6 left-4.5 sm:left-6 w-[2px] bg-gradient-to-b from-[#367C8E]/50 via-[#B2D8E2]/60 to-transparent z-0"
            aria-hidden="true"
          />

          {/* Timeline Stack */}
          <div className="space-y-3.5 sm:space-y-5">
            {experiences.map((exp) => {
              const isCurrent = exp.duration.includes('Present');
              const isExpanded = expandAll || Boolean(openIds[exp.id]) || (isHoverDevice() && hoveredId === exp.id);

              return (
                <div 
                  key={exp.id} 
                  onMouseEnter={() => {
                    if (isHoverDevice()) setHoveredId(exp.id);
                  }}
                  onMouseLeave={() => {
                    if (isHoverDevice()) setHoveredId(null);
                  }}
                  className="group/item relative flex items-start gap-3 sm:gap-6"
                >
                  
                  {/* Timeline Node on Spine */}
                  <div 
                    onClick={(e) => toggleItem(exp.id, e)}
                    className="relative z-10 shrink-0 mt-3 sm:mt-4 cursor-pointer"
                  >
                    <div 
                      className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 bg-[#367C8E] text-white border-[#367C8E] shadow-md shadow-[#367C8E]/25 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Briefcase size={15} strokeWidth={2.2} />
                    </div>
                  </div>

                  {/* Compact Card Container */}
                  <div 
                    className={`flex-1 rounded-2xl sm:rounded-3xl border transition-all duration-300 p-4 sm:p-6 ${
                      isExpanded
                        ? 'bg-white border-[#367C8E] shadow-lg shadow-[#367C8E]/10 -translate-y-0.5'
                        : 'bg-white/95 border-[#B2D8E2]/80 shadow-xs hover:border-[#367C8E] hover:shadow-md'
                    }`}
                  >
                    
                    {/* Collapsed Top Bar (Always Visible, Clickable Header to Toggle) */}
                    <div 
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      onClick={(e) => toggleItem(exp.id, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleItem(exp.id, e);
                        }
                      }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                    >
                      
                      {/* Left: Number, Role, Company, Type */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <span className="font-mono text-[11px] sm:text-xs font-bold text-[#367C8E] bg-[#E8F4F7] px-2 py-0.5 rounded-md">
                          {exp.number}
                        </span>

                        <h3 className="font-display text-sm sm:text-lg font-bold text-zinc-950 tracking-tight">
                          {exp.role}
                        </h3>

                        <span className="text-xs sm:text-sm font-semibold text-[#367C8E]">
                          @{exp.company}
                        </span>

                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#E8F4F7]/60 text-[#235B6A] border border-[#B2D8E2]">
                          {exp.type}
                        </span>
                      </div>

                      {/* Right: Duration Pill & Clickable Chevron Toggle */}
                      <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto shrink-0 mt-0.5 sm:mt-0">
                        <div className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-semibold text-zinc-800 bg-[#E8F4F7]/40 border border-[#B2D8E2] px-2.5 py-0.5 sm:py-1 rounded-full">
                          <Calendar size={11} className="text-[#367C8E]" />
                          <span>{exp.duration}</span>
                        </div>

                        <button
                          type="button"
                          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                          onClick={(e) => toggleItem(exp.id, e)}
                          className={`p-1 rounded-full transition-all duration-300 cursor-pointer ${
                            isExpanded ? 'rotate-180 text-[#367C8E] bg-[#E8F4F7]' : 'text-zinc-400 group-hover/item:text-[#367C8E]'
                          }`}
                        >
                          <ChevronDown size={17} strokeWidth={2.5} />
                        </button>
                      </div>

                    </div>

                    {/* Brief Summary (Always visible, single line - also toggles) */}
                    <p 
                      onClick={(e) => toggleItem(exp.id, e)}
                      className="text-xs text-zinc-500 mt-2 leading-relaxed line-clamp-1 cursor-pointer select-none"
                    >
                      {exp.summary}
                    </p>

                    {/* 
                      Expanded Details Drawer:
                      Smoothly reveals the bullet points and tech pills!
                    */}
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isExpanded ? 'max-h-[600px] opacity-100 mt-4 pt-4 border-t border-zinc-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {/* Bullet points */}
                      <ul className="space-y-2 mb-4">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs text-zinc-700 leading-relaxed">
                            <span className="text-[#367C8E] font-bold text-sm leading-none mt-0.5 shrink-0">
                              •
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100">
                        <div className="flex flex-wrap gap-1.5">
                          {exp.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center text-[10px] sm:text-[11px] font-medium text-[#235B6A] bg-[#E8F4F7]/60 border border-[#B2D8E2] px-2 py-0.5 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Mobile explicit close button */}
                        <button
                          type="button"
                          onClick={(e) => toggleItem(exp.id, e)}
                          className="sm:hidden text-[11px] font-mono font-bold text-[#367C8E] hover:text-[#235B6A] py-1 px-2.5 rounded-full bg-[#E8F4F7] border border-[#B2D8E2] cursor-pointer"
                        >
                          Close Tab ↑
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
