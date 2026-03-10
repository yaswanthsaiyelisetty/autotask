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
      // Step 1: Parse with AI
      const parseRes = await aiAPI.parse(message);
      const tasks = parseRes.data.tasks;

      if (!tasks || tasks.length === 0) {
        toast.error("Couldn't understand that. Try: 'Remind me to study at 8 PM'");
        return;
      }

      // Step 2: Create each task
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
    <div className="bg-dark-800 rounded-xl p-5 border border-dark-700">
      <div className="flex items-center gap-2 mb-3">
        <FiZap className="text-primary-400" />
        <h3 className="text-sm font-semibold text-white">AI Quick Add</h3>
        <span className="text-xs text-dark-500">
          Type naturally and AI creates tasks for you
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Remind me to submit project on March 15 at 10 AM"
          className="flex-1 px-4 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiSend />
          )}
        </button>
      </form>
    </div>
  );
}
