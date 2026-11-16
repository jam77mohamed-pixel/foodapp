import React, { useState } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const RevenueChart = ({ totalRevenue = 14850.50 }) => {
  const [timeRange, setTimeRange] = useState('weekly');

  const weeklyData = [
    { label: 'Mon', value: 1650, orders: 42 },
    { label: 'Tue', value: 2100, orders: 58 },
    { label: 'Wed', value: 1850, orders: 50 },
    { label: 'Thu', value: 2400, orders: 66 },
    { label: 'Fri', value: 3200, orders: 89 },
    { label: 'Sat', value: 3950, orders: 110 },
    { label: 'Sun', value: 3450, orders: 95 }
  ];

  const monthlyData = [
    { label: 'Week 1', value: 12400, orders: 340 },
    { label: 'Week 2', value: 14600, orders: 395 },
    { label: 'Week 3', value: 13900, orders: 380 },
    { label: 'Week 4', value: 16800, orders: 450 }
  ];

  const data = timeRange === 'weekly' ? weeklyData : monthlyData;
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="rounded-3xl bg-[#18181b]/95 border border-neutral-800 p-5 sm:p-7 relative overflow-hidden shadow-2xl">
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <DollarSign className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              Revenue & Order Growth
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time financial performance across all restaurant partners
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900 border border-neutral-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeRange === 'weekly'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeRange === 'monthly'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly View
          </button>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/80">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Gross Sales</p>
          <p className="text-base sm:text-lg font-black text-white mt-0.5">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Avg Order Value</p>
          <p className="text-base sm:text-lg font-black text-orange-400 mt-0.5">
            $32.40
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Growth Rate</p>
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs sm:text-sm mt-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4%</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Peak Delivery Hour</p>
          <p className="text-base sm:text-lg font-black text-amber-400 mt-0.5">
            7:30 PM - 9 PM
          </p>
        </div>
      </div>

      {/* Interactive Bar Chart Visualization */}
      <div className="h-48 sm:h-56 flex items-end gap-2 sm:gap-4 pt-6 px-2">
        {data.map((bar, idx) => {
          const heightPercent = Math.round((bar.value / maxValue) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center pointer-events-none pb-1">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-neutral-800 text-white border border-neutral-700 whitespace-nowrap shadow-md">
                  {formatCurrency(bar.value)} ({bar.orders} orders)
                </span>
              </div>

              {/* Bar */}
              <div className="w-full bg-neutral-800/60 rounded-xl overflow-hidden flex flex-col justify-end h-full">
                <div
                  className="w-full rounded-xl bg-gradient-to-t from-orange-600 via-orange-500 to-amber-400 group-hover:brightness-125 transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Label */}
              <span className="text-[11px] font-bold text-slate-400 group-hover:text-orange-400 transition-colors">
                {bar.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
