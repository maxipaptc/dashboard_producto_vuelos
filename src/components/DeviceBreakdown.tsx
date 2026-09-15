import React, { useMemo } from 'react';
import { FlightMetricRow } from '../types';

interface DeviceBreakdownProps {
  data: FlightMetricRow[];
}

export const DeviceBreakdown: React.FC<DeviceBreakdownProps> = ({ data }) => {
  // 1. Device metrics
  const deviceStats = useMemo(() => {
    let desktopSearches = 0;
    let desktopClicks = 0;
    let mobileSearches = 0;
    let mobileClicks = 0;
    let totalSearches = 0;
    let totalClicks = 0;

    data.forEach((row) => {
      totalSearches += row.search;
      totalClicks += row.click_flight;
      if (row.device_category === 'desktop') {
        desktopSearches += row.search;
        desktopClicks += row.click_flight;
      } else {
        mobileSearches += row.search;
        mobileClicks += row.click_flight;
      }
    });

    const desktopCtr = desktopSearches > 0 ? Number(((desktopClicks / desktopSearches) * 100).toFixed(2)) : 0;
    const mobileCtr = mobileSearches > 0 ? Number(((mobileClicks / mobileSearches) * 100).toFixed(2)) : 0;
    const desktopSearchShare = totalSearches > 0 ? Number(((desktopSearches / totalSearches) * 100).toFixed(1)) : 0;
    const mobileSearchShare = totalSearches > 0 ? Number(((mobileSearches / totalSearches) * 100).toFixed(1)) : 0;
    const desktopClickShare = totalClicks > 0 ? Number(((desktopClicks / totalClicks) * 100).toFixed(1)) : 0;
    const mobileClickShare = totalClicks > 0 ? Number(((mobileClicks / totalClicks) * 100).toFixed(1)) : 0;

    return {
      desktop: {
        searches: desktopSearches,
        clicks: desktopClicks,
        ctr: desktopCtr,
        searchShare: desktopSearchShare,
        clickShare: desktopClickShare,
      },
      mobile: {
        searches: mobileSearches,
        clicks: mobileClicks,
        ctr: mobileCtr,
        searchShare: mobileSearchShare,
        clickShare: mobileClickShare,
      },
    };
  }, [data]);

  // 2. Trip Type metrics
  const tripStats = useMemo(() => {
    let domesticSearches = 0;
    let domesticClicks = 0;
    let internationalSearches = 0;
    let internationalClicks = 0;
    let totalSearches = 0;
    let totalClicks = 0;

    data.forEach((row) => {
      totalSearches += row.search;
      totalClicks += row.click_flight;
      if (row.trip_type === 'domestic') {
        domesticSearches += row.search;
        domesticClicks += row.click_flight;
      } else {
        internationalSearches += row.search;
        internationalClicks += row.click_flight;
      }
    });

    const domesticCtr = domesticSearches > 0 ? Number(((domesticClicks / domesticSearches) * 100).toFixed(2)) : 0;
    const internationalCtr =
      internationalSearches > 0
        ? Number(((internationalClicks / internationalSearches) * 100).toFixed(2))
        : 0;
    const domesticSearchShare = totalSearches > 0 ? Number(((domesticSearches / totalSearches) * 100).toFixed(1)) : 0;
    const internationalSearchShare =
      totalSearches > 0 ? Number(((internationalSearches / totalSearches) * 100).toFixed(1)) : 0;
    const domesticClickShare = totalClicks > 0 ? Number(((domesticClicks / totalClicks) * 100).toFixed(1)) : 0;
    const internationalClickShare =
      totalClicks > 0 ? Number(((internationalClicks / totalClicks) * 100).toFixed(1)) : 0;

    return {
      domestic: {
        searches: domesticSearches,
        clicks: domesticClicks,
        ctr: domesticCtr,
        searchShare: domesticSearchShare,
        clickShare: domesticClickShare,
      },
      international: {
        searches: internationalSearches,
        clicks: internationalClicks,
        ctr: internationalCtr,
        searchShare: internationalSearchShare,
        clickShare: internationalClickShare,
      },
    };
  }, [data]);

  const formatNumber = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}k`;
    return val.toLocaleString('es-AR');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* CARD 1: Device */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Dispositivo
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Desktop vs Mobile
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            
            {/* Desktop */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D384C]">Desktop</span>
                <span className="text-[11px] font-mono text-[#0D47A1] bg-blue-50 border border-[#3069F6]/30 px-1.5 py-0.5 rounded font-medium">
                  Share {deviceStats.desktop.searchShare}%
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Search:</span>
                  <span className="font-mono font-medium text-[#2D384C]">{formatNumber(deviceStats.desktop.searches)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Click_flight:</span>
                  <span className="font-mono font-medium text-[#2D384C]">{formatNumber(deviceStats.desktop.clicks)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-[#2D384C]">
                  <span>CTR:</span>
                  <span className="font-mono text-[#3069F6]">{deviceStats.desktop.ctr}%</span>
                </div>
              </div>
            </div>

            {/* Mobile */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D384C]">Mobile</span>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-medium">
                  Share {deviceStats.mobile.searchShare}%
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Search:</span>
                  <span className="font-mono font-medium text-[#2D384C]">{formatNumber(deviceStats.mobile.searches)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Click_flight:</span>
                  <span className="font-mono font-medium text-[#2D384C]">{formatNumber(deviceStats.mobile.clicks)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-[#2D384C]">
                  <span>CTR:</span>
                  <span className="font-mono text-[#3069F6]">{deviceStats.mobile.ctr}%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Minimal progress bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden flex">
            <div className="bg-[#3069F6] h-full" style={{ width: `${deviceStats.desktop.searchShare}%` }} />
            <div className="bg-slate-300 h-full" style={{ width: `${deviceStats.mobile.searchShare}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Desktop: {deviceStats.desktop.searchShare}%</span>
            <span>Mobile: {deviceStats.mobile.searchShare}%</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Trip_type */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tipo de viaje
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Domestic vs International
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            
            {/* Domestic */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D384C]">Domestic</span>
                <span className="text-[11px] font-mono text-[#0D47A1] bg-blue-50 border border-[#3069F6]/30 px-1.5 py-0.5 rounded font-medium">
                  Share {tripStats.domestic.searchShare}%
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Search:</span>
                  <span className="font-mono font-medium text-[#2D384C]">{formatNumber(tripStats.domestic.searches)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Click_flight:</span>
                  <span className="font-mono font-medium text-[#2D384C]">{formatNumber(tripStats.domestic.clicks)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-[#2D384C]">
                  <span>CTR:</span>
                  <span className="font-mono text-[#3069F6]">{tripStats.domestic.ctr}%</span>
                </div>
              </div>
            </div>

            {/* International */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D384C]">International</span>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded font-medium">
                  Share {tripStats.international.searchShare}%
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Search:</span>
                  <span className="font-mono font-medium text-[#2D384C]">{formatNumber(tripStats.international.searches)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Click_flight:</span>
                  <span className="font-mono font-medium text-[#2D384C]">{formatNumber(tripStats.international.clicks)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-[#2D384C]">
                  <span>CTR:</span>
                  <span className="font-mono text-[#3069F6]">{tripStats.international.ctr}%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Minimal progress bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden flex">
            <div className="bg-[#3069F6] h-full" style={{ width: `${tripStats.domestic.searchShare}%` }} />
            <div className="bg-slate-300 h-full" style={{ width: `${tripStats.international.searchShare}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Domestic: {tripStats.domestic.searchShare}%</span>
            <span>International: {tripStats.international.searchShare}%</span>
          </div>
        </div>
      </div>

    </div>
  );
};
