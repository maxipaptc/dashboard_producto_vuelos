import React, { useState, useMemo } from 'react';
import { FlightMetricRow } from '../types';

interface RoutesTableProps {
  data: FlightMetricRow[];
}

export const RoutesTable: React.FC<RoutesTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'search' | 'click_flight' | 'ctr' | 'searchShare' | 'clickShare' | 'element'>('search');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Overall totals for Share calculation
  const { totalSearches, totalClicks } = useMemo(() => {
    let searches = 0;
    let clicks = 0;
    data.forEach((r) => {
      searches += r.search;
      clicks += r.click_flight;
    });
    return { totalSearches: searches, totalClicks: clicks };
  }, [data]);

  // Group by element
  const aggregatedElements = useMemo(() => {
    const elementMap = new Map<
      string,
      {
        element: string;
        search: number;
        click_flight: number;
        desktopSearches: number;
        mobileSearches: number;
        domesticSearches: number;
        internationalSearches: number;
      }
    >();

    data.forEach((row) => {
      const elem = row.element || 'General';
      const existing = elementMap.get(elem) || {
        element: elem,
        search: 0,
        click_flight: 0,
        desktopSearches: 0,
        mobileSearches: 0,
        domesticSearches: 0,
        internationalSearches: 0,
      };

      existing.search += row.search;
      existing.click_flight += row.click_flight;

      if (row.device_category === 'desktop') {
        existing.desktopSearches += row.search;
      } else {
        existing.mobileSearches += row.search;
      }

      if (row.trip_type === 'domestic') {
        existing.domesticSearches += row.search;
      } else {
        existing.internationalSearches += row.search;
      }

      elementMap.set(elem, existing);
    });

    return Array.from(elementMap.values()).map((item) => {
      const ctr = item.search > 0 ? Number(((item.click_flight / item.search) * 100).toFixed(2)) : 0;
      const searchShare = totalSearches > 0 ? Number(((item.search / totalSearches) * 100).toFixed(2)) : 0;
      const clickShare = totalClicks > 0 ? Number(((item.click_flight / totalClicks) * 100).toFixed(2)) : 0;

      const desktopPct =
        item.search > 0 ? Math.round((item.desktopSearches / item.search) * 100) : 50;
      const domesticPct =
        item.search > 0 ? Math.round((item.domesticSearches / item.search) * 100) : 50;

      return {
        ...item,
        ctr,
        searchShare,
        clickShare,
        desktopPct,
        mobilePct: 100 - desktopPct,
        domesticPct,
        internationalPct: 100 - domesticPct,
      };
    });
  }, [data, totalSearches, totalClicks]);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    return aggregatedElements
      .filter((r) => r.element.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const factor = sortOrder === 'desc' ? -1 : 1;
        if (sortField === 'element') {
          return a.element.localeCompare(b.element) * factor;
        }
        return (a[sortField] - b[sortField]) * factor;
      });
  }, [aggregatedElements, searchTerm, sortField, sortOrder]);

  const handleSort = (field: 'search' | 'click_flight' | 'ctr' | 'searchShare' | 'clickShare' | 'element') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return <span className="text-neutral-300 ml-1">↕</span>;
    return <span className="text-neutral-900 ml-1 font-bold">{sortOrder === 'desc' ? '↓' : '↑'}</span>;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-bold text-[#2D384C]">
            Filtro de vuelos
          </h3>
          <p className="text-xs text-slate-500">
            Volumen, Share y CTR por feature
          </p>
        </div>

        {/* Search input */}
        <input
          id="input-filter-element"
          type="text"
          placeholder="Buscar filtro de vuelos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-56 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#2D384C] placeholder-slate-400 focus:outline-hidden focus:border-[#3069F6] focus:bg-white transition-colors"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
            <tr>
              <th
                onClick={() => handleSort('element')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-100 hover:text-[#0D47A1] transition-colors select-none font-sans"
              >
                Filtro de vuelos {renderSortIndicator('element')}
              </th>
              <th
                onClick={() => handleSort('search')}
                className="py-2.5 px-3 text-right cursor-pointer hover:bg-slate-100 hover:text-[#0D47A1] transition-colors select-none"
              >
                Search {renderSortIndicator('search')}
              </th>
              <th
                onClick={() => handleSort('searchShare')}
                className="py-2.5 px-3 text-right cursor-pointer hover:bg-slate-100 hover:text-[#0D47A1] transition-colors select-none"
              >
                Search Share {renderSortIndicator('searchShare')}
              </th>
              <th
                onClick={() => handleSort('click_flight')}
                className="py-2.5 px-3 text-right cursor-pointer hover:bg-slate-100 hover:text-[#0D47A1] transition-colors select-none"
              >
                Click_flight {renderSortIndicator('click_flight')}
              </th>
              <th
                onClick={() => handleSort('clickShare')}
                className="py-2.5 px-3 text-right cursor-pointer hover:bg-slate-100 hover:text-[#0D47A1] transition-colors select-none"
              >
                Click Share {renderSortIndicator('clickShare')}
              </th>
              <th
                onClick={() => handleSort('ctr')}
                className="py-2.5 px-3 text-right cursor-pointer hover:bg-slate-100 hover:text-[#0D47A1] transition-colors select-none"
              >
                CTR {renderSortIndicator('ctr')}
              </th>
              <th className="py-2.5 px-3 text-center">
                Device
              </th>
              <th className="py-2.5 px-3 text-center">
                Trip_type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400 text-xs font-sans">
                  Sin registros
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((item) => {
                const isHighCtr = item.ctr >= 15;
                return (
                  <tr
                    key={item.element}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    {/* Element name */}
                    <td className="py-2.5 px-3 font-medium text-[#2D384C] font-sans">
                      {item.element}
                    </td>

                    {/* Search */}
                    <td className="py-2.5 px-3 text-right text-slate-800">
                      {item.search.toLocaleString('es-AR')}
                    </td>

                    {/* Search Share */}
                    <td className="py-2.5 px-3 text-right text-slate-600 font-semibold">
                      {item.searchShare}%
                    </td>

                    {/* Click_flight */}
                    <td className="py-2.5 px-3 text-right text-slate-800">
                      {item.click_flight.toLocaleString('es-AR')}
                    </td>

                    {/* Click Share */}
                    <td className="py-2.5 px-3 text-right text-slate-600 font-semibold">
                      {item.clickShare}%
                    </td>

                    {/* CTR */}
                    <td className="py-2.5 px-3 text-right">
                      {isHighCtr ? (
                        <span className="font-bold text-[#9A6200] bg-amber-50 border border-[#FEBB02]/50 px-1.5 py-0.5 rounded text-xs">
                          {item.ctr}%
                        </span>
                      ) : (
                        <span className="font-bold text-[#3069F6]">
                          {item.ctr}%
                        </span>
                      )}
                    </td>

                    {/* Device Mix */}
                    <td className="py-2.5 px-3 text-center text-[10px] text-slate-500">
                      <span className="font-medium text-[#2D384C]">{item.desktopPct}% D</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span>{item.mobilePct}% M</span>
                    </td>

                    {/* Trip Mix */}
                    <td className="py-2.5 px-3 text-center text-[10px] text-slate-500">
                      <span className="font-medium text-[#2D384C]">{item.domesticPct}% Dom</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span>{item.internationalPct}% Int</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{filteredAndSorted.length} filtros de vuelos</span>
        <span>Total Search: {totalSearches.toLocaleString('es-AR')} | Total Click_flight: {totalClicks.toLocaleString('es-AR')}</span>
      </div>
    </div>
  );
};
