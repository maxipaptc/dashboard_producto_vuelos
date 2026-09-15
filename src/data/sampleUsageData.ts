import { FilterUsageRow, MONTH_NAMES } from '../types';
import { cleanElementName } from './sampleFlightData';

export const RAW_USAGE_CSV = `mes,element,element 2,trip_type,event_count
3,equipaje,desktop,domestic,12314
3,equipaje,desktop,international,92122
3,equipaje,mobile,domestic,9236
3,equipaje,mobile,international,36965
3,escalas,desktop,domestic,8180
3,escalas,desktop,international,79909
3,escalas,mobile,domestic,8610
3,escalas,mobile,international,47532
3,aerolineas,desktop,domestic,16239
3,aerolineas,desktop,international,88183
3,aerolineas,mobile,domestic,8529
3,aerolineas,mobile,international,24399
3,horario despegue,desktop,domestic,15639
3,horario despegue,desktop,international,34064
3,horario despegue,mobile,domestic,13373
3,horario despegue,mobile,international,18792
3,aeropuertos,desktop,domestic,6175
3,aeropuertos,desktop,international,12071
3,aeropuertos,mobile,domestic,4727
3,aeropuertos,mobile,international,6319
3,duracion,desktop,domestic,1454
3,duracion,desktop,international,18139
3,duracion,mobile,domestic,1934
3,duracion,mobile,international,6500
3,formas de pago,desktop,domestic,1120
3,formas de pago,desktop,international,4890
3,formas de pago,mobile,domestic,1430
3,formas de pago,mobile,international,3150
3,precio,desktop,domestic,1850
3,precio,desktop,international,9420
3,precio,mobile,domestic,1620
3,precio,mobile,international,4100
4,equipaje,desktop,domestic,11940
4,equipaje,desktop,international,88400
4,equipaje,mobile,domestic,9810
4,equipaje,mobile,international,39200
4,escalas,desktop,domestic,7900
4,escalas,desktop,international,81200
4,escalas,mobile,domestic,8400
4,escalas,mobile,international,49100
4,aerolineas,desktop,domestic,15400
4,aerolineas,desktop,international,91200
4,aerolineas,mobile,domestic,8900
4,aerolineas,mobile,international,26100
4,horario despegue,desktop,domestic,14900
4,horario despegue,desktop,international,35100
4,horario despegue,mobile,domestic,13800
4,horario despegue,mobile,international,19400
4,aeropuertos,desktop,domestic,5800
4,aeropuertos,desktop,international,11900
4,aeropuertos,mobile,domestic,4900
4,aeropuertos,mobile,international,6800
4,duracion,desktop,domestic,1390
4,duracion,desktop,international,17500
4,duracion,mobile,domestic,1850
4,duracion,mobile,international,6200
5,equipaje,desktop,domestic,16362
5,equipaje,desktop,international,84371
5,equipaje,mobile,domestic,11826
5,equipaje,mobile,international,35644
5,escalas,desktop,domestic,9200
5,escalas,desktop,international,88900
5,escalas,mobile,domestic,9400
5,escalas,mobile,international,53400
5,aerolineas,desktop,domestic,18100
5,aerolineas,desktop,international,98600
5,aerolineas,mobile,domestic,9900
5,aerolineas,mobile,international,28900
5,horario despegue,desktop,domestic,16900
5,horario despegue,desktop,international,38500
5,horario despegue,mobile,domestic,14900
5,horario despegue,mobile,international,21200
5,aeropuertos,desktop,domestic,6900
5,aeropuertos,desktop,international,13900
5,aeropuertos,mobile,domestic,5600
5,aeropuertos,mobile,international,7900
5,duracion,desktop,domestic,1650
5,duracion,desktop,international,19800
5,duracion,mobile,domestic,2150
5,duracion,mobile,international,7200
6,equipaje,desktop,domestic,14200
6,equipaje,desktop,international,102500
6,equipaje,mobile,domestic,11200
6,equipaje,mobile,international,46800
6,escalas,desktop,domestic,9800
6,escalas,desktop,international,94200
6,escalas,mobile,domestic,10100
6,escalas,mobile,international,57900
6,aerolineas,desktop,domestic,19400
6,aerolineas,desktop,international,104800
6,aerolineas,mobile,domestic,10600
6,aerolineas,mobile,international,31400
6,horario despegue,desktop,domestic,17800
6,horario despegue,desktop,international,41200
6,horario despegue,mobile,domestic,15800
6,horario despegue,mobile,international,22900
6,aeropuertos,desktop,domestic,7400
6,aeropuertos,desktop,international,14800
6,aeropuertos,mobile,domestic,6100
6,aeropuertos,mobile,international,8500
6,duracion,desktop,domestic,1790
6,duracion,desktop,international,21400
6,duracion,mobile,domestic,2340
6,duracion,mobile,international,7800
7,equipaje,desktop,domestic,15600
7,equipaje,desktop,international,114200
7,equipaje,mobile,domestic,12400
7,equipaje,mobile,international,51800
7,escalas,desktop,domestic,10900
7,escalas,desktop,international,105300
7,escalas,mobile,domestic,11200
7,escalas,mobile,international,63800
7,aerolineas,desktop,domestic,21200
7,aerolineas,desktop,international,116800
7,aerolineas,mobile,domestic,11800
7,aerolineas,mobile,international,34900
7,horario despegue,desktop,domestic,19600
7,horario despegue,desktop,international,45800
7,horario despegue,mobile,domestic,17400
7,horario despegue,mobile,international,25400
7,aeropuertos,desktop,domestic,8200
7,aeropuertos,desktop,international,16500
7,aeropuertos,mobile,domestic,6800
7,aeropuertos,mobile,international,9400
7,duracion,desktop,domestic,1980
7,duracion,desktop,international,23900
7,duracion,mobile,domestic,2590
7,duracion,mobile,international,8650
8,equipaje,desktop,domestic,16800
8,equipaje,desktop,international,123500
8,equipaje,mobile,domestic,13400
8,equipaje,mobile,international,56200
8,escalas,desktop,domestic,11800
8,escalas,desktop,international,114900
8,escalas,mobile,domestic,12100
8,escalas,mobile,international,69400
8,aerolineas,desktop,domestic,22900
8,aerolineas,desktop,international,127400
8,aerolineas,mobile,domestic,12800
8,aerolineas,mobile,international,38100
8,horario despegue,desktop,domestic,21200
8,horario despegue,desktop,international,49800
8,horario despegue,mobile,domestic,18900
8,horario despegue,mobile,international,27600
8,aeropuertos,desktop,domestic,8900
8,aeropuertos,desktop,international,17900
8,aeropuertos,mobile,domestic,7400
8,aeropuertos,mobile,international,10300
8,duracion,desktop,domestic,2150
8,duracion,desktop,international,25900
8,duracion,mobile,domestic,2810
8,duracion,mobile,international,9400`;

export function parseRawUsageDataset(csvText: string): FilterUsageRow[] {
  const lines = csvText.trim().split('\n');
  const rows: FilterUsageRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 5) continue;

    const mes = parseInt(parts[0], 10) || 1;
    const rawElement = parts[1].trim();
    const device = parts[2].trim().toLowerCase();
    const tripType = parts[3].trim().toLowerCase();
    const eventCount = parseInt(parts[4], 10) || 0;

    const monthName = MONTH_NAMES[mes] || `M${mes}`;

    rows.push({
      id: `usage-row-${i}`,
      mes,
      element: cleanElementName(rawElement),
      device_category: device,
      trip_type: tripType,
      event_count: eventCount,
      displayMonth: monthName,
    });
  }

  return rows.sort((a, b) => a.mes - b.mes || b.event_count - a.event_count);
}

export const SAMPLE_USAGE_DATA: FilterUsageRow[] = parseRawUsageDataset(RAW_USAGE_CSV);
