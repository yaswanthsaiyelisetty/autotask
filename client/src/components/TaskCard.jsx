import {
  FiCheck,
  FiTrash2,
  FiEdit2,
  FiClock,
  FiCalendar,
  FiRepeat,
} from 'react-icons/fi';

const priorityStyles = {
  high: 'border-l-red-500 bg-red-500/5',
  medium: 'border-l-yellow-500 bg-yellow-500/5',
  low: 'border-l-green-500 bg-green-500/5',
};

const priorityBadge = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400',
};

const statusBadge = {
  pending: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  missed: 'bg-red-500/20 text-red-400',
};

function formatTime12h(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

export default function TaskCard({ task, onComplete, onDelete, onEdit }) {
  const isCompleted = task.status === 'completed';

  return (
    <div
      className={`bg-dark-800 rounded-xl border border-dark-700 border-l-4 ${
        priorityStyles[task.priority]
      } p-4 hover:border-dark-600 transition animate-slideIn ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-medium ${
              isCompleted ? 'line-through text-dark-400' : 'text-white'
            }`}
          >
            {task.task}
          </h3>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Time */}
            <span className="flex items-center gap-1 text-sm text-dark-400">
              <FiClock className="text-xs" />
              {formatTime12h(task.time)}
            </span>

            {/* Date */}
            {task.date && (
              <span className="flex items-center gap-1 text-sm text-dark-400">
                <FiCalendar className="text-xs" />
                {task.date}
              </span>
            )}

            {/* Repeat */}
            {task.repeat !== 'none' && (
              <span className="flex items-center gap-1 text-sm text-dark-400">
                <FiRepeat className="text-xs" />
                {task.repeat}
                {task.repeatDay ? ` (${task.repeatDay})` : ''}
              </span>
            )}

            {/* Priority badge */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                priorityBadge[task.priority]
              }`}
            >
              {task.priority}
            </span>

            {/* Status badge */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                statusBadge[task.status]
              }`}
            >
              {task.status}
            </span>

            {/* Source */}
            {task.source === 'whatsapp' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                WhatsApp
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!isCompleted && (
            <button
              onClick={() => onComplete(task._id)}
              className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition"
              title="Mark complete"
            >
              <FiCheck />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
              title="Edit"
            >
              <FiEdit2 />
            </button>
          )}
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
