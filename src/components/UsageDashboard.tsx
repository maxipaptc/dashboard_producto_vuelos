import React, { useState, useMemo } from 'react';
import { FilterUsageRow, FilterState, MONTH_NAMES } from '../types';
import { KpiCard } from './KpiCard';
import { FilterBar } from './FilterBar';
import { UsageTrendsChart } from './UsageTrendsChart';
import { UsageBreakdown } from './UsageBreakdown';
import { UsageTable } from './UsageTable';

interface UsageDashboardProps {
  data: FilterUsageRow[];
}

export const UsageDashboard: React.FC<UsageDashboardProps> = ({ data }) => {
  // Local filter state for this dashboard
  const [filters, setFilters] = useState<FilterState>({
    meses: [],
    element: 'all',
    device_category: 'all',
    trip_type: 'all',
  });

  // Extract unique available months
  const availableMonths = useMemo(() => {
    const set = new Set<number>();
    data.forEach((r) => {
      if (r.mes) set.add(r.mes);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [data]);

  // Extract unique available elements
  const availableElements = useMemo(() => {
    const set = new Set<string>();
    data.forEach((r) => {
      if (r.element) set.add(r.element);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Filter by months
      if (filters.meses.length > 0 && !filters.meses.includes(row.mes)) {
        return false;
      }
      // Filter by element
      if (filters.element !== 'all' && row.element !== filters.element) {
        return false;
      }
      // Filter by device category
      if (filters.device_category !== 'all' && row.device_category !== filters.device_category) {
        return false;
      }
      // Filter by trip type
      if (filters.trip_type !== 'all' && row.trip_type !== filters.trip_type) {
        return false;
      }
      return true;
    });
  }, [data, filters]);

  // KPI Calculations
  const summary = useMemo(() => {
    let totalEvents = 0;
    const elementMap = new Map<string, number>();
    const monthMap = new Map<number, number>();
    let desktopEvents = 0;
    let mobileEvents = 0;
    let domesticEvents = 0;
    let internationalEvents = 0;

    filteredData.forEach((r) => {
      totalEvents += r.event_count;

      elementMap.set(r.element, (elementMap.get(r.element) || 0) + r.event_count);
      monthMap.set(r.mes, (monthMap.get(r.mes) || 0) + r.event_count);

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

    // Top element
    let topElement: { element: string; event_count: number; share: number } | null = null;
    let maxElementCount = -1;
    elementMap.forEach((count, elem) => {
      if (count > maxElementCount) {
        maxElementCount = count;
        topElement = {
          element: elem,
          event_count: count,
          share: totalEvents > 0 ? Number(((count / totalEvents) * 100).toFixed(1)) : 0,
        };
      }
    });

    // Best month
    let bestMonth: { mes: number; label: string; event_count: number } | null = null;
    let maxMonthCount = -1;
    monthMap.forEach((count, m) => {
      if (count > maxMonthCount) {
        maxMonthCount = count;
        bestMonth = {
          mes: m,
          label: MONTH_NAMES[m] || `Mes ${m}`,
          event_count: count,
        };
      }
    });

    const desktopShare = totalEvents > 0 ? Number(((desktopEvents / totalEvents) * 100).toFixed(1)) : 0;
    const mobileShare = totalEvents > 0 ? Number(((mobileEvents / totalEvents) * 100).toFixed(1)) : 0;
    const internationalShare = totalEvents > 0 ? Number(((internationalEvents / totalEvents) * 100).toFixed(1)) : 0;
    const domesticShare = totalEvents > 0 ? Number(((domesticEvents / totalEvents) * 100).toFixed(1)) : 0;

    return {
      totalEvents,
      topElement,
      bestMonth,
      desktopEvents,
      desktopShare,
      mobileEvents,
      mobileShare,
      domesticEvents,
      domesticShare,
      internationalEvents,
      internationalShare,
    };
  }, [filteredData]);

  const formatNumberDisplay = (num: number): string => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}k`;
    }
    return num.toLocaleString('es-AR');
  };

  return (
    <div className="space-y-4">
      {/* Subheader Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            Uso filtros
          </h1>
          <p className="text-xs text-neutral-500">
            Event_count y volumen de interacción con los filtros de vuelos
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Usos */}
        <KpiCard
          id="kpi-usage-total"
          title="Event Count (Usos)"
          value={formatNumberDisplay(summary.totalEvents)}
          subValue={`(${summary.totalEvents.toLocaleString('es-AR')})`}
          subtitle="Total de interacciones registradas"
          accent="blue"
        />

        {/* Card 2: Filtro Más Usado */}
        <KpiCard
          id="kpi-usage-top-element"
          title="Filtro Más Usado"
          value={summary.topElement ? summary.topElement.element : '—'}
          subValue={summary.topElement ? `${summary.topElement.share}% del total` : undefined}
          subtitle={summary.topElement ? `${summary.topElement.event_count.toLocaleString('es-AR')} usos` : undefined}
          badgeText={summary.topElement ? 'Líder' : undefined}
          accent="amber"
        />

        {/* Card 3: Dispositivo Dominante */}
        <KpiCard
          id="kpi-usage-device"
          title="Desktop vs Mobile"
          value={`${summary.desktopShare}% / ${summary.mobileShare}%`}
          subValue={`Desktop: ${formatNumberDisplay(summary.desktopEvents)}`}
          subtitle={`Mobile: ${formatNumberDisplay(summary.mobileEvents)} usos`}
          accent="neutral"
        />

        {/* Card 4: Mercado Dominante */}
        <KpiCard
          id="kpi-usage-market"
          title="Internacional vs Doméstico"
          value={`${summary.internationalShare}% / ${summary.domesticShare}%`}
          subValue={`Inter: ${formatNumberDisplay(summary.internationalEvents)}`}
          subtitle={`Doméstico: ${formatNumberDisplay(summary.domesticEvents)} usos`}
          accent="neutral"
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        availableMonths={availableMonths}
        availableElements={availableElements}
        onResetFilters={() =>
          setFilters({
            meses: [],
            element: 'all',
            device_category: 'all',
            trip_type: 'all',
          })
        }
        filteredCount={filteredData.length}
        totalCount={data.length}
      />

      {/* Monthly Trend Chart */}
      <UsageTrendsChart data={filteredData} />

      {/* Breakdown: Device & Trip Type */}
      <UsageBreakdown data={filteredData} />

      {/* Table */}
      <UsageTable data={filteredData} />
    </div>
  );
};
