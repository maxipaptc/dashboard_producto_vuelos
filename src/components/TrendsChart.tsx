import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { FlightMetricRow, MONTH_NAMES } from '../types';

interface TrendsChartProps {
  data: FlightMetricRow[];
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'all' | 'device' | 'trip_type'>('all');

  // Aggregate by Month
  const chartData = useMemo(() => {
    const monthMap = new Map<
      number,
      {
        mes: number;
        label: string;
        searches: number;
        clicks: number;
        desktopSearches: number;
        desktopClicks: number;
        mobileSearches: number;
        mobileClicks: number;
        domesticSearches: number;
        domesticClicks: number;
        internationalSearches: number;
        internationalClicks: number;
      }
    >();

    data.forEach((row) => {
      const existing = monthMap.get(row.mes) || {
        mes: row.mes,
        label: MONTH_NAMES[row.mes] || `M${row.mes}`,
        searches: 0,
        clicks: 0,
        desktopSearches: 0,
        desktopClicks: 0,
        mobileSearches: 0,
        mobileClicks: 0,
        domesticSearches: 0,
        domesticClicks: 0,
        internationalSearches: 0,
        internationalClicks: 0,
      };

      existing.searches += row.search;
      existing.clicks += row.click_flight;

      if (row.device_category === 'desktop') {
        existing.desktopSearches += row.search;
        existing.desktopClicks += row.click_flight;
      } else {
        existing.mobileSearches += row.search;
        existing.mobileClicks += row.click_flight;
      }

      if (row.trip_type === 'domestic') {
        existing.domesticSearches += row.search;
        existing.domesticClicks += row.click_flight;
      } else {
        existing.internationalSearches += row.search;
        existing.internationalClicks += row.click_flight;
      }

      monthMap.set(row.mes, existing);
    });

    return Array.from(monthMap.values())
      .sort((a, b) => a.mes - b.mes)
      .map((item) => {
        const ctr = item.searches > 0 ? Number(((item.clicks / item.searches) * 100).toFixed(2)) : 0;
        const desktopCtr =
          item.desktopSearches > 0
            ? Number(((item.desktopClicks / item.desktopSearches) * 100).toFixed(2))
            : 0;
        const mobileCtr =
          item.mobileSearches > 0
            ? Number(((item.mobileClicks / item.mobileSearches) * 100).toFixed(2))
            : 0;
        const domesticCtr =
          item.domesticSearches > 0
            ? Number(((item.domesticClicks / item.domesticSearches) * 100).toFixed(2))
            : 0;
        const internationalCtr =
          item.internationalSearches > 0
            ? Number(((item.internationalClicks / item.internationalSearches) * 100).toFixed(2))
            : 0;

        return {
          ...item,
          ctr,
          desktopCtr,
          mobileCtr,
          domesticCtr,
          internationalCtr,
        };
      });
  }, [data]);

  const formatNumber = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
    return val.toString();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#2D384C]">
            Evolución mensual
          </h3>
          <p className="text-xs text-slate-500">
            Search, Click_flight y CTR (%)
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
          <button
            id="view-mode-all"
            onClick={() => setViewMode('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMode === 'all'
                ? 'bg-[#3069F6] text-white font-medium shadow-2xs'
                : 'text-slate-600 hover:text-[#0D47A1]'
            }`}
          >
            General
          </button>
          <button
            id="view-mode-device"
            onClick={() => setViewMode('device')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMode === 'device'
                ? 'bg-[#3069F6] text-white font-medium shadow-2xs'
                : 'text-slate-600 hover:text-[#0D47A1]'
            }`}
          >
            CTR Device
          </button>
          <button
            id="view-mode-trip"
            onClick={() => setViewMode('trip_type')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              viewMode === 'trip_type'
                ? 'bg-[#3069F6] text-white font-medium shadow-2xs'
                : 'text-slate-600 hover:text-[#0D47A1]'
            }`}
          >
            CTR Trip_type
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            Sin datos para los filtros seleccionados
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              
              {/* Left axis: Volumes (in 'all' mode) */}
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={formatNumber}
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                hide={viewMode !== 'all'}
              />

              {/* Right axis: CTR % */}
              <YAxis
                yAxisId="right"
                orientation={viewMode === 'all' ? 'right' : 'left'}
                unit="%"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15) || 30]}
                tick={{ fontSize: 11, fill: '#2D384C' }}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-[#2D384C] text-white p-3 rounded-xl shadow-lg text-xs space-y-1 font-mono border border-slate-700/60">
                        <div className="font-bold border-b border-slate-600/70 pb-1 text-slate-200">
                          {label}
                        </div>
                        {viewMode === 'all' && (
                          <>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Search:</span>
                              <span className="font-bold">{item.searches.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Click_flight:</span>
                              <span className="font-bold">{item.clicks.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between gap-4 pt-1 border-t border-slate-600/70">
                              <span className="text-[#FEBB02] font-bold">CTR:</span>
                              <span className="font-bold text-white">{item.ctr}%</span>
                            </div>
                          </>
                        )}
                        {viewMode === 'device' && (
                          <>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Desktop CTR:</span>
                              <span className="font-bold text-[#3069F6]">{item.desktopCtr}%</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Mobile CTR:</span>
                              <span className="font-bold text-slate-300">{item.mobileCtr}%</span>
                            </div>
                          </>
                        )}
                        {viewMode === 'trip_type' && (
                          <>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">Domestic CTR:</span>
                              <span className="font-bold text-[#3069F6]">{item.domesticCtr}%</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-300">International CTR:</span>
                              <span className="font-bold text-slate-300">{item.internationalCtr}%</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="rect"
              />

              {viewMode === 'all' && (
                <>
                  <Bar
                    yAxisId="left"
                    dataKey="searches"
                    name="Search"
                    fill="#CBD5E1"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="clicks"
                    name="Click_flight"
                    fill="#0D47A1"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="ctr"
                    name="CTR (%)"
                    stroke="#3069F6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3069F6', r: 3.5, stroke: '#FFFFFF', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#3069F6', stroke: '#BFDBFE', strokeWidth: 2 }}
                  />
                </>
              )}

              {viewMode === 'device' && (
                <>
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="desktopCtr"
                    name="Desktop CTR (%)"
                    stroke="#3069F6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3069F6', r: 3.5, stroke: '#FFFFFF', strokeWidth: 1.5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="mobileCtr"
                    name="Mobile CTR (%)"
                    stroke="#64748B"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ fill: '#64748B', r: 3 }}
                  />
                </>
              )}

              {viewMode === 'trip_type' && (
                <>
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="domesticCtr"
                    name="Domestic CTR (%)"
                    stroke="#3069F6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3069F6', r: 3.5, stroke: '#FFFFFF', strokeWidth: 1.5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="internationalCtr"
                    name="International CTR (%)"
                    stroke="#64748B"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ fill: '#64748B', r: 3 }}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
