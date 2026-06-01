import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Heart, Share2, Tag, Users, ChevronRight, Flame, Star, Ticket, Film, Monitor } from 'lucide-react';
import { useEvent } from '@/hooks/useEvents';
import { useAuthStore } from '@/store/authStore';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { formatDateTime, formatPrice, formatDate } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function EventDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { event, loading, error } = useEvent(slug);
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  const [isFav, setIsFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    if (event?.isFavorited !== undefined) setIsFav(event.isFavorited);
  }, [event?.isFavorited]);

  const handleFavorite = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!event?.id) return toast.error(t('eventDetail.notFound'));
    try {
      const { data } = await api.post(`/events/${event.id}/favorite`);
      setIsFav(data.isFavorited);
      toast.success(data.isFavorited ? t('eventDetail.addedFav') : t('eventDetail.removedFav'));
    } catch (err) {
      toast.error(err.response?.data?.error || t('common.error'));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t('eventDetail.shareLink'));
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40">{t('eventDetail.loading')}</p>
      </div>
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen pt-24 flex items-center justify-center text-center px-4">
      <div>
        <p className="text-7xl mb-5">😕</p>
        <h2 className="text-2xl font-bold mb-3">{t('eventDetail.notFound')}</h2>
        <p className="text-white/40 mb-6">{t('eventDetail.notFoundSub')}</p>
        <button onClick={() => navigate('/events')} className="btn-primary px-8">{t('eventDetail.backToPoster')}</button>
      </div>
    </div>
  );

  const images = [event.banner || event.poster, ...(event.gallery || [])].filter(Boolean);
  const soldPct = event.totalSeats > 0 ? Math.round((event.soldSeats / event.totalSeats) * 100) : 0;
  const isCinema = (event.venueType || event.venue_type) === 'cinema';

  const SESSIONS = isCinema ? [
    { time: '10:00', format: 'IMAX', price: event.maxPrice,  available: true  },
    { time: '13:30', format: '2D',   price: event.minPrice,  available: true  },
    { time: '16:00', format: '3D',   price: Math.round(((event.minPrice||0) + (event.maxPrice||0)) / 2), available: true },
    { time: '19:30', format: 'IMAX', price: event.maxPrice,  available: false },
    { time: '22:00', format: '2D',   price: event.minPrice,  available: true  },
  ] : [];

  return (
    <>
      <Helmet>
        <title>{event.title} — TicketHub</title>
        <meta name="description" content={event.shortDesc || event.description?.slice(0, 160)} />
      </Helmet>

      {/* Hero banner */}
      <div className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <motion.img key={activeImg} initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          src={images[activeImg] || 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=1400'}
          alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/70 to-transparent" />

        {/* Badges */}
        <div className="absolute top-24 left-6 flex gap-2">
          <span className="badge glass text-white backdrop-blur-sm border border-white/20 px-4 py-2">
            {event.category?.icon} {event.category?.name}
          </span>
          {event.isHot && <span className="badge bg-red-500/90 text-white backdrop-blur-sm px-3 py-2"><Flame className="w-3.5 h-3.5" /> {t('nav.hot')}</span>}
          {event.isFeatured && <span className="badge bg-brand-500/90 text-white backdrop-blur-sm px-3 py-2"><Star className="w-3.5 h-3.5" /> {t('nav.top')}</span>}
        </div>

        {/* Gallery thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-6 flex gap-2">
            {images.map((img, i) => (
              <motion.button key={i} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveImg(i)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-brand-400 shadow-neon-purple' : 'border-white/20'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-24 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Title + actions */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="font-display text-3xl sm:text-4xl font-black leading-tight">{event.title}</h1>
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleFavorite}
                    className={`btn-secondary p-3 rounded-xl ${isFav ? 'text-red-400 border-red-400/40 bg-red-400/10' : ''}`}>
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleShare} className="btn-secondary p-3 rounded-xl">
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Meta cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Calendar, label: t('eventDetail.dateTime'), value: formatDateTime(event.startDate), color: 'text-brand-400', bg: 'bg-brand-500/10' },
                  { icon: MapPin,   label: t('eventDetail.venue'),    value: `${event.venue?.name}, ${event.venue?.city}`, color: 'text-neon-pink', bg: 'bg-pink-500/10' },
                  { icon: Clock,    label: t('eventDetail.duration'), value: event.duration ? t('eventDetail.durationValue', { min: event.duration }) : t('eventDetail.durationUnknown'), color: 'text-neon-cyan', bg: 'bg-cyan-500/10' },
                ].map(item => (
                  <div key={item.label} className="glass-card p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-white/30 mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Countdown */}
              <div className="glass-card p-6 mb-6">
                <p className="text-xs text-white/30 uppercase tracking-widest mb-4">{t('eventDetail.countdown')}</p>
                <CountdownTimer targetDate={event.startDate} />
              </div>

              {/* Cinema sessions block */}
              {isCinema && (
                <div className="glass-card p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Film className="w-5 h-5 text-red-400" /> {t('eventDetail.sessions')}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SESSIONS.map((s, i) => (
                      <motion.button key={i} whileHover={{ scale: s.available ? 1.04 : 1 }} whileTap={{ scale: s.available ? 0.97 : 1 }}
                        onClick={() => s.available && setSelectedSession(i)}
                        disabled={!s.available}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          !s.available
                            ? 'border-white/5 opacity-35 cursor-not-allowed bg-white/3'
                            : selectedSession === i
                              ? 'border-brand-400 bg-brand-500/15 shadow-neon-purple'
                              : 'border-white/10 glass hover:border-brand-400/40'
                        }`}>
                        <p className="font-display font-black text-xl mb-1">{s.time}</p>
                        <span className={`badge text-xs px-2 py-0.5 mb-2 inline-block ${
                          s.format === 'IMAX' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : s.format === '3D'  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-white/10 text-white/50'
                        }`}>{s.format}</span>
                        <p className="text-xs font-semibold text-brand-400">{formatPrice(s.price)}</p>
                        {!s.available && <p className="text-xs text-red-400 mt-1">{t('eventDetail.noSeats')}</p>}
                      </motion.button>
                    ))}
                  </div>
                  {selectedSession !== null && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 glass rounded-xl border border-brand-400/30 flex items-center justify-between">
                      <p className="text-sm text-white/60">
                        {t('eventDetail.selectedSession')} <span className="text-white font-bold">{SESSIONS[selectedSession].time}</span>
                        {' '}·{' '}<span className="text-brand-400">{SESSIONS[selectedSession].format}</span>
                      </p>
                      <button onClick={() => setSelectedSession(null)} className="text-white/30 hover:text-white/60 text-xs">✕</button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Cinema formats info */}
              {isCinema && (
                <div className="glass-card p-5 mb-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-brand-400" /> {t('eventDetail.formats')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { fmt: 'IMAX', icon: '🎬', desc: 'Экран 26м, Dolby Atmos', color: '#06B6D4', price: event.maxPrice },
                      { fmt: '3D',   icon: '👓', desc: '3D очки в комплекте',    color: '#8B5CF6', price: Math.round((event.minPrice + event.maxPrice) / 2) },
                      { fmt: '2D',   icon: '📽️', desc: 'Стандартный формат',     color: '#10B981', price: event.minPrice },
                    ].map(f => (
                      <div key={f.fmt} className="p-3 glass rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{f.icon}</span>
                          <span className="font-bold text-sm" style={{ color: f.color }}>{f.fmt}</span>
                        </div>
                        <p className="text-xs text-white/40 mb-1">{f.desc}</p>
                        <p className="text-sm font-bold text-brand-400">{formatPrice(f.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="glass-card p-6 mb-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-brand-400" /> {t('eventDetail.about')}
                </h2>
                <p className="text-white/60 leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>

              {/* Tags */}
              {event.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="badge glass text-white/40 text-xs border border-white/10 px-3 py-1.5">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }} className="sticky top-24 space-y-4">

              {/* Buy ticket card */}
              <div className="glass-card p-6 neon-border">
                <h3 className="font-display font-bold text-xl mb-5">
                  {isCinema ? t('eventDetail.chooseSession') : t('eventDetail.buyTicket')}
                </h3>

                {/* Cinema: show selected session */}
                {isCinema && selectedSession !== null && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10">
                    <p className="text-xs text-cyan-400 uppercase tracking-wider mb-1">Выбранный сеанс</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">{SESSIONS[selectedSession].time}</p>
                        <span className="badge text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          {SESSIONS[selectedSession].format}
                        </span>
                      </div>
                      <p className="font-display font-black text-xl text-brand-400">
                        {formatPrice(SESSIONS[selectedSession].price)}
                      </p>
                    </div>
                  </motion.div>
                )}

                {isCinema && selectedSession === null && (
                  <div className="mb-4 p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                    <p className="text-xs text-yellow-400 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5" /> {t('eventDetail.selectSession')}
                    </p>
                  </div>
                )}

                {/* Ticket types for non-cinema */}
                {!isCinema && (
                  <div className="space-y-2.5 mb-5">
                    {event.ticketTypes?.length > 0 ? (
                      event.ticketTypes.map(tt => (
                        <div key={tt.id} className="flex items-center justify-between p-3 glass rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: tt.color || '#8B5CF6' }} />
                            <div>
                              <p className="text-sm font-semibold">{tt.name}</p>
                              <p className="text-xs text-white/35">{tt.maxCount - tt.soldCount} мест</p>
                            </div>
                          </div>
                          <p className="font-bold text-brand-400">{formatPrice(tt.price)}</p>
                        </div>
                      ))
                    ) : (
                      <>
                        {[
                          { label: 'Стандарт', price: event.minPrice, color: '#10B981' },
                          ...(event.maxPrice > event.minPrice ? [{ label: 'VIP', price: event.maxPrice, color: '#8B5CF6' }] : []),
                        ].map(t => (
                          <div key={t.label} className="flex items-center justify-between p-3 glass rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                              <span className="text-sm font-semibold">{t.label}</span>
                            </div>
                            <span className="font-bold text-brand-400">{formatPrice(t.price)}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* Availability */}
                {event.totalSeats > 0 && (
                  <div className="mb-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/40 flex items-center gap-1.5"><Users className="w-4 h-4" /> {t('eventDetail.seatsLeft')}</span>
                      <span className="font-semibold">{event.totalSeats - event.soldSeats}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${soldPct}%` }} transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${soldPct > 80 ? 'bg-gradient-to-r from-red-500 to-orange-400' : 'bg-gradient-to-r from-brand-500 to-neon-pink'}`} />
                    </div>
                    {soldPct > 80 && <p className="text-xs text-red-400 mt-1.5">{t('eventDetail.almostSoldOut')}</p>}
                  </div>
                )}

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(isAuthenticated ? `/events/${slug}/seats` : '/login')}
                  disabled={isCinema && selectedSession === null}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                  {isCinema ? <><Film className="w-5 h-5" /> {t('eventDetail.selectSeats')}</> : <>{t('eventDetail.selectSeats')} <ChevronRight className="w-5 h-5" /></>}
                </motion.button>

                <p className="text-xs text-white/25 text-center mt-3">{t('eventDetail.safePayment')}</p>
              </div>

              {/* Venue info */}
              <div className="glass-card p-5">
                <h4 className="font-semibold text-sm mb-3 text-white/60 uppercase tracking-wider">{t('eventDetail.venueInfo')}</h4>
                <p className="font-bold mb-1">{event.venue?.name}</p>
                <p className="text-sm text-white/40 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-neon-pink" />
                  {event.venue?.city}, {t('common.kazakhstan')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
