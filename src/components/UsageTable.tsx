import React, { useState, useMemo } from 'react';
import { FilterUsageRow } from '../types';
import { Search, Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface UsageTableProps {
  data: FilterUsageRow[];
}

interface ElementAggregated {
  element: string;
  totalEvents: number;
  desktopEvents: number;
  mobileEvents: number;
  domesticEvents: number;
  internationalEvents: number;
  share: number;
}

export const UsageTable: React.FC<UsageTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'totalEvents' | 'element' | 'share'>('totalEvents');
  const [sortAsc, setSortAsc] = useState(false);

  const totalAllEvents = useMemo(() => {
    return data.reduce((acc, r) => acc + r.event_count, 0);
  }, [data]);

  const aggregatedList = useMemo(() => {
    const map = new Map<string, ElementAggregated>();

    data.forEach((r) => {
      const existing = map.get(r.element) || {
        element: r.element,
        totalEvents: 0,
        desktopEvents: 0,
        mobileEvents: 0,
        domesticEvents: 0,
        internationalEvents: 0,
        share: 0,
      };

      existing.totalEvents += r.event_count;
      if (r.device_category === 'desktop') {
        existing.desktopEvents += r.event_count;
      } else {
        existing.mobileEvents += r.event_count;
      }

      if (r.trip_type === 'domestic') {
        existing.domesticEvents += r.event_count;
      } else {
        existing.internationalEvents += r.event_count;
      }

      map.set(r.element, existing);
    });

    // Calculate share
    const list = Array.from(map.values()).map((item) => ({
      ...item,
      share: totalAllEvents > 0 ? Number(((item.totalEvents / totalAllEvents) * 100).toFixed(2)) : 0,
    }));

    return list;
  }, [data, totalAllEvents]);

  const filteredAndSortedList = useMemo(() => {
    return aggregatedList
      .filter((item) => item.element.toLowerCase().includes(searchTerm.toLowerCase().trim()))
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'element') {
          diff = a.element.localeCompare(b.element);
        } else if (sortField === 'totalEvents') {
          diff = a.totalEvents - b.totalEvents;
        } else if (sortField === 'share') {
          diff = a.share - b.share;
        }
        return sortAsc ? diff : -diff;
      });
  }, [aggregatedList, searchTerm, sortField, sortAsc]);

  const handleSort = (field: 'totalEvents' | 'element' | 'share') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Filtro de Vuelos',
      'Usos Totales (event_count)',
      'Share (%)',
      'Desktop Usos',
      'Desktop (%)',
      'Mobile Usos',
      'Mobile (%)',
      'Domestico Usos',
      'Domestico (%)',
      'Internacional Usos',
      'Internacional (%)',
    ];

    const rows = filteredAndSortedList.map((item, idx) => {
      const dPct = item.totalEvents > 0 ? ((item.desktopEvents / item.totalEvents) * 100).toFixed(1) : '0';
      const mPct = item.totalEvents > 0 ? ((item.mobileEvents / item.totalEvents) * 100).toFixed(1) : '0';
      const domPct = item.totalEvents > 0 ? ((item.domesticEvents / item.totalEvents) * 100).toFixed(1) : '0';
      const intPct = item.totalEvents > 0 ? ((item.internationalEvents / item.totalEvents) * 100).toFixed(1) : '0';

      return [
        idx + 1,
        `"${item.element}"`,
        item.totalEvents,
        `${item.share}%`,
        item.desktopEvents,
        `${dPct}%`,
        item.mobileEvents,
        `${mPct}%`,
        item.domesticEvents,
        `${domPct}%`,
        item.internationalEvents,
        `${intPct}%`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `turismocity_uso_filtros_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <h3 className="text-sm font-bold text-[#2D384C]">
            Tabla Detallada de Uso por Filtro de Vuelos
          </h3>
          <p className="text-xs text-slate-500">
            Ranking según event_count total, share sobre el uso global y desglose por dispositivo/mercado
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar filtro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#3069F6] w-40 sm:w-52 text-[#2D384C]"
            />
          </div>

          {/* Export CSV */}
          <button
            id="btn-export-usage-csv"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2D384C] bg-white border border-slate-200 rounded-lg hover:bg-blue-50/50 hover:border-[#3069F6]/40 transition-colors cursor-pointer shadow-2xs"
            title="Descargar como CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 w-12 text-center">#</th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-[#0D47A1] transition-colors"
                onClick={() => handleSort('element')}
              >
                <div className="flex items-center gap-1">
                  <span>Filtro de Vuelos</span>
                  {sortField === 'element' ? (
                    sortAsc ? <ArrowUp className="w-3 h-3 text-[#3069F6]" /> : <ArrowDown className="w-3 h-3 text-[#3069F6]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-[#0D47A1] transition-colors text-right"
                onClick={() => handleSort('totalEvents')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Event Count (Usos)</span>
                  {sortField === 'totalEvents' ? (
                    sortAsc ? <ArrowUp className="w-3 h-3 text-[#3069F6]" /> : <ArrowDown className="w-3 h-3 text-[#3069F6]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-[#0D47A1] transition-colors"
                onClick={() => handleSort('share')}
              >
                <div className="flex items-center gap-1">
                  <span>% Share</span>
                  {sortField === 'share' ? (
                    sortAsc ? <ArrowUp className="w-3 h-3 text-[#3069F6]" /> : <ArrowDown className="w-3 h-3 text-[#3069F6]" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-30" />
                  )}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">Desktop</th>
              <th className="py-2.5 px-3 text-right">Mobile</th>
              <th className="py-2.5 px-3 text-right">Doméstico</th>
              <th className="py-2.5 px-3 text-right">Internacional</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAndSortedList.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No se encontraron filtros que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredAndSortedList.map((item, idx) => {
                const dPct = item.totalEvents > 0 ? ((item.desktopEvents / item.totalEvents) * 100).toFixed(0) : '0';
                const mPct = item.totalEvents > 0 ? ((item.mobileEvents / item.totalEvents) * 100).toFixed(0) : '0';
                const domPct = item.totalEvents > 0 ? ((item.domesticEvents / item.totalEvents) * 100).toFixed(0) : '0';
                const intPct = item.totalEvents > 0 ? ((item.internationalEvents / item.totalEvents) * 100).toFixed(0) : '0';

                return (
                  <tr
                    key={item.element}
                    className="hover:bg-blue-50/40 transition-colors odd:bg-white even:bg-slate-50/30"
                  >
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#2D384C]">
                      {item.element}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#2D384C]">
                      {item.totalEvents.toLocaleString('es-AR')}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2 min-w-28">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#3069F6] h-full rounded-full"
                            style={{ width: `${Math.min(100, item.share * 2.5)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-700">
                          {item.share}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                      <span>{item.desktopEvents.toLocaleString('es-AR')}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({dPct}%)</span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                      <span>{item.mobileEvents.toLocaleString('es-AR')}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({mPct}%)</span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                      <span>{item.domesticEvents.toLocaleString('es-AR')}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({domPct}%)</span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                      <span>{item.internationalEvents.toLocaleString('es-AR')}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({intPct}%)</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Mostrando {filteredAndSortedList.length} filtros de vuelos</span>
        <span className="font-mono text-[11px]">
          Total filtrado: <span className="font-bold text-[#2D384C]">{totalAllEvents.toLocaleString('es-AR')}</span> usos
        </span>
      </div>
    </div>
  );
};
