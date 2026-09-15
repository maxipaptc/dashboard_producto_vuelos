import Papa from 'papaparse';
import { FlightMetricRow, FilterUsageRow, MONTH_NAMES, BaggageInfoRow } from '../types';
import { cleanElementName } from '../data/sampleFlightData';

export interface ParseResult {
  success: boolean;
  data: FlightMetricRow[];
  error?: string;
  detectedColumns?: {
    mesCol?: string;
    elementCol?: string;
    deviceCol?: string;
    tripTypeCol?: string;
    searchCol?: string;
    clickFlightCol?: string;
  };
  totalRowsParsed?: number;
}

/**
 * Extracts Google Spreadsheet ID and GID from any valid Google Sheets URL
 */
export function extractSpreadsheetId(url: string): { sheetId: string | null; gid: string | null } {
  const matchId = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const matchGid = url.match(/[#&?]gid=([0-9]+)/);

  return {
    sheetId: matchId ? matchId[1] : null,
    gid: matchGid ? matchGid[1] : null,
  };
}

/**
 * Normalizes header string to ease fuzzy matching
 */
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[\s_|-]+/g, '');
}

/**
 * Parses numeric value flexibly (handling "1.500", "1,500", "1500", etc.)
 */
function parseCleanNumber(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : Math.round(val);
  if (!val) return 0;

  let str = String(val).trim();
  str = str.replace(/[^\d.,-]/g, '');
  if (!str) return 0;

  const hasComma = str.includes(',');
  const hasDot = str.includes('.');

  if (hasComma && hasDot) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      str = str.replace(/,/g, '');
    }
  } else if (hasComma && !hasDot) {
    const parts = str.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      str = str.replace(',', '.');
    } else {
      str = str.replace(/,/g, '');
    }
  } else if (hasDot && !hasComma) {
    const parts = str.split('.');
    if (parts.length === 2 && parts[1].length === 3) {
      str = str.replace(/\./g, '');
    }
  }

  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.round(num);
}

/**
 * Parses raw tabular rows into FlightMetricRow[]
 */
export function processRawRows(rawRows: Record<string, any>[] | any[][]): ParseResult {
  if (!rawRows || rawRows.length === 0) {
    return { success: false, data: [], error: 'El archivo o planilla no contiene filas de datos.' };
  }

  // Support 2D array: [ [header1, header2, ...], [val1, val2, ...], ... ]
  if (Array.isArray(rawRows) && rawRows.length > 0 && Array.isArray(rawRows[0])) {
    const headers = (rawRows[0] as unknown as any[]).map((h) => String(h ?? '').trim());
    const converted: Record<string, any>[] = [];
    for (let i = 1; i < rawRows.length; i++) {
      const rowArr = rawRows[i] as unknown as any[];
      if (!rowArr || !Array.isArray(rowArr) || rowArr.length === 0) continue;
      const obj: Record<string, any> = {};
      headers.forEach((h, hIdx) => {
        if (h) obj[h] = rowArr[hIdx];
      });
      converted.push(obj);
    }
    return processRawRows(converted);
  }

  const sampleRow = rawRows[0] as Record<string, any>;
  const keys = Object.keys(sampleRow);

  // 1. Month column (mes, month, fecha, date)
  const mesCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['mes', 'month', 'meses', 'periodo', 'fecha', 'date'].includes(norm);
  });

  // 2. Element column (element, elemento, filtro, filter, feature, componente, ruta)
  const elementCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['element', 'elemento', 'filtro', 'filter', 'feature', 'componente', 'ruta', 'route'].includes(norm);
  });

  // 3. Device category (device_category, devicecategory, device, dispositivo, plataforma)
  const deviceCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['devicecategory', 'device', 'dispositivo', 'plataforma', 'categoria'].includes(norm);
  });

  // 4. Trip type (trip_type, triptype, tipoviaje, tipo, mercado)
  const tripTypeCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['triptype', 'tipoviaje', 'tipo', 'mercado', 'viaje'].includes(norm);
  });

  // 5. Search volume (search, searches, busqueda, busquedas, consultas)
  const searchCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['search', 'searches', 'searchs', 'busqueda', 'busquedas', 'consultas', 'volumen'].includes(norm);
  });

  // 6. Click flight volume (click_flight, clickflight, clickflights, clicks, clics, salidas)
  const clickFlightCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['clickflight', 'clickflights', 'click', 'clicks', 'clics', 'salidas', 'exitclicks'].includes(norm);
  });

  // Check required
  const missing: string[] = [];
  if (!searchCol) missing.push('Búsquedas (ej: "search" o "busquedas")');
  if (!clickFlightCol) missing.push('Clics (ej: "click_flight" o "clics")');

  if (missing.length > 0) {
    return {
      success: false,
      data: [],
      error: `Faltan columnas requeridas en la planilla: ${missing.join(', ')}. Columnas detectadas: [${keys.join(', ')}]`,
    };
  }

  const parsedData: FlightMetricRow[] = [];

  rawRows.forEach((row, index) => {
    // Extract mes
    let mes = 3;
    if (mesCol && row[mesCol] !== undefined) {
      const rawMes = String(row[mesCol]).trim();
      // If it's a number like 3, 4, 5
      const parsedNum = parseInt(rawMes, 10);
      if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= 12) {
        mes = parsedNum;
      } else if (rawMes.includes('-') || rawMes.includes('/')) {
        // e.g. 2026-04-15
        const match = rawMes.match(/[-/](\d{1,2})[-/]/);
        if (match) {
          const m = parseInt(match[1], 10);
          if (m >= 1 && m <= 12) mes = m;
        }
      }
    }

    const rawElement = elementCol ? String(row[elementCol] || '').trim() : 'General';
    const element = cleanElementName(rawElement || 'General');

    const rawDevice = deviceCol ? String(row[deviceCol] || '').trim().toLowerCase() : 'desktop';
    const device_category = rawDevice.includes('mob') ? 'mobile' : 'desktop';

    const rawTrip = tripTypeCol ? String(row[tripTypeCol] || '').trim().toLowerCase() : 'domestic';
    const trip_type = rawTrip.includes('inter') ? 'international' : 'domestic';

    const search = parseCleanNumber(row[searchCol!]);
    const click_flight = parseCleanNumber(row[clickFlightCol!]);
    const ctr = search > 0 ? Number(((click_flight / search) * 100).toFixed(2)) : 0;

    const monthName = MONTH_NAMES[mes] || `M${mes}`;

    parsedData.push({
      id: `row-${index + 1}`,
      mes,
      element,
      device_category,
      trip_type,
      search,
      click_flight,
      ctr,
      displayMonth: monthName,
      fecha: `2026-0${mes}-01`,
    });
  });

  // Sort by mes asc then element
  parsedData.sort((a, b) => a.mes - b.mes || a.element.localeCompare(b.element));

  return {
    success: true,
    data: parsedData,
    detectedColumns: {
      mesCol,
      elementCol,
      deviceCol,
      tripTypeCol,
      searchCol,
      clickFlightCol,
    },
    totalRowsParsed: parsedData.length,
  };
}

/**
 * Fetches and parses Google Sheets using Google Visualization API (GViz)
 * Supports specifying sheet name (defaults to "CTR Base" with intelligent fallbacks)
 */
export async function fetchGoogleSheetGViz(
  sheetUrlOrId: string,
  sheetName: string = 'CTR Base'
): Promise<ParseResult> {
  const cleanUrl = sheetUrlOrId.trim();

  // Check if it's a Google Apps Script Web App URL
  if (cleanUrl.includes('script.google.com')) {
    try {
      const urlWithParam = cleanUrl.includes('sheet=')
        ? cleanUrl
        : cleanUrl.includes('?')
        ? `${cleanUrl}&sheet=${encodeURIComponent(sheetName)}`
        : `${cleanUrl}?sheet=${encodeURIComponent(sheetName)}`;

      let response = await fetch(urlWithParam);
      if (!response.ok) {
        response = await fetch(cleanUrl);
      }

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al consultar Apps Script.`);
      }

      let json: any = null;
      const text = await response.text();
      try {
        json = JSON.parse(text);
      } catch {
        return parsePastedText(text);
      }

      if (json) {
        let rawRows: any[] = [];
        if (Array.isArray(json)) {
          rawRows = json;
        } else if (json['ctr filtros'] && Array.isArray(json['ctr filtros'])) {
          rawRows = json['ctr filtros'];
        } else if (json['ctr_filtros'] && Array.isArray(json['ctr_filtros'])) {
          rawRows = json['ctr_filtros'];
        } else if (json['CTR filtros'] && Array.isArray(json['CTR filtros'])) {
          rawRows = json['CTR filtros'];
        } else if (json['CTR Base'] && Array.isArray(json['CTR Base'])) {
          rawRows = json['CTR Base'];
        } else if (json.ctr && Array.isArray(json.ctr)) {
          rawRows = json.ctr;
        } else if (json.CTR && Array.isArray(json.CTR)) {
          rawRows = json.CTR;
        } else if (json.data && Array.isArray(json.data)) {
          rawRows = json.data;
        } else if (json.rows && Array.isArray(json.rows)) {
          rawRows = json.rows;
        } else if (typeof json === 'object') {
          // If first property contains an array
          const firstVal = Object.values(json).find((v) => Array.isArray(v));
          if (firstVal && Array.isArray(firstVal)) {
            rawRows = firstVal;
          }
        }
        return processRawRows(rawRows);
      }
    } catch (err: any) {
      return {
        success: false,
        data: [],
        error: `Error al obtener datos de Apps Script: ${err.message}. Asegúrate de que la Aplicación Web esté implementada con acceso para "Cualquiera" (Anyone).`,
      };
    }
  }

  const { sheetId, gid } = extractSpreadsheetId(cleanUrl);
  const actualId = sheetId || cleanUrl;

  if (!actualId) {
    return {
      success: false,
      data: [],
      error: 'La URL o ID del Google Sheet ingresado no es válido.',
    };
  }

  // Candidate sheet names: user requested sheet, 'ctr filtros', 'CTR Base', 'Base', and undefined (first tab by default)
  const candidateNames: (string | undefined)[] = Array.from(
    new Set([sheetName, 'ctr filtros', 'ctr_filtros', 'CTR filtros', 'CTR Base', 'Base', undefined].filter((s) => s !== ''))
  );

  // Attempt 1: Fetch via GViz endpoint with candidate sheet names
  for (const candidate of candidateNames) {
    try {
      let gvizUrl = `https://docs.google.com/spreadsheets/d/${actualId}/gviz/tq?tqx=out:json`;
      if (candidate) {
        gvizUrl += `&sheet=${encodeURIComponent(candidate)}`;
      }
      if (gid) {
        gvizUrl += `&gid=${gid}`;
      }

      const response = await fetch(gvizUrl);
      if (response.ok) {
        const text = await response.text();
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/);

        if (jsonMatch && jsonMatch[1]) {
          const parsedJson = JSON.parse(jsonMatch[1]);
          const table = parsedJson.table;

          if (table && table.cols && table.rows && table.rows.length > 0) {
            const colNames = table.cols.map((col: any, idx: number) => {
              return col.label && col.label.trim() ? col.label.trim() : `Col_${idx + 1}`;
            });

            const rawRows: Record<string, any>[] = [];
            table.rows.forEach((r: any) => {
              const rowObj: Record<string, any> = {};
              let hasValue = false;
              r.c?.forEach((cell: any, cIdx: number) => {
                const colName = colNames[cIdx];
                const val = cell ? (cell.f !== undefined && cell.f !== null ? cell.f : cell.v) : '';
                rowObj[colName] = val;
                if (val !== '' && val !== null && val !== undefined) hasValue = true;
              });
              if (hasValue) rawRows.push(rowObj);
            });

            if (rawRows.length > 0) {
              const result = processRawRows(rawRows);
              if (result.success && result.data.length > 0) {
                return result;
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.warn(`GViz fetch failed for candidate "${candidate}":`, err);
    }
  }

  // Attempt 2: Try CSV export endpoint with candidate names or gid
  for (const candidate of candidateNames) {
    try {
      let csvUrl = `https://docs.google.com/spreadsheets/d/${actualId}/gviz/tq?tqx=out:csv`;
      if (candidate) {
        csvUrl += `&sheet=${encodeURIComponent(candidate)}`;
      }
      if (gid) {
        csvUrl += `&gid=${gid}`;
      }

      let csvResp = await fetch(csvUrl);
      if (!csvResp.ok) {
        const directExportUrl = `https://docs.google.com/spreadsheets/d/${actualId}/export?format=csv${
          gid ? `&gid=${gid}` : candidate ? `&sheet=${encodeURIComponent(candidate)}` : ''
        }`;
        csvResp = await fetch(directExportUrl);
      }

      if (csvResp.ok) {
        const csvText = await csvResp.text();
        const result = parsePastedText(csvText);
        if (result.success && result.data.length > 0) {
          return result;
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  return {
    success: false,
    data: [],
    error:
      'No se pudo acceder a la hoja de cálculo. Asegúrate de que el documento tenga permisos de "Cualquiera con el enlace puede ver" en Google Sheets (Archivo > Compartir > Cualquier persona que tenga el vínculo).',
  };
}

/**
 * Parses raw text pasted from Google Sheets (TSV or CSV)
 */
export function parsePastedText(text: string): ParseResult {
  if (!text || !text.trim()) {
    return { success: false, data: [], error: 'El texto ingresado está vacío.' };
  }

  const result = Papa.parse<Record<string, any>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (result.errors && result.errors.length > 0 && result.data.length === 0) {
    return {
      success: false,
      data: [],
      error: `Error de formato al procesar datos: ${result.errors[0].message}`,
    };
  }

  return processRawRows(result.data);
}

export interface ParseUsageResult {
  success: boolean;
  data: FilterUsageRow[];
  error?: string;
}

/**
 * Parses raw rows from Google Sheets into FilterUsageRow[]
 * Detects 'element 2' as device category, 'element' as filter, and 'event_count' as interactions
 */
export function processRawUsageRows(rawRows: Record<string, any>[] | any[][]): ParseUsageResult {
  if (!rawRows || rawRows.length === 0) {
    return { success: false, data: [], error: 'La planilla "Uso" no contiene filas de datos.' };
  }

  // Support 2D array: [ [header1, header2, ...], [val1, val2, ...], ... ]
  if (Array.isArray(rawRows) && rawRows.length > 0 && Array.isArray(rawRows[0])) {
    const headers = (rawRows[0] as unknown as any[]).map((h) => String(h ?? '').trim());
    const converted: Record<string, any>[] = [];
    for (let i = 1; i < rawRows.length; i++) {
      const rowArr = rawRows[i] as unknown as any[];
      if (!rowArr || !Array.isArray(rowArr) || rowArr.length === 0) continue;
      const obj: Record<string, any> = {};
      headers.forEach((h, hIdx) => {
        if (h) obj[h] = rowArr[hIdx];
      });
      converted.push(obj);
    }
    return processRawUsageRows(converted);
  }

  const sampleRow = rawRows[0] as Record<string, any>;
  const keys = Object.keys(sampleRow);

  // 1. Month column (mes, month, fecha)
  const mesCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['mes', 'month', 'meses', 'periodo', 'fecha', 'date'].includes(norm);
  });

  // 2. Element column (element, elemento, filtro, filter)
  const elementCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['element', 'elemento', 'filtro', 'filter', 'feature', 'componente'].includes(norm);
  });

  // 3. Device category (element 2, element2, device_category, device)
  const deviceCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['element2', 'element_2', 'devicecategory', 'device', 'dispositivo', 'plataforma', 'categoria'].includes(norm);
  });

  // 4. Trip type (trip_type, triptype, tipoviaje, tipo, mercado)
  const tripTypeCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['triptype', 'trip_type', 'tipoviaje', 'tipo', 'mercado', 'viaje'].includes(norm);
  });

  // 5. Event count (event_count, eventcount, count, usos, eventos)
  const eventCountCol = keys.find((k) => {
    const norm = normalizeHeader(k);
    return ['eventcount', 'event_count', 'event', 'events', 'usos', 'uso', 'count', 'cantidad', 'eventos'].includes(norm);
  });

  if (!eventCountCol) {
    return {
      success: false,
      data: [],
      error: `No se encontró la columna de conteo de eventos (event_count) en la hoja "Uso". Columnas detectadas: [${keys.join(', ')}]`,
    };
  }

  const parsedData: FilterUsageRow[] = [];

  rawRows.forEach((row: any, index) => {
    let mes = 3;
    if (mesCol && row[mesCol] !== undefined) {
      const rawMes = String(row[mesCol]).trim();
      const numMes = parseInt(rawMes, 10);
      if (!isNaN(numMes) && numMes >= 1 && numMes <= 12) {
        mes = numMes;
      } else {
        const lowerMes = rawMes.toLowerCase();
        if (lowerMes.includes('may')) mes = 5;
        else if (lowerMes.includes('mar')) mes = 3;
        else if (lowerMes.includes('abr') || lowerMes.includes('apr')) mes = 4;
        else if (lowerMes.includes('jun')) mes = 6;
        else if (lowerMes.includes('jul')) mes = 7;
        else if (lowerMes.includes('ago') || lowerMes.includes('aug')) mes = 8;
        else if (lowerMes.includes('sep') || lowerMes.includes('set')) mes = 9;
        else if (lowerMes.includes('oct')) mes = 10;
        else if (lowerMes.includes('nov')) mes = 11;
        else if (lowerMes.includes('dic') || lowerMes.includes('dec')) mes = 12;
        else if (lowerMes.includes('ene') || lowerMes.includes('jan')) mes = 1;
        else if (lowerMes.includes('feb')) mes = 2;
      }
    }

    const rawElem = elementCol && row[elementCol] !== undefined ? String(row[elementCol]).trim() : 'General';
    if (!rawElem) return;

    let device = 'desktop';
    if (deviceCol && row[deviceCol] !== undefined) {
      const d = String(row[deviceCol]).trim().toLowerCase();
      if (d.includes('mob') || d.includes('cel') || d.includes('app')) {
        device = 'mobile';
      } else {
        device = 'desktop';
      }
    }

    let tripType = 'domestic';
    if (tripTypeCol && row[tripTypeCol] !== undefined) {
      const t = String(row[tripTypeCol]).trim().toLowerCase();
      if (t.includes('int')) {
        tripType = 'international';
      } else {
        tripType = 'domestic';
      }
    }

    const eventCount = parseCleanNumber(row[eventCountCol]);
    const monthName = MONTH_NAMES[mes] || `M${mes}`;

    parsedData.push({
      id: `usage-${index}-${mes}-${rawElem}-${device}-${tripType}`,
      mes,
      element: cleanElementName(rawElem),
      device_category: device,
      trip_type: tripType,
      event_count: eventCount,
      displayMonth: monthName,
    });
  });

  return {
    success: true,
    data: parsedData,
  };
}

/**
 * Fetches and parses the Google Sheets "Uso" tab using Google Visualization API (GViz)
 */
export async function fetchGoogleSheetUsageGViz(
  sheetUrlOrId: string,
  sheetName: string = 'Uso'
): Promise<ParseUsageResult> {
  const cleanUrl = sheetUrlOrId.trim();

  // 1. Check if it's a Google Apps Script Web App URL
  if (cleanUrl.includes('script.google.com')) {
    try {
      const urlWithParam = cleanUrl.includes('sheet=')
        ? cleanUrl
        : cleanUrl.includes('?')
        ? `${cleanUrl}&sheet=${encodeURIComponent(sheetName)}`
        : `${cleanUrl}?sheet=${encodeURIComponent(sheetName)}`;

      let response = await fetch(urlWithParam);
      if (!response.ok) {
        response = await fetch(cleanUrl);
      }

      if (response.ok) {
        let json: any = null;
        const text = await response.text();
        try {
          json = JSON.parse(text);
        } catch {}

        if (json) {
          let rawRows: any[] = [];
          if (json['uso filtros'] && Array.isArray(json['uso filtros'])) {
            rawRows = json['uso filtros'];
          } else if (json.Uso && Array.isArray(json.Uso)) {
            rawRows = json.Uso;
          } else if (json.uso && Array.isArray(json.uso)) {
            rawRows = json.uso;
          } else if (json['Uso filtros'] && Array.isArray(json['Uso filtros'])) {
            rawRows = json['Uso filtros'];
          } else if (json['uso_filtros'] && Array.isArray(json['uso_filtros'])) {
            rawRows = json['uso_filtros'];
          } else if (Array.isArray(json)) {
            rawRows = json;
          } else if (json.data && Array.isArray(json.data)) {
            rawRows = json.data;
          } else if (json.rows && Array.isArray(json.rows)) {
            rawRows = json.rows;
          } else if (typeof json === 'object') {
            const arr = Object.values(json).find((v) => Array.isArray(v));
            if (arr && Array.isArray(arr)) rawRows = arr;
          }

          if (rawRows.length > 0) {
            const result = processRawUsageRows(rawRows);
            if (result.success && result.data.length > 0) {
              return result;
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('Apps Script usage fetch error:', err);
    }
  }

  // 2. Google Sheets GViz / direct export
  let actualId = cleanUrl;

  if (cleanUrl.includes('google.com') || cleanUrl.includes('http')) {
    const extracted = extractSpreadsheetId(cleanUrl);
    if (!extracted.sheetId) {
      return {
        success: false,
        data: [],
        error: 'El enlace ingresado no parece ser una URL válida de Google Sheets.',
      };
    }
    actualId = extracted.sheetId;
  }

  const candidateNames: string[] = Array.from(
    new Set([sheetName, 'uso filtros', 'uso_filtros', 'Uso filtros', 'Uso', 'uso', 'USO', 'Uso '].filter((s) => s.trim() !== ''))
  );

  // Attempt 1: Fetch via GViz endpoint with candidate sheet names (no &gid to avoid locking to the first sheet)
  for (const candidate of candidateNames) {
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${actualId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
        candidate
      )}`;

      const response = await fetch(gvizUrl);
      if (response.ok) {
        const text = await response.text();
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/);

        if (jsonMatch && jsonMatch[1]) {
          const parsedJson = JSON.parse(jsonMatch[1]);
          const table = parsedJson.table;

          if (table && table.cols && table.rows && table.rows.length > 0) {
            const colNames = table.cols.map((col: any, idx: number) => {
              return col.label && col.label.trim() ? col.label.trim() : `Col_${idx + 1}`;
            });

            const rawRows: Record<string, any>[] = [];
            table.rows.forEach((r: any) => {
              const rowObj: Record<string, any> = {};
              let hasValue = false;
              r.c?.forEach((cell: any, cIdx: number) => {
                const colName = colNames[cIdx];
                const val = cell ? (cell.f !== undefined && cell.f !== null ? cell.f : cell.v) : '';
                rowObj[colName] = val;
                if (val !== '' && val !== null && val !== undefined) hasValue = true;
              });
              if (hasValue) rawRows.push(rowObj);
            });

            if (rawRows.length > 0) {
              const result = processRawUsageRows(rawRows);
              if (result.success && result.data.length > 0) {
                return result;
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.warn(`GViz usage fetch failed for candidate "${candidate}":`, err);
    }
  }

  // Attempt 2: Try CSV export fallback
  for (const candidate of candidateNames) {
    try {
      let csvUrl = `https://docs.google.com/spreadsheets/d/${actualId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
        candidate
      )}`;

      let csvResp = await fetch(csvUrl);
      if (!csvResp.ok) {
        const directExportUrl = `https://docs.google.com/spreadsheets/d/${actualId}/export?format=csv&sheet=${encodeURIComponent(
          candidate
        )}`;
        csvResp = await fetch(directExportUrl);
      }

      if (csvResp.ok) {
        const csvText = await csvResp.text();
        const parsed = Papa.parse<Record<string, any>>(csvText.trim(), {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
        });
        if (parsed.data && parsed.data.length > 0) {
          const result = processRawUsageRows(parsed.data);
          if (result.success && result.data.length > 0) {
            return result;
          }
        }
      }
    } catch {}
  }

  return {
    success: false,
    data: [],
    error: 'No se pudo acceder a la hoja "Uso" del Google Sheets.',
  };
}

export interface ParseBaggageResult {
  success: boolean;
  data: BaggageInfoRow[];
  error?: string;
}

/**
 * Parses raw tabular rows or 2D array into BaggageInfoRow[]
 */
export function processRawBaggageRows(rawRows: Record<string, any>[] | any[][]): ParseBaggageResult {
  if (!rawRows || rawRows.length === 0) {
    return { success: false, data: [], error: 'La hoja "info equipaje" no contiene filas de datos.' };
  }

  // Support 2D array: [ [header1, header2, ...], [val1, val2, ...], ... ]
  if (Array.isArray(rawRows) && rawRows.length > 0 && Array.isArray(rawRows[0])) {
    const headers = (rawRows[0] as unknown as any[]).map((h) => String(h ?? '').trim());
    const converted: Record<string, any>[] = [];
    for (let i = 1; i < rawRows.length; i++) {
      const rowArr = rawRows[i] as unknown as any[];
      if (!rowArr || !Array.isArray(rowArr) || rowArr.length === 0) continue;
      const obj: Record<string, any> = {};
      let hasValue = false;
      headers.forEach((h, hIdx) => {
        if (h) {
          obj[h] = rowArr[hIdx];
          if (rowArr[hIdx] !== undefined && rowArr[hIdx] !== null && String(rowArr[hIdx]).trim() !== '') {
            hasValue = true;
          }
        }
      });
      if (hasValue) converted.push(obj);
    }
    return processRawBaggageRows(converted);
  }

  const parsedData: BaggageInfoRow[] = (rawRows as Record<string, any>[])
    .filter(
      (row) =>
        row &&
        typeof row === 'object' &&
        Object.values(row).some((v) => v !== undefined && v !== null && String(v).trim() !== '')
    )
    .map((row, index) => {
      const item: BaggageInfoRow = {
        id: `baggage-${index + 1}`,
      };
      Object.entries(row).forEach(([key, val]) => {
        const cleanKey = key.trim();
        if (cleanKey) {
          item[cleanKey] = val !== undefined && val !== null ? val : '';
        }
      });
      return item;
    });

  return {
    success: true,
    data: parsedData,
  };
}

/**
 * Fetches and parses the Google Sheets "info equipaje" tab using Google Visualization API (GViz) or Apps Script
 */
export async function fetchGoogleSheetBaggageInfoGViz(
  sheetUrlOrId: string,
  sheetName: string = 'info equipaje'
): Promise<ParseBaggageResult> {
  const cleanUrl = sheetUrlOrId.trim();

  // 1. Check if it's a Google Apps Script Web App URL
  if (cleanUrl.includes('script.google.com')) {
    try {
      const urlWithParam = cleanUrl.includes('sheet=')
        ? cleanUrl
        : cleanUrl.includes('?')
        ? `${cleanUrl}&sheet=${encodeURIComponent(sheetName)}`
        : `${cleanUrl}?sheet=${encodeURIComponent(sheetName)}`;

      let response = await fetch(urlWithParam);
      if (!response.ok) {
        response = await fetch(cleanUrl);
      }

      if (response.ok) {
        let json: any = null;
        const text = await response.text();
        try {
          json = JSON.parse(text);
        } catch {}

        if (json) {
          let rawRows: any[] = [];
          if (json['info equipaje'] && Array.isArray(json['info equipaje'])) {
            rawRows = json['info equipaje'];
          } else if (json['info_equipaje'] && Array.isArray(json['info_equipaje'])) {
            rawRows = json['info_equipaje'];
          } else if (json['Info equipaje'] && Array.isArray(json['Info equipaje'])) {
            rawRows = json['Info equipaje'];
          } else if (json['Info Equipaje'] && Array.isArray(json['Info Equipaje'])) {
            rawRows = json['Info Equipaje'];
          } else if (json.equipaje && Array.isArray(json.equipaje)) {
            rawRows = json.equipaje;
          } else if (json.Equipaje && Array.isArray(json.Equipaje)) {
            rawRows = json.Equipaje;
          } else if (json.equipaje_info && Array.isArray(json.equipaje_info)) {
            rawRows = json.equipaje_info;
          } else if (Array.isArray(json)) {
            rawRows = json;
          } else if (json.data && Array.isArray(json.data)) {
            rawRows = json.data;
          } else if (json.rows && Array.isArray(json.rows)) {
            rawRows = json.rows;
          }

          if (rawRows.length > 0) {
            const result = processRawBaggageRows(rawRows);
            if (result.success && result.data.length > 0) {
              return result;
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('Apps Script baggage info fetch error:', err);
    }
  }

  // 2. Google Sheets GViz / direct export
  let actualId = cleanUrl;

  if (cleanUrl.includes('google.com') || cleanUrl.includes('http')) {
    const extracted = extractSpreadsheetId(cleanUrl);
    if (!extracted.sheetId) {
      return {
        success: false,
        data: [],
        error: 'El enlace ingresado no parece ser una URL válida de Google Sheets.',
      };
    }
    actualId = extracted.sheetId;
  }

  const candidateNames: string[] = Array.from(
    new Set([
      sheetName,
      'info equipaje',
      'info_equipaje',
      'Info equipaje',
      'Info Equipaje',
      'equipaje',
      'Equipaje',
      'Equipaje info',
    ].filter((s) => s.trim() !== ''))
  );

  // Attempt 1: Fetch via GViz endpoint with candidate sheet names
  for (const candidate of candidateNames) {
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${actualId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
        candidate
      )}`;

      const response = await fetch(gvizUrl);
      if (response.ok) {
        const text = await response.text();
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/);

        if (jsonMatch && jsonMatch[1]) {
          const parsedJson = JSON.parse(jsonMatch[1]);
          const table = parsedJson.table;

          if (table && table.cols && table.rows && table.rows.length > 0) {
            const colNames = table.cols.map((col: any, idx: number) => {
              return col.label && col.label.trim() ? col.label.trim() : `Col_${idx + 1}`;
            });

            const rawRows: Record<string, any>[] = [];
            table.rows.forEach((r: any) => {
              const rowObj: Record<string, any> = {};
              let hasValue = false;
              r.c?.forEach((cell: any, cIdx: number) => {
                const colName = colNames[cIdx];
                const val = cell ? (cell.f !== undefined && cell.f !== null ? cell.f : cell.v) : '';
                rowObj[colName] = val;
                if (val !== '' && val !== null && val !== undefined) hasValue = true;
              });
              if (hasValue) rawRows.push(rowObj);
            });

            if (rawRows.length > 0) {
              const result = processRawBaggageRows(rawRows);
              if (result.success && result.data.length > 0) {
                return result;
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.warn(`GViz baggage fetch failed for candidate "${candidate}":`, err);
    }
  }

  // Attempt 2: Try CSV export fallback
  for (const candidate of candidateNames) {
    try {
      let csvUrl = `https://docs.google.com/spreadsheets/d/${actualId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
        candidate
      )}`;

      let csvResp = await fetch(csvUrl);
      if (!csvResp.ok) {
        const directExportUrl = `https://docs.google.com/spreadsheets/d/${actualId}/export?format=csv&sheet=${encodeURIComponent(
          candidate
        )}`;
        csvResp = await fetch(directExportUrl);
      }

      if (csvResp.ok) {
        const csvText = await csvResp.text();
        const parsed = Papa.parse<Record<string, any>>(csvText.trim(), {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
        });
        if (parsed.data && parsed.data.length > 0) {
          const result = processRawBaggageRows(parsed.data);
          if (result.success && result.data.length > 0) {
            return result;
          }
        }
      }
    } catch {}
  }

  return {
    success: false,
    data: [],
    error: 'No se pudo acceder a la hoja "info equipaje" del Google Sheets.',
  };
}

