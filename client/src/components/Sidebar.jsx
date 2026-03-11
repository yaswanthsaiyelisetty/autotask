import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiCheckSquare,
  FiUser,
  FiLogOut,
  FiZap,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useState } from 'react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/tasks', label: 'Tasks', icon: <FiCheckSquare /> },
  { to: '/profile', label: 'Profile', icon: <FiUser /> },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-7 pt-9 pb-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center shadow-glow-sm">
            <FiZap className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white tracking-tight">
              Auto<span className="text-gradient">Task</span>
            </h1>
          </div>
        </div>
        <p className="text-[10px] text-dark-600 mt-2 pl-[52px] -mt-0.5 tracking-[0.2em] uppercase font-medium">
          AI Automation
        </p>
      </div>

      {/* Elegant divider */}
      <div className="mx-6 elegant-divider" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-7 space-y-1">
        <p className="text-[10px] font-semibold text-dark-600 uppercase tracking-[0.2em] px-3 mb-4 font-serif">
          Menu
        </p>
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-medium transition-gpu relative ${
                isActive
                  ? 'text-white'
                  : 'text-dark-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-600/15 via-primary-600/8 to-transparent border border-primary-500/15 shadow-inner-glow" />
              )}
              <span
                className={`text-lg relative z-10 transition-gpu ${
                  isActive
                    ? 'text-primary-400'
                    : 'text-dark-500 group-hover:text-primary-400/60'
                }`}
              >
                {link.icon}
              </span>
              <span className="relative z-10 tracking-wide">{link.label}</span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-primary-400 to-accent-400 rounded-r-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-5 pb-7">
        <div className="mx-2 elegant-divider mb-5" />
        <div className="flex items-center gap-3 px-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-glow-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate tracking-wide">
              {user?.name}
            </p>
            <p className="text-[11px] text-dark-600 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-dark-500 hover:text-red-400 hover:bg-red-500/[0.06] rounded-2xl transition-gpu"
        >
          <FiLogOut className="text-base" />
          <span className="tracking-wide">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-2xl glass text-white hover:text-primary-400 transition-gpu"
      >
        <FiMenu className="text-xl" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — mobile slide-in, desktop fixed */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[270px] bg-dark-950/95 backdrop-blur-2xl border-r border-white/[0.04] flex flex-col z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-5 right-5 p-2 text-dark-400 hover:text-white transition-gpu rounded-xl hover:bg-white/[0.05]"
        >
          <FiX className="text-lg" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
