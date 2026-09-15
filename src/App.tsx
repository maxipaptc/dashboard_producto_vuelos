import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarDrawer } from './components/SidebarDrawer';
import { KpiCard } from './components/KpiCard';
import { FilterBar } from './components/FilterBar';
import { TrendsChart } from './components/TrendsChart';
import { RoutesTable } from './components/RoutesTable';
import { DeviceBreakdown } from './components/DeviceBreakdown';
import { UsageDashboard } from './components/UsageDashboard';
import { BaggageInfoView } from './components/BaggageInfoView';
import { LoginPage } from './components/LoginPage';
import { SAMPLE_FLIGHT_DATA } from './data/sampleFlightData';
import { SAMPLE_USAGE_DATA } from './data/sampleUsageData';
import { SAMPLE_BAGGAGE_INFO } from './data/sampleBaggageInfo';
import {
  FlightMetricRow,
  FilterUsageRow,
  BaggageInfoRow,
  ActiveDashboard,
  ConnectionSource,
  FilterState,
  DashboardSummary,
  MONTH_NAMES,
  AuthUser,
} from './types';
import {
  fetchGoogleSheetGViz,
  fetchGoogleSheetUsageGViz,
  fetchGoogleSheetBaggageInfoGViz,
  processRawRows,
  processRawUsageRows,
  processRawBaggageRows,
} from './utils/sheetParser';

export default function App() {
  const [activeDashboard, setActiveDashboard] = useState<ActiveDashboard>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || params.get('dashboard');
      if (tab === 'uso' || tab === 'uso-filtros' || tab === 'uso_filtros') return 'uso';
      if (tab === 'equipaje' || tab === 'info-equipaje' || tab === 'info_equipaje') return 'equipaje';
      const saved = localStorage.getItem('turismocity_active_dashboard_v1');
      if (saved === 'uso' || saved === 'ctr' || saved === 'equipaje') return saved as ActiveDashboard;
    } catch {}
    return 'ctr';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authenticated user state restricted to @turismocity.com
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('turismocity_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const email = (parsed?.email || '').toLowerCase().trim();
        if (email.endsWith('@turismocity.com') || email.endsWith('@turismocity.com.ar')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const handleLogout = () => {
    try {
      localStorage.removeItem('turismocity_auth_user');
      (window as any).google?.accounts?.id?.disableAutoSelect?.();
    } catch (e) {
      console.error(e);
    }
    setAuthUser(null);
  };

  const [data, setData] = useState<FlightMetricRow[]>(() => {
    const saved = localStorage.getItem('turismocity_flight_data_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].search !== undefined) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_FLIGHT_DATA;
  });

  const [usageData, setUsageData] = useState<FilterUsageRow[]>(() => {
    const saved = localStorage.getItem('turismocity_usage_data_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].event_count !== undefined) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_USAGE_DATA;
  });

  const [baggageData, setBaggageData] = useState<BaggageInfoRow[]>(() => {
    const saved = localStorage.getItem('turismocity_baggage_data_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_BAGGAGE_INFO;
  });

  const [connection, setConnection] = useState<ConnectionSource>(() => {
    // Check URL query parameter first
    let queryUrl: string | null = null;
    try {
      const params = new URLSearchParams(window.location.search);
      queryUrl = params.get('url') || params.get('sheetUrl') || params.get('sheet');
    } catch {}

    const envSheetUrl = (import.meta as any).env?.VITE_GOOGLE_SHEET_URL;

    const saved = localStorage.getItem('turismocity_connection_source_v2');
    let savedConn: ConnectionSource | null = null;
    if (saved) {
      try {
        savedConn = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    if (queryUrl) {
      return {
        type: 'google-sheet-url',
        sheetUrl: queryUrl,
        sheetName: 'CTR Base',
        rowCount: SAMPLE_FLIGHT_DATA.length,
        isAutoSyncing: true,
      };
    }

    if (savedConn && savedConn.type === 'google-sheet-url' && savedConn.sheetUrl) {
      return {
        ...savedConn,
        sheetName: !savedConn.sheetName || savedConn.sheetName === 'Base' ? 'CTR Base' : savedConn.sheetName,
        isAutoSyncing: true,
      };
    }

    if (envSheetUrl && String(envSheetUrl).trim()) {
      return {
        type: 'google-sheet-url',
        sheetUrl: String(envSheetUrl).trim(),
        sheetName: 'CTR Base',
        rowCount: SAMPLE_FLIGHT_DATA.length,
        isAutoSyncing: true,
      };
    }

    return {
      type: 'demo',
      sheetName: 'CTR Base',
      rowCount: SAMPLE_FLIGHT_DATA.length,
      isAutoSyncing: true,
    };
  });

  // Filters: meses (array for multi-month selection), element, device_category, trip_type
  const [filters, setFilters] = useState<FilterState>({
    meses: [], // Empty array = all months
    element: 'all',
    device_category: 'all',
    trip_type: 'all',
  });

  // Persist data in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('turismocity_flight_data_v2', JSON.stringify(data));
      localStorage.setItem('turismocity_usage_data_v1', JSON.stringify(usageData));
      localStorage.setItem('turismocity_baggage_data_v1', JSON.stringify(baggageData));
      localStorage.setItem('turismocity_connection_source_v2', JSON.stringify(connection));
      localStorage.setItem('turismocity_active_dashboard_v1', activeDashboard);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [data, usageData, baggageData, connection, activeDashboard]);

  // Real-time automatic synchronization with Google Sheets
  useEffect(() => {
    const sheetUrl = connection.sheetUrl;
    if (!sheetUrl) return;

    let isSubscribed = true;

    const performSync = async () => {
      try {
        // Fast-path: If it's Google Apps Script, try reading the combined payload
        if (sheetUrl.includes('script.google.com')) {
          try {
            const resp = await fetch(sheetUrl);
            if (resp.ok) {
              const json = await resp.json();
              if (json && typeof json === 'object' && !Array.isArray(json)) {
                const ctrRows =
                  json['ctr filtros'] ||
                  json['ctr_filtros'] ||
                  json['CTR filtros'] ||
                  json['CTR Base'] ||
                  json['ctr_base'] ||
                  json['ctr'] ||
                  json['Base'] ||
                  json['data'];
                const usoRows =
                  json['uso filtros'] ||
                  json['uso_filtros'] ||
                  json['Uso filtros'] ||
                  json['Uso'] ||
                  json['uso'];
                const baggageRows =
                  json['info equipaje'] ||
                  json['info_equipaje'] ||
                  json['Info equipaje'] ||
                  json['Info Equipaje'] ||
                  json['equipaje'] ||
                  json['Equipaje'];

                let updatedCTR = false;
                let updatedUso = false;
                let updatedBaggage = false;

                if (isSubscribed && ctrRows && Array.isArray(ctrRows) && ctrRows.length > 0) {
                  const resCTR = processRawRows(ctrRows);
                  if (resCTR.success && resCTR.data.length > 0) {
                    setData(resCTR.data);
                    updatedCTR = true;
                  }
                }

                if (isSubscribed && usoRows && Array.isArray(usoRows) && usoRows.length > 0) {
                  const resUso = processRawUsageRows(usoRows);
                  if (resUso.success && resUso.data.length > 0) {
                    setUsageData(resUso.data);
                    updatedUso = true;
                  }
                }

                if (isSubscribed && baggageRows && Array.isArray(baggageRows) && baggageRows.length > 0) {
                  const resBaggage = processRawBaggageRows(baggageRows);
                  if (resBaggage.success && resBaggage.data.length > 0) {
                    setBaggageData(resBaggage.data);
                    updatedBaggage = true;
                  }
                }

                if (updatedCTR || updatedUso || updatedBaggage) {
                  setConnection((prev) => ({
                    ...prev,
                    rowCount: (ctrRows && ctrRows.length) || prev.rowCount,
                    lastSyncedAt: new Date().toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    }),
                  }));
                  return;
                }
              }
            }
          } catch (errCombined) {
            console.warn('Combined Apps Script fetch fallback to individual queries:', errCombined);
          }
        }

        // Standard path: query individual sheets
        // 1. Sync CTR Base / ctr filtros
        const resultCTR = await fetchGoogleSheetGViz(sheetUrl, connection.sheetName || 'ctr filtros');
        if (isSubscribed && resultCTR.success && resultCTR.data.length > 0) {
          setData(resultCTR.data);
        }

        // 2. Sync Uso sheet / uso filtros
        const resultUsage = await fetchGoogleSheetUsageGViz(sheetUrl, 'uso filtros');
        if (isSubscribed && resultUsage.success && resultUsage.data.length > 0) {
          setUsageData(resultUsage.data);
        }

        // 3. Sync info equipaje sheet
        const resultBaggage = await fetchGoogleSheetBaggageInfoGViz(sheetUrl, 'info equipaje');
        if (isSubscribed && resultBaggage.success && resultBaggage.data.length > 0) {
          setBaggageData(resultBaggage.data);
        }

        setConnection((prev) => ({
          ...prev,
          rowCount: resultCTR.success ? resultCTR.data.length : prev.rowCount,
          lastSyncedAt: new Date().toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        }));
      } catch (err) {
        console.warn('Auto-sync cycle:', err);
      }
    };

    // Initial background sync
    performSync();

    // Auto-sync polling every 5 seconds
    const intervalId = setInterval(performSync, 5000);

    // Instant sync when user switches back from Google Sheets tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        performSync();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', performSync);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', performSync);
    };
  }, [connection.sheetUrl, connection.sheetName]);

  // Extract unique filter options
  const availableMonths = useMemo(() => {
    const set = new Set<number>();
    data.forEach((r) => {
      if (r.mes) set.add(r.mes);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [data]);

  const availableElements = useMemo(() => {
    const set = new Set<string>();
    data.forEach((r) => {
      if (r.element && r.element !== 'General') set.add(r.element);
    });
    return Array.from(set).sort();
  }, [data]);

  // Filtered dataset according to user selection
  const filteredData = useMemo(() => {
    let result = [...data];

    // Multi-month filter: if user selected specific months (e.g. MAY to JUL)
    if (filters.meses && filters.meses.length > 0) {
      result = result.filter((r) => filters.meses.includes(r.mes));
    }
    if (filters.element !== 'all') {
      result = result.filter((r) => r.element === filters.element);
    }
    if (filters.device_category !== 'all') {
      result = result.filter((r) => r.device_category === filters.device_category);
    }
    if (filters.trip_type !== 'all') {
      result = result.filter((r) => r.trip_type === filters.trip_type);
    }

    return result;
  }, [data, filters]);

  // High-level summary metrics
  const summary: DashboardSummary = useMemo(() => {
    let totalSearches = 0;
    let totalClicks = 0;
    let desktopSearches = 0;
    let desktopClicks = 0;
    let mobileSearches = 0;
    let mobileClicks = 0;
    let domesticSearches = 0;
    let domesticClicks = 0;
    let internationalSearches = 0;
    let internationalClicks = 0;

    const elementStats = new Map<string, { search: number; click_flight: number }>();
    const monthStats = new Map<number, { search: number; click_flight: number }>();

    filteredData.forEach((row) => {
      totalSearches += row.search;
      totalClicks += row.click_flight;

      if (row.device_category === 'desktop') {
        desktopSearches += row.search;
        desktopClicks += row.click_flight;
      } else {
        mobileSearches += row.search;
        mobileClicks += row.click_flight;
      }

      if (row.trip_type === 'domestic') {
        domesticSearches += row.search;
        domesticClicks += row.click_flight;
      } else {
        internationalSearches += row.search;
        internationalClicks += row.click_flight;
      }

      // Per element
      const curElem = elementStats.get(row.element) || { search: 0, click_flight: 0 };
      curElem.search += row.search;
      curElem.click_flight += row.click_flight;
      elementStats.set(row.element, curElem);

      // Per month
      const curMonth = monthStats.get(row.mes) || { search: 0, click_flight: 0 };
      curMonth.search += row.search;
      curMonth.click_flight += row.click_flight;
      monthStats.set(row.mes, curMonth);
    });

    const avgCtr = totalSearches > 0 ? Number(((totalClicks / totalSearches) * 100).toFixed(2)) : 0;
    const desktopCtr =
      desktopSearches > 0 ? Number(((desktopClicks / desktopSearches) * 100).toFixed(2)) : 0;
    const mobileCtr =
      mobileSearches > 0 ? Number(((mobileClicks / mobileSearches) * 100).toFixed(2)) : 0;
    const domesticCtr =
      domesticSearches > 0 ? Number(((domesticClicks / domesticSearches) * 100).toFixed(2)) : 0;
    const internationalCtr =
      internationalSearches > 0
        ? Number(((internationalClicks / internationalSearches) * 100).toFixed(2))
        : 0;

    // Top element by volume
    let maxSearch = 0;
    let topElementByVolume: { element: string; search: number; click_flight: number; ctr: number } | null = null;
    elementStats.forEach((v, elem) => {
      if (v.search > maxSearch) {
        maxSearch = v.search;
        topElementByVolume = {
          element: elem,
          search: v.search,
          click_flight: v.click_flight,
          ctr: v.search > 0 ? Number(((v.click_flight / v.search) * 100).toFixed(2)) : 0,
        };
      }
    });

    // Top element by CTR (with min search threshold)
    let maxCtr = 0;
    let topElementByCtr: { element: string; ctr: number; search: number; click_flight: number } | null = null;
    elementStats.forEach((v, elem) => {
      if (v.search >= 500) {
        const ctr = (v.click_flight / v.search) * 100;
        if (ctr > maxCtr) {
          maxCtr = ctr;
          topElementByCtr = {
            element: elem,
            ctr: Number(ctr.toFixed(2)),
            search: v.search,
            click_flight: v.click_flight,
          };
        }
      }
    });

    // Best month: plain 3-letter month (MAR, ABR, etc.) without parentheses
    let bestMonthCtr = 0;
    let bestMonth: { mes: number; label: string; ctr: number; search: number } | null = null;
    monthStats.forEach((v, m) => {
      const ctr = v.search > 0 ? (v.click_flight / v.search) * 100 : 0;
      if (ctr > bestMonthCtr) {
        bestMonthCtr = ctr;
        bestMonth = {
          mes: m,
          label: MONTH_NAMES[m] || `M${m}`,
          ctr: Number(ctr.toFixed(2)),
          search: v.search,
        };
      }
    });

    return {
      totalSearches,
      totalClicks,
      avgCtr,
      topElementByCtr,
      topElementByVolume,
      bestMonth,
      desktopCtr,
      mobileCtr,
      domesticCtr,
      internationalCtr,
    };
  }, [filteredData]);

  const formatNumberDisplay = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
    return num.toLocaleString('es-AR');
  };

  if (!authUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          try {
            localStorage.setItem('turismocity_auth_user', JSON.stringify(user));
          } catch (e) {
            console.error(e);
          }
          setAuthUser(user);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#2D384C] flex flex-col antialiased font-sans">
      {/* Top Header */}
      <Header
        onOpenSidebar={() => setIsSidebarOpen(true)}
        activeDashboard={activeDashboard}
        user={authUser}
        onLogout={handleLogout}
      />

      {/* Left Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeDashboard={activeDashboard}
        onSelectDashboard={setActiveDashboard}
        user={authUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {activeDashboard === 'ctr' ? (
          <>
            {/* Subheader */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-1">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[#2D384C] tracking-tight">
                  CTR filtros
                </h1>
                <p className="text-xs text-slate-500">
                  Search, Click_flight, CTR y Share por filtro de vuelos y device
                </p>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Card 1: Search */}
              <KpiCard
                id="kpi-searches"
                title="Search"
                value={formatNumberDisplay(summary.totalSearches)}
                subValue={`(${summary.totalSearches.toLocaleString('es-AR')})`}
                subtitle={summary.topElementByVolume ? `Top vol: ${summary.topElementByVolume.element}` : undefined}
                accent="neutral"
              />

              {/* Card 2: Click_flight */}
              <KpiCard
                id="kpi-clicks"
                title="Click_flight"
                value={formatNumberDisplay(summary.totalClicks)}
                subValue={`(${summary.totalClicks.toLocaleString('es-AR')})`}
                subtitle={`${summary.totalClicks.toLocaleString('es-AR')} salidas totales`}
                accent="neutral"
              />

              {/* Card 3: CTR */}
              <KpiCard
                id="kpi-ctr"
                title="CTR"
                value={`${summary.avgCtr}%`}
                subtitle={summary.bestMonth ? `Mejor mes: ${summary.bestMonth.label} • ${summary.bestMonth.ctr}%` : undefined}
                badgeText={summary.avgCtr >= 20 ? 'CTR > 20%' : 'Global'}
                accent="blue"
              />

              {/* Card 4: Top Filtro de vuelos CTR */}
              <KpiCard
                id="kpi-top-element"
                title="Top Filtro de vuelos CTR"
                value={summary.topElementByCtr ? `${summary.topElementByCtr.ctr}%` : '—'}
                subValue={summary.topElementByCtr ? summary.topElementByCtr.element : undefined}
                subtitle={summary.topElementByCtr ? `${summary.topElementByCtr.click_flight.toLocaleString('es-AR')} clicks` : undefined}
                badgeText={summary.topElementByCtr ? 'Destacado' : undefined}
                accent="amber"
              />
            </div>

            {/* Interactive Filters Bar (supports multi-month range selection like MAY a JUL) */}
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

            {/* Monthly Trend Evolution (renders only selected months e.g. MAY a JUL) */}
            <TrendsChart data={filteredData} />

            {/* Breakdown: Device & Trip Type */}
            <DeviceBreakdown data={filteredData} />

            {/* Filtros de Vuelos Table */}
            <RoutesTable data={filteredData} />
          </>
        ) : activeDashboard === 'uso' ? (
          /* Dashboard: Uso filtros */
          <UsageDashboard data={usageData} />
        ) : (
          /* Dashboard: Información de equipaje */
          <BaggageInfoView data={baggageData} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-3 mt-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1 font-mono text-[11px]">
          <div>
            Turismocity • Vuelos •{' '}
            {activeDashboard === 'ctr'
              ? 'CTR filtros'
              : activeDashboard === 'uso'
              ? 'Uso filtros'
              : 'Información de equipaje'}
          </div>
          <div>
            {activeDashboard === 'ctr'
              ? 'CTR = Click_flight / Search'
              : activeDashboard === 'uso'
              ? 'Uso = Event_count por filtro de vuelos'
              : 'Información y políticas de equipaje'}
          </div>
        </div>
      </footer>
    </div>
  );
}
