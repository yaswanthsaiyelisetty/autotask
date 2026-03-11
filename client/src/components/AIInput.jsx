import { useState } from 'react';
import { aiAPI, taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiSend, FiZap } from 'react-icons/fi';

export default function AIInput({ onTaskCreated }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const parseRes = await aiAPI.parse(message);
      const tasks = parseRes.data.tasks;

      if (!tasks || tasks.length === 0) {
        toast.error("Couldn't understand that. Try: 'Remind me to study at 8 PM'");
        return;
      }

      for (const t of tasks) {
        await taskAPI.create({
          task: t.task,
          date: t.date || new Date().toISOString().split('T')[0],
          time: t.time,
          repeat: t.repeat || 'none',
          repeatDay: t.repeatDay || null,
          priority: t.priority || 'medium',
        });
      }

      toast.success(
        `${tasks.length} task${tasks.length > 1 ? 's' : ''} created with AI!`
      );
      setMessage('');
      onTaskCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 flex items-center justify-center border border-primary-500/10">
          <FiZap className="text-primary-400 text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-serif font-semibold text-white tracking-wide">AI Quick Add</h3>
          <span className="text-[11px] text-dark-600 hidden sm:block">
            Type naturally &mdash; AI creates tasks for you
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Remind me to submit project on March 15 at 10 AM"
          className="flex-1 px-5 py-3.5 bg-dark-900/50 border border-white/[0.05] rounded-2xl text-white placeholder-dark-600 focus:outline-none focus:border-primary-500/30 transition-gpu text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="btn-shine px-5 sm:px-6 py-3.5 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 hover:from-primary-500 hover:via-primary-400 hover:to-primary-500 text-white font-medium rounded-2xl transition-gpu disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2.5 shadow-glow-sm hover:shadow-glow-md text-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiSend className="text-sm" />
          )}
        </button>
      </form>
    </div>
  );
}
