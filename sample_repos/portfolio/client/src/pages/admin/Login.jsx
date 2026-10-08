import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide both username and password');
      return;
    }
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleQuickDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between p-6 sm:p-10 font-sans selection:bg-yellow-400 selection:text-black relative overflow-hidden">
      {/* Background ambient glowing yellow gradient spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.09)_0%,transparent_70%)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.06)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-yellow-400 transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
          <ShieldCheck size={14} className="text-yellow-400" />
          <span>Encrypted Session</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-12 relative z-10">
        <div className="text-center mb-8">
          {/* Glowing Yellow Logo badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-400 text-black font-mono font-black text-lg tracking-wider mb-4 shadow-xl shadow-yellow-400/25">
            &lt;/&gt;
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Admin Authentication
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Secure administrative gateway to manage Anshika Gupta's portfolio content.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#121215] border border-zinc-800 border-t-4 border-t-yellow-400 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                Username or ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  autoComplete="username"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-[#09090b] border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-yellow-400 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Vibrant Yellow Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black py-3 px-4 text-sm font-bold transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/35 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper Box */}
          <div className="mt-6 pt-5 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400">
                Demo: <code className="bg-zinc-800 text-yellow-400 font-semibold px-1.5 py-0.5 rounded text-[11px]">admin</code> / <code className="bg-zinc-800 text-yellow-400 font-semibold px-1.5 py-0.5 rounded text-[11px]">admin123</code>
              </span>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
              >
                Auto-fill Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-zinc-500 text-xs font-mono relative z-10">
        © {new Date().getFullYear()} Anshika Gupta · Authorized Access Only
      </div>
    </div>
  );
}
