import React, { useMemo } from 'react';
import { FilterUsageRow } from '../types';
import { Monitor, Smartphone, Globe, MapPin } from 'lucide-react';

interface UsageBreakdownProps {
  data: FilterUsageRow[];
}

export const UsageBreakdown: React.FC<UsageBreakdownProps> = ({ data }) => {
  const stats = useMemo(() => {
    let desktopEvents = 0;
    let mobileEvents = 0;
    let domesticEvents = 0;
    let internationalEvents = 0;
    let totalEvents = 0;

    data.forEach((r) => {
      totalEvents += r.event_count;
      if (r.device_category === 'desktop') {
        desktopEvents += r.event_count;
      } else {
        mobileEvents += r.event_count;
      }

      if (r.trip_type === 'domestic') {
        domesticEvents += r.event_count;
      } else {
        internationalEvents += r.event_count;
      }
    });

    const desktopPct = totalEvents > 0 ? (desktopEvents / totalEvents) * 100 : 0;
    const mobilePct = totalEvents > 0 ? (mobileEvents / totalEvents) * 100 : 0;

    const domesticPct = totalEvents > 0 ? (domesticEvents / totalEvents) * 100 : 0;
    const internationalPct = totalEvents > 0 ? (internationalEvents / totalEvents) * 100 : 0;

    return {
      totalEvents,
      desktopEvents,
      mobileEvents,
      desktopPct: Number(desktopPct.toFixed(1)),
      mobilePct: Number(mobilePct.toFixed(1)),
      domesticEvents,
      internationalEvents,
      domesticPct: Number(domesticPct.toFixed(1)),
      internationalPct: Number(internationalPct.toFixed(1)),
    };
  }, [data]);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
    return num.toLocaleString('es-AR');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Device Breakdown Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-slate-500" />
              Distribución por Dispositivo
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {formatNumber(stats.totalEvents)} usos
            </span>
          </div>

          {/* Device Progress Bar */}
          <div className="mt-3">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-[#3069F6] transition-all duration-500"
                style={{ width: `${stats.desktopPct}%` }}
                title={`Desktop: ${stats.desktopPct}%`}
              />
              <div
                className="bg-[#5C93F9] transition-all duration-500"
                style={{ width: `${stats.mobilePct}%` }}
                title={`Mobile: ${stats.mobilePct}%`}
              />
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 gap-3 mt-3 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-medium text-[#2D384C]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#3069F6] inline-block"></span>
                  Desktop
                </span>
                <span className="font-bold text-[#3069F6] font-mono">{stats.desktopPct}%</span>
              </div>
              <div className="text-sm font-bold text-[#2D384C] font-mono">
                {stats.desktopEvents.toLocaleString('es-AR')}
              </div>
              <div className="text-[10px] text-slate-400">event_count</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-medium text-[#2D384C]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#5C93F9] inline-block"></span>
                  Mobile
                </span>
                <span className="font-bold text-[#3069F6] font-mono">{stats.mobilePct}%</span>
              </div>
              <div className="text-sm font-bold text-[#2D384C] font-mono">
                {stats.mobileEvents.toLocaleString('es-AR')}
              </div>
              <div className="text-[10px] text-slate-400">event_count</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Type Breakdown Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              Distribución por Mercado / Viaje
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {formatNumber(stats.totalEvents)} usos
            </span>
          </div>

          {/* Trip Type Progress Bar */}
          <div className="mt-3">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-[#0D47A1] transition-all duration-500"
                style={{ width: `${stats.internationalPct}%` }}
                title={`Internacional: ${stats.internationalPct}%`}
              />
              <div
                className="bg-[#FEBB02] transition-all duration-500"
                style={{ width: `${stats.domesticPct}%` }}
                title={`Doméstico: ${stats.domesticPct}%`}
              />
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 gap-3 mt-3 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-medium text-[#2D384C]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#0D47A1] inline-block"></span>
                  Internacional
                </span>
                <span className="font-bold text-[#0D47A1] font-mono">{stats.internationalPct}%</span>
              </div>
              <div className="text-sm font-bold text-[#2D384C] font-mono">
                {stats.internationalEvents.toLocaleString('es-AR')}
              </div>
              <div className="text-[10px] text-slate-400">event_count</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-medium text-[#2D384C]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#FEBB02] inline-block"></span>
                  Doméstico
                </span>
                <span className="font-bold text-[#B38300] font-mono">{stats.domesticPct}%</span>
              </div>
              <div className="text-sm font-bold text-[#2D384C] font-mono">
                {stats.domesticEvents.toLocaleString('es-AR')}
              </div>
              <div className="text-[10px] text-slate-400">event_count</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
