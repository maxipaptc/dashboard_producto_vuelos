import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FilterUsageRow, MONTH_NAMES } from '../types';

interface UsageTrendsChartProps {
  data: FilterUsageRow[];
}

export const UsageTrendsChart: React.FC<UsageTrendsChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const monthMap = new Map<number, { mes: number; totalEvents: number; desktopEvents: number; mobileEvents: number }>();

    data.forEach((r) => {
      const existing = monthMap.get(r.mes) || {
        mes: r.mes,
        totalEvents: 0,
        desktopEvents: 0,
        mobileEvents: 0,
      };

      existing.totalEvents += r.event_count;
      if (r.device_category === 'desktop') {
        existing.desktopEvents += r.event_count;
      } else {
        existing.mobileEvents += r.event_count;
      }

      monthMap.set(r.mes, existing);
    });

    return Array.from(monthMap.values())
      .sort((a, b) => a.mes - b.mes)
      .map((item) => ({
        ...item,
        monthName: MONTH_NAMES[item.mes] || `M${item.mes}`,
      }));
  }, [data]);

  const totalFilteredEvents = useMemo(() => {
    return data.reduce((acc, r) => acc + r.event_count, 0);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-5 text-center text-xs text-neutral-500">
        No hay datos de uso para los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-[#2D384C]">
            Evolución Mensual de Uso (Event Count)
          </h2>
          <p className="text-xs text-slate-500">
            Total de interacciones registradas con filtros por mes
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-3 h-3 rounded-xs bg-[#3069F6] inline-block"></span>
            <span>Desktop</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-3 h-3 rounded-xs bg-[#5C93F9] inline-block"></span>
            <span>Mobile</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px] hidden md:inline">
            Total: {totalFilteredEvents.toLocaleString('es-AR')} usos
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="monthName"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              tickFormatter={(v) => {
                if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
                return v;
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  const total = d.totalEvents;
                  const dPct = total > 0 ? ((d.desktopEvents / total) * 100).toFixed(1) : 0;
                  const mPct = total > 0 ? ((d.mobileEvents / total) * 100).toFixed(1) : 0;
                  return (
                    <div className="bg-[#2D384C] text-white text-xs p-3 rounded-xl shadow-xl space-y-1.5 border border-slate-600 min-w-44">
                      <div className="font-bold border-b border-slate-600 pb-1 flex justify-between">
                        <span>{d.monthName} (Mes {d.mes})</span>
                        <span className="text-[#FEBB02] font-mono">{d.totalEvents.toLocaleString('es-AR')} usos</span>
                      </div>
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#3069F6]"></span>
                          Desktop:
                        </span>
                        <span className="font-mono">{d.desktopEvents.toLocaleString('es-AR')} ({dPct}%)</span>
                      </div>
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#5C93F9]"></span>
                          Mobile:
                        </span>
                        <span className="font-mono">{d.mobileEvents.toLocaleString('es-AR')} ({mPct}%)</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="desktopEvents" stackId="a" fill="#3069F6" radius={[0, 0, 0, 0]} name="Desktop" />
            <Bar dataKey="mobileEvents" stackId="a" fill="#5C93F9" radius={[4, 4, 0, 0]} name="Mobile" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
