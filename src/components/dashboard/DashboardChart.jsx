import React, { useState } from 'react';
import { LineChart } from 'lucide-react';

const DashboardChart = ({ surveys }) => {
  const [chartPeriod, setChartPeriod] = useState('week');

  const getChartData = () => {
    const chartData = [];

    if (chartPeriod === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const count = surveys.filter(s => s.created === dateStr).length;
        chartData.push({ label: date.toLocaleDateString('de-DE', { weekday: 'short' }), count });
      }
    } else if (chartPeriod === 'month') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toISOString().slice(0, 7);
        const count = surveys.filter(s => s.created?.startsWith(monthStr)).length;
        chartData.push({ label: date.toLocaleDateString('de-DE', { month: 'short' }), count });
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        const year = new Date().getFullYear() - i;
        const count = surveys.filter(s => s.created?.startsWith(year.toString())).length;
        chartData.push({ label: year.toString(), count });
      }
    }

    return chartData;
  };

  const chartData = getChartData();
  const maxCount = Math.max(...chartData.map(d => d.count)) || 1;

  return (
    <div className="card-dark p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-3 font-['Syne'] text-lg font-bold">
          <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center">
            <LineChart className="h-5 w-5 text-[#00D4FF]" />
          </div>
          Test-Verlauf
        </h3>
        <div className="flex rounded-lg border border-white/10 bg-[#1A1A1D] p-1">
          {['week', 'month', 'year'].map(p => (
            <button
              key={p}
              onClick={() => setChartPeriod(p)}
              className={"rounded-md px-3 py-1.5 text-xs font-medium transition-all " + (chartPeriod === p ? 'bg-[#FF6B35] text-[#0A0A0B]' : 'text-white/50 hover:text-white')}
            >
              {p === 'week' ? 'Woche' : p === 'month' ? 'Monate' : 'Jahre'}
            </button>
          ))}
        </div>
      </div>
      <div className="h-48">
        {surveys.length > 0 ? (
          <div className="flex h-full items-end justify-between gap-2 px-4">
            {chartData.map((d, idx) => {
              const height = d.count > 0 ? Math.max((d.count / maxCount) * 100, 10) : 5;
              return (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full flex justify-center">
                    {d.count > 0 && (
                      <span className="absolute -top-6 text-xs font-bold text-[#FF6B35]">{d.count}</span>
                    )}
                    <div
                      className={"w-full max-w-[40px] rounded-t-lg transition-all " + (d.count > 0 ? 'bg-gradient-to-t from-[#FF6B35] to-[#FF8C5A]' : 'bg-white/10')}
                      style={{ height: `${height}%`, minHeight: '8px' }}
                    />
                  </div>
                  <span className="text-xs text-white/40">{d.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            <div className="text-center">
              <LineChart className="mx-auto mb-2 h-10 w-10 opacity-50" />
              <p className="text-sm">Noch keine Daten</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardChart;
