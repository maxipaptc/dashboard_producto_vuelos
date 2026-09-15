import { FlightMetricRow, MONTH_NAMES } from '../types';

export const RAW_TURISMOCITY_CSV = `mes,element,device_category,trip_type,search,click_flight
3,aerolineas,desktop,domestic,20351,5235
3,aerolineas,mobile,domestic,9371,1796
3,aeropuertos |,desktop,domestic,10555,2709
3,aeropuertos |,mobile,domestic,6835,1366
3,aeropuertos de escala,desktop,domestic,72,33
3,aeropuertos de escala,mobile,domestic,413,53
3,alianzas,desktop,domestic,66,53
3,alianzas,mobile,domestic,66,7
3,autotransbordo,desktop,domestic,73,13
3,autotransbordo,mobile,domestic,86,0
3,duracion,desktop,domestic,4373,1188
3,duracion,mobile,domestic,3455,582
3,equipaje,desktop,domestic,15551,5393
3,equipaje,mobile,domestic,11236,3103
3,escalas,desktop,domestic,18811,4329
3,escalas,mobile,domestic,15172,2521
3,formas de pago,desktop,domestic,1443,635
3,formas de pago,mobile,domestic,1887,675
3,horario aterrizaje,desktop,domestic,882,268
3,horario aterrizaje,mobile,domestic,1442,209
3,horario despegue,desktop,domestic,18393,4161
3,horario despegue,mobile,domestic,12667,2097
3,pago en pesos,desktop,domestic,210,79
3,pago en pesos,mobile,domestic,757,202
3,precio,desktop,domestic,2064,373
3,precio,mobile,domestic,1942,289
3,sitios de reserva,desktop,domestic,7276,2904
3,sitios de reserva,mobile,domestic,491,138
3,aerolineas,desktop,international,85223,17693
3,aerolineas,mobile,international,25658,3757
4,aeropuertos |,desktop,domestic,9507,2292
4,aeropuertos |,mobile,domestic,6103,1361
3,aeropuertos de escala,desktop,international,1735,302
3,aeropuertos de escala,mobile,international,4380,644
3,alianzas,desktop,international,1046,310
3,alianzas,mobile,international,347,34
3,autotransbordo,desktop,international,3521,636
3,autotransbordo,mobile,international,943,166
3,duracion,desktop,international,29639,5577
3,duracion,mobile,international,8760,1312
3,equipaje,desktop,international,133442,30212
3,equipaje,mobile,international,47492,11009
3,escalas,desktop,international,146850,29299
3,escalas,mobile,international,77162,11953
3,formas de pago,desktop,international,5959,2103
3,formas de pago,mobile,international,4027,825
3,horario aterrizaje,desktop,international,6700,1179
3,horario aterrizaje,mobile,international,2430,218
3,horario despegue,desktop,international,54390,10845
3,horario despegue,mobile,international,23021,3601
3,pago en pesos,desktop,international,965,327
3,pago en pesos,mobile,international,810,190
3,precio,desktop,international,11915,2616
3,precio,mobile,international,4858,753
3,sitios de reserva,desktop,international,15872,5053
3,sitios de reserva,mobile,international,1862,388
4,aerolineas,desktop,domestic,17472,4051
4,aerolineas,mobile,domestic,9340,1736
5,aeropuertos |,desktop,domestic,10001,3040
5,aeropuertos |,mobile,domestic,7216,1663
4,aeropuertos de escala,desktop,domestic,238,37
4,aeropuertos de escala,mobile,domestic,495,58
4,alianzas,desktop,domestic,84,5
4,alianzas,mobile,domestic,147,74
4,autotransbordo,desktop,domestic,205,32
4,autotransbordo,mobile,domestic,346,63
4,duracion,desktop,domestic,3454,693
4,duracion,mobile,domestic,2345,456
4,equipaje,desktop,domestic,14028,5385
4,equipaje,mobile,domestic,10394,3015
4,escalas,desktop,domestic,14332,3302
4,escalas,mobile,domestic,12221,1991
4,formas de pago,desktop,domestic,1403,522
4,formas de pago,mobile,domestic,1847,590
4,horario aterrizaje,desktop,domestic,742,105
4,horario aterrizaje,mobile,domestic,984,84
4,horario despegue,desktop,domestic,16497,3460
4,horario despegue,mobile,domestic,11143,2077
4,pago en pesos,desktop,domestic,352,90
4,pago en pesos,mobile,domestic,674,163
4,precio,desktop,domestic,1618,345
4,precio,mobile,domestic,1620,310
4,sitios de reserva,desktop,domestic,4706,1635
4,sitios de reserva,mobile,domestic,921,248
4,aerolineas,desktop,international,75496,14118
4,aerolineas,mobile,international,21569,2792
6,aeropuertos |,desktop,domestic,11079,2638
6,aeropuertos |,mobile,domestic,7646,1425
4,aeropuertos de escala,desktop,international,1751,253
4,aeropuertos de escala,mobile,international,4000,449
4,alianzas,desktop,international,778,236
4,alianzas,mobile,international,178,16
4,autotransbordo,desktop,international,3338,646
4,autotransbordo,mobile,international,862,164
4,duracion,desktop,international,24642,5066
4,duracion,mobile,international,6177,1093
4,equipaje,desktop,international,104767,23015
4,equipaje,mobile,international,38550,8255
4,escalas,desktop,international,121747,23498
4,escalas,mobile,international,61338,9003
4,formas de pago,desktop,international,5363,1573
4,formas de pago,mobile,international,2394,525
4,horario aterrizaje,desktop,international,6605,1111
4,horario aterrizaje,mobile,international,2214,212
4,horario despegue,desktop,international,40584,7273
4,horario despegue,mobile,international,18991,2554
4,pago en pesos,desktop,international,653,179
4,pago en pesos,mobile,international,396,48
4,precio,desktop,international,10290,2555
4,precio,mobile,international,3202,466
4,sitios de reserva,desktop,international,14928,4756
4,sitios de reserva,mobile,international,1145,263
5,aerolineas,desktop,domestic,11039,3283
5,aerolineas,mobile,domestic,6058,1283
7,aeropuertos |,desktop,domestic,13291,3060
7,aeropuertos |,mobile,domestic,11379,2231
5,aeropuertos de escala,desktop,domestic,310,50
5,aeropuertos de escala,mobile,domestic,498,83
5,alianzas,desktop,domestic,45,19
5,alianzas,mobile,domestic,135,26
5,autotransbordo,desktop,domestic,251,38
5,autotransbordo,mobile,domestic,145,45
5,duracion,desktop,domestic,4771,1141
5,duracion,mobile,domestic,3574,772
5,equipaje,desktop,domestic,17890,6343
5,equipaje,mobile,domestic,15262,4357
5,escalas,desktop,domestic,16459,3963
5,escalas,mobile,domestic,14682,2368
5,formas de pago,desktop,domestic,1348,548
5,formas de pago,mobile,domestic,2568,695
5,horario aterrizaje,desktop,domestic,1059,181
5,horario aterrizaje,mobile,domestic,1091,180
5,horario despegue,desktop,domestic,19475,4835
5,horario despegue,mobile,domestic,11595,1856
5,pago en pesos,desktop,domestic,233,117
5,pago en pesos,mobile,domestic,561,115
5,precio,desktop,domestic,1555,431
5,precio,mobile,domestic,2171,541
5,sitios de reserva,desktop,domestic,4895,2038
5,sitios de reserva,mobile,domestic,656,225
5,aerolineas,desktop,international,76810,16389
5,aerolineas,mobile,international,19633,2801
8,aeropuertos |,desktop,domestic,18634,4875
8,aeropuertos |,mobile,domestic,11219,2304
5,aeropuertos de escala,desktop,international,1936,258
5,aeropuertos de escala,mobile,international,3827,495
5,alianzas,desktop,international,1187,205
5,alianzas,mobile,international,64,0
5,autotransbordo,desktop,international,4037,928
5,autotransbordo,mobile,international,795,87
5,duracion,desktop,international,31937,5621
5,duracion,mobile,international,7368,1145
5,equipaje,desktop,international,128259,27515
5,equipaje,mobile,international,52917,10968
5,escalas,desktop,international,147079,29375
5,escalas,mobile,international,61811,9234
5,formas de pago,desktop,international,6735,2069
5,formas de pago,mobile,international,3711,720
5,horario aterrizaje,desktop,international,5892,1159
5,horario aterrizaje,mobile,international,1883,360
5,horario despegue,desktop,international,46579,8721
5,horario despegue,mobile,international,19522,3088
5,pago en pesos,desktop,international,826,276
5,pago en pesos,mobile,international,380,122
5,precio,desktop,international,11551,2467
5,precio,mobile,international,4373,643
5,sitios de reserva,desktop,international,15083,5504
5,sitios de reserva,mobile,international,1393,308
6,aerolineas,desktop,domestic,8769,2542
6,aerolineas,mobile,domestic,7451,1363
3,aeropuertos |,desktop,international,26682,6349
3,aeropuertos |,mobile,international,9515,1746
6,aeropuertos de escala,desktop,domestic,17,0
6,aeropuertos de escala,mobile,domestic,102,22
6,alianzas,desktop,domestic,28,23
6,alianzas,mobile,domestic,34,6
6,autotransbordo,desktop,domestic,23,6
6,autotransbordo,mobile,domestic,39,6
6,duracion,desktop,domestic,5043,1203
6,duracion,mobile,domestic,4352,761
6,equipaje,desktop,domestic,17281,5561
6,equipaje,mobile,domestic,12763,3264
6,escalas,desktop,domestic,19568,4280
6,escalas,mobile,domestic,12048,1659
6,formas de pago,desktop,domestic,1928,756
6,formas de pago,mobile,domestic,2992,864
6,horario aterrizaje,desktop,domestic,1230,204
6,horario aterrizaje,mobile,domestic,1305,205
6,horario despegue,desktop,domestic,17622,3486
6,horario despegue,mobile,domestic,12201,2134
6,pago en pesos,desktop,domestic,28,0
6,pago en pesos,mobile,domestic,73,17
6,precio,desktop,domestic,1659,546
6,precio,mobile,domestic,3366,523
6,sitios de reserva,desktop,domestic,5635,3201
6,sitios de reserva,mobile,domestic,1391,426
6,aerolineas,desktop,international,67634,12744
6,aerolineas,mobile,international,17829,2774
4,aeropuertos |,desktop,international,20535,4276
4,aeropuertos |,mobile,international,7326,1083
6,aeropuertos de escala,desktop,international,1897,289
6,aeropuertos de escala,mobile,international,3150,535
6,alianzas,desktop,international,569,121
6,alianzas,mobile,international,170,40
6,autotransbordo,desktop,international,3832,420
6,autotransbordo,mobile,international,631,159
6,duracion,desktop,international,35077,5443
6,duracion,mobile,international,7526,1159
6,equipaje,desktop,international,111458,21914
6,equipaje,mobile,international,43344,8808
6,escalas,desktop,international,152613,28114
6,escalas,mobile,international,57260,8726
6,formas de pago,desktop,international,4652,1218
6,formas de pago,mobile,international,3337,875
6,horario aterrizaje,desktop,international,9236,1458
6,horario aterrizaje,mobile,international,2728,342
6,horario despegue,desktop,international,54377,9077
6,horario despegue,mobile,international,22463,3261
6,pago en pesos,desktop,international,186,73
6,pago en pesos,mobile,international,578,73
6,precio,desktop,international,13927,2208
6,precio,mobile,international,5095,857
6,sitios de reserva,desktop,international,16690,7310
6,sitios de reserva,mobile,international,1991,391
7,aerolineas,desktop,domestic,8225,2020
7,aerolineas,mobile,domestic,7650,1664
7,aeropuertos de escala,desktop,domestic,44,7
7,aeropuertos de escala,mobile,domestic,36,7
7,alianzas,desktop,domestic,44,0
7,alianzas,mobile,domestic,385,52
7,autotransbordo,desktop,domestic,14,7
7,autotransbordo,mobile,domestic,0,0
7,duracion,desktop,domestic,4625,1236
7,duracion,mobile,domestic,4534,798
7,equipaje,desktop,domestic,20396,6021
7,equipaje,mobile,domestic,18114,4510
7,escalas,desktop,domestic,21299,4305
7,escalas,mobile,domestic,16644,2630
7,formas de pago,desktop,domestic,1520,725
7,formas de pago,mobile,domestic,4077,1243
7,horario aterrizaje,desktop,domestic,688,133
7,horario aterrizaje,mobile,domestic,1548,192
7,horario despegue,desktop,domestic,20540,4491
7,horario despegue,mobile,domestic,16952,2986
7,pago en pesos,desktop,domestic,96,30
7,pago en pesos,mobile,domestic,0,0
7,precio,desktop,domestic,2333,555
7,precio,mobile,domestic,3638,703
7,sitios de reserva,desktop,domestic,4520,1965
7,sitios de reserva,mobile,domestic,2326,498
8,aerolineas,desktop,domestic,10460,3120
8,aerolineas,mobile,domestic,7917,1795
8,aeropuertos de escala,desktop,domestic,8,0
8,aeropuertos de escala,mobile,domestic,0,0
8,alianzas,desktop,domestic,92,50
8,alianzas,mobile,domestic,235,83
8,autotransbordo,desktop,domestic,143,25
8,autotransbordo,mobile,domestic,0,0
8,duracion,desktop,domestic,7593,2181
8,duracion,mobile,domestic,5270,999
8,equipaje,desktop,domestic,26653,10352
8,equipaje,mobile,domestic,20465,5900
8,escalas,desktop,domestic,25468,6388
8,escalas,mobile,domestic,16319,2913
8,formas de pago,desktop,domestic,2535,974
8,formas de pago,mobile,domestic,4619,1130
8,horario aterrizaje,desktop,domestic,1856,344
8,horario aterrizaje,mobile,domestic,2099,276
8,horario despegue,desktop,domestic,27318,6673
8,horario despegue,mobile,domestic,21548,3874
8,pago en pesos,desktop,domestic,16,0
8,pago en pesos,mobile,domestic,25,0
8,precio,desktop,domestic,3761,966
8,precio,mobile,domestic,4357,879
8,sitios de reserva,desktop,domestic,6848,2903
8,sitios de reserva,mobile,domestic,1593,444
7,aerolineas,desktop,international,82290,15267
7,aerolineas,mobile,international,21835,3179
7,aeropuertos de escala,desktop,international,1636,303
7,aeropuertos de escala,mobile,international,4445,696
7,alianzas,desktop,international,1452,235
7,alianzas,mobile,international,357,95
7,autotransbordo,desktop,international,4293,1053
7,autotransbordo,mobile,international,1661,134
7,duracion,desktop,international,41978,6766
7,duracion,mobile,international,11157,1414
7,equipaje,desktop,international,136509,29004
7,equipaje,mobile,international,59831,12032
7,escalas,desktop,international,195717,34764
7,escalas,mobile,international,80101,11406
7,formas de pago,desktop,international,5680,1481
7,formas de pago,mobile,international,4774,1330
7,horario aterrizaje,desktop,international,14342,2112
7,horario aterrizaje,mobile,international,4418,532
7,horario despegue,desktop,international,69834,11092
7,horario despegue,mobile,international,29928,3762
7,pago en pesos,desktop,international,467,126
7,pago en pesos,mobile,international,964,303
7,precio,desktop,international,14765,2961
7,precio,mobile,international,7301,1034
7,sitios de reserva,desktop,international,14891,5149
7,sitios de reserva,mobile,international,2313,665
8,aerolineas,desktop,international,116779,22613
8,aerolineas,mobile,international,31473,5179
8,aeropuertos de escala,desktop,international,1310,453
8,aeropuertos de escala,mobile,international,5271,956
8,alianzas,desktop,international,1024,209
8,alianzas,mobile,international,184,58
8,autotransbordo,desktop,international,4952,764
8,autotransbordo,mobile,international,1069,218
8,duracion,desktop,international,48551,8572
8,duracion,mobile,international,16471,2321
8,equipaje,desktop,international,203738,42373
8,equipaje,mobile,international,90604,18283
8,escalas,desktop,international,230164,47080
8,escalas,mobile,international,98706,15355
8,formas de pago,desktop,international,7035,2243
8,formas de pago,mobile,international,6311,1550
8,horario aterrizaje,desktop,international,11138,1693
8,horario aterrizaje,mobile,international,3811,747
8,horario despegue,desktop,international,76462,15663
8,horario despegue,mobile,international,39128,6202
8,pago en pesos,desktop,international,622,279
8,pago en pesos,mobile,international,932,269
8,precio,desktop,international,20969,4104
8,precio,mobile,international,9278,1652
8,sitios de reserva,desktop,international,28232,9829
8,sitios de reserva,mobile,international,2743,568
5,aeropuertos |,desktop,international,21585,4611
5,aeropuertos |,mobile,international,8656,1796
6,aeropuertos |,desktop,international,20933,4413
6,aeropuertos |,mobile,international,8963,1681
7,aeropuertos |,desktop,international,29732,5958
7,aeropuertos |,mobile,international,12741,2079
8,aeropuertos |,desktop,international,34684,8564
8,aeropuertos |,mobile,international,16371,3113`;

export function cleanElementName(name: string): string {
  if (!name) return 'General';
  let cleaned = name.trim();
  // Remove trailing pipes or weird characters
  cleaned = cleaned.replace(/\|+$/, '').trim();
  // Capitalize nicely
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function parseRawDataset(csvText: string): FlightMetricRow[] {
  const lines = csvText.trim().split('\n');
  const rows: FlightMetricRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 6) continue;

    const mes = parseInt(parts[0], 10) || 1;
    const rawElement = parts[1].trim();
    const device = parts[2].trim().toLowerCase();
    const tripType = parts[3].trim().toLowerCase();
    const search = parseInt(parts[4], 10) || 0;
    const clickFlight = parseInt(parts[5], 10) || 0;
    const ctr = search > 0 ? Number(((clickFlight / search) * 100).toFixed(2)) : 0;

    const monthName = MONTH_NAMES[mes] || `M${mes}`;

    rows.push({
      id: `row-${i}`,
      mes,
      element: cleanElementName(rawElement),
      device_category: device,
      trip_type: tripType,
      search,
      click_flight: clickFlight,
      ctr,
      displayMonth: monthName,
      fecha: `2026-0${mes}-01`,
    });
  }

  // Sort by mes asc then element
  return rows.sort((a, b) => a.mes - b.mes || a.element.localeCompare(b.element));
}

export const SAMPLE_FLIGHT_DATA: FlightMetricRow[] = parseRawDataset(RAW_TURISMOCITY_CSV);
