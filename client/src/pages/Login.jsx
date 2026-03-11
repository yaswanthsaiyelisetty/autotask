import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiZap, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-950">
      {/* Left — Premium branding panel */}
      <div className="hidden lg:flex lg:w-[520px] xl:w-[580px] relative overflow-hidden auth-bg">
        {/* Layered orbs */}
        <div className="absolute top-16 left-8 w-80 h-80 bg-primary-600/15 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-24 right-0 w-64 h-64 bg-accent-400/8 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-primary-400/10 rounded-full blur-[80px]" />

        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center shadow-glow-sm">
              <FiZap className="text-white text-xl" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight font-serif">AutoTask</span>
          </div>

          {/* Hero text */}
          <div className="space-y-8">
            <div>
              <p className="text-accent-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">AI-Powered Automation</p>
              <h2 className="text-5xl xl:text-6xl font-serif font-bold text-white leading-[1.1] tracking-tight">
                Automate your
                <br />
                <span className="text-gradient italic">productivity</span>
              </h2>
            </div>
            <p className="text-dark-400 text-base leading-relaxed max-w-sm font-light">
              Intelligent task management with WhatsApp reminders. Simply describe what you need — AI orchestrates the rest.
            </p>
            <div className="elegant-divider w-20" />
            <div className="flex items-center gap-8 text-sm text-dark-500">
              <span className="flex items-center gap-2.5">
                <span className="w-1 h-1 bg-accent-400 rounded-full" />
                <span className="text-xs tracking-wide">AI Parsing</span>
              </span>
              <span className="flex items-center gap-2.5">
                <span className="w-1 h-1 bg-primary-400 rounded-full" />
                <span className="text-xs tracking-wide">WhatsApp</span>
              </span>
              <span className="flex items-center gap-2.5">
                <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                <span className="text-xs tracking-wide">Scheduling</span>
              </span>
            </div>
          </div>

          <p className="text-dark-600 text-[11px] tracking-wide">&copy; 2026 AutoTask &mdash; Built with AI</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative">
        {/* Subtle background orb */}
        <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-primary-600/[0.04] rounded-full blur-[100px]" />

        <div className="w-full max-w-[420px] animate-fade-in-up relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center shadow-glow-sm">
                <FiZap className="text-white text-lg" />
              </div>
              <span className="text-2xl font-serif font-bold text-white">AutoTask</span>
            </div>
            <p className="text-dark-500 text-sm">AI-Powered Task Automation</p>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Welcome back</h2>
            <p className="text-dark-500 mt-2 text-sm font-light">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-medium text-dark-400 mb-2.5 uppercase tracking-[0.15em]">
                Email Address
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 text-sm group-focus-within:text-primary-400 transition-colors duration-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-dark-900/60 border border-dark-700/50 rounded-2xl text-white placeholder-dark-600 focus:outline-none focus:border-primary-500/40 transition-gpu text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-dark-400 mb-2.5 uppercase tracking-[0.15em]">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 text-sm group-focus-within:text-primary-400 transition-colors duration-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-dark-900/60 border border-dark-700/50 rounded-2xl text-white placeholder-dark-600 focus:outline-none focus:border-primary-500/40 transition-gpu text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors duration-300"
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-shine w-full py-3.5 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 hover:from-primary-500 hover:via-primary-400 hover:to-primary-500 text-white font-semibold rounded-2xl transition-gpu disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-glow-sm hover:shadow-glow-md text-sm mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="text-sm" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <div className="elegant-divider mb-6" />
            <p className="text-dark-500 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-400 hover:text-accent-400 font-medium transition-colors duration-300">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
