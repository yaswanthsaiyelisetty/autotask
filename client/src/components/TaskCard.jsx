import {
  FiCheck,
  FiTrash2,
  FiEdit2,
  FiClock,
  FiCalendar,
  FiRepeat,
} from 'react-icons/fi';

const priorityAccent = {
  high: 'border-l-rose-400',
  medium: 'border-l-amber-400',
  low: 'border-l-emerald-400',
};

const priorityBadge = {
  high: 'bg-rose-500/10 text-rose-400 border-rose-500/10',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/10',
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10',
};

const statusBadge = {
  pending: 'bg-violet-500/10 text-violet-400 border-violet-500/10',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10',
  missed: 'bg-rose-500/10 text-rose-400 border-rose-500/10',
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
      className={`glass rounded-2xl border-l-[3px] ${priorityAccent[task.priority]} p-5 card-lift transition-gpu relative overflow-hidden ${
        isCompleted ? 'opacity-40' : ''
      }`}
    >
      {/* Subtle top highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3
            className={`text-[15px] font-medium leading-snug tracking-wide ${
              isCompleted ? 'line-through text-dark-500' : 'text-white'
            }`}
          >
            {task.task}
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-dark-500 font-light">
              <FiClock className="text-[10px] text-dark-600" />
              {formatTime12h(task.time)}
            </span>

            {task.date && (
              <span className="flex items-center gap-1.5 text-xs text-dark-500 font-light">
                <FiCalendar className="text-[10px] text-dark-600" />
                {task.date}
              </span>
            )}

            {task.repeat !== 'none' && (
              <span className="flex items-center gap-1.5 text-xs text-dark-500 font-light">
                <FiRepeat className="text-[10px] text-dark-600" />
                {task.repeat}
                {task.repeatDay ? ` (${task.repeatDay})` : ''}
              </span>
            )}

            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-[0.1em] border ${priorityBadge[task.priority]}`}
            >
              {task.priority}
            </span>

            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-[0.1em] border ${statusBadge[task.status]}`}
            >
              {task.status}
            </span>

            {task.source === 'whatsapp' && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold uppercase tracking-[0.1em] border border-emerald-500/10">
                WhatsApp
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isCompleted && (
            <button
              onClick={() => onComplete(task._id)}
              className="p-2.5 text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-gpu"
              title="Mark complete"
            >
              <FiCheck className="text-sm" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-2.5 text-violet-400 hover:bg-violet-500/10 rounded-xl transition-gpu"
              title="Edit"
            >
              <FiEdit2 className="text-sm" />
            </button>
          )}
          <button
            onClick={() => onDelete(task._id)}
            className="p-2.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-gpu"
            title="Delete"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
