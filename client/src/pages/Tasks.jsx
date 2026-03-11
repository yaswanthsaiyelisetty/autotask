import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import toast from 'react-hot-toast';
import { FiPlus, FiFilter, FiInbox } from 'react-icons/fi';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '' });

  const fetchTasks = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.priority) params.priority = filter.priority;

      const res = await taskAPI.getAll(params);
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleCreate = async (data) => {
    try {
      await taskAPI.create(data);
      toast.success('Task created!');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await taskAPI.update(editingTask._id, data);
      toast.success('Task updated!');
      setEditingTask(null);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleComplete = async (id) => {
    try {
      await taskAPI.complete(id);
      toast.success('Task completed!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to complete task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const selectCls =
    'bg-dark-900/50 border border-white/[0.05] text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary-500/30 transition-gpu';

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-accent-400 text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">Manage</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-dark-500 mt-1.5 text-sm font-light">Organize and track your work</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="btn-shine flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 hover:from-primary-500 hover:via-primary-400 hover:to-primary-500 text-white font-medium rounded-2xl transition-gpu shadow-glow-sm hover:shadow-glow-md text-sm"
        >
          <FiPlus className="text-sm" /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-dark-800/50 flex items-center justify-center border border-white/[0.04]">
            <FiFilter className="text-dark-500 text-xs" />
          </div>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className={selectCls}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
          </select>
        </div>
        <select
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          className={selectCls}
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* Task List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass rounded-2xl p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
          <div className="w-16 h-16 rounded-2xl bg-dark-800/50 flex items-center justify-center mx-auto mb-5 border border-white/[0.04]">
            <FiInbox className="text-dark-600 text-2xl" />
          </div>
          <p className="text-dark-400 font-serif font-medium text-lg">No tasks found</p>
          <p className="text-dark-600 text-sm mt-2 font-light">
            Create your first task to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
