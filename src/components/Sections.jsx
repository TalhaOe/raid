import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, BarChart3, BookOpen, CheckCircle2, Cloud, Cpu, Database, HardDrive, HelpCircle, PlayCircle, RefreshCcw, Server, Shield, Sparkles, XCircle } from 'lucide-react';
import { METRIC_ROWS, RAID_TIMELINE, REAL_WORLD_CASES } from '../data/raidData.js';
import { calculateRaidCapacity } from '../utils/raidCapacity.js';
import { ParticleField, SectionTitle } from './Shared.jsx';
export function EnterpriseRack(){return <motion.section initial={{opacity:0,scale:.96}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} className="relative overflow-hidden rounded-[2rem] bg-black p-8 text-white shadow-[0_0_120px_rgba(34,211,238,.18)] ring-1 ring-cyan-300/20"><ParticleField/><SectionTitle icon={Server} title="Enterprise Storage Rack" dark/><div className="relative mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({length:8},(_,i)=><motion.div key={i} className="relative rounded-3xl bg-gradient-to-b from-slate-800 to-slate-950 p-5 ring-1 ring-cyan-300/10" whileHover={{y:-8,rotateX:8}}><div className="mb-4 flex items-center justify-between"><div className="text-sm font-black">NODE {i+1}</div><motion.div className="h-3 w-3 rounded-full bg-emerald-400" animate={{opacity:[.2,1,.2],boxShadow:['0 0 0 rgba(74,222,128,0)','0 0 20px rgba(74,222,128,.9)','0 0 0 rgba(74,222,128,0)']}} transition={{duration:1.2,repeat:Infinity}}/></div><div className="grid grid-cols-4 gap-2">{Array.from({length:12},(_,j)=><motion.div key={j} className="h-8 rounded-lg bg-gradient-to-b from-cyan-300 to-blue-700" animate={{boxShadow:['0 0 10px rgba(34,211,238,.25)','0 0 24px rgba(34,211,238,.75)','0 0 10px rgba(34,211,238,.25)']}} transition={{duration:2,repeat:Infinity,delay:j*.08}}/>)}</div></motion.div>)}</div></motion.section>}
export function RaidTimeline(){return <motion.section initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200"><SectionTitle icon={Activity} title="Entwicklung von RAID"/><div className="relative mt-10 overflow-x-auto pb-6"><div className="absolute left-0 right-0 top-10 h-1 rounded-full bg-slate-200"/><div className="relative flex min-w-[900px] justify-between gap-6">{RAID_TIMELINE.map((item,i)=><motion.div key={item.label} className="relative flex w-40 flex-col items-center text-center" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*.12}}><motion.div className={`z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-lg font-black text-white shadow-2xl`} animate={{y:[0,-8,0]}} transition={{duration:2.4,repeat:Infinity,delay:i*.15}}>{item.label}</motion.div><div className="mt-4 text-sm font-black text-slate-500">{item.year}</div><div className="mt-1 font-bold">{item.text}</div></motion.div>)}</div></div></motion.section>}
export function CapacityCalculator(){const[raid,setRaid]=useState('5');const[disks,setDisks]=useState(4);const[size,setSize]=useState(2);const result=useMemo(()=>calculateRaidCapacity(raid,disks,size),[raid,disks,size]);return <motion.section initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="rounded-3xl bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,.55)] ring-1 ring-cyan-300/20"><SectionTitle icon={Cpu} title="Interaktiver RAID-Rechner" dark/><div className="mt-6 grid gap-6 lg:grid-cols-3"><div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15"><label className="text-sm font-bold text-cyan-200">RAID-Level</label><select value={raid} onChange={e=>setRaid(e.target.value)} className="mt-2 w-full rounded-xl bg-slate-900 p-3 text-white ring-1 ring-cyan-300/20"><option value="0">RAID 0</option><option value="1">RAID 1</option><option value="5">RAID 5</option><option value="6">RAID 6</option><option value="10">RAID 10</option></select><label className="mt-5 block text-sm font-bold text-cyan-200">Anzahl Disks</label><input type="range" min="2" max="12" value={disks} onChange={e=>setDisks(Number(e.target.value))} className="mt-2 w-full"/><div className="text-sm text-slate-300">{disks} Laufwerke</div><label className="mt-5 block text-sm font-bold text-cyan-200">TB pro Disk</label><input type="range" min="1" max="20" value={size} onChange={e=>setSize(Number(e.target.value))} className="mt-2 w-full"/><div className="text-sm text-slate-300">{size} TB pro Laufwerk</div></div><motion.div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-700/20 p-6 ring-1 ring-cyan-300/20" animate={{boxShadow:['0 0 20px rgba(34,211,238,.2)','0 0 60px rgba(34,211,238,.45)','0 0 20px rgba(34,211,238,.2)']}} transition={{duration:2.2,repeat:Infinity}}><div className="text-sm font-bold uppercase tracking-wide text-cyan-200">Nutzbare Kapazität</div><div className="mt-3 text-5xl font-black">{result.usable} TB</div><div className="mt-4 text-slate-300">Gesamtkapazität: {disks*size} TB</div></motion.div><div className="grid gap-4"><div className="rounded-2xl bg-emerald-500/15 p-5 ring-1 ring-emerald-300/20"><div className="text-sm font-bold uppercase tracking-wide text-emerald-200">Ausfalltoleranz</div><div className="mt-2 text-3xl font-black">{result.fail}</div></div><div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10"><div className="text-sm font-bold uppercase tracking-wide text-cyan-200">Beschreibung</div><div className="mt-2 text-lg font-bold">{result.note}</div></div></div></div></motion.section>}
export function MetricBars(){const metrics=[{key:'speed',label:'Performance'},{key:'safety',label:'Sicherheit'},{key:'efficiency',label:'Kapazitäts-Effizienz'}];return <motion.section initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200"><SectionTitle icon={BarChart3} title="Animierter Vergleich: Tempo, Sicherheit, Kosten"/><div className="mt-7 space-y-6">{METRIC_ROWS.map((row,i)=><div key={row.raid} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><div className="mb-3 font-black text-slate-900">{row.raid}</div><div className="grid gap-3 md:grid-cols-3">{metrics.map((m,j)=><div key={m.key}><div className="mb-1 flex justify-between text-xs font-bold text-slate-500"><span>{m.label}</span><span>{row[m.key]}%</span></div><div className="h-4 overflow-hidden rounded-full bg-slate-200"><motion.div className={`h-full rounded-full bg-gradient-to-r ${row.color}`} initial={{width:0}} whileInView={{width:`${row[m.key]}%`}} viewport={{once:true}} transition={{duration:1.1,delay:i*.08+j*.08,ease:'easeOut'}}/></div></div>)}</div></div>)}</div></motion.section>}
export function HardwareSoftwareRaidSection(){const hardwareItems=['Eigener RAID-Controller','Entlastet die CPU','Oft in Servern & Rechenzentren','Sehr schnell & stabil','Teurer als Software RAID'];const softwareItems=['Keine spezielle Hardware nötig','Günstiger & flexibel','CPU übernimmt Berechnungen','Beliebt bei NAS & Heimservern','Heute oft mit ZFS oder mdadm'];return <motion.section initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,.55)] ring-1 ring-cyan-300/20"><ParticleField count={30}/><SectionTitle icon={Cpu} title="Hardware RAID vs Software RAID" dark/><div className="relative mt-7 grid gap-6 lg:grid-cols-2"><div className="relative rounded-3xl bg-gradient-to-br from-cyan-500/15 to-blue-700/15 p-6 ring-1 ring-cyan-300/20"><div className="flex items-center gap-3"><Server className="h-8 w-8 text-cyan-300"/><div><div className="text-sm font-bold uppercase tracking-wide text-cyan-200">Enterprise-Lösung</div><h3 className="text-3xl font-black">Hardware RAID</h3></div></div><p className="mt-4 text-slate-300">Ein eigener RAID-Controller übernimmt die Verwaltung der Festplatten.</p><div className="mt-5 grid gap-3">{hardwareItems.map(item=><div key={item} className="rounded-2xl bg-white/10 p-3 text-sm font-bold ring-1 ring-white/10"><CheckCircle2 className="mr-2 inline h-4 w-4 text-emerald-300"/>{item}</div>)}</div></div><div className="relative rounded-3xl bg-gradient-to-br from-violet-500/15 to-fuchsia-700/15 p-6 ring-1 ring-violet-300/20"><div className="flex items-center gap-3"><Database className="h-8 w-8 text-violet-300"/><div><div className="text-sm font-bold uppercase tracking-wide text-violet-200">Flexibel & günstig</div><h3 className="text-3xl font-black">Software RAID</h3></div></div><p className="mt-4 text-slate-300">Das Betriebssystem übernimmt die RAID-Verwaltung selbst.</p><div className="mt-5 grid gap-3">{softwareItems.map(item=><div key={item} className="rounded-2xl bg-white/10 p-3 text-sm font-bold ring-1 ring-white/10"><Sparkles className="mr-2 inline h-4 w-4 text-violet-300"/>{item}</div>)}</div></div></div><div className="relative mt-7 rounded-3xl bg-white/10 p-5 ring-1 ring-white/10"><div className="font-black text-cyan-200">Heute in der Praxis</div><div className="mt-2 text-sm text-slate-300">Unternehmen nutzen oft Hardware RAID oder Storage-Systeme. NAS und Heimserver nutzen häufig Software RAID, ZFS, mdadm oder TrueNAS.</div></div></motion.section>}
export function DecisionDiagram(){const cards=[{icon:Shield,title:'RAID',text:'Verfügbarkeit bei Laufwerksausfall',color:'from-blue-400 to-cyan-600'},{icon:RefreshCcw,title:'Backup',text:'Wiederherstellung nach Löschen, Virus oder Fehler',color:'from-emerald-400 to-green-600'},{icon:Cloud,title:'Cloud / Offsite',text:'Schutz, wenn Gerät oder Standort verloren geht',color:'from-violet-400 to-purple-700'}];return <motion.section initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200"><SectionTitle icon={Cloud} title="RAID vs Backup vs Cloud"/><div className="mt-7 grid gap-5 md:grid-cols-3">{cards.map((card,i)=>{const Icon=card.icon;return <motion.div key={card.title} className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl" whileHover={{y:-12,scale:1.04,rotate:i-1}}><div className={`absolute inset-0 bg-gradient-to-br ${card.color}`}/><div className="relative"><Icon className="h-10 w-10"/><div className="mt-4 text-3xl font-black">{card.title}</div><p className="mt-3 text-white/90">{card.text}</p></div></motion.div>})}</div><div className="mt-6 rounded-2xl bg-slate-100 p-4 text-center text-lg font-black text-slate-800">Merksatz: RAID hält Systeme am Laufen — Backups bringen Daten zurück.</div></motion.section>}
export function ReconstructionDemo(){const[lost,setLost]=useState(false);return <motion.section initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,.55)] ring-1 ring-emerald-300/20"><ParticleField count={28}/><div className="relative flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-300"><RefreshCcw className="h-4 w-4"/> RAID 5 Rekonstruktion</div><h2 className="mt-2 text-3xl font-black">Fehlender Block wird aus Parität rekonstruiert</h2><p className="mt-2 max-w-3xl text-slate-300">Vereinfacht: Datenblöcke und Paritätsblock werden kombiniert, um einen verlorenen Block neu zu berechnen.</p></div><button onClick={()=>setLost(!lost)} className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-slate-950 shadow-[0_0_35px_rgba(52,211,153,.45)] transition hover:scale-105">{lost?'Block wieder normal':'Blockverlust simulieren'}</button></div><div className="relative mt-8 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto_1fr]">{['A1','B1','P1'].map(blockName=><div key={blockName} className="rounded-3xl bg-white/10 p-5 text-center ring-1 ring-white/15"><div className="text-xs font-bold text-emerald-200">Quelle</div><div className="mt-2 text-4xl font-black">{blockName}</div></div>)}<div className="flex items-center justify-center text-5xl font-black text-emerald-300">→</div><div className={`rounded-3xl p-5 text-center ring-1 ${lost?'bg-red-500/20 ring-red-300':'bg-white/10 ring-white/15'}`}><div className="text-xs font-bold text-slate-300">Ergebnis</div><div className="mt-2 text-4xl font-black">A2</div><div className="mt-1 text-xs text-slate-300">{lost?'rekonstruiert':'normal vorhanden'}</div></div></div></motion.section>}
export function Raid10Vs01Interactive(){const[fail,setFail]=useState(false);const tower=(name,critical=false)=><motion.div className={`rounded-2xl p-3 text-center ring-1 ${fail&&critical?'bg-red-500/25 text-red-100 ring-red-300':'bg-white/10 text-white ring-white/15'}`} animate={fail&&critical?{x:[0,-5,5,0]}:{y:[0,-4,0]}} transition={{duration:1.4,repeat:Infinity}}><div className="mx-auto mb-2 h-12 w-12 rounded-xl bg-gradient-to-b from-cyan-300 to-blue-700"/><div className="text-xs font-black">{name}</div></motion.div>;return <motion.section initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="rounded-3xl bg-black p-8 text-white shadow-[0_0_100px_rgba(239,68,68,.15)] ring-1 ring-red-300/20"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-red-300"><AlertTriangle className="h-4 w-4"/> RAID 10 vs RAID 01 Live-Test</div><h2 className="mt-2 text-3xl font-black">Gleiche Anzahl Disks, anderes Risiko</h2></div><button onClick={()=>setFail(!fail)} className="rounded-2xl bg-red-400 px-5 py-3 font-black text-slate-950 shadow-[0_0_35px_rgba(248,113,113,.45)] transition hover:scale-105">{fail?'Zurücksetzen':'Disk-Ausfall testen'}</button></div><div className="mt-7 grid gap-6 lg:grid-cols-2"><div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15"><h3 className="text-2xl font-black text-cyan-200">RAID 10</h3><div className="mt-4 grid grid-cols-2 gap-4"><div className="rounded-2xl bg-cyan-400/10 p-3 ring-1 ring-cyan-300/20"><div className="mb-2 text-center text-xs font-bold text-cyan-200">Mirror 1</div><div className="grid grid-cols-2 gap-2">{tower('D1',true)}{tower('D2')}</div></div><div className="rounded-2xl bg-cyan-400/10 p-3 ring-1 ring-cyan-300/20"><div className="mb-2 text-center text-xs font-bold text-cyan-200">Mirror 2</div><div className="grid grid-cols-2 gap-2">{tower('D3')}{tower('D4')}</div></div></div><div className="mt-4 rounded-2xl bg-emerald-400/15 p-3 text-sm font-bold text-emerald-100">{fail?'Läuft weiter: D2 hat die Spiegelkopie von D1.':'Robust, weil jedes Mirror-Paar eine Kopie hat.'}</div></div><div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15"><h3 className="text-2xl font-black text-red-200">RAID 01</h3><div className="mt-4 grid grid-cols-2 gap-4"><div className="rounded-2xl bg-red-400/10 p-3 ring-1 ring-red-300/20"><div className="mb-2 text-center text-xs font-bold text-red-200">Stripe 1</div><div className="grid grid-cols-2 gap-2">{tower('D1',true)}{tower('D2',fail)}</div></div><div className="rounded-2xl bg-orange-400/10 p-3 ring-1 ring-orange-300/20"><div className="mb-2 text-center text-xs font-bold text-orange-200">Stripe 2</div><div className="grid grid-cols-2 gap-2">{tower('D3')}{tower('D4')}</div></div></div><div className="mt-4 rounded-2xl bg-amber-400/15 p-3 text-sm font-bold text-amber-100">{fail?'Kritischer: ein ganzes Stripe-Set wird gefährdet.':'Funktioniert, aber nach Ausfällen ungünstiger als RAID 10.'}</div></div></div></motion.section>}
export function RealWorldExamples(){return <motion.section initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="rounded-3xl bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,.55)] ring-1 ring-cyan-300/20"><SectionTitle icon={HardDrive} title="RAID im echten Leben" dark/><div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{REAL_WORLD_CASES.map((item,i)=><motion.div key={item.title} className="relative overflow-hidden rounded-3xl bg-white/10 p-5 ring-1 ring-white/10" whileHover={{y:-12,scale:1.05,rotate:i%2?1:-1}}><div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20`}/><div className="relative"><div className="text-sm font-black uppercase tracking-wide text-cyan-200">{item.raid}</div><div className="mt-2 text-2xl font-black">{item.title}</div><p className="mt-3 text-sm text-slate-300">{item.description}</p></div></motion.div>)}</div></motion.section>}
export function RaidSimulator(){const[failed,setFailed]=useState(false);return <motion.section initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-[0_30px_90px_rgba(15,23,42,0.55)] ring-1 ring-cyan-300/20"><ParticleField count={26}/><div className="relative flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-300"><PlayCircle className="h-4 w-4"/> Interaktive Demo</div><h2 className="mt-2 text-3xl font-black">Was passiert bei einem Plattenausfall?</h2></div><button onClick={()=>setFailed(!failed)} className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.45)] transition hover:scale-105">{failed?'System wiederherstellen':'Ausfall simulieren'}</button></div><div className="relative mt-8 grid gap-5 md:grid-cols-4">{['Disk 1','Disk 2','Disk 3','Parity'].map((disk,i)=>{const isDown=failed&&i===1;return <motion.div key={disk} className={`relative overflow-hidden rounded-3xl p-5 ring-1 ${isDown?'bg-red-950/80 ring-red-400':'bg-white/10 ring-white/15'}`}><div className={`mx-auto h-28 w-20 rounded-2xl ${isDown?'bg-red-500':'bg-gradient-to-b from-cyan-300 to-blue-600'} shadow-2xl`}/><div className="mt-4 text-center font-black">{disk}</div><div className={`mt-1 text-center text-xs ${isDown?'text-red-200':'text-cyan-100'}`}>{isDown?'AUSGEFALLEN':i===3?'Prüfdaten':'Datenblöcke'}</div></motion.div>})}</div></motion.section>}

export function MiniQuiz() {
  const questions = [
    {
      q: "Welches RAID bietet maximale Geschwindigkeit ohne Redundanz?",
      a: "RAID 0",
      options: ["RAID 0", "RAID 1", "RAID 5", "RAID 6"],
    },
    {
      q: "Welches RAID spiegelt Daten auf mehrere Festplatten?",
      a: "RAID 1",
      options: ["RAID 0", "RAID 1", "RAID 3", "RAID 5"],
    },
    {
      q: "Welches RAID kann den Ausfall von zwei Festplatten verkraften?",
      a: "RAID 6",
      options: ["RAID 0", "RAID 5", "RAID 6", "RAID 10"],
    },
    {
      q: "Welches RAID verwendet verteilte Parität?",
      a: "RAID 5",
      options: ["RAID 1", "RAID 2", "RAID 5", "RAID 10"],
    },
    {
      q: "Welches RAID wird häufig für Datenbanken und Server genutzt?",
      a: "RAID 10",
      options: ["RAID 7", "RAID 10", "RAID 0", "RAID 3"],
    },
    {
      q: "Was bedeutet 'Mirroring'?",
      a: "Daten werden gespiegelt",
      options: [
        "Daten werden gelöscht",
        "Daten werden gespiegelt",
        "Daten werden verschlüsselt",
        "Daten werden komprimiert",
      ],
    },
    {
      q: "Warum ist RAID 0 riskant?",
      a: "Ein Ausfall zerstört das gesamte Array",
      options: [
        "Es ist langsam",
        "Es braucht Internet",
        "Ein Ausfall zerstört das gesamte Array",
        "Es funktioniert nur mit SSDs",
      ],
    },
    {
      q: "Was ist ein Vorteil von Software RAID?",
      a: "Kein spezieller RAID-Controller nötig",
      options: [
        "Kein Betriebssystem nötig",
        "Immer schneller",
        "Kein spezieller RAID-Controller nötig",
        "Nur für HDDs geeignet",
      ],
    },
    {
      q: "Warum gilt RAID 10 als sehr beliebt?",
      a: "Es kombiniert Geschwindigkeit und Sicherheit",
      options: [
        "Es braucht nur eine Festplatte",
        "Es kombiniert Geschwindigkeit und Sicherheit",
        "Es hat keine Spiegelung",
        "Es braucht keinen Strom",
      ],
    },
    {
      q: "Ersetzt RAID ein Backup?",
      a: "Nein",
      options: ["Ja", "Nein", "Nur bei SSDs", "Nur bei RAID 1"],
    },
  ];

  const [answers, setAnswers] = useState({});

  return (
    <motion.section
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl ring-1 ring-cyan-300/20"
    >
      <SectionTitle
        icon={HelpCircle}
        title="Mini-Quiz fürs Referat"
        dark
      />

      <div className="mt-6 space-y-5">
        {questions.map((question, i) => (
          <motion.div
            key={question.q}
            className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10"
            whileHover={{ scale: 1.01 }}
          >
            <div className="font-bold">
              {i + 1}. {question.q}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {question.options.map((option) => {
                const chosen = answers[i] === option;
                const correct = chosen && option === question.a;
                const wrong = chosen && option !== question.a;

                return (
                  <button
                    key={option}
                    onClick={() =>
                      setAnswers({
                        ...answers,
                        [i]: option,
                      })
                    }
                    className={`rounded-xl px-4 py-2 text-sm font-black transition hover:scale-105 ${
                      correct
                        ? "bg-emerald-400 text-slate-950"
                        : wrong
                          ? "bg-red-400 text-slate-950"
                          : "bg-white/10 text-white ring-1 ring-white/15"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {answers[i] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-3 text-sm font-bold ${
                  answers[i] === question.a
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {answers[i] === question.a
                  ? "Richtig!"
                  : `Nicht ganz — richtig wäre ${question.a}.`}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export function IntroSection(){return <motion.section initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="-mt-8 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200"><div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><div><div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-blue-700"><BookOpen className="h-4 w-4"/> Sprechertext für den Einstieg</div><h2 className="mt-2 text-3xl font-black">Was ist RAID?</h2><p className="mt-3 leading-7 text-slate-700">RAID ist eine Technik, bei der mehrere Laufwerke wie ein gemeinsames Speichersystem arbeiten. Je nach RAID-Level werden Daten verteilt, gespiegelt oder mit Paritätsinformationen ergänzt.</p></div><div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200"><h3 className="font-black">Merksatz</h3><p className="mt-2 text-lg text-slate-700"><b>RAID ist Verfügbarkeit, Backup ist Wiederherstellung.</b></p><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white p-3 text-sm ring-1 ring-slate-200"><CheckCircle2 className="mb-1 h-5 w-5 text-emerald-600"/>RAID kann helfen, wenn eine Festplatte ausfällt.</div><div className="rounded-xl bg-white p-3 text-sm ring-1 ring-slate-200"><XCircle className="mb-1 h-5 w-5 text-red-600"/>RAID hilft nicht, wenn man Dateien löscht und kein Backup hat.</div></div></div></div></motion.section>}
