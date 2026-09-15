import React, { useState, useRef, useEffect } from 'react';
import { FilterState, MONTH_NAMES } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableMonths: number[];
  availableElements: string[];
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  availableMonths,
  availableElements,
  onResetFilters,
  filteredCount,
  totalCount,
}) => {
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const isAllMonthsSelected =
    filters.meses.length === 0 || filters.meses.length === availableMonths.length;

  const isFiltered =
    !isAllMonthsSelected ||
    filters.element !== 'all' ||
    filters.device_category !== 'all' ||
    filters.trip_type !== 'all';

  // Close dropdown on click outside without dimming the background
  useEffect(() => {
    if (!isMonthModalOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsMonthModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMonthModalOpen]);

  // Toggle single month in multi-selection
  const handleToggleMonth = (m: number) => {
    let nextMeses: number[];
    if (isAllMonthsSelected) {
      // If previously all were selected, clicking one selects just that one
      nextMeses = [m];
    } else if (filters.meses.includes(m)) {
      nextMeses = filters.meses.filter((x) => x !== m);
      if (nextMeses.length === 0) {
        nextMeses = []; // empty means all
      }
    } else {
      nextMeses = [...filters.meses, m].sort((a, b) => a - b);
    }
    onFilterChange({ ...filters, meses: nextMeses });
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-3">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Exactly two month buttons: "Todos los meses" and "Custom" with compact popover */}
          <div className="relative inline-flex items-center" ref={popoverRef}>
            <div className="inline-flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                id="filter-mes-all"
                type="button"
                onClick={() => onFilterChange({ ...filters, meses: [] })}
                className={`px-3 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                  isAllMonthsSelected
                    ? 'bg-[#3069F6] text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-[#0D47A1] hover:bg-blue-50/50'
                }`}
              >
                Todos los meses
              </button>
              <button
                id="filter-mes-custom"
                type="button"
                onClick={() => setIsMonthModalOpen((prev) => !prev)}
                className={`px-3 py-1 rounded-md transition-colors font-medium cursor-pointer flex items-center gap-1.5 ${
                  !isAllMonthsSelected
                    ? 'bg-[#3069F6] text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-[#0D47A1] hover:bg-blue-50/50'
                }`}
                title="Abrir selector de meses"
              >
                <span>Personalizado</span>
                {!isAllMonthsSelected && (
                  <span className="bg-white/25 text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold">
                    {filters.meses.length}
                  </span>
                )}
              </button>
            </div>

            {/* Compact Popover desprendiéndose debajo de Custom */}
            {isMonthModalOpen && (
              <div
                id="popover-custom-months"
                className="absolute top-full left-0 mt-1.5 z-50 bg-white rounded-xl shadow-lg border border-slate-200 w-64 p-3 space-y-2.5"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-[#2D384C]">
                    Seleccionar meses
                  </span>
                  <button
                    type="button"
                    onClick={() => onFilterChange({ ...filters, meses: [] })}
                    className="text-[10px] text-[#3069F6] hover:underline font-medium cursor-pointer"
                  >
                    Marcar todos
                  </button>
                </div>

                {/* Grid / Cuadrícula compacta de meses */}
                <div className="grid grid-cols-4 gap-1.5 py-0.5">
                  {availableMonths.map((m) => {
                    const label = MONTH_NAMES[m] || `M${m}`;
                    const isSelected = !isAllMonthsSelected && filters.meses.includes(m);
                    return (
                      <button
                        key={m}
                        id={`btn-modal-month-${m}`}
                        type="button"
                        onClick={() => handleToggleMonth(m)}
                        className={`h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#3069F6] text-white shadow-2xs'
                            : 'bg-slate-50 text-[#2D384C] border border-slate-200 hover:border-[#3069F6] hover:text-[#0D47A1] hover:bg-blue-50/40'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom status and Listo button */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[11px]">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {!isAllMonthsSelected ? `${filters.meses.length} activos` : 'Todos'}
                  </span>
                  <button
                    id="btn-apply-month-modal"
                    type="button"
                    onClick={() => setIsMonthModalOpen(false)}
                    className="px-2.5 py-1 bg-[#3069F6] hover:bg-[#2052D2] text-white rounded-lg text-[11px] font-medium shadow-2xs transition-colors cursor-pointer"
                  >
                    Listo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filtro de vuelos select */}
          <select
            id="select-element"
            value={filters.element}
            onChange={(e) => onFilterChange({ ...filters, element: e.target.value })}
            className={`px-2.5 py-1 bg-white border rounded-lg text-xs cursor-pointer max-w-[210px] truncate transition-colors focus:outline-hidden focus:border-[#3069F6] ${
              filters.element !== 'all'
                ? 'border-[#3069F6] text-[#0D47A1] font-medium bg-blue-50/40'
                : 'border-slate-200 text-[#2D384C] hover:border-slate-300'
            }`}
          >
            <option value="all">Filtro de vuelos: Todos</option>
            {availableElements.map((elem) => (
              <option key={elem} value={elem}>
                {elem}
              </option>
            ))}
          </select>

          {/* Device select */}
          <select
            id="select-device"
            value={filters.device_category}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                device_category: e.target.value as any,
              })
            }
            className={`px-2.5 py-1 bg-white border rounded-lg text-xs cursor-pointer transition-colors focus:outline-hidden focus:border-[#3069F6] ${
              filters.device_category !== 'all'
                ? 'border-[#3069F6] text-[#0D47A1] font-medium bg-blue-50/40'
                : 'border-slate-200 text-[#2D384C] hover:border-slate-300'
            }`}
          >
            <option value="all">Device: Todos</option>
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>

          {/* Trip type select */}
          <select
            id="select-trip-type"
            value={filters.trip_type}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                trip_type: e.target.value as any,
              })
            }
            className={`px-2.5 py-1 bg-white border rounded-lg text-xs cursor-pointer transition-colors focus:outline-hidden focus:border-[#3069F6] ${
              filters.trip_type !== 'all'
                ? 'border-[#3069F6] text-[#0D47A1] font-medium bg-blue-50/40'
                : 'border-slate-200 text-[#2D384C] hover:border-slate-300'
            }`}
          >
            <option value="all">Trip_type: Todos</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>

          {/* Reset button */}
          {isFiltered && (
            <button
              id="btn-reset-filters"
              onClick={onResetFilters}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-amber-800 hover:bg-amber-50 border border-dashed border-slate-300 hover:border-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}

        </div>

        {/* Right Counter */}
        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
          {!isAllMonthsSelected && (
            <span className="bg-blue-50/90 text-[#0D47A1] border border-blue-100 px-2 py-0.5 rounded-md font-sans font-medium text-[11px]">
              {filters.meses.length} {filters.meses.length === 1 ? 'mes' : 'meses'} ({filters.meses.map(m => MONTH_NAMES[m]).join(', ')})
            </span>
          )}
          <span>
            <span className="text-[#2D384C] font-bold">{filteredCount}</span> / {totalCount} filas
          </span>
        </div>

      </div>
    </div>
  );
};
