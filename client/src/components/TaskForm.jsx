import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    task: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    repeat: 'none',
    repeatDay: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (task) {
      setForm({
        task: task.task || '',
        date: task.date || '',
        time: task.time || '09:00',
        repeat: task.repeat || 'none',
        repeatDay: task.repeatDay || '',
        priority: task.priority || 'medium',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (!data.repeatDay) data.repeatDay = null;
    onSubmit(data);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 w-full max-w-lg animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-dark-400 hover:text-white transition"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              Task Description
            </label>
            <input
              type="text"
              name="task"
              required
              value={form.task}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition"
              placeholder="What do you need to do?"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">
                Time
              </label>
              <input
                type="time"
                name="time"
                required
                value={form.time}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition"
              />
            </div>
          </div>

          {/* Repeat & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">
                Repeat
              </label>
              <select
                name="repeat"
                value={form.repeat}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition"
              >
                <option value="none">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Repeat Day (conditional) */}
          {form.repeat === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">
                Day of Week
              </label>
              <select
                name="repeatDay"
                value={form.repeatDay}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition"
              >
                <option value="">Select day</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.repeat === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">
                Day of Month
              </label>
              <input
                type="number"
                name="repeatDay"
                min="1"
                max="31"
                value={form.repeatDay}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition"
                placeholder="1-31"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
