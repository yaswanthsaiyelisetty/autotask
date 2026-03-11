import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* Ambient background orbs — premium layered depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb w-[600px] h-[600px] bg-primary-600/[0.025] top-[-150px] right-[-100px]" />
        <div className="orb w-[500px] h-[500px] bg-accent-400/[0.015] bottom-[-100px] left-[15%]" style={{ animationDelay: '2s' }} />
        <div className="orb w-[300px] h-[300px] bg-primary-500/[0.02] top-[40%] left-[50%]" style={{ animationDelay: '4s' }} />
      </div>

      <Sidebar />
      <main className="flex-1 lg:ml-[270px] p-4 sm:p-6 lg:p-10 pt-16 lg:pt-10 min-h-screen relative">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
