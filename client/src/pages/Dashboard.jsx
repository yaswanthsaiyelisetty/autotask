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
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-dark-400 mt-1">
          Here's what's happening with your tasks today.
        </p>
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
