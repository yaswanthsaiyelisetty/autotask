import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import StatsCards from '../components/StatsCards';
import TodayTasks from '../components/TodayTasks';
import AIInput from '../components/AIInput';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, highPriority: 0 });
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, todayRes] = await Promise.all([
        taskAPI.getStats(),
        taskAPI.getToday(),
      ]);
      setStats(statsRes.data);
      setTodayTasks(todayRes.data.tasks);
    } catch (err) {
      console.error('Dashboard load error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleComplete = async (id) => {
    try {
      await taskAPI.complete(id);
      toast.success('Task completed!');
      fetchData();
    } catch (err) {
      toast.error('Failed to complete task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Hero Header */}
      <div>
        <p className="text-accent-400 text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">Dashboard</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
          {greeting()},{' '}
          <span className="text-gradient italic">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-dark-500 mt-2 text-sm font-light">
          Here's what's happening with your tasks today.
        </p>
        <div className="elegant-divider w-16 mt-4" />
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* AI Quick Add */}
      <AIInput onTaskCreated={fetchData} />

      {/* Today's Tasks */}
      <TodayTasks
        tasks={todayTasks}
        onComplete={handleComplete}
        onDelete={handleDelete}
      />
    </div>
  );
}
