import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Calendar, MapPin, Flame, Star } from 'lucide-react';
import { useFeaturedEvents } from '@/hooks/useEvents';
import { formatDate, formatPrice } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const GRADIENTS = [
  'from-violet-900/70 via-purple-900/40',
  'from-pink-900/70 via-rose-900/40',
  'from-cyan-900/70 via-blue-900/40',
];

const CATEGORY_SLUGS = [
  { slug: 'concerts',   icon: '🎵', key: 'nav.categories_list.concerts' },
  { slug: 'theatre',    icon: '🎭', key: 'nav.categories_list.theatre' },
  { slug: 'sport',      icon: '⚽', key: 'nav.categories_list.sport' },
  { slug: 'standup',    icon: '🎤', key: 'nav.categories_list.standup' },
  { slug: 'exhibition', icon: '🖼️', key: 'nav.categories_list.exhibition' },
];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState(0);
  const { events } = useFeaturedEvents();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!events.length) return;
    const id = setInterval(() => setCurrent(c => (c + 1) % Math.min(events.length, 3)), 5000);
    return () => clearInterval(id);
  }, [events.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/events${query ? `?search=${encodeURIComponent(query)}` : ''}`);
  };

  const currentEvent = events[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        {currentEvent && (
          <motion.div key={current} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute inset-0">
            <img src={currentEvent.banner || currentEvent.poster} alt="" className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${GRADIENTS[current % 3]} to-dark-900`} />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: Math.random() * 4 + 1, height: Math.random() * 4 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: i % 3 === 0 ? '#8B5CF6' : i % 3 === 1 ? '#EC4899' : '#06B6D4', opacity: 0.4 }}
            animate={{ y: [-30, 30], opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-300 mb-6 border border-brand-500/30">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{t('home.hero.badge')}</span>
            </motion.div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
              <span className="text-white">{t('home.hero.title')}</span>{' '}
              <span className="text-gradient">{t('home.hero.titleHighlight')}</span>
            </h1>

            <p className="text-white/55 text-lg mb-8 max-w-lg leading-relaxed">
              {t('home.hero.subtitle')}
            </p>

            <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder={t('events.searchPlaceholder')}
                  className="input-field pl-12 h-14 text-base rounded-2xl" />
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="btn-primary h-14 px-6 rounded-2xl flex items-center gap-2 text-base font-semibold">
                {t('home.hero.browsePoster')} <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>

            <div className="flex flex-wrap gap-2">
              {CATEGORY_SLUGS.map(item => (
                <motion.button key={item.slug} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/events?category=${item.slug}`)}
                  className="glass px-4 py-2 rounded-full text-sm text-white/65 hover:text-white hover:border-brand-400/50 transition-all">
                  {item.icon} {t(item.key)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block">
            <AnimatePresence mode="wait">
              {currentEvent && (
                <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
                  className="glass-card p-1 rounded-3xl overflow-hidden neon-border cursor-pointer"
                  onClick={() => navigate(`/events/${currentEvent.slug}`)}>
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <img src={currentEvent.poster} alt={currentEvent.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {currentEvent.isHot && <span className="badge bg-red-500/90 text-white text-xs"><Flame className="w-3 h-3" /> {t('nav.hot')}</span>}
                      {currentEvent.isFeatured && <span className="badge bg-brand-500/90 text-white text-xs"><Star className="w-3 h-3" /> {t('nav.top')}</span>}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="font-display font-bold text-lg leading-tight mb-1">{currentEvent.title}</p>
                      <div className="flex items-center gap-3 text-xs text-white/60">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(currentEvent.startDate)}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{currentEvent.venue?.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40">{t('events.from')}</p>
                      <p className="font-display font-black text-xl text-brand-400">{formatPrice(currentEvent.minPrice)}</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} className="btn-primary py-2.5 px-5 text-sm rounded-xl">
                      {t('eventDetail.buyTicket')}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-4">
              {events.slice(0, 3).map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-brand-400' : 'w-2 bg-white/20'}`} />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-lg mt-12">
          {[
            { value: '500K+', key: 'home.hero.stats.tickets' },
            { value: '1200+', key: 'home.hero.stats.events' },
            { value: '4.9★', key: 'home.hero.stats.rating' },
          ].map(s => (
            <div key={s.key} className="text-center">
              <p className="font-display font-black text-2xl text-gradient">{s.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{t(s.key)}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  );
}
