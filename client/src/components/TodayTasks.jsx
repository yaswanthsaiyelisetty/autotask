import TaskCard from './TaskCard';
import { FiSun, FiInbox } from 'react-icons/fi';

export default function TodayTasks({ tasks, onComplete, onDelete }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl bg-accent-500/10 flex items-center justify-center border border-accent-500/10">
          <FiSun className="text-accent-400 text-sm" />
        </div>
        <h2 className="text-lg font-serif font-semibold text-white tracking-wide">Today's Tasks</h2>
        <span className="text-[11px] text-dark-600 bg-dark-800/60 px-2.5 py-1 rounded-full border border-white/[0.04]">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
          <div className="w-14 h-14 rounded-2xl bg-dark-800/60 flex items-center justify-center mx-auto mb-4 border border-white/[0.04]">
            <FiInbox className="text-dark-600 text-xl" />
          </div>
          <p className="text-dark-400 text-sm font-serif">No tasks for today</p>
          <p className="text-dark-600 text-xs mt-1.5 font-light">
            Enjoy your free time or add a new task
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
