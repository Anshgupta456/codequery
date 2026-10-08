import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Layers,
  ExternalLink,
  FolderGit2,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import ProjectCard from '../../components/public/ProjectCard';
import { usePortfolio } from '../../context/PortfolioContext';

export default function Projects() {
  const { projects, projectCategories, profile } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Compute dynamic categories strictly from admin-configured projectCategories
  const categories = useMemo(() => {
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

  // Format projects for display
  const formattedProjects = useMemo(() => {
    return (projects || []).map((p, idx) => {
      const tech = Array.isArray(p.techStack) ? p.techStack : [];
      const projectCategory = p.category || (p.featured ? 'Featured' : 'Full Stack');

      return {
        id: p.id || p._id || `proj-${idx}`,
        number: String(idx + 1).padStart(2, '0'),
        title: p.title,
        duration: p.category || (tech.length > 0 ? tech.slice(0, 3).join(' · ') : 'Full Stack'),
        theme: idx % 2 === 0 ? 'dark' : 'light',
        category: projectCategory,
        featured: Boolean(p.featured),
        tags: tech,
        verticalBadge: p.featured ? 'Featured' : (p.category || 'Production'),
        imageUrl: p.imageUrl,
        liveLink: p.liveLink,
        githubLink: p.githubLink,
        description: p.description,
        bulletPoints: p.bulletPoints || []
      };
    });
  }, [projects]);

  // Filter projects by category and search query
  const filteredProjects = useMemo(() => {
    return formattedProjects.filter((project) => {
      // Category match
      let matchesCategory = true;
      if (activeCategory === 'Featured') {
        matchesCategory = project.featured;
      } else if (activeCategory !== 'All') {
        matchesCategory =
          (project.category && project.category.toLowerCase() === activeCategory.toLowerCase()) ||
          project.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase());
      }

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        project.title.toLowerCase().includes(query) ||
        (project.description && project.description.toLowerCase().includes(query)) ||
        project.tags.some(t => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [formattedProjects, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white flex flex-col">
      {/* Universal Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-zinc-100 bg-gradient-to-b from-zinc-50/70 via-white to-white overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute top-0 right-1/4 w-[500px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(178,216,226,0.3)_0%,rgba(232,244,247,0.1)_60%,transparent_80%)] blur-[70px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="mb-4 sm:mb-6">
              <Link
                to="/#work"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Headline Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B2D8E2] bg-[#E8F4F7] text-[#367C8E] text-xs font-mono font-medium tracking-wide mb-2.5 sm:mb-3">
                  <FolderGit2 size={13} />
                  <span>COMPLETE ARCHIVE</span>
                </div>
                <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
                  All Featured Works & Engineering Projects
                </h1>
                <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-base text-zinc-600 leading-relaxed">
                  Explore full-stack platforms, APIs, cloud-deployed systems, and tools engineered by Anshika Gupta. Filter by category or search by specific technologies.
                </p>
              </div>

              {/* Stat Metric Chip */}
              <div className="shrink-0 flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs self-start md:self-auto">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-mono font-bold text-xs sm:text-sm">
                  {formattedProjects.length}
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-400">Total Projects</div>
                  <div className="text-xs sm:text-sm font-semibold text-zinc-900">Shipped & Maintained</div>
                </div>
              </div>
            </div>

            {/* Search & Category Filter Control Bar */}
            <div className="mt-6 sm:mt-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-zinc-200/70">

              {/* Category Pills with smooth horizontal scrolling */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer active:scale-95 ${isActive
                        ? 'bg-zinc-950 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950'
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, React, Node, AI..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-full text-base sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-zinc-700"
                  >
                    Clear
                  </button>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="py-10 sm:py-16 bg-zinc-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

            {/* Filter Result Counter */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                Showing <strong className="text-zinc-900">{filteredProjects.length}</strong> of {formattedProjects.length} projects
              </span>
              {(activeCategory !== 'All' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-xs font-medium text-zinc-950 hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200 p-8">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-4">
                  <Search size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-zinc-900">No matching projects found</h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
                  We couldn't find any projects matching "{searchQuery || activeCategory}". Try searching for another keyword or reset filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
                >
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
