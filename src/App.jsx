import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Server, Shield, Zap, HardDrive, AlertTriangle, Database, RefreshCcw, CheckCircle2, XCircle, BookOpen, Presentation, Activity, Cpu, Sparkles, PlayCircle, Network, Radio, BarChart3, Cloud, HelpCircle, MousePointer2 } from "lucide-react";

const RAID_TIMELINE = [
  { year: "1987", label: "RAID 0", text: "Performance durch Striping", color: "from-orange-400 to-red-500" },
  { year: "1988", label: "RAID 1", text: "Spiegelung für Sicherheit", color: "from-sky-400 to-blue-600" },
  { year: "1990", label: "RAID 3/4", text: "Parität als Schutz", color: "from-violet-400 to-fuchsia-600" },
  { year: "1993", label: "RAID 5", text: "Verteilte Parität", color: "from-emerald-400 to-teal-600" },
  { year: "2000+", label: "RAID 6", text: "Doppelte Parität", color: "from-cyan-400 to-blue-700" },
  { year: "Heute", label: "RAID 10", text: "Enterprise Standard", color: "from-indigo-400 to-cyan-700" },
];

const REAL_WORLD_CASES = [
  { title: "Gaming / Videoschnitt", raid: "RAID 0", description: "Extrem hohe Geschwindigkeit für große Dateien und Ladezeiten.", color: "from-orange-400 to-red-500" },
  { title: "Familienfotos", raid: "RAID 1", description: "Wichtige Daten werden gespiegelt und bleiben bei Ausfall erhalten.", color: "from-sky-400 to-blue-600" },
  { title: "NAS Zuhause", raid: "RAID 5", description: "Gute Balance aus Speicherplatz und Ausfallsicherheit.", color: "from-emerald-400 to-teal-600" },
  { title: "Unternehmensserver", raid: "RAID 10", description: "Sehr schnelle Datenbanken mit hoher Verfügbarkeit.", color: "from-indigo-400 to-cyan-700" },
];

const RAID_LEVELS = [
  { id: "0", title: "RAID 0 – Striping", short: "Maximale Geschwindigkeit, keine Sicherheit", min: "2", capacity: "100 %", tolerance: "0 Platten", performance: "Sehr schnell beim Lesen und Schreiben", use: "Gaming, temporäre Daten, Videoschnitt-Cache", risk: "Fällt eine Platte aus, sind alle Daten des Arrays verloren.", color: "from-orange-400 via-red-500 to-pink-600", blocks: [["A1", "A3", "A5"], ["A2", "A4", "A6"]] },
  { id: "1", title: "RAID 1 – Mirroring", short: "Gleiche Daten auf zwei oder mehr Platten", min: "2", capacity: "ca. 50 % bei 2 Platten", tolerance: "1 Platte pro Spiegel", performance: "Lesen oft schneller, Schreiben ähnlich wie eine Platte", use: "Systemplatten, kleine Server, wichtige Daten", risk: "Teuer pro nutzbarem GB, ersetzt trotzdem kein Backup.", color: "from-sky-400 via-blue-600 to-indigo-700", blocks: [["A1", "A2", "A3"], ["A1", "A2", "A3"]] },
  { id: "2", title: "RAID 2 – Bit-Striping mit Hamming-Code", short: "Historisch, heute praktisch nicht mehr verwendet", min: "Mehrere Daten- und ECC-Platten", capacity: "Abhängig von ECC-Aufbau", tolerance: "Fehlerkorrektur über Hamming-Code", performance: "Spezialfall, alte Großrechner-Technik", use: "Heute kaum relevant, eher für Geschichte von RAID", risk: "Moderne Festplatten haben eigene Fehlerkorrektur; RAID 2 ist unpraktisch.", color: "from-slate-400 via-slate-600 to-slate-800", blocks: [["b1", "b4", "b7"], ["b2", "b5", "b8"], ["b3", "b6", "b9"], ["ECC", "ECC", "ECC"]] },
  { id: "3", title: "RAID 3 – Byte-Striping mit eigener Paritätsplatte", short: "Daten verteilt, Parität auf einer extra Platte", min: "3", capacity: "n - 1 Platten", tolerance: "1 Platte", performance: "Gut für große sequentielle Daten, schwach bei vielen kleinen Zugriffen", use: "Historisch, Spezialanwendungen", risk: "Die Paritätsplatte kann zum Flaschenhals werden.", color: "from-violet-400 via-purple-600 to-fuchsia-700", blocks: [["A1", "B1", "C1"], ["A2", "B2", "C2"], ["P", "P", "P"]] },
  { id: "4", title: "RAID 4 – Block-Striping mit eigener Paritätsplatte", short: "Ähnlich RAID 5, aber Parität nur auf einer Platte", min: "3", capacity: "n - 1 Platten", tolerance: "1 Platte", performance: "Gute Reads, Writes oft langsamer durch Paritätsplatte", use: "Selten, eher theoretisch/ältere Systeme", risk: "Dedizierte Paritätsplatte ist ein Schreib-Flaschenhals.", color: "from-fuchsia-400 via-pink-600 to-rose-700", blocks: [["A1", "B1", "C1"], ["A2", "B2", "C2"], ["A3", "B3", "C3"], ["P", "P", "P"]] },
  { id: "5", title: "RAID 5 – Striping mit verteilter Parität", short: "Guter Kompromiss aus Speicherplatz und Ausfallsicherheit", min: "3", capacity: "n - 1 Platten", tolerance: "1 Platte", performance: "Lesen gut, Schreiben langsamer wegen Paritätsberechnung", use: "NAS, Dateiserver, kleinere Serverumgebungen", risk: "Während Wiederherstellung nach Ausfall ist das Array stärker gefährdet.", color: "from-emerald-400 via-green-600 to-teal-700", blocks: [["A1", "B1", "P3"], ["A2", "P2", "C2"], ["P1", "B3", "C3"]] },
  { id: "6", title: "RAID 6 – Striping mit doppelter Parität", short: "Wie RAID 5, aber hält zwei Plattenausfälle aus", min: "4", capacity: "n - 2 Platten", tolerance: "2 Platten", performance: "Lesen gut, Schreiben langsamer als RAID 5", use: "Große NAS-Systeme, Server mit vielen Festplatten", risk: "Mehr Rechenaufwand und weniger nutzbare Kapazität.", color: "from-teal-400 via-cyan-600 to-blue-700", blocks: [["A1", "B1", "P", "Q"], ["A2", "P", "Q", "C2"], ["P", "Q", "B3", "C3"], ["Q", "A4", "B4", "P"]] },
  { id: "7", title: "RAID 7 – Herstellerabhängiger Sonderfall", short: "Kein offener Standard, eher historisch/proprietär", min: "Je nach Implementierung", capacity: "Je nach Hersteller", tolerance: "Je nach Implementierung", performance: "Eigener Controller mit Cache und Echtzeit-OS", use: "Im Unterricht erwähnen, aber nicht als moderner Standard darstellen", risk: "Proprietär, kaum verbreitet, nicht vergleichbar mit Standard-RAID-Leveln.", color: "from-yellow-400 via-amber-600 to-orange-700", blocks: [["Cache", "A1", "B1"], ["OS", "A2", "B2"], ["P", "P", "P"]] },
  { id: "10", title: "RAID 10 / RAID 1+0 – Stripe über Mirrors", short: "Sehr beliebt: schnell und ausfallsicher", min: "4", capacity: "ca. 50 %", tolerance: "Mind. 1 Platte, oft mehrere – solange nicht beide aus einem Mirror ausfallen", performance: "Sehr gute Lese- und Schreibperformance", use: "Datenbanken, Virtualisierung, produktive Server", risk: "Braucht mindestens vier Platten und kostet viel Kapazität.", color: "from-indigo-400 via-blue-700 to-cyan-700", blocks: [["A1", "A3", "A5"], ["A1", "A3", "A5"], ["A2", "A4", "A6"], ["A2", "A4", "A6"]] },
  { id: "01", title: "RAID 01 / RAID 0+1 – Mirror über Stripes", short: "Ähnlich klingend, aber schlechtere Ausfalltoleranz als RAID 10", min: "4", capacity: "ca. 50 %", tolerance: "Nach erstem Ausfall ist oft eine ganze Stripe-Gruppe kritisch", performance: "Schnell, aber weniger robust als RAID 10", use: "Heute meist weniger empfohlen als RAID 10", risk: "Ein zweiter Ausfall in der falschen Gruppe kann alles zerstören.", color: "from-rose-400 via-red-700 to-orange-700", blocks: [["A1", "A3", "A5"], ["A2", "A4", "A6"], ["A1", "A3", "A5"], ["A2", "A4", "A6"]] }
];

function ParticleField() {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden">{Array.from({ length: 44 }, (_, i) => <motion.span key={i} className="absolute rounded-full bg-cyan-300/50 shadow-[0_0_18px_rgba(103,232,249,0.8)]" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 19) % 100}%`, width: 3 + (i % 5), height: 3 + (i % 5) }} animate={{ y: [-20, 26, -20], x: [-10, 12, -10], opacity: [0.1, 0.95, 0.1], scale: [0.8, 1.9, 0.8] }} transition={{ duration: 5 + (i % 7), repeat: Infinity, delay: (i % 9) * 0.25, ease: "easeInOut" }} />)}</div>;
}

function FlyingPackets({ count = 10 }) {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden">{Array.from({ length: count }, (_, i) => <motion.div key={i} className="absolute h-3 w-8 rounded-md bg-gradient-to-r from-cyan-300 to-blue-500 shadow-[0_0_20px_rgba(56,189,248,0.75)]" style={{ top: `${14 + (i % 6) * 14}%` }} initial={{ x: -120, opacity: 0, rotate: 0 }} animate={{ x: [-120, 180, 480, 760], opacity: [0, 1, 1, 0], rotate: [0, 6, -6, 0] }} transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.26, ease: "easeInOut" }} />)}</div>;
}

function RaidHeroMachine() {
  const labels = ["RAID 0", "RAID 1", "RAID 5", "RAID 6", "RAID 10"];
  return <motion.div className="relative mt-10 rounded-[2rem] border border-cyan-300/20 bg-slate-950/70 p-5 shadow-[0_0_100px_rgba(34,211,238,0.25)] backdrop-blur-xl" initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8, ease: "easeOut" }}>
    <ParticleField />
    <div className="relative grid gap-5 lg:grid-cols-[1fr_1.35fr_1fr]">
      <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
        <div className="flex items-center gap-2 text-sm font-bold text-cyan-200"><Cpu className="h-4 w-4" /> RAID-Controller</div>
        <motion.div className="mt-4 h-28 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-600/20 ring-1 ring-cyan-200/30" animate={{ boxShadow: ["0 0 20px rgba(34,211,238,.25)", "0 0 60px rgba(34,211,238,.8)", "0 0 20px rgba(34,211,238,.25)"] }} transition={{ duration: 2.2, repeat: Infinity }} />
      </div>
      <div className="relative min-h-[190px] overflow-hidden rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
        <Network className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-cyan-300/20" />
        {Array.from({ length: 16 }, (_, i) => <motion.div key={i} className="absolute h-2 w-12 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,.9)]" style={{ top: `${12 + (i % 8) * 10}%`, left: `${i % 2 ? 4 : 76}%` }} animate={{ x: i % 2 ? [0, 240, 0] : [0, -240, 0], opacity: [0, 1, 0], scaleX: [0.5, 1.5, 0.5] }} transition={{ duration: 2.1 + (i % 4) * 0.25, repeat: Infinity, delay: i * 0.12 }} />)}
        <div className="relative z-10 flex h-full items-center justify-center text-center"><div><motion.div animate={{ rotate: 360, scale: [1, 1.18, 1] }} transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" }, scale: { duration: 1.8, repeat: Infinity } }}><Sparkles className="mx-auto h-11 w-11 text-cyan-200" /></motion.div><div className="mt-3 text-2xl font-black">Live-Datenfluss</div><div className="text-sm text-slate-300">Pakete werden verteilt, gespiegelt oder mit Parität ergänzt</div></div></div>
      </div>
      <div className="grid gap-2">{labels.map((d, i) => <motion.div key={d} className="rounded-xl bg-white/10 px-4 py-3 text-sm font-bold ring-1 ring-white/15" animate={{ x: [0, i % 2 ? 8 : -8, 0], opacity: [0.72, 1, 0.72] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }} whileHover={{ scale: 1.08, x: 0 }}>{d}</motion.div>)}</div>
    </div>
  </motion.div>;
}

function Block({ children, type = "data", delay = 0 }) {
  const styles = {
    data: "bg-blue-100 text-blue-900 ring-blue-200",
    parity: "bg-amber-100 text-amber-900 ring-amber-200",
    mirror: "bg-sky-100 text-sky-900 ring-sky-200",
    danger: "bg-red-100 text-red-900 ring-red-200",
    system: "bg-violet-100 text-violet-900 ring-violet-200",
  };
  return <motion.div className={`rounded-xl px-3 py-2 text-center text-xs font-black ring-1 shadow-sm ${styles[type]}`} initial={{ opacity: 0, scale: 0.55, y: 12 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} animate={{ boxShadow: ["0 0 0 rgba(59,130,246,0)", "0 0 22px rgba(59,130,246,.35)", "0 0 0 rgba(59,130,246,0)"] }} transition={{ delay, duration: 1.9, repeat: Infinity }} whileHover={{ scale: 1.14, rotate: 2 }}>{children}</motion.div>;
}

function DiskTower({ name, children, tone = "blue", failed = false }) {
  const toneClass = failed ? "from-red-500 to-red-800 ring-red-300" : tone === "amber" ? "from-amber-300 to-orange-600 ring-amber-200" : tone === "violet" ? "from-violet-400 to-purple-700 ring-violet-200" : "from-cyan-300 to-blue-700 ring-blue-200";
  return <motion.div className="relative min-w-[86px] flex-1 rounded-2xl bg-white/85 p-3 shadow-xl ring-1 ring-slate-200" animate={failed ? { x: [0, -6, 6, -4, 4, 0], rotate: [0, -2, 2, 0] } : { y: [0, -4, 0] }} transition={{ duration: failed ? 0.45 : 2.5, repeat: failed ? 2 : Infinity }} whileHover={{ y: -10, scale: 1.04 }}>
    <motion.div className={`mx-auto mb-3 h-12 w-16 rounded-2xl bg-gradient-to-b ${toneClass} ring-1 shadow-lg`} animate={{ boxShadow: failed ? ["0 0 22px rgba(239,68,68,.8)", "0 0 60px rgba(239,68,68,1)", "0 0 22px rgba(239,68,68,.8)"] : ["0 0 14px rgba(34,211,238,.35)", "0 0 34px rgba(34,211,238,.65)", "0 0 14px rgba(34,211,238,.35)"] }} transition={{ duration: 1.6, repeat: Infinity }} />
    <div className="mb-3 text-center text-xs font-black text-slate-600">{name}</div>
    <div className="space-y-2">{children}</div>
  </motion.div>;
}

function ArrowFlow({ label, danger = false }) {
  return <div className="relative my-3 flex items-center gap-2 text-xs font-bold text-slate-600">
    <div className={`h-1 flex-1 rounded-full ${danger ? "bg-red-300" : "bg-cyan-300"}`} />
    <motion.div className={`rounded-full px-3 py-1 ${danger ? "bg-red-100 text-red-800" : "bg-cyan-100 text-cyan-800"}`} animate={{ x: [-5, 5, -5] }} transition={{ duration: 1.4, repeat: Infinity }}>{label}</motion.div>
    <div className={`h-1 flex-1 rounded-full ${danger ? "bg-red-300" : "bg-cyan-300"}`} />
  </div>;
}

function RaidVisual({ level }) {
  const id = level.id;
  if (id === "0") return <motion.div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 p-5 ring-1 ring-orange-200" whileHover={{ scale: 1.02 }}>
    <div className="mb-3 flex items-center gap-2 font-black text-red-900"><Zap className="h-5 w-5" /> Speed: Daten werden abwechselnd verteilt</div>
    <div className="grid gap-3 md:grid-cols-2"><DiskTower name="Disk 1">{["A1", "A3", "A5"].map((b,i)=><Block key={b} delay={i*.08}>{b}</Block>)}</DiskTower><DiskTower name="Disk 2">{["A2", "A4", "A6"].map((b,i)=><Block key={b} delay={i*.08}>{b}</Block>)}</DiskTower></div>
    <ArrowFlow label="max. Tempo" />
    <motion.div className="rounded-2xl bg-red-100 p-3 text-sm font-bold text-red-900 ring-1 ring-red-200" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>Keine Redundanz: fällt eine Disk aus, ist die Datei unvollständig.</motion.div>
  </motion.div>;

  if (id === "1") return <motion.div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50 p-5 ring-1 ring-sky-200" whileHover={{ scale: 1.02 }}>
    <div className="mb-3 flex items-center gap-2 font-black text-blue-900"><Shield className="h-5 w-5" /> Spiegelung: beide Platten enthalten dasselbe</div>
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr]"><DiskTower name="Original">{["A1", "A2", "A3"].map((b,i)=><Block key={b} type="mirror" delay={i*.08}>{b}</Block>)}</DiskTower><motion.div className="flex items-center justify-center text-4xl font-black text-blue-400" animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>⇄</motion.div><DiskTower name="Spiegel">{["A1", "A2", "A3"].map((b,i)=><Block key={b} type="mirror" delay={i*.08}>{b}</Block>)}</DiskTower></div>
    <ArrowFlow label="Kopie in Echtzeit" />
    <div className="rounded-2xl bg-blue-100 p-3 text-sm font-bold text-blue-900 ring-1 ring-blue-200">Zweck: Verfügbarkeit. Eine Platte kann ausfallen, die andere hat die Daten.</div>
  </motion.div>;

  if (id === "2") return <motion.div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-200 p-5 ring-1 ring-slate-300" whileHover={{ scale: 1.02 }}>
    <div className="mb-3 flex items-center gap-2 font-black text-slate-900"><Radio className="h-5 w-5" /> Bit-Level + Hamming-Code</div>
    <div className="grid gap-3 md:grid-cols-4"><DiskTower name="Bit 1" tone="violet"><Block>b1</Block><Block>b4</Block></DiskTower><DiskTower name="Bit 2" tone="violet"><Block>b2</Block><Block>b5</Block></DiskTower><DiskTower name="Bit 3" tone="violet"><Block>b3</Block><Block>b6</Block></DiskTower><DiskTower name="ECC" tone="amber"><Block type="parity">ECC</Block><Block type="parity">ECC</Block></DiskTower></div>
    <ArrowFlow label="Fehlerkorrektur statt moderner Praxis" />
    <div className="rounded-2xl bg-white p-3 text-sm font-bold text-slate-700 ring-1 ring-slate-200">Zweck: historisch zeigen, wie Fehlerkorrektur über zusätzliche Prüfdaten funktionieren kann.</div>
  </motion.div>;

  if (id === "3") return <motion.div className="rounded-3xl bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5 ring-1 ring-violet-200" whileHover={{ scale: 1.02 }}>
    <div className="mb-3 flex items-center gap-2 font-black text-violet-900"><Database className="h-5 w-5" /> Byte-Striping mit zentraler Parität</div>
    <div className="grid gap-3 md:grid-cols-3"><DiskTower name="Daten 1" tone="violet"><Block>A1</Block><Block>B1</Block><Block>C1</Block></DiskTower><DiskTower name="Daten 2" tone="violet"><Block>A2</Block><Block>B2</Block><Block>C2</Block></DiskTower><DiskTower name="Parity" tone="amber"><Block type="parity">P</Block><Block type="parity">P</Block><Block type="parity">P</Block></DiskTower></div>
    <ArrowFlow label="gut für große Datenströme" />
    <div className="rounded-2xl bg-violet-100 p-3 text-sm font-bold text-violet-900 ring-1 ring-violet-200">Zweck: sequentielle Daten, aber die Paritätsplatte ist stark belastet.</div>
  </motion.div>;

  if (id === "4") return <motion.div className="rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 p-5 ring-1 ring-pink-200" whileHover={{ scale: 1.02 }}>
    <div className="mb-3 flex items-center gap-2 font-black text-pink-900"><HardDrive className="h-5 w-5" /> Block-Striping + eine feste Paritätsplatte</div>
    <div className="grid gap-3 md:grid-cols-4"><DiskTower name="Daten 1"><Block>A1</Block><Block>B1</Block><Block>C1</Block></DiskTower><DiskTower name="Daten 2"><Block>A2</Block><Block>B2</Block><Block>C2</Block></DiskTower><DiskTower name="Daten 3"><Block>A3</Block><Block>B3</Block><Block>C3</Block></DiskTower><DiskTower name="Parity" tone="amber"><Block type="parity">P</Block><Block type="parity">P</Block><Block type="parity">P</Block></DiskTower></div>
    <ArrowFlow label="Schreib-Flaschenhals rechts" danger />
    <div className="rounded-2xl bg-pink-100 p-3 text-sm font-bold text-pink-900 ring-1 ring-pink-200">Zweck: verständlich als Vorstufe zu RAID 5 – aber die Paritätsplatte bremst Schreibvorgänge.</div>
  </motion.div>;

  if (id === "5") return <motion.div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 ring-1 ring-emerald-200" whileHover={{ scale: 1.02 }}>
    <div className="mb-3 flex items-center gap-2 font-black text-emerald-900"><RefreshCcw className="h-5 w-5" /> Verteilte Parität: kein einzelner Paritäts-Flaschenhals</div>
    <div className="grid gap-3 md:grid-cols-3"><DiskTower name="Disk 1"><Block>A1</Block><Block>A2</Block><Block type="parity">P1</Block></DiskTower><DiskTower name="Disk 2"><Block>B1</Block><Block type="parity">P2</Block><Block>B3</Block></DiskTower><DiskTower name="Disk 3"><Block type="parity">P3</Block><Block>C2</Block><Block>C3</Block></DiskTower></div>
    <ArrowFlow label="Parität rotiert über alle Platten" />
    <div className="rounded-2xl bg-emerald-100 p-3 text-sm font-bold text-emerald-900 ring-1 ring-emerald-200">Zweck: guter Kompromiss aus Kapazität und Schutz vor einem Plattenausfall.</div>
  </motion.div>;

  if (id === "6") return <motion.div className="rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-50 p-5 ring-1 ring-cyan-200" whileHover={{ scale: 1.02 }}>
    <div className="mb-3 flex items-center gap-2 font-black text-cyan-900"><Shield className="h-5 w-5" /> Doppelte Parität: P + Q</div>
    <div className="grid gap-3 md:grid-cols-4"><DiskTower name="Disk 1"><Block>A1</Block><Block>A2</Block><Block type="parity">P</Block></DiskTower><DiskTower name="Disk 2"><Block>B1</Block><Block type="parity">P</Block><Block type="parity">Q</Block></DiskTower><DiskTower name="Disk 3"><Block type="parity">P</Block><Block type="parity">Q</Block><Block>B3</Block></DiskTower><DiskTower name="Disk 4"><Block type="parity">Q</Block><Block>C2</Block><Block>C3</Block></DiskTower></div>
    <ArrowFlow label="hält zwei Ausfälle aus" />
    <div className="rounded-2xl bg-cyan-100 p-3 text-sm font-bold text-cyan-900 ring-1 ring-cyan-200">Zweck: große Arrays sicherer machen, besonders wenn Wiederherstellung lange dauert.</div>
  </motion.div>;

  if (id === "7") return <motion.div className="rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 p-5 ring-1 ring-amber-200" whileHover={{ scale: 1.02 }}>
    <div className="mb-3 flex items-center gap-2 font-black text-amber-900"><Cpu className="h-5 w-5" /> Proprietärer Sonderfall mit Controller-Logik</div>
    <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr]"><DiskTower name="Cache" tone="amber"><Block type="system">Cache</Block><Block>A1</Block></DiskTower><DiskTower name="Realtime OS" tone="violet"><Block type="system">OS</Block><Block>A2</Block></DiskTower><DiskTower name="Parity" tone="amber"><Block type="parity">P</Block><Block type="parity">P</Block></DiskTower></div>
    <ArrowFlow label="kein normaler offener Standard" danger />
    <div className="rounded-2xl bg-amber-100 p-3 text-sm font-bold text-amber-900 ring-1 ring-amber-200">Zweck: als historisch/proprietär erwähnen, nicht als typisches modernes RAID empfehlen.</div>
  </motion.div>;

  if (id === "10") return <motion.div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-cyan-50 p-5 ring-1 ring-indigo-200" whileHover={{ scale: 1.02 }}>
    <div className="mb-3 flex items-center gap-2 font-black text-indigo-900"><Sparkles className="h-5 w-5" /> Erst spiegeln, dann stripen: schnell + robust</div>
    <div className="grid gap-4 md:grid-cols-2"><div className="rounded-3xl bg-white/80 p-3 ring-2 ring-blue-200"><div className="mb-2 text-center text-xs font-black text-blue-800">Mirror-Gruppe 1</div><div className="grid grid-cols-2 gap-2"><DiskTower name="D1"><Block type="mirror">A1</Block><Block type="mirror">A3</Block></DiskTower><DiskTower name="D2"><Block type="mirror">A1</Block><Block type="mirror">A3</Block></DiskTower></div></div><div className="rounded-3xl bg-white/80 p-3 ring-2 ring-cyan-200"><div className="mb-2 text-center text-xs font-black text-cyan-800">Mirror-Gruppe 2</div><div className="grid grid-cols-2 gap-2"><DiskTower name="D3"><Block type="mirror">A2</Block><Block type="mirror">A4</Block></DiskTower><DiskTower name="D4"><Block type="mirror">A2</Block><Block type="mirror">A4</Block></DiskTower></div></div></div>
    <ArrowFlow label="Stripe über sichere Spiegelgruppen" />
    <div className="rounded-2xl bg-indigo-100 p-3 text-sm font-bold text-indigo-900 ring-1 ring-indigo-200">Zweck: sehr gut für Datenbanken und produktive Server, weil Performance und Ausfallsicherheit kombiniert werden.</div>
  </motion.div>;

  return <motion.div className="rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 p-5 ring-1 ring-rose-200" whileHover={{ scale: 1.02 }}>
    <div className="mb-3 flex items-center gap-2 font-black text-rose-900"><AlertTriangle className="h-5 w-5" /> Erst stripen, dann spiegeln: schneller, aber riskanter als RAID 10</div>
    <div className="grid gap-4 md:grid-cols-2"><div className="rounded-3xl bg-white/80 p-3 ring-2 ring-red-200"><div className="mb-2 text-center text-xs font-black text-red-800">Stripe-Set 1</div><div className="grid grid-cols-2 gap-2"><DiskTower name="D1"><Block>A1</Block><Block>A3</Block></DiskTower><DiskTower name="D2"><Block>A2</Block><Block>A4</Block></DiskTower></div></div><div className="rounded-3xl bg-white/80 p-3 ring-2 ring-orange-200"><div className="mb-2 text-center text-xs font-black text-orange-800">gespiegeltes Stripe-Set 2</div><div className="grid grid-cols-2 gap-2"><DiskTower name="D3"><Block>A1</Block><Block>A3</Block></DiskTower><DiskTower name="D4"><Block>A2</Block><Block>A4</Block></DiskTower></div></div></div>
    <ArrowFlow label="nach erstem Ausfall wird ein ganzes Stripe-Set kritisch" danger />
    <div className="rounded-2xl bg-rose-100 p-3 text-sm font-bold text-rose-900 ring-1 ring-rose-200">Zweck: zeigt den Unterschied zu RAID 10. In der Praxis wird meistens RAID 10 bevorzugt.</div>
  </motion.div>;
}

function DiskDiagram({ level }) {
  return <div><RaidVisual level={level} /></div>;
}

function StatCard({ icon: Icon, label, value }) {
  return <motion.div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200" whileHover={{ y: -8, scale: 1.04, boxShadow: "0 20px 45px rgba(15,23,42,.18)" }} transition={{ type: "spring", stiffness: 220, damping: 18 }}><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Icon className="h-4 w-4" /> {label}</div><div className="mt-2 text-lg font-bold text-slate-900">{value}</div></motion.div>;
}

function LevelCard({ level }) {
  return <motion.section initial={{ opacity: 0, y: 55, scale: 0.94, rotateX: -8 }} whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, ease: "easeOut" }} whileHover={{ y: -6 }} className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 [perspective:1000px]">
    <motion.div className={`relative overflow-hidden bg-gradient-to-r ${level.color} bg-[length:300%_300%] p-6 text-white`} animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }}><FlyingPackets count={5} /><div className="relative flex flex-wrap items-start justify-between gap-4"><div><div className="text-sm font-semibold opacity-90">RAID-Level {level.id}</div><h2 className="mt-1 text-2xl font-black tracking-tight">{level.title}</h2><p className="mt-2 max-w-3xl text-white/90">{level.short}</p></div><motion.div className="rounded-2xl bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur" animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 2, repeat: Infinity }}>{level.min} min. Platten</motion.div></div></motion.div>
    <div className="grid gap-6 p-6 lg:grid-cols-[1.05fr_0.95fr]"><div><div className="grid gap-3 sm:grid-cols-3"><StatCard icon={Server} label="Kapazität" value={level.capacity} /><StatCard icon={Shield} label="Ausfall" value={level.tolerance} /><StatCard icon={Zap} label="Tempo" value={level.performance} /></div><div className="mt-5 grid gap-4 md:grid-cols-2"><motion.div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100" whileHover={{ scale: 1.04, rotate: -1 }}><div className="flex items-center gap-2 font-bold text-emerald-900"><CheckCircle2 className="h-5 w-5" /> Typischer Einsatz</div><p className="mt-2 text-sm text-emerald-900/80">{level.use}</p></motion.div><motion.div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100" whileHover={{ scale: 1.04, rotate: 1 }}><div className="flex items-center gap-2 font-bold text-red-900"><AlertTriangle className="h-5 w-5" /> Wichtiges Risiko</div><p className="mt-2 text-sm text-red-900/80">{level.risk}</p></motion.div></div></div><DiskDiagram level={level} /></div>
  </motion.section>;
}

function CapacityCalculator() {
  const [raid, setRaid] = useState("5");
  const [disks, setDisks] = useState(4);
  const [size, setSize] = useState(2);

  const result = useMemo(() => {
    const total = disks * size;
    if (raid === "0") return { usable: total, fail: 0, note: "Maximale Performance" };
    if (raid === "1") return { usable: total / 2, fail: 1, note: "Spiegelung halbiert Kapazität" };
    if (raid === "5") return { usable: (disks - 1) * size, fail: 1, note: "Eine Platte für Parität" };
    if (raid === "6") return { usable: (disks - 2) * size, fail: 2, note: "Zwei Paritätsplatten" };
    return { usable: total / 2, fail: "mehrere", note: "Performance + Sicherheit" };
  }, [raid, disks, size]);

  return <motion.section initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,.55)] ring-1 ring-cyan-300/20">
    <div className="flex items-center gap-3"><Cpu className="h-7 w-7 text-cyan-300" /><h2 className="text-3xl font-black">Interaktiver RAID-Rechner</h2></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
        <label className="text-sm font-bold text-cyan-200">RAID-Level</label>
        <select value={raid} onChange={(e)=>setRaid(e.target.value)} className="mt-2 w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-cyan-300/20">
          <option value="0">RAID 0</option>
          <option value="1">RAID 1</option>
          <option value="5">RAID 5</option>
          <option value="6">RAID 6</option>
          <option value="10">RAID 10</option>
        </select>
        <label className="mt-5 block text-sm font-bold text-cyan-200">Anzahl Disks</label>
        <input type="range" min="2" max="12" value={disks} onChange={(e)=>setDisks(Number(e.target.value))} className="mt-2 w-full" />
        <div className="text-sm text-slate-300">{disks} Laufwerke</div>
        <label className="mt-5 block text-sm font-bold text-cyan-200">TB pro Disk</label>
        <input type="range" min="1" max="20" value={size} onChange={(e)=>setSize(Number(e.target.value))} className="mt-2 w-full" />
        <div className="text-sm text-slate-300">{size} TB pro Laufwerk</div>
      </div>

      <motion.div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-700/20 p-6 ring-1 ring-cyan-300/20" animate={{ boxShadow: ["0 0 20px rgba(34,211,238,.2)", "0 0 60px rgba(34,211,238,.45)", "0 0 20px rgba(34,211,238,.2)"] }} transition={{ duration: 2.2, repeat: Infinity }}>
        <div className="text-sm font-bold uppercase tracking-wide text-cyan-200">Nutzbare Kapazität</div>
        <div className="mt-3 text-5xl font-black">{result.usable} TB</div>
        <div className="mt-4 text-slate-300">Gesamtkapazität: {disks * size} TB</div>
      </motion.div>

      <div className="grid gap-4">
        <motion.div className="rounded-2xl bg-emerald-500/15 p-5 ring-1 ring-emerald-300/20" whileHover={{ scale: 1.03 }}>
          <div className="text-sm font-bold uppercase tracking-wide text-emerald-200">Ausfalltoleranz</div>
          <div className="mt-2 text-3xl font-black">{result.fail}</div>
        </motion.div>
        <motion.div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10" whileHover={{ scale: 1.03 }}>
          <div className="text-sm font-bold uppercase tracking-wide text-cyan-200">Beschreibung</div>
          <div className="mt-2 text-lg font-bold">{result.note}</div>
        </motion.div>
      </div>
    </div>
  </motion.section>;
}

function RaidTimeline() {
  return <motion.section initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
    <div className="flex items-center gap-3"><Activity className="h-7 w-7 text-blue-700" /><h2 className="text-3xl font-black">Entwicklung von RAID</h2></div>
    <div className="relative mt-10 overflow-x-auto pb-6">
      <div className="absolute left-0 right-0 top-10 h-1 rounded-full bg-slate-200" />
      <div className="relative flex min-w-[900px] justify-between gap-6">
        {RAID_TIMELINE.map((item, i)=><motion.div key={item.label} className="relative flex w-40 flex-col items-center text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
          <motion.div className={`z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-lg font-black text-white shadow-2xl`} animate={{ y: [0, -8, 0], boxShadow: ["0 0 20px rgba(59,130,246,.25)", "0 0 50px rgba(59,130,246,.5)", "0 0 20px rgba(59,130,246,.25)"] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.15 }}>{item.label}</motion.div>
          <div className="mt-4 text-sm font-black text-slate-500">{item.year}</div>
          <div className="mt-1 font-bold">{item.text}</div>
        </motion.div>)}
      </div>
    </div>
  </motion.section>;
}

function RealWorldExamples() {
  return <motion.section initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,.55)] ring-1 ring-cyan-300/20">
    <div className="flex items-center gap-3"><HardDrive className="h-7 w-7 text-cyan-300" /><h2 className="text-3xl font-black">RAID im echten Leben</h2></div>
    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {REAL_WORLD_CASES.map((item,i)=><motion.div key={item.title} className="relative overflow-hidden rounded-3xl bg-white/10 p-5 ring-1 ring-white/10" whileHover={{ y: -12, scale: 1.05, rotate: i % 2 ? 1 : -1 }}>
        <motion.div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20`} animate={{ opacity: [.12,.3,.12] }} transition={{ duration: 2.4, repeat: Infinity }} />
        <div className="relative">
          <div className="text-sm font-black uppercase tracking-wide text-cyan-200">{item.raid}</div>
          <div className="mt-2 text-2xl font-black">{item.title}</div>
          <p className="mt-3 text-sm text-slate-300">{item.description}</p>
        </div>
      </motion.div>)}
    </div>
  </motion.section>;
}

function EnterpriseRack() {
  return <motion.section initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-[2rem] bg-black p-8 text-white shadow-[0_0_120px_rgba(34,211,238,.18)] ring-1 ring-cyan-300/20">
    <ParticleField />
    <div className="relative flex items-center gap-3"><Server className="h-7 w-7 text-cyan-300" /><h2 className="text-4xl font-black">Enterprise Storage Rack</h2></div>
    <div className="relative mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i)=><motion.div key={i} className="relative rounded-3xl bg-gradient-to-b from-slate-800 to-slate-950 p-5 ring-1 ring-cyan-300/10" whileHover={{ y: -8, rotateX: 8 }}>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-black">NODE {i + 1}</div>
          <motion.div className="h-3 w-3 rounded-full bg-emerald-400" animate={{ opacity: [.2,1,.2], boxShadow: ["0 0 0 rgba(74,222,128,0)", "0 0 20px rgba(74,222,128,.9)", "0 0 0 rgba(74,222,128,0)"] }} transition={{ duration: 1.2, repeat: Infinity }} />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }, (_, j)=><motion.div key={j} className="h-8 rounded-lg bg-gradient-to-b from-cyan-300 to-blue-700" animate={{ boxShadow: ["0 0 10px rgba(34,211,238,.25)", "0 0 24px rgba(34,211,238,.75)", "0 0 10px rgba(34,211,238,.25)"] }} transition={{ duration: 2, repeat: Infinity, delay: j * .08 }} />)}
        </div>
      </motion.div>)}
    </div>
  </motion.section>;
}

function MetricBars() {
  const rows = [
    { raid: "RAID 0", speed: 96, safety: 8, cost: 92, color: "from-orange-400 to-red-500" },
    { raid: "RAID 1", speed: 58, safety: 82, cost: 45, color: "from-sky-400 to-blue-600" },
    { raid: "RAID 5", speed: 72, safety: 70, cost: 78, color: "from-emerald-400 to-teal-600" },
    { raid: "RAID 6", speed: 63, safety: 92, cost: 64, color: "from-cyan-400 to-blue-700" },
    { raid: "RAID 10", speed: 92, safety: 90, cost: 50, color: "from-indigo-400 to-cyan-700" },
  ];
  const metrics = [{ key: "speed", label: "Performance" }, { key: "safety", label: "Sicherheit" }, { key: "cost", label: "Kapazitäts-Effizienz" }];
  return <motion.section initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
    <div className="flex items-center gap-3"><BarChart3 className="h-7 w-7 text-blue-700" /><h2 className="text-3xl font-black">Animierter Vergleich: Tempo, Sicherheit, Kosten</h2></div>
    <div className="mt-7 space-y-6">{rows.map((row, i)=><div key={row.raid} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="mb-3 font-black text-slate-900">{row.raid}</div>
      <div className="grid gap-3 md:grid-cols-3">{metrics.map((m, j)=><div key={m.key}><div className="mb-1 flex justify-between text-xs font-bold text-slate-500"><span>{m.label}</span><span>{row[m.key]}%</span></div><div className="h-4 overflow-hidden rounded-full bg-slate-200"><motion.div className={`h-full rounded-full bg-gradient-to-r ${row.color}`} initial={{ width: 0 }} whileInView={{ width: `${row[m.key]}%` }} viewport={{ once: true }} transition={{ duration: 1.1, delay: i*.08 + j*.08, ease: "easeOut" }} /></div></div>)}</div>
    </div>)}</div>
  </motion.section>;
}

function ReconstructionDemo() {
  const [lost, setLost] = useState(false);
  return <motion.section initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,.55)] ring-1 ring-emerald-300/20">
    <ParticleField />
    <div className="relative flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-300"><RefreshCcw className="h-4 w-4" /> RAID 5 Rekonstruktion</div><h2 className="mt-2 text-3xl font-black">Fehlender Block wird aus Parität rekonstruiert</h2><p className="mt-2 max-w-3xl text-slate-300">Die Animation zeigt vereinfacht: Datenblöcke und Paritätsblock werden kombiniert, um den verlorenen Block neu zu berechnen.</p></div><button onClick={()=>setLost(!lost)} className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-slate-950 shadow-[0_0_35px_rgba(52,211,153,.45)] transition hover:scale-105">{lost ? "Block wieder normal" : "Blockverlust simulieren"}</button></div>
    <div className="relative mt-8 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto_1fr]">
      {["A1", "B1", "P1"].map((b,i)=><motion.div key={b} className="rounded-3xl bg-white/10 p-5 text-center ring-1 ring-white/15" animate={{ y: [0,-6,0], boxShadow: lost ? ["0 0 12px rgba(52,211,153,.2)", "0 0 45px rgba(52,211,153,.55)", "0 0 12px rgba(52,211,153,.2)"] : undefined }} transition={{ duration: 1.6, repeat: Infinity, delay: i*.2 }}><div className="text-xs font-bold text-emerald-200">Quelle</div><div className="mt-2 text-4xl font-black">{b}</div></motion.div>)}
      <motion.div className="flex items-center justify-center text-5xl font-black text-emerald-300" animate={{ scale: [1,1.25,1] }} transition={{ duration: 1.2, repeat: Infinity }}>→</motion.div>
      <motion.div className={`rounded-3xl p-5 text-center ring-1 ${lost ? "bg-red-500/20 ring-red-300" : "bg-white/10 ring-white/15"}`} animate={lost ? { scale: [1,.92,1.08,1], boxShadow: ["0 0 20px rgba(239,68,68,.4)", "0 0 55px rgba(52,211,153,.7)", "0 0 20px rgba(239,68,68,.4)"] } : { y: [0,-6,0] }} transition={{ duration: 1.4, repeat: Infinity }}><div className="text-xs font-bold text-slate-300">Ergebnis</div><div className="mt-2 text-4xl font-black">{lost ? "A2" : "A2"}</div><div className="mt-1 text-xs text-slate-300">{lost ? "rekonstruiert" : "normal vorhanden"}</div></motion.div>
    </div>
    <div className="relative mt-6 rounded-2xl bg-emerald-400/15 p-4 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/30">Vereinfacht gesagt: RAID 5 speichert Prüfinformationen. Wenn ein Block fehlt, kann er aus den übrigen Daten + Parität wieder berechnet werden.</div>
  </motion.section>;
}

function Raid10Vs01Interactive() {
  const [fail, setFail] = useState(false);
  const tower = (name, critical=false) => <motion.div className={`rounded-2xl p-3 text-center ring-1 ${fail && critical ? "bg-red-500/25 text-red-100 ring-red-300" : "bg-white/10 text-white ring-white/15"}`} animate={fail && critical ? { x: [0,-5,5,0], scale: [1,.96,1.04,1] } : { y: [0,-4,0] }} transition={{ duration: 1.4, repeat: Infinity }}><div className="mx-auto mb-2 h-12 w-12 rounded-xl bg-gradient-to-b from-cyan-300 to-blue-700" /><div className="text-xs font-black">{name}</div></motion.div>;
  return <motion.section initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-black p-8 text-white shadow-[0_0_100px_rgba(239,68,68,.15)] ring-1 ring-red-300/20">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-red-300"><AlertTriangle className="h-4 w-4" /> RAID 10 vs RAID 01 Live-Test</div><h2 className="mt-2 text-3xl font-black">Gleiche Anzahl Disks, anderes Risiko</h2></div><button onClick={()=>setFail(!fail)} className="rounded-2xl bg-red-400 px-5 py-3 font-black text-slate-950 shadow-[0_0_35px_rgba(248,113,113,.45)] transition hover:scale-105">{fail ? "Zurücksetzen" : "Disk-Ausfall testen"}</button></div>
    <div className="mt-7 grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15"><h3 className="text-2xl font-black text-cyan-200">RAID 10</h3><div className="mt-4 grid grid-cols-2 gap-4"><div className="rounded-2xl bg-cyan-400/10 p-3 ring-1 ring-cyan-300/20"><div className="mb-2 text-center text-xs font-bold text-cyan-200">Mirror 1</div><div className="grid grid-cols-2 gap-2">{tower("D1", true)}{tower("D2")}</div></div><div className="rounded-2xl bg-cyan-400/10 p-3 ring-1 ring-cyan-300/20"><div className="mb-2 text-center text-xs font-bold text-cyan-200">Mirror 2</div><div className="grid grid-cols-2 gap-2">{tower("D3")}{tower("D4")}</div></div></div><div className="mt-4 rounded-2xl bg-emerald-400/15 p-3 text-sm font-bold text-emerald-100">{fail ? "Läuft weiter: D2 hat die Spiegelkopie von D1." : "Robust, weil jedes Mirror-Paar eine Kopie hat."}</div></div>
      <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15"><h3 className="text-2xl font-black text-red-200">RAID 01</h3><div className="mt-4 grid grid-cols-2 gap-4"><div className="rounded-2xl bg-red-400/10 p-3 ring-1 ring-red-300/20"><div className="mb-2 text-center text-xs font-bold text-red-200">Stripe 1</div><div className="grid grid-cols-2 gap-2">{tower("D1", true)}{tower("D2", fail)}</div></div><div className="rounded-2xl bg-orange-400/10 p-3 ring-1 ring-orange-300/20"><div className="mb-2 text-center text-xs font-bold text-orange-200">Stripe 2</div><div className="grid grid-cols-2 gap-2">{tower("D3")}{tower("D4")}</div></div></div><div className="mt-4 rounded-2xl bg-amber-400/15 p-3 text-sm font-bold text-amber-100">{fail ? "Kritischer: ein ganzes Stripe-Set wird gefährdet." : "Funktioniert, aber nach Ausfällen ungünstiger als RAID 10."}</div></div>
    </div>
  </motion.section>;
}

function DecisionDiagram() {
  const cards = [
    { icon: Shield, title: "RAID", text: "Verfügbarkeit bei Laufwerksausfall", color: "from-blue-400 to-cyan-600" },
    { icon: RefreshCcw, title: "Backup", text: "Wiederherstellung nach Löschen, Virus oder Fehler", color: "from-emerald-400 to-green-600" },
    { icon: Cloud, title: "Cloud / Offsite", text: "Schutz, wenn Gerät oder Standort verloren geht", color: "from-violet-400 to-purple-700" },
  ];
  return <motion.section initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
    <div className="flex items-center gap-3"><Cloud className="h-7 w-7 text-violet-700" /><h2 className="text-3xl font-black">RAID vs Backup vs Cloud</h2></div>
    <div className="mt-7 grid gap-5 md:grid-cols-3">{cards.map((c,i)=>{const Icon=c.icon; return <motion.div key={c.title} className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl" whileHover={{ y: -12, scale: 1.04, rotate: i-1 }}><motion.div className={`absolute inset-0 bg-gradient-to-br ${c.color}`} animate={{ scale: [1,1.08,1] }} transition={{ duration: 3, repeat: Infinity, delay: i*.2 }} /><div className="relative"><Icon className="h-10 w-10" /><div className="mt-4 text-3xl font-black">{c.title}</div><p className="mt-3 text-white/90">{c.text}</p></div></motion.div>})}</div>
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-center text-lg font-black text-slate-800">Merksatz: RAID hält Systeme am Laufen — Backups bringen Daten zurück.</div>
  </motion.section>;
}

function MiniQuiz() {
  const questions = [
    { q: "Welches RAID bietet maximale Geschwindigkeit ohne Redundanz?", a: "RAID 0", options: ["RAID 0", "RAID 1", "RAID 5", "RAID 6"] },
    { q: "Welches RAID spiegelt Daten auf mehrere Festplatten?", a: "RAID 1", options: ["RAID 0", "RAID 1", "RAID 3", "RAID 5"] },
    { q: "Welches RAID kann den Ausfall von zwei Festplatten verkraften?", a: "RAID 6", options: ["RAID 0", "RAID 5", "RAID 6", "RAID 10"] },
    { q: "Welches RAID verwendet verteilte Parität?", a: "RAID 5", options: ["RAID 1", "RAID 2", "RAID 5", "RAID 10"] },
    { q: "Welches RAID wird häufig für Datenbanken und Server genutzt?", a: "RAID 10", options: ["RAID 7", "RAID 10", "RAID 0", "RAID 3"] },
    { q: "Was bedeutet Mirroring?", a: "Daten werden gespiegelt", options: ["Daten werden gelöscht", "Daten werden gespiegelt", "Daten werden verschlüsselt", "Daten werden komprimiert"] },
    { q: "Warum ist RAID 0 riskant?", a: "Ein Ausfall zerstört das gesamte Array", options: ["Es ist langsam", "Es braucht Internet", "Ein Ausfall zerstört das gesamte Array", "Es funktioniert nur mit SSDs"] },
    { q: "Was ist ein Vorteil von Software RAID?", a: "Kein spezieller RAID-Controller nötig", options: ["Kein Betriebssystem nötig", "Immer schneller", "Kein spezieller RAID-Controller nötig", "Nur für HDDs geeignet"] },
    { q: "Warum gilt RAID 10 als sehr beliebt?", a: "Es kombiniert Geschwindigkeit und Sicherheit", options: ["Es braucht nur eine Festplatte", "Es kombiniert Geschwindigkeit und Sicherheit", "Es hat keine Spiegelung", "Es braucht keinen Strom"] },
    { q: "Ersetzt RAID ein Backup?", a: "Nein", options: ["Ja", "Nein", "Nur bei SSDs", "Nur bei RAID 1"] },
  ];

  const [answers, setAnswers] = useState({});

  return (
    <motion.section
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl ring-1 ring-cyan-300/20"
    >
      <div className="flex items-center gap-3">
        <HelpCircle className="h-7 w-7 text-cyan-300" />
        <h2 className="text-3xl font-black">Mini-Quiz</h2>
      </div>

      <div className="mt-6 space-y-5">
        {questions.map((q, i) => (
          <div
            key={q.q}
            className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10"
          >
            <div className="font-bold">
              {i + 1}. {q.q}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {q.options.map((o) => {
                const chosen = answers[i] === o;
                const correct = chosen && o === q.a;
                const wrong = chosen && o !== q.a;

                return (
                  <button
                    key={o}
                    onClick={() => setAnswers({ ...answers, [i]: o })}
                    className={`rounded-xl px-4 py-2 text-sm font-black transition hover:scale-105 ${
                      correct
                        ? "bg-emerald-400 text-slate-950"
                        : wrong
                          ? "bg-red-400 text-slate-950"
                          : "bg-white/10 text-white ring-1 ring-white/15"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>

            {answers[i] && (
              <div
                className={`mt-3 text-sm font-bold ${
                  answers[i] === q.a ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {answers[i] === q.a
                  ? "Richtig!"
                  : `Nicht ganz — richtig wäre ${q.a}.`}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function RaidSimulator() {
  const [mode, setMode] = useState("normal");
  const failed = mode === "failure";
  return <motion.section initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-[0_30px_90px_rgba(15,23,42,0.55)] ring-1 ring-cyan-300/20">
    <ParticleField />
    <div className="relative flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-300"><PlayCircle className="h-4 w-4" /> Interaktive Demo</div><h2 className="mt-2 text-3xl font-black">Was passiert bei einem Plattenausfall?</h2><p className="mt-2 max-w-3xl text-slate-300">Klicke auf den Button: Die Demo zeigt, warum RAID mit Parität oder Spiegelung weiterlaufen kann, aber RAID 0 sofort kritisch ist.</p></div><button onClick={() => setMode(failed ? "normal" : "failure")} className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.45)] transition hover:scale-105">{failed ? "System wiederherstellen" : "Ausfall simulieren"}</button></div>
    <div className="relative mt-8 grid gap-5 md:grid-cols-4">{["Disk 1", "Disk 2", "Disk 3", "Parity"].map((disk, i) => { const isDown = failed && i === 1; return <motion.div key={disk} className={`relative overflow-hidden rounded-3xl p-5 ring-1 ${isDown ? "bg-red-950/80 ring-red-400" : "bg-white/10 ring-white/15"}`} animate={isDown ? { x: [0, -8, 8, -5, 5, 0], rotate: [0, -2, 2, -1, 1, 0] } : { y: [0, -7, 0] }} transition={{ duration: isDown ? 0.5 : 2.4, repeat: isDown ? 2 : Infinity, delay: i * 0.14 }}><motion.div className={`mx-auto h-28 w-20 rounded-2xl ${isDown ? "bg-red-500" : "bg-gradient-to-b from-cyan-300 to-blue-600"} shadow-2xl`} animate={{ boxShadow: isDown ? ["0 0 25px rgba(248,113,113,.8)", "0 0 70px rgba(239,68,68,.9)", "0 0 25px rgba(248,113,113,.8)"] : ["0 0 20px rgba(34,211,238,.35)", "0 0 50px rgba(34,211,238,.75)", "0 0 20px rgba(34,211,238,.35)"] }} transition={{ duration: 1.6, repeat: Infinity }} /><div className="mt-4 text-center font-black">{disk}</div><div className={`mt-1 text-center text-xs ${isDown ? "text-red-200" : "text-cyan-100"}`}>{isDown ? "AUSGEFALLEN" : i === 3 ? "Prüfdaten" : "Datenblöcke"}</div></motion.div>; })}</div>
    <motion.div className={`relative mt-6 rounded-2xl p-4 text-sm font-semibold ${failed ? "bg-amber-400/15 text-amber-100 ring-1 ring-amber-300/30" : "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/30"}`} animate={{ scale: [1, 1.012, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>{failed ? "RAID mit Redundanz kann Daten aus den übrigen Blöcken und Parität/Spiegelung rekonstruieren. Bei RAID 0 wäre jetzt alles verloren." : "Normalbetrieb: Datenpakete werden auf mehrere Laufwerke verteilt. Je nach RAID-Level gibt es zusätzlich Spiegelung oder Parität."}</motion.div>
  </motion.section>;
}

export default function RaidReferatWebseite() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => RAID_LEVELS.filter(l => `${l.id} ${l.title} ${l.short} ${l.use}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-100 text-slate-900">
    <header className="relative overflow-hidden px-6 py-16 text-white md:px-12"><ParticleField /><div className="absolute inset-0 opacity-20"><motion.div className="absolute left-10 top-10 h-44 w-44 rounded-full bg-blue-400 blur-3xl" animate={{ x: [0, 35, 0], y: [0, 18, 0], scale: [1, 1.12, 1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} /><motion.div className="absolute right-12 top-24 h-64 w-64 rounded-full bg-cyan-300 blur-3xl" animate={{ x: [0, -30, 0], y: [0, 24, 0], scale: [1, 1.08, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} /></div><div className="relative mx-auto max-w-6xl"><motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}><motion.div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 backdrop-blur" whileHover={{ scale: 1.08, boxShadow: "0 0 40px rgba(34,211,238,.45)" }}><motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2.4, repeat: Infinity }}><Presentation className="h-4 w-4" /></motion.div> Raid</motion.div><motion.h1 className="mt-6 max-w-4xl bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-7xl" initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.15, duration: 0.75, ease: "easeOut" }}>RAID einfach erklärt</motion.h1><motion.p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.55 }}>RAID steht für „Redundant Array of Independent Disks“. Mehrere Festplatten oder SSDs werden zusammengeschaltet, um mehr Geschwindigkeit, mehr Ausfallsicherheit oder beides zu erreichen.</motion.p><div className="mt-8 grid gap-3 sm:grid-cols-3">{["Striping", "Mirroring", "Parity"].map((title, i) => <motion.div key={title} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 + i * 0.1 }} whileHover={{ y: -8, scale: 1.06, boxShadow: "0 20px 60px rgba(34,211,238,.18)" }}><b>{title}</b><br/><span className="text-sm text-slate-300">{i === 0 ? "Daten werden aufgeteilt → schneller." : i === 1 ? "Daten werden gespiegelt → sicherer." : "Prüfinformationen helfen bei Wiederherstellung."}</span></motion.div>)}</div><RaidHeroMachine /></motion.div></div></header>
    <main className="mx-auto max-w-6xl space-y-10 px-6 pb-20 md:px-12">
      <EnterpriseRack />
      <RaidTimeline />
      <CapacityCalculator />
      <MetricBars />
      <DecisionDiagram />
      <ReconstructionDemo />
      <Raid10Vs01Interactive />
      <RealWorldExamples />
      <motion.section initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="-mt-8 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200"><div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-blue-700"><BookOpen className="h-4 w-4" /> Sprechertext für den Einstieg</div><h2 className="mt-2 text-3xl font-black">Was ist RAID?</h2><p className="mt-3 leading-7 text-slate-700">RAID ist eine Technik, bei der mehrere Laufwerke wie ein gemeinsames Speichersystem arbeiten. Je nach RAID-Level werden Daten verteilt, gespiegelt oder mit Paritätsinformationen ergänzt. Wichtig: RAID schützt vor bestimmten Festplattenausfällen, aber nicht vor versehentlichem Löschen, Viren, Diebstahl oder Brand. Deshalb ist ein Backup trotzdem notwendig.</p></div><div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200"><h3 className="font-black">Merksatz</h3><p className="mt-2 text-lg text-slate-700"><b>RAID ist Verfügbarkeit, Backup ist Wiederherstellung.</b></p><div className="mt-4 grid gap-3 sm:grid-cols-2"><motion.div className="rounded-xl bg-white p-3 text-sm ring-1 ring-slate-200" whileHover={{ scale: 1.04 }}><CheckCircle2 className="mb-1 h-5 w-5 text-emerald-600" /> RAID kann helfen, wenn eine Festplatte ausfällt.</motion.div><motion.div className="rounded-xl bg-white p-3 text-sm ring-1 ring-slate-200" whileHover={{ scale: 1.04 }}><XCircle className="mb-1 h-5 w-5 text-red-600" /> RAID hilft nicht, wenn man Dateien löscht und kein Backup hat.</motion.div></div></div></div></motion.section>
      <motion.section initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-3xl font-black">Vergleich auf einen Blick</h2><p className="mt-1 text-slate-600">Tabelle</p></div><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="RAID-Level suchen …" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-blue-200 focus:ring sm:w-72" /></div><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[760px] border-separate border-spacing-0 overflow-hidden rounded-2xl text-left text-sm"><thead className="bg-slate-900 text-white"><tr><th className="p-3">Level</th><th className="p-3">Prinzip</th><th className="p-3">Min.</th><th className="p-3">Nutzbare Kapazität</th><th className="p-3">Ausfalltoleranz</th><th className="p-3">Kurzbewertung</th></tr></thead><tbody>{filtered.map((l, i) => <motion.tr key={l.id} className={i % 2 ? "bg-slate-50" : "bg-white"} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ scale: 1.008, backgroundColor: "rgba(224,242,254,.8)" }}><td className="p-3 font-black">RAID {l.id}</td><td className="p-3">{l.short}</td><td className="p-3">{l.min}</td><td className="p-3">{l.capacity}</td><td className="p-3">{l.tolerance}</td><td className="p-3">{l.performance}</td></motion.tr>)}</tbody></table></div></motion.section>
      <RaidSimulator />
      <section className="space-y-7">{filtered.map(level => <LevelCard key={level.id} level={level} />)}</section>
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl"><div className="flex items-center gap-3"><motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}><RefreshCcw className="h-6 w-6" /></motion.div><h2 className="text-3xl font-black">RAID 10 vs. RAID 01 – wichtiger Unterschied</h2></div><div className="mt-5 grid gap-5 md:grid-cols-2"><motion.div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15" whileHover={{ scale: 1.04, rotate: -1 }}><h3 className="text-xl font-bold">RAID 10</h3><p className="mt-2 text-slate-300">Erst werden Platten gespiegelt, dann werden die Daten über diese Spiegel verteilt. Dadurch ist es meist robuster: Es dürfen mehrere Platten ausfallen, solange nicht beide Platten desselben Spiegelpaars betroffen sind.</p></motion.div><motion.div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15" whileHover={{ scale: 1.04, rotate: 1 }}><h3 className="text-xl font-bold">RAID 01</h3><p className="mt-2 text-slate-300">Erst werden Daten gestriped, dann wird dieses Stripe-Set gespiegelt. Nach dem ersten Ausfall ist oft eine ganze Hälfte kritisch. Deshalb wird in der Praxis eher RAID 10 bevorzugt.</p></motion.div></div></motion.section>
      <MiniQuiz />
    </main>
  </div>;
}
