import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  colorScheme = 'orange', // 'orange', 'amber', 'emerald', 'cyan', 'rose', 'purple'
  subtitle,
  sparklineType = 'bars' // 'bars' | 'wave' | 'dots'
}) => {
  const neonClasses = {
    orange: 'neon-card-orange',
    amber: 'neon-card-amber',
    cyan: 'neon-card-cyan',
    emerald: 'app-card hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    rose: 'app-card hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]',
    purple: 'app-card hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
  };

  const iconColors = {
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  };

  const barColors = {
    orange: 'from-orange-500/30 to-orange-400',
    amber: 'from-amber-500/30 to-amber-400',
    cyan: 'from-cyan-500/30 to-cyan-400',
    emerald: 'from-emerald-500/30 to-emerald-400',
    rose: 'from-rose-500/30 to-rose-400',
    purple: 'from-purple-500/30 to-purple-400'
  };

  const borderClass = neonClasses[colorScheme] || 'app-card';
  const iconStyle = iconColors[colorScheme] || iconColors.orange;
  const barStyle = barColors[colorScheme] || barColors.orange;

  return (
    <div className={`p-4 sm:p-5 ${borderClass} flex flex-col justify-between text-slate-100 transition-all duration-300 group`}>
      <div>
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider truncate text-slate-300">
            {title}
          </span>
          {Icon && (
            <div className={`p-1.5 rounded-xl border ${iconStyle} transition-transform group-hover:scale-110 duration-300`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-2">
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {value}
          </h3>
          {change && (
            <div
              className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isPositive
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-400" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mini Visual Accent */}
      <div className="mt-3 pt-2">
        {sparklineType === 'bars' && (
          <div className="flex items-end gap-1 h-5 pt-1">
            {[45, 65, 40, 80, 60, 95, 85, 100].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm bg-gradient-to-t ${barStyle}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        )}

        {sparklineType === 'wave' && (
          <div className="h-5 flex items-center">
            <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
              <path
                d="M0 14 Q 25 2, 50 12 T 100 4"
                fill="none"
                stroke={colorScheme === 'orange' ? '#f97316' : colorScheme === 'amber' ? '#f59e0b' : '#10b981'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {subtitle && (
          <p className="mt-1 text-[10.5px] text-slate-400 font-medium truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
