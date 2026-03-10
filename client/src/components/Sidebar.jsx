import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiCheckSquare,
  FiUser,
  FiLogOut,
  FiZap,
} from 'react-icons/fi';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/tasks', label: 'Tasks', icon: <FiCheckSquare /> },
  { to: '/profile', label: 'Profile', icon: <FiUser /> },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-800 border-r border-dark-700 flex flex-col z-20">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FiZap className="text-primary-500" />
          Auto<span className="text-primary-500">Task</span>
        </h1>
        <p className="text-xs text-dark-500 mt-1">AI-Powered Automation</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-600/15 text-primary-400 border border-primary-500/20'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-dark-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-dark-400 hover:text-red-400 hover:bg-dark-700 rounded-lg transition"
        >
          <FiLogOut />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
