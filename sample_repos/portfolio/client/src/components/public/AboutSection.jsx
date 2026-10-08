import { Award } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';

export default function AboutSection() {
  const { profile, education } = usePortfolio();

  const bioSummary = profile?.summary || profile?.headline || 'I am a Software Engineer dedicated to architecting scalable, full-stack web applications. With a strong foundation in React, Node.js, and modern cloud architectures, I build digital products that balance engineering rigor with intuitive user experiences.';

  const educationList = (education && education.length > 0)
    ? education.map((item, idx) => ({
        category: item.degree.includes('B.Tech') || item.degree.includes('Bachelor') ? 'Graduation' : (item.degree.includes('XII') || item.degree.includes('Secondary') ? 'Schooling' : `Education ${idx + 1}`),
        degree: item.degree,
        field: item.institution,
        institution: item.location || 'India',
        location: '',
        duration: [item.startDate, item.endDate].filter(Boolean).join(' — ') || 'Completed',
        score: item.cgpa ? (item.cgpa.includes('CGPA') || item.cgpa.includes('%') ? item.cgpa : `CGPA / Score: ${item.cgpa}`) : 'First Division'
      }))
    : [
        {
          category: 'Graduation',
          degree: 'Bachelor of Technology (B.Tech)',
          field: 'Graphic Era Hill University',
          institution: 'Dehradun, Uttarakhand, India',
          location: '',
          duration: '2020 — 2024',
          score: 'CGPA: 8.7 / 10'
        }
      ];

  return (
    <section id="about" className="relative py-20 sm:py-28 bg-white overflow-hidden scroll-mt-16 sm:scroll-mt-20">

      {/* Background shirt-matching teal ambient glow (colored by default) */}
      <div 
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(178,216,226,0.35)_0%,rgba(232,244,247,0.18)_50%,transparent_85%)] blur-[90px] pointer-events-none opacity-80 z-0" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* About Section Heading: Clean, centered, no subtitle */}
        <SectionHeading
          watermark="ABOUT"
          title="ABOUT ME"
          variant="color"
          align="center"
          className="mb-6 sm:mb-8"
        />

        {/* Clean, Simple Center-Aligned About Paragraph with no extra clutter */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-20 px-2 sm:px-4">
          <p className="font-display text-base sm:text-lg lg:text-2xl font-normal text-zinc-700 leading-relaxed tracking-tight">
            {bioSummary}
          </p>
        </div>

        {/* 
          ==========================================================
          EDUCATION SECTION (#education anchor)
          Single rectangular box with 3 columns separated by vertical lines
          ==========================================================
        */}
        <div id="education" className="pt-10 sm:pt-12 scroll-mt-24 border-t border-zinc-200/80">
          
          <SectionHeading
            watermark="ACADEMICS"
            title="EDUCATION"
            variant="color"
            align="center"
            className="mb-8 sm:mb-10"
          />

          {/* Single Rectangular Box with 3 Columns separated by vertical lines */}
          <div className="bg-[#FAFAFA] border border-[#B2D8E2]/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200/90">
              {educationList.map((item) => (
                <div 
                  key={item.category} 
                  className="p-5 sm:p-8 lg:p-9 flex flex-col justify-between hover:bg-white transition-colors duration-300"
                >
                  <div>
                    {/* Category Label & Duration */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3.5 sm:mb-4">
                      <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#367C8E]">
                        {item.category}
                      </span>
                      <span className="font-mono text-[11px] sm:text-xs font-semibold text-[#367C8E] bg-[#E8F4F7]/70 border border-[#B2D8E2] px-2.5 py-0.5 rounded-full">
                        {item.duration}
                      </span>
                    </div>

                    {/* Degree Title */}
                    <h4 className="font-display text-base sm:text-xl font-bold text-zinc-950 tracking-tight mb-1">
                      {item.degree}
                    </h4>

                    {/* Field / Stream */}
                    <p className="text-xs sm:text-sm font-medium text-zinc-600 mb-3 sm:mb-4">
                      {item.field}
                    </p>

                    {/* Institution & Location */}
                    <div className="text-xs text-zinc-500 space-y-0.5 mb-4 sm:mb-6">
                      <p className="font-medium text-zinc-800">{item.institution}</p>
                      <p>{item.location}</p>
                    </div>
                  </div>

                  {/* Bottom Score Badge */}
                  <div className="pt-3.5 sm:pt-4 border-t border-zinc-200/70 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] sm:text-xs text-zinc-400 font-mono uppercase tracking-wider">
                      Grade / Score
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-bold text-zinc-900 bg-[#E8F4F7]/60 border border-[#B2D8E2] px-2.5 sm:px-3 py-1 rounded-md shadow-2xs">
                      <Award size={13} className="text-[#367C8E]" />
                      {item.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
