import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FolderKanban, 
  Briefcase, 
  Cpu, 
  GraduationCap, 
  Trophy, 
  Mail, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/portfolioService';
import { localStore } from '../../services/api';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [resetNotice, setResetNotice] = useState(false);

  useEffect(() => {
    // Fetch unread messages count
    const fetchUnread = async () => {
      try {
        const msgs = await messageService.getAll();
        const unread = msgs.filter((m) => !m.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Error fetching unread messages count:', err);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 8000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Profile & Bio', path: '/admin/profile', icon: User },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Experience', path: '/admin/experience', icon: Briefcase },
    { label: 'Skills & Tech', path: '/admin/skills', icon: Cpu },
    { label: 'Education', path: '/admin/education', icon: GraduationCap },
    { label: 'Achievements', path: '/admin/achievements', icon: Trophy },
    { label: 'Messages Inbox', path: '/admin/messages', icon: Mail, badge: unreadCount }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all demo content back to default resume records? Any unsaved local drafts will be overwritten.')) {
      localStore.resetToDefaults();
      setResetNotice(true);
      setTimeout(() => {
        setResetNotice(false);
        window.location.reload();
      }, 700);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased relative selection:bg-yellow-400 selection:text-black">
      {/* Sleek yellow ambient background glow accents */}
      <div className="fixed top-0 right-0 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(250,204,21,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-64 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(250,204,21,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10" />

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#111114] border-r border-zinc-800/90 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand & Top Info */}
        <div className="p-5 border-b border-zinc-800/80">
          <div className="flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-mono font-black text-xs tracking-wider shadow-lg shadow-yellow-400/20 group-hover:scale-105 transition-all">
                &lt;/&gt;
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-sm tracking-tight text-white uppercase leading-none">
                  Anshika Gupta
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-yellow-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  Admin Console
                </span>
              </div>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
            Portfolio Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-yellow-400 text-black font-bold shadow-lg shadow-yellow-400/20'
                      : 'text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        isActive 
                          ? 'bg-black/15 text-black' 
                          : 'bg-zinc-800/90 text-yellow-400 group-hover:bg-zinc-800 group-hover:text-yellow-300'
                      }`}>
                        <Icon size={15} />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive ? 'bg-black text-yellow-400' : 'bg-yellow-400 text-black shadow-sm shadow-yellow-400/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile & Actions Card */}
        <div className="p-3 border-t border-zinc-800/80 bg-[#0d0d10] space-y-2">
          {/* View Live Website Button */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400 hover:text-black border border-yellow-400/30 rounded-xl transition-all shadow-sm group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="group-hover:scale-110 transition-transform" />
              View Public Website
            </span>
            <span className="text-xs group-hover:translate-x-0.5 transition-transform">↗</span>
          </Link>

          {/* Reset Demo Data Button */}
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Reset Demo Records</span>
          </button>

          {/* Admin User Info & Logout */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 px-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-xs shadow-md shadow-yellow-400/20 shrink-0">
                {admin?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-zinc-200 truncate">
                  {admin?.username || 'admin'}
                </span>
                <span className="text-[10px] text-yellow-400 font-mono font-medium">
                  {admin?.role || 'Administrator'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#111114]/90 backdrop-blur-xl border-b border-zinc-800/80 px-3 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer shrink-0"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="px-2 py-0.5 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[11px] sm:text-xs font-mono font-semibold">
                Admin
              </span>
              <span className="text-zinc-600">/</span>
              <h1 className="text-xs sm:text-sm font-bold text-white capitalize truncate">
                {location.pathname.replace('/admin/', '').replace('/', '') || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Status indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[11px] font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span>System Online</span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-yellow-400 border border-zinc-800 hover:border-yellow-400/40 rounded-xl transition-all bg-[#18181b]"
            >
              <span className="hidden sm:inline">Public Site</span>
              <span className="sm:hidden">Site</span>
              <ExternalLink size={12} />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-red-400 hover:bg-red-950/40 border border-zinc-800 rounded-xl transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Reset Feedback Banner */}
        {resetNotice && (
          <div className="bg-yellow-400 text-black font-bold px-4 py-2 text-xs text-center flex items-center justify-center gap-2 shadow-md">
            <CheckCircle2 size={14} className="text-black" />
            <span>Default resume records restored successfully. Refreshing...</span>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
