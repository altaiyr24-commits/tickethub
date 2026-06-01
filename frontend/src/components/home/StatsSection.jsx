import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Users, Ticket, Calendar, Star, TrendingUp, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function CountUp({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  return (
    <motion.span onViewportEnter={() => {
      if (ref.current) return;
      ref.current = true;
      const num = parseInt(to.replace(/\D/g, ''));
      let start = 0;
      const step = num / 60;
      const id = setInterval(() => {
        start += step;
        if (start >= num) { setVal(num); clearInterval(id); }
        else setVal(Math.floor(start));
      }, 16);
    }}>
      {val.toLocaleString()}{suffix}
    </motion.span>
  );
}

export default function StatsSection() {
  const { t } = useTranslation();

  const STATS = [
    { icon: Ticket,     value: '500000', suffix: '+', labelKey: 'home.stats.tickets',  color: '#8B5CF6', bg: 'from-violet-500/20 to-violet-500/5' },
    { icon: Calendar,   value: '1200',   suffix: '+', labelKey: 'home.stats.events',   color: '#EC4899', bg: 'from-pink-500/20 to-pink-500/5' },
    { icon: Users,      value: '150000', suffix: '+', labelKey: 'home.stats.users',    color: '#06B6D4', bg: 'from-cyan-500/20 to-cyan-500/5' },
    { icon: Star,       value: '4',      suffix: '.9★',labelKey: 'home.hero.stats.rating', color: '#F59E0B', bg: 'from-amber-500/20 to-amber-500/5' },
    { icon: TrendingUp, value: '98',     suffix: '%', labelKey: 'home.stats.tickets',  color: '#10B981', bg: 'from-emerald-500/20 to-emerald-500/5' },
    { icon: Shield,     value: '100',    suffix: '%', labelKey: 'home.stats.tickets',  color: '#EF4444', bg: 'from-red-500/20 to-red-500/5' },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/10 via-transparent to-neon-pink/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-12">
          <h2 className="section-title mb-3">
            {t('home.stats.title')}
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`glass-card p-5 text-center bg-gradient-to-b ${s.bg} relative overflow-hidden group`}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at center, ${s.color}10, transparent 70%)` }} />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: `${s.color}20` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <p className="text-2xl font-display font-black mb-1" style={{ color: s.color }}>
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <p className="text-white/40 text-xs leading-tight">{t(s.labelKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
