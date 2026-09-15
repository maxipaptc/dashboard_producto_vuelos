import React, { useState, useMemo } from 'react';
import { BaggageInfoRow } from '../types';
import { Search, Luggage, LayoutGrid, Table as TableIcon, Clock } from 'lucide-react';

interface BaggageInfoViewProps {
  data: BaggageInfoRow[];
}

export const BaggageInfoView: React.FC<BaggageInfoViewProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Extract all dynamic column headers from the rows (excluding 'id')
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    const keysSet = new Set<string>();
    data.forEach((row) => {
      Object.keys(row).forEach((k) => {
        if (k !== 'id') keysSet.add(k);
      });
    });
    return Array.from(keysSet);
  }, [data]);

  // Format header label for clean presentation
  const formatHeaderLabel = (col: string) => {
    const cleaned = col.replace(/[_-]+/g, ' ').trim();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  };

  // Filter rows based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase().trim();
    return data.filter((row) => {
      return Object.entries(row).some(([key, val]) => {
        if (key === 'id' || val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm]);

  // Count airlines or distinct categories if available
  const distinctAirlines = useMemo(() => {
    const set = new Set<string>();
    data.forEach((row) => {
      const val = row.aerolinea || row.airline || row.carrier;
      if (val) set.add(String(val).trim());
    });
    return set.size;
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#2D384C] tracking-tight">
              Información de equipaje
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80">
              <Luggage className="w-3.5 h-3.5 text-[#3069F6]" />
              Informativo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Políticas, medidas permitidas, pesos y franquicias por aerolínea.
          </p>
        </div>

        {/* Informative Stats Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-medium shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Última vez actualizado: 31-ago-2026
          </span>
          <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium shadow-2xs">
            {data.length} registros
          </span>
          {distinctAirlines > 0 && (
            <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium shadow-2xs">
              {distinctAirlines} aerolíneas
            </span>
          )}
        </div>
      </div>

      {/* Control Bar: Search and View Mode Switcher */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-baggage-info"
            type="text"
            placeholder="Buscar por aerolínea, tipo, peso, medidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-[#2D384C] placeholder:text-slate-400 focus:outline-none focus:border-[#3069F6] focus:bg-white transition-all"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-end sm:self-auto border border-slate-200/60">
          <button
            id="btn-view-table"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-[#2D384C] shadow-2xs'
                : 'text-slate-500 hover:text-[#2D384C]'
            }`}
            title="Vista de tabla"
          >
            <TableIcon className="w-3.5 h-3.5" />
            Tabla
          </button>
          <button
            id="btn-view-cards"
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-[#2D384C] shadow-2xs'
                : 'text-slate-500 hover:text-[#2D384C]'
            }`}
            title="Vista de tarjetas"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Tarjetas
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Luggage className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-[#2D384C]">No se encontraron datos</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? `No hay resultados que coincidan con "${searchTerm}". Prueba con otros términos.`
              : 'No hay información de equipaje cargada en este momento.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 text-xs font-semibold text-[#3069F6] hover:underline cursor-pointer"
            >
              Borrar filtro de búsqueda
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TABULAR VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-4 w-10 text-slate-400">#</th>
                  {columns.map((col) => (
                    <th key={col} className="py-2.5 px-4 font-semibold whitespace-nowrap">
                      {formatHeaderLabel(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((row, idx) => {
                  return (
                    <tr
                      key={row.id || `baggage-row-${idx}`}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-[11px] text-slate-400 font-mono">
                        {idx + 1}
                      </td>
                      {columns.map((col) => {
                        const cellVal = row[col];
                        const isPrimary = col === 'aerolinea' || col === 'airline';
                        const isTag = col === 'tipo_equipaje' || col === 'tipo';
                        const isIncluded = col === 'incluido' || col === 'politica';

                        return (
                          <td
                            key={col}
                            className={`py-3 px-4 ${
                              isPrimary
                                ? 'font-bold text-[#2D384C] whitespace-nowrap'
                                : 'text-slate-700'
                            }`}
                          >
                            {isTag && cellVal ? (
                              <span className="inline-block bg-slate-100 text-[#2D384C] text-[11px] font-medium px-2 py-0.5 rounded-md border border-slate-200/60">
                                {String(cellVal)}
                              </span>
                            ) : isIncluded && cellVal ? (
                              <span
                                className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md ${
                                  String(cellVal).toLowerCase().includes('incluido')
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                                }`}
                              >
                                {String(cellVal)}
                              </span>
                            ) : cellVal !== null && cellVal !== undefined && String(cellVal).trim() !== '' ? (
                              String(cellVal)
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredData.map((row, idx) => {
            const airline = row.aerolinea || row.airline || row.carrier || 'Aerolínea';
            const bagType = row.tipo_equipaje || row.tipo || row.categoria || '';

            return (
              <div
                key={row.id || `bag-card-${idx}`}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-[#2D384C]">{airline}</h4>
                      {bagType && (
                        <span className="inline-block mt-1 text-[11px] font-medium text-[#0D47A1] bg-blue-50 border border-[#3069F6]/20 px-2 py-0.5 rounded-md">
                          {bagType}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs py-1">
                    {columns
                      .filter(
                        (col) =>
                          col !== 'aerolinea' &&
                          col !== 'airline' &&
                          col !== 'carrier' &&
                          col !== 'tipo_equipaje' &&
                          col !== 'tipo'
                      )
                      .map((col) => {
                        const val = row[col];
                        if (val === null || val === undefined || String(val).trim() === '') return null;
                        return (
                          <div key={col} className="flex items-baseline justify-between gap-2">
                            <span className="text-slate-500 font-medium text-[11px] shrink-0">
                              {formatHeaderLabel(col)}:
                            </span>
                            <span className="text-slate-800 text-right font-medium break-words">
                              {String(val)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}


    </div>
  );
};
