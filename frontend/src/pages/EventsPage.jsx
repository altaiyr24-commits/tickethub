import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { formatDate, formatPrice } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronLeft, ChevronRight, Grid3X3, List, Flame, Star } from 'lucide-react';
import { useEvents, useCategories } from '@/hooks/useEvents';
import EventCard from '@/components/ui/EventCard';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState('grid');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    search:   searchParams.get('search')   || '',
    category: searchParams.get('category') || '',
    sort:     searchParams.get('sort')     || 'startDate',
    hot:      searchParams.get('hot')      || '',
    featured: searchParams.get('featured') || '',
    page:     parseInt(searchParams.get('page') || '1'),
  });

  const { events, pagination, loading } = useEvents({ ...filters, limit: 12 });
  const { categories } = useCategories();

  const SORT_OPTIONS = [
    { value: 'startDate', label: t('events.sort.date') },
    { value: 'popular',   label: t('events.sort.popular') },
    { value: 'price',     label: t('events.sort.price') },
  ];

  useEffect(() => {
    const p = {};
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== '1') p[k] = String(v); });
    if (filters.page > 1) p.page = String(filters.page);
    setSearchParams(p, { replace: true });
  }, [filters]);

  const set = (key, value) => setFilters(f => ({ ...f, [key]: value, page: 1 }));
  const activeFiltersCount = [filters.category, filters.hot, filters.featured, filters.search].filter(Boolean).length;
  const clearAll = () => setFilters({ search: '', category: '', sort: 'startDate', hot: '', featured: '', page: 1 });

  return (
    <>
      <Helmet><title>{t('events.title')} — TicketHub</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="section-title mb-2">{t('events.title')}</h1>
            <p className="text-white/40">
              {pagination ? t('events.total', { count: pagination.total }) : t('events.loading')}
              {activeFiltersCount > 0 && <span className="ml-2 text-brand-400">· {t('events.filters', { count: activeFiltersCount })}</span>}
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input type="text" value={filters.search} onChange={e => set('search', e.target.value)}
                placeholder={t('events.searchPlaceholder')}
                className="input-field pl-12 pr-10 rounded-2xl" />
              {filters.search && (
                <button onClick={() => set('search', '')} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
                </button>
              )}
            </div>
            <select value={filters.sort} onChange={e => set('sort', e.target.value)}
              className="input-field w-auto min-w-[180px] rounded-2xl">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="flex glass rounded-2xl p-1 gap-1">
              <button onClick={() => setView('grid')} className={cn('p-2 rounded-xl transition-all', view === 'grid' ? 'bg-brand-500 text-white' : 'text-white/40 hover:text-white')}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={cn('p-2 rounded-xl transition-all', view === 'list' ? 'bg-brand-500 text-white' : 'text-white/40 hover:text-white')}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
            <button onClick={clearAll}
              className={cn('badge px-4 py-2 whitespace-nowrap transition-all flex-shrink-0 rounded-full',
                !filters.category && !filters.hot && !filters.featured ? 'bg-brand-500 text-white shadow-neon-purple' : 'glass text-white/60 hover:text-white border border-white/10')}>
              {t('events.all')}
            </button>
            <button onClick={() => set('hot', filters.hot ? '' : 'true')}
              className={cn('badge px-4 py-2 whitespace-nowrap transition-all flex-shrink-0 rounded-full flex items-center gap-1.5',
                filters.hot ? 'bg-red-500 text-white' : 'glass text-white/60 hover:text-white border border-white/10')}>
              <Flame className="w-3.5 h-3.5" /> {t('nav.hot')}
            </button>
            <button onClick={() => set('featured', filters.featured ? '' : 'true')}
              className={cn('badge px-4 py-2 whitespace-nowrap transition-all flex-shrink-0 rounded-full flex items-center gap-1.5',
                filters.featured ? 'bg-brand-500 text-white' : 'glass text-white/60 hover:text-white border border-white/10')}>
              <Star className="w-3.5 h-3.5" /> {t('nav.top')}
            </button>
            {categories.map(cat => (
              <button key={cat.slug} onClick={() => set('category', filters.category === cat.slug ? '' : cat.slug)}
                className={cn('badge px-4 py-2 whitespace-nowrap transition-all flex-shrink-0 rounded-full',
                  filters.category === cat.slug ? 'text-white shadow-sm' : 'glass text-white/60 hover:text-white border border-white/10')}
                style={filters.category === cat.slug ? { background: cat.color || '#8B5CF6' } : {}}>
                {cat.icon} {cat.name}
              </button>
            ))}
            {activeFiltersCount > 0 && (
              <button onClick={clearAll}
                className="badge px-4 py-2 whitespace-nowrap flex-shrink-0 rounded-full glass text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> {t('events.resetFilters')}
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SkeletonGrid count={12} />
              </motion.div>
            ) : events.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
                <p className="text-7xl mb-5">🎭</p>
                <h3 className="text-2xl font-bold mb-3">{t('events.notFound')}</h3>
                <p className="text-white/40 mb-6">{t('events.notFoundSub')}</p>
                <button onClick={clearAll} className="btn-primary px-8">{t('events.resetFilters')}</button>
              </motion.div>
            ) : (
              <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className={cn(view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-4')}>
                  {events.map((event, i) => (
                    view === 'grid'
                      ? <EventCard key={event.id} event={event} index={i} />
                      : <EventListRow key={event.id} event={event} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button onClick={() => set('page', filters.page - 1)} disabled={filters.page <= 1} className="btn-secondary p-2.5 rounded-xl disabled:opacity-30">
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(p => Math.abs(p - filters.page) <= 2)
                .map(p => (
                  <button key={p} onClick={() => set('page', p)}
                    className={cn('w-10 h-10 rounded-xl text-sm font-semibold transition-all',
                      p === filters.page ? 'bg-brand-500 text-white shadow-neon-purple' : 'glass text-white/60 hover:text-white')}>
                    {p}
                  </button>
                ))}
              <button onClick={() => set('page', filters.page + 1)} disabled={filters.page >= pagination.pages} className="btn-secondary p-2.5 rounded-xl disabled:opacity-30">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function EventListRow({ event, index }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const soldPct = event.totalSeats > 0 ? Math.round((event.soldSeats / event.totalSeats) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }} whileHover={{ x: 4 }}
      onClick={() => navigate(`/events/${event.slug}`)}
      className="glass-card p-4 flex gap-4 cursor-pointer hover:border-brand-500/40 transition-all group">
      <img src={event.poster || 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=200'}
        alt={event.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-base group-hover:text-brand-400 transition-colors line-clamp-1">{event.title}</h3>
          <span className="badge glass text-xs flex-shrink-0">{event.category?.icon} {event.category?.name}</span>
        </div>
        <p className="text-white/40 text-sm mt-1 line-clamp-1">{event.shortDesc}</p>
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-white/40">
          <span>📅 {formatDate(event.startDate, 'd MMM yyyy, HH:mm')}</span>
          <span>📍 {event.venue?.name}, {event.venue?.city}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden max-w-[120px]">
            <div className="h-full bg-gradient-to-r from-brand-500 to-neon-pink rounded-full" style={{ width: `${soldPct}%` }} />
          </div>
          <span className="text-xs text-white/30">{t('events.soldPercent', { percent: soldPct })}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0 flex flex-col justify-between">
        <div>
          <p className="text-xs text-white/30">{t('events.from')}</p>
          <p className="font-display font-black text-lg text-brand-400">{formatPrice(event.minPrice)}</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} className="btn-primary text-xs py-2 px-4 rounded-xl">{t('events.buy')}</motion.div>
      </div>
    </motion.div>
  );
}
