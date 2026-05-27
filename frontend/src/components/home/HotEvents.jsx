import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, Clock, MapPin } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { formatDate, formatPrice } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

function HotCard({ event, index }) {
  const navigate = useNavigate();
  const soldPct = event.totalSeats > 0 ? Math.round((event.soldSeats / event.totalSeats) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.1 }}
      whileHover={{ x: 4 }} onClick={() => navigate(`/events/${event.slug}`)}
      className="group flex gap-4 p-4 glass-card cursor-pointer hover:border-red-500/30 transition-all duration-300">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img src={event.poster || 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=200'}
          alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-1 left-1">
          <span className="badge bg-red-500/90 text-white text-xs px-1.5 py-0.5">
            <Flame className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm leading-tight mb-1 group-hover:text-brand-400 transition-colors line-clamp-2">
          {event.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(event.startDate, 'd MMM')}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue?.city}</span>
        </div>

        {/* Sold progress */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
              initial={{ width: 0 }} whileInView={{ width: `${soldPct}%` }}
              viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.1 }} />
          </div>
          <span className="text-xs text-red-400 font-semibold whitespace-nowrap">{soldPct}%</span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="font-bold text-brand-400 text-sm">{formatPrice(event.minPrice)}</p>
        <p className="text-xs text-white/30 mt-0.5">от</p>
      </div>
    </motion.div>
  );
}

export default function HotEvents() {
  const { events, loading } = useEvents({ hot: 'true', limit: 6 });

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} className="flex items-end justify-between mb-12">
        <div>
          <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4" /> Горячие билеты
          </p>
          <h2 className="section-title">
            Раскупают <span className="text-gradient">прямо сейчас</span>
          </h2>
        </div>
        <Link to="/events?hot=true"
          className="hidden sm:flex items-center gap-2 text-sm text-white/50 hover:text-red-400 transition-colors group">
          Смотреть все <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event, i) => <HotCard key={event.id} event={event} index={i} />)}
        </div>
      )}
    </section>
  );
}
