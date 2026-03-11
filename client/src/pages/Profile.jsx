import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiSave, FiMail, FiMessageCircle } from 'react-icons/fi';

const inputCls =
  'w-full pl-11 pr-4 py-3.5 bg-dark-900/50 border border-white/[0.05] rounded-2xl text-white placeholder-dark-600 focus:outline-none focus:border-primary-500/30 transition-gpu text-sm';
const labelCls =
  'block text-[11px] font-medium text-dark-400 mb-2.5 uppercase tracking-[0.15em]';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ name, phone });
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in-up">
      <div className="mb-10">
        <p className="text-accent-400 text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">Settings</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">Profile</h1>
        <p className="text-dark-500 mt-2 text-sm font-light">Manage your personal information</p>
        <div className="elegant-divider w-16 mt-4" />
      </div>

      <div className="glass rounded-3xl p-7 sm:p-9 relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-9">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl flex items-center justify-center text-2xl font-serif font-bold text-white shadow-glow-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-serif font-semibold text-white tracking-tight">{user?.name}</h2>
            <p className="text-dark-500 text-sm font-light">{user?.email}</p>
          </div>
        </div>

        <div className="elegant-divider mb-8" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelCls}>Full Name</label>
            <div className="relative group">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 text-sm group-focus-within:text-primary-400 transition-colors duration-300" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>WhatsApp Number</label>
            <div className="relative group">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 text-sm group-focus-within:text-primary-400 transition-colors duration-300" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
                placeholder="+919876543210"
              />
            </div>
            <p className="text-[11px] text-dark-600 mt-2 pl-1 font-light">
              Include country code (e.g. +91 for India)
            </p>
          </div>

          <div>
            <label className={labelCls}>Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-600 text-sm" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-11 pr-4 py-3.5 bg-dark-950/40 border border-white/[0.03] rounded-2xl text-dark-500 cursor-not-allowed text-sm"
              />
            </div>
            <p className="text-[11px] text-dark-600 mt-2 pl-1 font-light">Email cannot be changed</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-shine flex items-center justify-center gap-2.5 w-full py-3.5 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 hover:from-primary-500 hover:via-primary-400 hover:to-primary-500 text-white font-semibold rounded-2xl transition-gpu disabled:opacity-50 shadow-glow-sm hover:shadow-glow-md text-sm mt-8"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiSave className="text-sm" />
                Save Changes
              </>
            )}
          </button>
        </form>

        {/* WhatsApp Sandbox Setup Guide */}
        <div className="mt-8 p-5 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
          <div className="flex items-center gap-2.5 mb-3">
            <FiMessageCircle className="text-emerald-400 text-sm" />
            <h3 className="text-emerald-400 font-serif font-semibold text-xs uppercase tracking-[0.15em]">WhatsApp Setup</h3>
          </div>
          <p className="text-dark-400 text-xs leading-relaxed font-light">
            To receive reminders, send this message from your WhatsApp to{' '}
            <span className="text-white font-mono text-[11px]">+14155238886</span>:
          </p>
          <p className="text-emerald-400 font-mono text-sm mt-2 mb-2.5">join &lt;your-sandbox-code&gt;</p>
          <p className="text-dark-600 text-[11px] font-light">
            Find your sandbox code at{' '}
            <a href="https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn" target="_blank" rel="noreferrer" className="text-primary-400 hover:text-accent-400 underline transition-colors duration-300">
              Twilio Console → WhatsApp Sandbox
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
