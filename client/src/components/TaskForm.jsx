import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const inputCls =
  'w-full px-4 py-3.5 bg-dark-900/50 border border-white/[0.05] rounded-2xl text-white placeholder-dark-600 focus:outline-none focus:border-primary-500/30 transition-gpu text-sm';
const labelCls =
  'block text-[11px] font-medium text-dark-400 mb-2.5 uppercase tracking-[0.15em]';

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-7 w-full max-w-lg animate-scale-in relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/25 to-transparent" />

        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-xl font-serif font-bold text-white tracking-tight">
              {task ? 'Edit Task' : 'New Task'}
            </h2>
            <p className="text-dark-600 text-xs mt-1 font-light">Fill in the details below</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2.5 text-dark-500 hover:text-white rounded-xl hover:bg-white/[0.05] transition-gpu"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelCls}>Task Description</label>
            <input
              type="text"
              name="task"
              required
              value={form.task}
              onChange={handleChange}
              className={inputCls}
              placeholder="What do you need to do?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Time</label>
              <input
                type="time"
                name="time"
                required
                value={form.time}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Repeat</label>
              <select
                name="repeat"
                value={form.repeat}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="none">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {form.repeat === 'weekly' && (
            <div>
              <label className={labelCls}>Day of Week</label>
              <select
                name="repeatDay"
                value={form.repeatDay}
                onChange={handleChange}
                className={inputCls}
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
              <label className={labelCls}>Day of Month</label>
              <input
                type="number"
                name="repeatDay"
                min="1"
                max="31"
                value={form.repeatDay}
                onChange={handleChange}
                className={inputCls}
                placeholder="1-31"
              />
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3.5 bg-dark-800/60 hover:bg-dark-800 text-dark-300 font-medium rounded-2xl transition-gpu text-sm border border-white/[0.04]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shine flex-1 py-3.5 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 hover:from-primary-500 hover:via-primary-400 hover:to-primary-500 text-white font-semibold rounded-2xl transition-gpu shadow-glow-sm hover:shadow-glow-md text-sm"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
