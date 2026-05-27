import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// ─── Colors ──────────────────────────────────────────────────────────────────
const C = {
  AVAILABLE_STD:  { fill: '#10B981', stroke: '#059669' },
  AVAILABLE_VIP:  { fill: '#8B5CF6', stroke: '#7C3AED' },
  AVAILABLE_PREM: { fill: '#EC4899', stroke: '#DB2777' },
  RESERVED:       { fill: '#F59E0B', stroke: '#D97706' },
  SOLD:           { fill: '#1F2937', stroke: '#111827' },
  SELECTED:       { fill: '#06B6D4', stroke: '#0284C7' },
};

function getColor(seat, isSelected) {
  if (isSelected)                  return C.SELECTED;
  if (seat.status === 'SOLD')      return C.SOLD;
  if (seat.status === 'RESERVED')  return C.RESERVED;
  if (seat.seatType === 'VIP' || seat.seat_type === 'VIP')     return C.AVAILABLE_VIP;
  if (seat.seatType === 'PREMIUM' || seat.seat_type === 'PREMIUM') return C.AVAILABLE_PREM;
  return C.AVAILABLE_STD;
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function Tooltip({ seat, x, y }) {
  const type = seat.seatType || seat.seat_type || 'STANDARD';
  const typeColor = type === 'VIP' ? '#A78BFA' : type === 'PREMIUM' ? '#F472B6' : '#34D399';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.12 }}
      className="absolute z-50 pointer-events-none"
      style={{ left: x, top: y - 82, transform: 'translateX(-50%)' }}>
      <div className="bg-gray-900/98 border border-white/20 rounded-xl px-3 py-2 text-xs shadow-xl whitespace-nowrap backdrop-blur-sm">
        <p className="font-bold text-white mb-0.5">Ряд {seat.row}, Место {seat.number}</p>
        <p className="font-semibold mb-0.5" style={{ color: typeColor }}>{type}</p>
        <p className="text-brand-400 font-bold">{formatPrice(seat.price)}</p>
        <p className={seat.status === 'SOLD' ? 'text-red-400' : seat.status === 'RESERVED' ? 'text-yellow-400' : 'text-green-400'}>
          {seat.status === 'SOLD' ? '✗ Занято' : seat.status === 'RESERVED' ? '⏳ Бронь' : '✓ Свободно'}
        </p>
      </div>
      <div className="w-2 h-2 bg-gray-900/98 border-r border-b border-white/20 rotate-45 mx-auto -mt-1" />
    </motion.div>
  );
}

// ─── Legend ──────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {[
        { color: '#10B981', label: 'Стандарт' },
        { color: '#8B5CF6', label: 'VIP' },
        { color: '#EC4899', label: 'Premium' },
        { color: '#F59E0B', label: 'Бронь' },
        { color: '#1F2937', label: 'Занято', dim: true },
        { color: '#06B6D4', label: 'Выбрано' },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-1.5 text-xs text-white/50">
          <div className="w-3.5 h-3.5 rounded-full border border-white/20"
            style={{ background: item.color, opacity: item.dim ? 0.35 : 1 }} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ─── THEATRE layout ───────────────────────────────────────────────────────────
function TheatreLayout({ seats, selectedSeats, onSeatClick, containerRef, setTooltip }) {
  const rows = {};
  seats.forEach(s => { if (!rows[s.row]) rows[s.row] = []; rows[s.row].push(s); });
  const rowLabels = Object.keys(rows).sort();
  const S = 24, G = 5;
  const maxW = Math.max(...Object.values(rows).map(r => r.length));
  const W = maxW * (S + G) + 80;
  const H = rowLabels.length * (S + G) + 70;

  return (
    <svg width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id="tStage" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5"/>
          <stop offset="50%" stopColor="#EC4899" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      {/* Stage */}
      <rect x={W*0.08} y={2} width={W*0.84} height={26} rx={13} fill="url(#tStage)" />
      <text x={W/2} y={19} textAnchor="middle" fontSize="10" fill="white" fontWeight="700" letterSpacing="3">С Ц Е Н А</text>

      {rowLabels.map((rowLabel, ri) => {
        const rowSeats = rows[rowLabel].sort((a, b) => a.number - b.number);
        const rowW = rowSeats.length * (S + G);
        const ox = (W - rowW - 40) / 2 + 20;
        const y = ri * (S + G) + 38;
        return (
          <g key={rowLabel}>
            <text x={ox - 8} y={y + S/2 + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.3)" fontWeight="600">{rowLabel}</text>
            {rowSeats.map((seat, si) => {
              const sel = selectedSeats.includes(seat.id);
              const col = getColor(seat, sel);
              const cx = ox + si * (S + G) + S/2;
              const cy = y + S/2;
              const ok = seat.status === 'AVAILABLE';
              return (
                <g key={seat.id}>
                  <rect x={cx-S/2+1} y={cy-S/2+1} width={S-2} height={S-2} rx={5}
                    fill={col.fill} stroke={col.stroke} strokeWidth={sel ? 2.5 : 1}
                    opacity={seat.status === 'SOLD' ? 0.25 : 1}
                    style={{ cursor: ok ? 'pointer' : 'not-allowed', transition: 'all 0.12s' }}
                    onClick={() => ok && onSeatClick(seat)}
                    onMouseEnter={e => { const r = containerRef.current?.getBoundingClientRect(); setTooltip({ seat, x: e.clientX-(r?.left||0), y: e.clientY-(r?.top||0) }); }}
                    onMouseLeave={() => setTooltip(null)} />
                  {sel && <text x={cx} y={cy+4} textAnchor="middle" fontSize="10" fill="white" style={{pointerEvents:'none'}}>✓</text>}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

// ─── CINEMA layout ────────────────────────────────────────────────────────────
function CinemaLayout({ seats, selectedSeats, onSeatClick, containerRef, setTooltip }) {
  const rows = {};
  seats.forEach(s => { if (!rows[s.row]) rows[s.row] = []; rows[s.row].push(s); });
  const rowLabels = Object.keys(rows).sort();
  const S = 26, G = 6;
  const maxW = Math.max(...Object.values(rows).map(r => r.length));
  const W = maxW * (S + G) + 80;
  const H = rowLabels.length * (S + G) + 80;

  return (
    <svg width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id="cScreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3"/>
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3"/>
        </linearGradient>
      </defs>
      {/* Screen */}
      <rect x={W*0.05} y={2} width={W*0.9} height={20} rx={4} fill="url(#cScreen)" />
      <text x={W/2} y={16} textAnchor="middle" fontSize="9" fill="rgba(0,0,0,0.7)" fontWeight="700" letterSpacing="4">ЭКРАН</text>
      {/* Screen glow */}
      <ellipse cx={W/2} cy={28} rx={W*0.35} ry={8} fill="rgba(6,182,212,0.08)" />

      {rowLabels.map((rowLabel, ri) => {
        const rowSeats = rows[rowLabel].sort((a, b) => a.number - b.number);
        // Slight curve — seats fan out from screen
        const curve = ri * 0.5;
        const rowW = rowSeats.length * (S + G);
        const ox = (W - rowW - 40) / 2 + 20;
        const baseY = ri * (S + G) + 42;
        return (
          <g key={rowLabel}>
            <text x={ox - 8} y={baseY + S/2 + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)">{rowLabel}</text>
            {rowSeats.map((seat, si) => {
              const sel = selectedSeats.includes(seat.id);
              const col = getColor(seat, sel);
              // Slight arc
              const midX = rowSeats.length / 2;
              const arcY = Math.abs(si - midX) * curve * 0.15;
              const cx = ox + si * (S + G) + S/2;
              const cy = baseY + arcY + S/2;
              const ok = seat.status === 'AVAILABLE';
              return (
                <g key={seat.id}>
                  <rect x={cx-S/2+1} y={cy-S/2+1} width={S-2} height={S-2} rx={6}
                    fill={col.fill} stroke={col.stroke} strokeWidth={sel ? 2.5 : 1}
                    opacity={seat.status === 'SOLD' ? 0.2 : 1}
                    style={{ cursor: ok ? 'pointer' : 'not-allowed', transition: 'all 0.12s' }}
                    onClick={() => ok && onSeatClick(seat)}
                    onMouseEnter={e => { const r = containerRef.current?.getBoundingClientRect(); setTooltip({ seat, x: e.clientX-(r?.left||0), y: e.clientY-(r?.top||0) }); }}
                    onMouseLeave={() => setTooltip(null)} />
                  {sel && <text x={cx} y={cy+4} textAnchor="middle" fontSize="10" fill="white" style={{pointerEvents:'none'}}>✓</text>}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

// ─── STADIUM / FOOTBALL layout ────────────────────────────────────────────────
function StadiumLayout({ seats, selectedSeats, onSeatClick, containerRef, setTooltip }) {
  const W = 720, H = 540;
  const cx = W/2, cy = H/2;
  const RX = 270, RY = 195;

  // Group by section
  const sections = {};
  seats.forEach(s => {
    const sec = s.section || s.row?.charAt(0) || 'A';
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(s);
  });

  const sectionAngles = { A:-90, B:-45, C:0, D:45, E:90, F:135, G:180, H:-135 };

  return (
    <svg width={W} height={H} className="overflow-visible">
      <defs>
        <radialGradient id="fieldG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#166534"/>
          <stop offset="60%" stopColor="#15803d"/>
          <stop offset="100%" stopColor="#14532d"/>
        </radialGradient>
        <radialGradient id="trackG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="transparent"/>
          <stop offset="85%" stopColor="rgba(139,92,246,0.15)"/>
          <stop offset="100%" stopColor="rgba(139,92,246,0.3)"/>
        </radialGradient>
      </defs>

      {/* Outer stadium ring */}
      <ellipse cx={cx} cy={cy} rx={RX+55} ry={RY+45} fill="rgba(15,15,26,0.6)" stroke="rgba(139,92,246,0.2)" strokeWidth="2"/>
      {/* Track */}
      <ellipse cx={cx} cy={cy} rx={RX-20} ry={RY-15} fill="url(#trackG)" stroke="rgba(139,92,246,0.3)" strokeWidth="1"/>
      {/* Field */}
      <ellipse cx={cx} cy={cy} rx={RX-80} ry={RY-65} fill="url(#fieldG)" stroke="#15803d" strokeWidth="2"/>
      {/* Field lines */}
      <line x1={cx} y1={cy-RY+80} x2={cx} y2={cy+RY-80} stroke="#15803d" strokeWidth="1.5" opacity="0.5"/>
      <ellipse cx={cx} cy={cy} rx={55} ry={38} fill="none" stroke="#15803d" strokeWidth="1.5" opacity="0.5"/>
      <circle cx={cx} cy={cy} r={5} fill="#15803d" opacity="0.6"/>
      {/* Goal areas */}
      <rect x={cx-30} y={cy-RY+80} width={60} height={22} fill="none" stroke="#15803d" strokeWidth="1" opacity="0.4"/>
      <rect x={cx-30} y={cy+RY-102} width={60} height={22} fill="none" stroke="#15803d" strokeWidth="1" opacity="0.4"/>
      <text x={cx} y={cy+6} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.2)" fontWeight="700">ПОЛЕ</text>

      {/* Section labels */}
      {Object.entries(sectionAngles).map(([sec, deg]) => {
        const rad = deg * Math.PI / 180;
        const lx = cx + (RX+38) * Math.cos(rad);
        const ly = cy + (RY+28) * Math.sin(rad);
        return <text key={sec} x={lx} y={ly+4} textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.45)" fontWeight="800">{sec}</text>;
      })}

      {/* Seats */}
      {Object.entries(sectionAngles).map(([sec, deg]) => {
        const sectionSeats = sections[sec] || [];
        const rad = deg * Math.PI / 180;
        const rowGroups = {};
        sectionSeats.forEach(s => {
          const rn = parseInt((s.row || '1').replace(/\D/g,'')) || 1;
          if (!rowGroups[rn]) rowGroups[rn] = [];
          rowGroups[rn].push(s);
        });
        return Object.entries(rowGroups).map(([rn, rowSeats]) => {
          const r = parseInt(rn);
          const dist = RX - 15 + r * 13;
          const distY = RY - 10 + r * 9;
          return rowSeats.map((seat, si) => {
            const spread = (si - rowSeats.length/2) * 0.045;
            const a = rad + spread;
            const sx = cx + dist * Math.cos(a);
            const sy = cy + distY * Math.sin(a);
            const sel = selectedSeats.includes(seat.id);
            const col = getColor(seat, sel);
            const ok = seat.status === 'AVAILABLE';
            return (
              <circle key={seat.id} cx={sx} cy={sy} r={5.5}
                fill={col.fill} stroke={col.stroke} strokeWidth={sel ? 2 : 0.5}
                opacity={seat.status === 'SOLD' ? 0.2 : 0.9}
                style={{ cursor: ok ? 'pointer' : 'not-allowed', transition: 'all 0.1s' }}
                onClick={() => ok && onSeatClick(seat)}
                onMouseEnter={e => { const r2 = containerRef.current?.getBoundingClientRect(); setTooltip({ seat, x: e.clientX-(r2?.left||0), y: e.clientY-(r2?.top||0) }); }}
                onMouseLeave={() => setTooltip(null)} />
            );
          });
        });
      })}
    </svg>
  );
}

// ─── Main SeatMap ─────────────────────────────────────────────────────────────
export default function SeatMap({ seats, selectedSeats = [], onSeatClick, venueType = 'concert' }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const onWheel = useCallback(e => {
    e.preventDefault();
    setZoom(z => Math.max(0.35, Math.min(3, z + (e.deltaY > 0 ? -0.1 : 0.1))));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener('wheel', onWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', onWheel); };
  }, [onWheel]);

  const onDown = e => {
    if (['circle','rect'].includes(e.target.tagName)) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const onMove = e => { if (dragging && dragStart) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const onUp   = () => { setDragging(false); setDragStart(null); };
  const reset  = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const isStadium = ['stadium','football','arena'].includes(venueType);
  const isTheatre = venueType === 'theatre';
  const isCinema  = venueType === 'cinema';

  const Layout = isStadium ? StadiumLayout : isTheatre ? TheatreLayout : CinemaLayout;
  const mapH = isStadium ? 580 : 500;

  return (
    <div className="relative select-none">
      {/* Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        {[
          { icon: ZoomIn,    fn: () => setZoom(z => Math.min(3, z+0.2)) },
          { icon: ZoomOut,   fn: () => setZoom(z => Math.max(0.35, z-0.2)) },
          { icon: Maximize2, fn: reset },
          { icon: RotateCcw, fn: reset },
        ].map(({ icon: Icon, fn }, i) => (
          <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={fn}
            className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:border-brand-400/50 transition-all">
            <Icon className="w-3.5 h-3.5 text-white/60" />
          </motion.button>
        ))}
      </div>

      {/* Zoom badge */}
      <div className="absolute top-3 left-3 z-20 glass rounded-lg px-2 py-1 text-xs text-white/35">
        {Math.round(zoom * 100)}%
      </div>

      {/* Canvas */}
      <div ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-white/5"
        style={{ height: mapH, background: 'radial-gradient(ellipse at center, #0f0f1a 0%, #080810 100%)', cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
        <div style={{
          transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: dragging ? 'none' : 'transform 0.1s',
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Layout seats={seats} selectedSeats={selectedSeats} onSeatClick={onSeatClick}
            containerRef={containerRef} setTooltip={setTooltip} />
        </div>
        <AnimatePresence>
          {tooltip && <Tooltip seat={tooltip.seat} x={tooltip.x} y={tooltip.y} />}
        </AnimatePresence>
      </div>

      <Legend />
    </div>
  );
}
