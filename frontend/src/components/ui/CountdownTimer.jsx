import { motion } from 'framer-motion';
import { useCountdown } from '@/hooks/useCountdown';

const TimeUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <motion.div
      key={value}
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      className="glass w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-display font-bold text-brand-400 shadow-neon-purple"
    >
      {String(value).padStart(2, '0')}
    </motion.div>
    <span className="text-xs text-white/40 mt-1 uppercase tracking-wider">{label}</span>
  </div>
);

export default function CountdownTimer({ targetDate }) {
  const time = useCountdown(targetDate);
  if (!time) return null;
  if (time.expired) return <p className="text-red-400 font-semibold">Событие началось</p>;

  return (
    <div className="flex items-end gap-3">
      <TimeUnit value={time.days} label="дней" />
      <span className="text-2xl font-bold text-white/30 mb-4">:</span>
      <TimeUnit value={time.hours} label="часов" />
      <span className="text-2xl font-bold text-white/30 mb-4">:</span>
      <TimeUnit value={time.minutes} label="минут" />
      <span className="text-2xl font-bold text-white/30 mb-4">:</span>
      <TimeUnit value={time.seconds} label="секунд" />
    </div>
  );
}
