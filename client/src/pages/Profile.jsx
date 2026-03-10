import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiSave } from 'react-icons/fi';

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
    <div className="max-w-xl mx-auto animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

      <div className="bg-dark-800 rounded-2xl p-8 border border-dark-700">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
            <p className="text-dark-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              WhatsApp Phone Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                placeholder="+919876543210"
              />
            </div>
            <p className="text-xs text-dark-500 mt-1">
              Include country code (e.g. +91 for India). Example: +919876543210
            </p>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-dark-950 border border-dark-700 rounded-xl text-dark-400 cursor-not-allowed"
            />
            <p className="text-xs text-dark-500 mt-1">Email cannot be changed</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
          >
            <FiSave />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* WhatsApp Sandbox Setup Guide */}
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <h3 className="text-green-400 font-semibold text-sm mb-2">📱 WhatsApp Setup (Required)</h3>
          <p className="text-dark-300 text-xs leading-relaxed">
            To receive reminders, send this message from your WhatsApp to <span className="text-white font-mono">+14155238886</span>:
          </p>
          <p className="text-green-400 font-mono text-sm mt-1 mb-2">join &lt;your-sandbox-code&gt;</p>
          <p className="text-dark-400 text-xs">
            Find your sandbox code at{' '}
            <a href="https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn" target="_blank" rel="noreferrer" className="text-primary-400 underline">Twilio Console → WhatsApp Sandbox</a>
          </p>
        </div>
      </div>
    </div>
  );
}
