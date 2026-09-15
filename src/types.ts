export interface FlightMetricRow {
  id: string;
  mes: number; // Month number, e.g. 3, 4, 5, 6, 7, 8
  element: string; // Filtro de vuelos (e.g. 'equipaje', 'escalas', 'aerolineas', 'horario despegue')
  device_category: 'desktop' | 'mobile' | string;
  trip_type: 'domestic' | 'international' | string;
  search: number;
  click_flight: number;
  ctr: number; // calculated: (click_flight / search) * 100
  fecha?: string;
  displayMonth?: string; // e.g. 'MAR'
}

export interface DashboardSummary {
  totalSearches: number;
  totalClicks: number;
  avgCtr: number;
  topElementByCtr: { element: string; ctr: number; search: number; click_flight: number } | null;
  topElementByVolume: { element: string; search: number; click_flight: number; ctr: number } | null;
  bestMonth: { mes: number; label: string; ctr: number; search: number } | null;
  desktopCtr: number;
  mobileCtr: number;
  domesticCtr: number;
  internationalCtr: number;
}

export interface FilterState {
  meses: number[]; // empty array = 'all' months, or array of selected month numbers, e.g. [5, 6, 7]
  element: string; // 'all' or specific Filtro de vuelos
  device_category: 'all' | 'desktop' | 'mobile' | string;
  trip_type: 'all' | 'domestic' | 'international' | string;
}

export interface ConnectionSource {
  type: 'demo' | 'google-sheet-url' | 'pasted-text' | 'csv-file';
  sheetUrl?: string;
  sheetName?: string;
  lastSyncedAt?: string;
  fileName?: string;
  rowCount: number;
  isAutoSyncing?: boolean;
}

export type ActiveDashboard = 'ctr' | 'uso' | 'equipaje';

export interface BaggageInfoRow {
  id: string;
  [key: string]: any;
}

export interface FilterUsageRow {
  id: string;
  mes: number; // Month number, e.g. 3, 4, 5, 6, 7, 8
  element: string; // Filtro de vuelos (e.g. 'equipaje', 'escalas', 'aerolineas', 'horario despegue')
  device_category: 'desktop' | 'mobile' | string; // mapped from 'element 2'
  trip_type: 'domestic' | 'international' | string;
  event_count: number;
  displayMonth?: string; // e.g. 'MAR'
}

export interface UsageSummary {
  totalEvents: number;
  topElementByUsage: { element: string; event_count: number; share: number } | null;
  topMonthByUsage: { mes: number; label: string; event_count: number } | null;
  desktopEvents: number;
  desktopShare: number;
  mobileEvents: number;
  mobileShare: number;
  domesticEvents: number;
  domesticShare: number;
  internationalEvents: number;
  internationalShare: number;
}

export const MONTH_NAMES: Record<number, string> = {
  1: 'ENE',
  2: 'FEB',
  3: 'MAR',
  4: 'ABR',
  5: 'MAY',
  6: 'JUN',
  7: 'JUL',
  8: 'AGO',
  9: 'SEP',
  10: 'OCT',
  11: 'NOV',
  12: 'DIC',
};

export interface AuthUser {
  email: string;
  name: string;
  picture?: string;
  hd?: string;
}
