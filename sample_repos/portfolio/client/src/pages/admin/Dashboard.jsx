import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  Briefcase, 
  Cpu, 
  Mail, 
  User, 
  ArrowUpRight, 
  Plus, 
  GraduationCap, 
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  projectService, 
  experienceService, 
  skillService, 
  messageService, 
  profileService,
  educationService,
  achievementService 
} from '../../services/portfolioService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projectsCount: 0,
    featuredProjects: 0,
    experienceCount: 0,
    skillsCount: 0,
    skillCategoriesCount: 0,
    messagesCount: 0,
    unreadMessages: 0,
    educationCount: 0,
    achievementsCount: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          projects,
          experience,
          skills,
          messages,
          prof,
          education,
          achievements
        ] = await Promise.all([
          projectService.getAll(),
          experienceService.getAll(),
          skillService.getAll(),
          messageService.getAll(),
          profileService.getProfile(),
          educationService.getAll(),
          achievementService.getAll()
        ]);

        const totalSkillItems = skills.reduce((acc, cat) => acc + (cat.items ? cat.items.length : 0), 0);
        const unread = messages.filter((m) => !m.isRead).length;
        const featured = projects.filter((p) => p.featured).length;

        setStats({
          projectsCount: projects.length,
          featuredProjects: featured,
          experienceCount: experience.length,
          skillsCount: totalSkillItems,
          skillCategoriesCount: skills.length,
          messagesCount: messages.length,
          unreadMessages: unread,
          educationCount: education.length,
          achievementsCount: achievements.length
        });

        setRecentMessages(messages.slice(0, 4));
        setProfile(prof);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    window.addEventListener('portfolio_data_updated', loadDashboardData);
    return () => {
      window.removeEventListener('portfolio_data_updated', loadDashboardData);
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    await messageService.markRead(id, true);
    setRecentMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
    setStats((prev) => ({
      ...prev,
      unreadMessages: Math.max(0, prev.unreadMessages - 1)
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-950 rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-zinc-400">Loading admin metrics...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Projects Shipped',
      value: stats.projectsCount,
      subtext: `${stats.featuredProjects} Featured on homepage`,
      icon: FolderKanban,
      link: '/admin/projects'
    },
    {
      title: 'Experience Records',
      value: stats.experienceCount,
      subtext: 'Career milestones & roles',
      icon: Briefcase,
      link: '/admin/experience'
    },
    {
      title: 'Skills & Tech Stack',
      value: stats.skillsCount,
      subtext: `Across ${stats.skillCategoriesCount} categories`,
      icon: Cpu,
      link: '/admin/skills'
    },
    {
      title: 'Messages & Inquiries',
      value: stats.messagesCount,
      subtext: stats.unreadMessages > 0 ? `${stats.unreadMessages} Unread messages` : 'All caught up',
      icon: Mail,
      link: '/admin/messages',
      highlight: stats.unreadMessages > 0
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Yellow Glow */}
      <div className="relative overflow-hidden bg-[#121215] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 shadow-2xl border border-zinc-800">
        {/* Yellow Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(250,204,21,0.12)_0%,transparent_70%)] blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-[radial-gradient(circle,rgba(250,204,21,0.06)_0%,transparent_70%)] blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
              Live Console
            </span>
            <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
              Synced with MongoDB Atlas
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="text-yellow-400">{profile?.name || 'Anshika'}</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            Manage your dynamic portfolio in real time. Showcase new projects, update career milestones, customize vector tech stack icons, and review incoming contact inquiries.
          </p>
        </div>

        {/* Quick actions row */}
        <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 flex-wrap w-full md:w-auto">
          <Link
            to="/admin/projects"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 rounded-xl transition-all shadow-lg shadow-yellow-400/20 active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Project</span>
          </Link>
          <Link
            to="/admin/profile"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-zinc-200 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition-all hover:text-yellow-400 active:scale-95 cursor-pointer"
          >
            <User size={15} />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className={`group p-5 bg-[#121215] rounded-2xl border ${card.highlight ? 'border-yellow-400/60 ring-1 ring-yellow-400/30' : 'border-zinc-800'} hover:border-yellow-400 transition-all hover:shadow-xl hover:shadow-yellow-400/5 hover:-translate-y-0.5 flex flex-col justify-between shadow-sm relative overflow-hidden`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 group-hover:text-yellow-400 transition-colors">
                  {card.title}
                </span>
                <div className="w-9 h-9 rounded-xl bg-zinc-800/90 border border-zinc-700 text-yellow-400 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-black transition-all">
                  <Icon size={17} />
                </div>
              </div>
              <div className="mt-4">
                <div className="font-display text-3xl font-extrabold tracking-tight text-white">
                  {card.value}
                </div>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-zinc-800/80 text-yellow-400 border border-zinc-750">
                    {card.subtext}
                  </span>
                  <ArrowUpRight size={15} className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Section: Recent Inquiries & Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Messages */}
        <div className="lg:col-span-2 bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
            <div>
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                Recent Inquiries & Submissions
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Direct messages received from public visitors and recruiters
              </p>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-mono font-semibold text-yellow-400 hover:text-yellow-300 hover:underline inline-flex items-center gap-1"
            >
              <span>View All ({stats.messagesCount})</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs font-mono">
              No inquiries received yet.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {recentMessages.map((msg) => (
                <div 
                  key={msg.id || msg._id} 
                  className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    !msg.isRead ? 'bg-yellow-400/5 -mx-4 px-4 rounded-xl border border-yellow-400/20' : ''
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0 shadow-xs shadow-yellow-400" title="Unread" />
                      )}
                      <span className="text-xs font-bold text-white truncate">
                        {msg.name}
                      </span>
                      <span className="text-[11px] font-mono text-yellow-400/90 font-medium truncate">
                        &lt;{msg.email}&gt;
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    {!msg.isRead ? (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(msg.id || msg._id)}
                        className="px-2.5 py-1 text-[10px] font-mono font-bold text-black bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-colors cursor-pointer"
                      >
                        Mark Read
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-400" /> Read
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Profile Snapshot & Shortcuts */}
        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                Profile Overview
              </h3>
              <Link
                to="/admin/profile"
                className="text-xs font-mono font-semibold text-yellow-400 hover:underline"
              >
                Edit
              </Link>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-black flex items-center justify-center font-display font-black text-xl shadow-lg shadow-yellow-400/20 shrink-0">
                {profile?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-sm text-white truncate">
                  {profile?.name || 'Anshika Gupta'}
                </div>
                <div className="text-xs font-medium text-yellow-400 truncate">
                  {profile?.title || 'Software Engineer'}
                </div>
                <div className="text-[10px] font-mono text-zinc-400 truncate">
                  {profile?.email || 'anshikagupta.work@gmail.com'}
                </div>
              </div>
            </div>

            <div className="bg-[#18181b] rounded-xl p-3.5 border border-zinc-800 text-xs text-zinc-300 line-clamp-3 leading-relaxed font-normal">
              {profile?.headline || profile?.summary || 'Building modern, high-impact web applications.'}
            </div>

            {/* Quick stats mini-grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl border border-zinc-800 bg-[#18181b]">
                <span className="block text-[10px] font-mono text-yellow-400 font-bold uppercase">Education</span>
                <span className="font-display font-extrabold text-sm text-white">{stats.educationCount} entries</span>
              </div>
              <div className="p-2.5 rounded-xl border border-zinc-800 bg-[#18181b]">
                <span className="block text-[10px] font-mono text-yellow-400 font-bold uppercase">Achievements</span>
                <span className="font-display font-extrabold text-sm text-white">{stats.achievementsCount} honors</span>
              </div>
            </div>
          </div>

          {/* Quick Manager links */}
          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block font-bold">
              Quick Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/admin/education"
                className="flex items-center gap-1.5 p-2.5 rounded-xl border border-zinc-800 bg-[#18181b] text-xs font-semibold text-zinc-300 hover:text-yellow-400 hover:border-yellow-400/40 transition-colors"
              >
                <GraduationCap size={14} className="text-yellow-400" />
                <span>Education</span>
              </Link>
              <Link
                to="/admin/achievements"
                className="flex items-center gap-1.5 p-2.5 rounded-xl border border-zinc-800 bg-[#18181b] text-xs font-semibold text-zinc-300 hover:text-yellow-400 hover:border-yellow-400/40 transition-colors"
              >
                <Trophy size={14} className="text-yellow-400" />
                <span>Achievements</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
