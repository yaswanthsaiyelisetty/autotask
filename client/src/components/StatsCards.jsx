import { FiCheckCircle, FiClock, FiList, FiAlertTriangle } from 'react-icons/fi';

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: <FiList className="text-lg" />,
      gradient: 'from-violet-500/15 via-violet-600/5 to-transparent',
      border: 'border-violet-500/15',
      iconBg: 'bg-violet-500/10 text-violet-400',
      glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <FiClock className="text-lg" />,
      gradient: 'from-amber-500/15 via-amber-600/5 to-transparent',
      border: 'border-amber-500/15',
      iconBg: 'bg-amber-500/10 text-amber-400',
      glow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <FiCheckCircle className="text-lg" />,
      gradient: 'from-emerald-500/15 via-emerald-600/5 to-transparent',
      border: 'border-emerald-500/15',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      glow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]',
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      icon: <FiAlertTriangle className="text-lg" />,
      gradient: 'from-rose-500/15 via-rose-600/5 to-transparent',
      border: 'border-rose-500/15',
      iconBg: 'bg-rose-500/10 text-rose-400',
      glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.08)]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 border ${card.border} bg-gradient-to-br ${card.gradient} backdrop-blur-sm card-lift transition-gpu ${card.glow} stagger-${i + 1}`}
        >
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-bl-full" />

          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.iconBg} mb-4`}>
            {card.icon}
          </div>
          <p className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">{card.value}</p>
          <p className="text-dark-500 text-[11px] mt-1.5 uppercase tracking-[0.15em] font-medium">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
