import TaskCard from './TaskCard';
import { FiSun } from 'react-icons/fi';

export default function TodayTasks({ tasks, onComplete, onDelete }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FiSun className="text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">Today's Tasks</h2>
        <span className="text-dark-400 text-sm">({tasks.length})</span>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 text-center">
          <p className="text-dark-400">No tasks for today 🎉</p>
          <p className="text-dark-500 text-sm mt-1">
            Enjoy your free time or add a new task!
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
