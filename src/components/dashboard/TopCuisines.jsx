import React from 'react';
import { Flame } from 'lucide-react';

export const TopCuisines = ({ restaurants = [] }) => {
  // Aggregate restaurants per cuisine
  const cuisineCounts = restaurants.reduce((acc, r) => {
    const c = r.cuisine || 'Other';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const total = restaurants.length || 1;

  const topList = Object.entries(cuisineCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cuisine, count]) => ({
      name: cuisine,
      count,
      percent: Math.round((count / total) * 100)
    }));

  const colors = [
    'from-orange-500 to-amber-400',
    'from-amber-400 to-yellow-400',
    'from-rose-500 to-orange-400',
    'from-emerald-500 to-teal-400',
    'from-cyan-500 to-blue-400'
  ];

  return (
    <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-5 sm:p-7 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Flame className="w-4 h-4" />
          </span>
          <h3 className="text-lg font-black text-white tracking-tight">
            Popular Cuisines
          </h3>
        </div>
        <span className="text-xs text-orange-400 font-bold">Market Share</span>
      </div>

      <p className="text-xs text-slate-400">
        Breakdown of customer orders and restaurant catalog variety
      </p>

      <div className="space-y-3 pt-2">
        {topList.map((item, idx) => (
          <div key={item.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-white">{item.name}</span>
              <span className="text-slate-400">{item.count} places ({item.percent}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${colors[idx % colors.length]}`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
