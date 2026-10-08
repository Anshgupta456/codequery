import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ProjectCard from './ProjectCard';
import { usePortfolio } from '../../context/PortfolioContext';

export default function WorkSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { projects, projectCategories } = usePortfolio();

  const formattedProjects = useMemo(() => {
    return (projects || []).map((p, idx) => ({
      id: p.id || p._id,
      number: String(idx + 1).padStart(2, '0'),
      title: p.title,
      duration: p.category || (Array.isArray(p.techStack) && p.techStack.length > 0 ? p.techStack.slice(0, 2).join(' · ') : 'Full Stack'),
      theme: idx % 2 === 0 ? 'dark' : 'light',
      category: p.category || 'Full Stack',
      featured: !!p.featured,
      tags: Array.isArray(p.techStack) ? p.techStack : [],
      verticalBadge: p.featured ? 'Featured' : (p.category || 'Production'),
      imageUrl: p.imageUrl,
      liveLink: p.liveLink,
      githubLink: p.githubLink,
      description: p.description
    }));
  }, [projects]);

  // Compute dynamic filter tabs strictly from admin-configured projectCategories
  const filterTabs = useMemo(() => {
    const list = ['All', 'Featured'];
    const customCats = (projectCategories || [])
      .map((c) => (typeof c === 'string' ? c : c.name))
      .filter((name) => name && name.trim());

    customCats.forEach((cat) => {
      if (!list.includes(cat)) {
        list.push(cat);
      }
    });

    return list;
  }, [projectCategories]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return formattedProjects;
    if (activeFilter === 'Featured') return formattedProjects.filter((p) => p.featured);
    return formattedProjects.filter((p) => 
      (p.category && p.category.toLowerCase() === activeFilter.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase()))
    );
  }, [formattedProjects, activeFilter]);

  return (
    <section id="projects" className="relative py-12 sm:py-16 pb-20 bg-white overflow-hidden scroll-mt-20">
      {/* Invisible anchor for backward compatibility */}
      <span id="work" className="sr-only" aria-hidden="true" />

      {/* Background shirt-matching teal ambient glow (colored by default) */}
      <div
        className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(178,216,226,0.35)_0%,rgba(232,244,247,0.18)_50%,transparent_85%)] blur-[75px] pointer-events-none opacity-80 z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* Section Header with Faint Background Watermark */}
        <SectionHeading
          watermark="PROJECTS"
          title="FEATURED PROJECTS"
          variant="color"
          align="center"
          className="mb-4 sm:mb-6"
        />

        {/* Filter Tabs & View All Action Row */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-4">

          {/* Filter Categories */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`text-sm transition-colors py-1 cursor-pointer whitespace-nowrap ${activeFilter === tab
                    ? 'text-[#367C8E] font-bold border-b-2 border-[#367C8E]'
                    : 'text-zinc-500 font-medium hover:text-[#367C8E]'
                  }`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* View All Work Pill CTA */}
          <Link
            to="/projects"
            className="group/all inline-flex items-center gap-2 rounded-full border border-[#367C8E] bg-[#E8F4F7]/40 px-5 py-2 text-xs sm:text-sm font-semibold text-[#367C8E] shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#367C8E] hover:text-white hover:shadow-md hover:shadow-[#367C8E]/20"
          >
            <span>View All Work</span>
            <ArrowUpRight size={15} strokeWidth={2.4} className="transition-transform group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5" />
          </Link>

        </div>

        {/* 3-Column Projects Grid (Matching Reference Screenshot 01, 02, 03) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}
