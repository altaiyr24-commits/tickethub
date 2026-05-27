import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Flame, Star, Users } from 'lucide-react';
import { formatDate, formatPrice, cn } from '@/lib/utils';

export default function EventCard({ event, index = 0 }) {
  const soldPct = event.totalSeats > 0 ? Math.round((event.soldSeats / event.totalSeats) * 100) : 0;
  const almostSoldOut = soldPct >= 90;
  const isCinema = (event.venueType || event.venue_type) === 'cinema';

  // Random cinema rating for demo
  const rating = isCinema ? (7.5 + (parseInt(event.id || '1') % 25) / 10).toFixed(1) : null;
  const formats = isCinema ? ['IMAX', '3D', '2D'].slice(0, 1 + (parseInt(event.id || '1') % 3)) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="group h-full"
    >
      <Link to={`/events/${event.slug}`} className="block h-full">
        <div className="glass-card overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:border-brand-500/40 group-hover:shadow-neon-purple">

          {/* Image */}
          <div className="relative h-52 overflow-hidden flex-shrink-0">
            <img
              src={event.poster || 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=600'}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/20 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {event.isHot && (
                <span className="badge bg-red-500/90 text-white text-xs backdrop-blur-sm">
                  <Flame className="w-3 h-3" /> Хит
                </span>
              )}
              {event.isFeatured && (
                <span className="badge bg-brand-500/90 text-white text-xs backdrop-blur-sm">
                  <Star className="w-3 h-3" /> Топ
                </span>
              )}
            </div>

            {/* Category */}
            <div className="absolute top-3 right-3">
              <span className="badge glass text-white/80 backdrop-blur-sm text-xs border border-white/10">
                {event.category?.icon} {event.category?.name}
              </span>
            </div>

            {/* Almost sold out */}
            {almostSoldOut && (
              <div className="absolute bottom-3 left-3 right-3">
                <span className="badge bg-red-500/90 text-white text-xs w-full justify-center backdrop-blur-sm">
                  🔥 Почти нет мест — осталось {event.totalSeats - event.soldSeats}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-display font-bold text-sm leading-snug mb-2.5 group-hover:text-brand-400 transition-colors line-clamp-2 flex-shrink-0">
              {event.title}
            </h3>

            <div className="space-y-1.5 mb-3 flex-1">
              <div className="flex items-center gap-2 text-white/45 text-xs">
                <Calendar className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <span>{formatDate(event.startDate, 'd MMM yyyy, HH:mm')}</span>
              </div>
              <div className="flex items-center gap-2 text-white/45 text-xs">
                <MapPin className="w-3.5 h-3.5 text-neon-pink flex-shrink-0" />
                <span className="truncate">{event.venue?.name}, {event.venue?.city}</span>
              </div>
              {event.totalSeats > 0 && (
                <div className="flex items-center gap-2 text-white/45 text-xs">
                  <Users className="w-3.5 h-3.5 text-neon-cyan flex-shrink-0" />
                  <span>{event.totalSeats - event.soldSeats} мест осталось</span>
                </div>
              )}
            </div>

            {/* Availability bar */}
            {event.totalSeats > 0 && !isCinema && (
              <div className="mb-3">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full', soldPct > 80 ? 'bg-gradient-to-r from-red-500 to-orange-400' : soldPct > 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' : 'bg-gradient-to-r from-emerald-500 to-green-400')}
                    initial={{ width: 0 }}
                    animate={{ width: `${soldPct}%` }}
                    transition={{ duration: 1, delay: index * 0.06 + 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Cinema formats */}
            {isCinema && formats.length > 0 && (
              <div className="flex gap-1.5 mb-3">
                {formats.map(f => (
                  <span key={f} className={`badge text-xs px-2 py-0.5 ${
                    f === 'IMAX' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : f === '3D' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-white/10 text-white/50'
                  }`}>{f}</span>
                ))}
              </div>
            )}

            {/* Price & CTA */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
              <div>
                {isCinema && rating && (
                  <p className="text-xs text-yellow-400 font-bold mb-0.5">⭐ {rating} IMDb</p>
                )}
                <p className="text-xs text-white/30">от</p>
                <p className="font-display font-black text-lg text-brand-400">{formatPrice(event.minPrice)}</p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className={`text-xs py-2 px-4 rounded-xl ${isCinema ? 'bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-sm' : 'btn-primary'}`}>
                {isCinema ? '🎬 Билеты' : 'Купить'}
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
