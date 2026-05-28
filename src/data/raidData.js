export const RAID_LEVELS = [
  { id:'0', title:'RAID 0 – Striping', short:'Maximale Geschwindigkeit, keine Sicherheit', min:'2', capacity:'100 %', tolerance:'0 Platten', performance:'Sehr schnell beim Lesen und Schreiben', use:'Gaming, temporäre Daten, Videoschnitt-Cache', risk:'Fällt eine Platte aus, sind alle Daten verloren.', color:'from-orange-400 via-red-500 to-pink-600', layout:[['A1','A3','A5'],['A2','A4','A6']] },
  { id:'1', title:'RAID 1 – Mirroring', short:'Gleiche Daten auf zwei oder mehr Platten', min:'2', capacity:'ca. 50 %', tolerance:'1 Platte pro Spiegel', performance:'Lesen oft schneller, Schreiben ähnlich wie eine Platte', use:'Systemplatten, kleine Server, wichtige Daten', risk:'Teuer pro nutzbarem GB, ersetzt kein Backup.', color:'from-sky-400 via-blue-600 to-indigo-700', layout:[['A1','A2','A3'],['A1','A2','A3']] },
  { id:'2', title:'RAID 2 – Bit-Striping mit Hamming-Code', short:'Historisch, heute praktisch nicht mehr verwendet', min:'Mehrere', capacity:'abhängig vom ECC-Aufbau', tolerance:'Fehlerkorrektur über Hamming-Code', performance:'Spezialfall, alte Großrechner-Technik', use:'Geschichte von RAID', risk:'Moderne Laufwerke haben eigene Fehlerkorrektur; RAID 2 ist unpraktisch.', color:'from-slate-400 via-slate-600 to-slate-800', layout:[['b1','b4'],['b2','b5'],['b3','b6'],['ECC','ECC']] },
  { id:'3', title:'RAID 3 – Byte-Striping mit Paritätsplatte', short:'Daten verteilt, Parität auf einer extra Platte', min:'3', capacity:'n - 1 Platten', tolerance:'1 Platte', performance:'Gut für große sequentielle Daten', use:'Historisch, Spezialanwendungen', risk:'Die Paritätsplatte kann zum Flaschenhals werden.', color:'from-violet-400 via-purple-600 to-fuchsia-700', layout:[['A1','B1','C1'],['A2','B2','C2'],['P','P','P']] },
  { id:'4', title:'RAID 4 – Block-Striping mit Paritätsplatte', short:'Ähnlich RAID 5, aber Parität nur auf einer Platte', min:'3', capacity:'n - 1 Platten', tolerance:'1 Platte', performance:'Gute Reads, Writes oft langsamer', use:'Selten, ältere Systeme', risk:'Dedizierte Paritätsplatte ist ein Schreib-Flaschenhals.', color:'from-fuchsia-400 via-pink-600 to-rose-700', layout:[['A1','B1','C1'],['A2','B2','C2'],['A3','B3','C3'],['P','P','P']] },
  { id:'5', title:'RAID 5 – Striping mit verteilter Parität', short:'Guter Kompromiss aus Speicherplatz und Ausfallsicherheit', min:'3', capacity:'n - 1 Platten', tolerance:'1 Platte', performance:'Lesen gut, Schreiben langsamer wegen Parität', use:'NAS, Dateiserver, kleinere Serverumgebungen', risk:'Während der Wiederherstellung ist das Array stärker gefährdet.', color:'from-emerald-400 via-green-600 to-teal-700', layout:[['A1','A2','P1'],['B1','P2','B3'],['P3','C2','C3']] },
  { id:'6', title:'RAID 6 – Striping mit doppelter Parität', short:'Wie RAID 5, aber hält zwei Plattenausfälle aus', min:'4', capacity:'n - 2 Platten', tolerance:'2 Platten', performance:'Lesen gut, Schreiben langsamer als RAID 5', use:'Große NAS-Systeme, Server mit vielen Festplatten', risk:'Mehr Rechenaufwand und weniger nutzbare Kapazität.', color:'from-teal-400 via-cyan-600 to-blue-700', layout:[['A1','A2','P'],['B1','P','Q'],['P','Q','B3'],['Q','C2','C3']] },
  { id:'7', title:'RAID 7 – Herstellerabhängiger Sonderfall', short:'Kein offener Standard, eher historisch/proprietär', min:'je nach Implementierung', capacity:'je nach Hersteller', tolerance:'je nach Implementierung', performance:'Eigener Controller mit Cache und Echtzeit-OS', use:'Im Referat kurz erwähnen', risk:'Proprietär und kaum verbreitet.', color:'from-yellow-400 via-amber-600 to-orange-700', layout:[['Cache','A1'],['OS','A2'],['P','P']] },
  { id:'10', title:'RAID 10 / RAID 1+0 – Stripe über Mirrors', short:'Sehr beliebt: schnell und ausfallsicher', min:'4', capacity:'ca. 50 %', tolerance:'mindestens 1 Platte, oft mehrere', performance:'Sehr gute Lese- und Schreibperformance', use:'Datenbanken, Virtualisierung, produktive Server', risk:'Braucht mindestens vier Platten und kostet viel Kapazität.', color:'from-indigo-400 via-blue-700 to-cyan-700', layout:[['A1','A3'],['A1','A3'],['A2','A4'],['A2','A4']] },
  { id:'01', title:'RAID 01 / RAID 0+1 – Mirror über Stripes', short:'Ähnlich klingend, aber schlechtere Ausfalltoleranz als RAID 10', min:'4', capacity:'ca. 50 %', tolerance:'nach erstem Ausfall oft kritisch', performance:'Schnell, aber weniger robust als RAID 10', use:'Heute meist weniger empfohlen als RAID 10', risk:'Ein zweiter Ausfall in der falschen Gruppe kann alles zerstören.', color:'from-rose-400 via-red-700 to-orange-700', layout:[['A1','A3'],['A2','A4'],['A1','A3'],['A2','A4']] }
];
export const RAID_TIMELINE = [
  { year:'1987', label:'RAID 0', text:'Performance durch Striping', color:'from-orange-400 to-red-500' },
  { year:'1988', label:'RAID 1', text:'Spiegelung für Sicherheit', color:'from-sky-400 to-blue-600' },
  { year:'1990', label:'RAID 3/4', text:'Parität als Schutz', color:'from-violet-400 to-fuchsia-600' },
  { year:'1993', label:'RAID 5', text:'Verteilte Parität', color:'from-emerald-400 to-teal-600' },
  { year:'2000+', label:'RAID 6', text:'Doppelte Parität', color:'from-cyan-400 to-blue-700' },
  { year:'Heute', label:'RAID 10', text:'Enterprise Standard', color:'from-indigo-400 to-cyan-700' }
];
export const REAL_WORLD_CASES = [
  { title:'Gaming / Videoschnitt', raid:'RAID 0', description:'Extrem hohe Geschwindigkeit für große Dateien und Ladezeiten.', color:'from-orange-400 to-red-500' },
  { title:'Familienfotos', raid:'RAID 1', description:'Wichtige Daten werden gespiegelt und bleiben bei Ausfall erhalten.', color:'from-sky-400 to-blue-600' },
  { title:'NAS Zuhause', raid:'RAID 5', description:'Gute Balance aus Speicherplatz und Ausfallsicherheit.', color:'from-emerald-400 to-teal-600' },
  { title:'Unternehmensserver', raid:'RAID 10', description:'Sehr schnelle Datenbanken mit hoher Verfügbarkeit.', color:'from-indigo-400 to-cyan-700' }
];
export const METRIC_ROWS = [
  { raid:'RAID 0', speed:96, safety:8, efficiency:100, color:'from-orange-400 to-red-500' },
  { raid:'RAID 1', speed:58, safety:82, efficiency:50, color:'from-sky-400 to-blue-600' },
  { raid:'RAID 5', speed:72, safety:70, efficiency:78, color:'from-emerald-400 to-teal-600' },
  { raid:'RAID 6', speed:63, safety:92, efficiency:64, color:'from-cyan-400 to-blue-700' },
  { raid:'RAID 10', speed:92, safety:90, efficiency:50, color:'from-indigo-400 to-cyan-700' }
];
