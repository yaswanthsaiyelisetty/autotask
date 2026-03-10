import { FiCheckCircle, FiClock, FiList, FiAlertTriangle } from 'react-icons/fi';

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: <FiList />,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <FiClock />,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <FiCheckCircle />,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      icon: <FiAlertTriangle />,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-dark-600 transition"
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-2xl ${card.color} ${card.bg} p-2 rounded-lg`}>
              {card.icon}
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{card.value}</p>
          <p className="text-dark-400 text-sm mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
