import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Ticket, AlertCircle, ArrowRight, MapPin, Calendar, Info, Plus, Minus, CreditCard, Zap } from 'lucide-react';
import { useEvent } from '@/hooks/useEvents';
import { useSeats } from '@/hooks/useSeats';
import { useCartStore } from '@/store/cartStore';
import SeatMap from '@/components/seats/SeatMap';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const MAP_TYPES = ['stadium', 'football', 'theatre', 'cinema', 'arena'];

function SimpleTicketPurchase({ event, onCheckout }) {
  const { t } = useTranslation();
  const ticketTypes = event.ticketTypes || event.ticket_types || [];
  const [quantities, setQuantities] = useState({});

  const defaultTypes = ticketTypes.length > 0 ? ticketTypes : [
    { id: 'std', name: t('seats.standard'), price: event.minPrice, color: '#10B981', maxCount: 100, soldCount: 0 },
    ...(event.maxPrice > event.minPrice ? [
      { id: 'vip', name: t('seats.vip'), price: event.maxPrice, color: '#8B5CF6', maxCount: 20, soldCount: 0 },
    ] : []),
  ];

  const setQty = (id, delta) => setQuantities(q => {
    const cur = q[id] || 0;
    return { ...q, [id]: Math.max(0, Math.min(10, cur + delta)) };
  });

  const totalItems = Object.values(quantities).reduce((s, v) => s + v, 0);
  const totalPrice = defaultTypes.reduce((s, tp) => s + (quantities[tp.id] || 0) * tp.price, 0);

  const handleBuy = () => {
    if (totalItems === 0) { toast.error(t('seats.selectAtLeastOne')); return; }
    const items = [];
    defaultTypes.forEach(tp => {
      const qty = quantities[tp.id] || 0;
      for (let i = 0; i < qty; i++) {
        items.push({ seat: { id: `${tp.id}-${i}`, row: tp.name, number: i + 1, seatType: tp.name, price: tp.price }, event });
      }
    });
    onCheckout(items, totalPrice);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-6">
        <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-brand-400" /> {t('seats.selectTickets')}
        </h2>
        <div className="space-y-3">
          {defaultTypes.map(tp => {
            const qty = quantities[tp.id] || 0;
            const available = (tp.maxCount || 100) - (tp.soldCount || 0);
            return (
              <motion.div key={tp.id} whileHover={{ scale: 1.01 }}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${qty > 0 ? 'border-brand-400/50 bg-brand-500/5' : 'border-white/10 glass'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: tp.color }} />
                  <div>
                    <p className="font-semibold">{tp.name}</p>
                    <p className="text-xs text-white/30 mt-0.5">{t('seats.available', { count: available })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-brand-400 text-lg">{formatPrice(tp.price)}</p>
                  <div className="flex items-center gap-2 glass rounded-xl p-1">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQty(tp.id, -1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30"
                      disabled={qty === 0}><Minus className="w-3.5 h-3.5" /></motion.button>
                    <span className="w-6 text-center font-bold text-sm">{qty}</span>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQty(tp.id, 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30"
                      disabled={qty >= Math.min(10, available)}><Plus className="w-3.5 h-3.5" /></motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60">{t('orders.tickets', { count: totalItems })}</span>
              <span className="font-display font-black text-2xl text-brand-400">{formatPrice(totalPrice)}</span>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBuy}
              className="btn-primary w-full py-4 text-base rounded-xl flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" /> {t('seats.toCheckout')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card p-4 space-y-2">
        {[
          { icon: Zap,        key: 'seats.instantDelivery' },
          { icon: CreditCard, key: 'seats.safePayment' },
          { icon: Ticket,     key: 'seats.qrCode' },
        ].map(({ icon: Icon, key }) => (
          <div key={key} className="flex items-center gap-2 text-xs text-white/40">
            <Icon className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
            {t(key)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SeatsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { event, loading: eventLoading } = useEvent(slug);
  const venueType = event?.venueType || event?.venue_type || 'concert';
  const hasMap = MAP_TYPES.includes(venueType);

  const { seats, loading: seatsLoading } = useSeats(hasMap ? event?.id : null);
  const { items, addSeat, removeSeat, clearCart, setExpiry, getTotalPrice } = useCartStore();
  const [reserving, setReserving] = useState(false);

  const selectedSeatIds = items.map(i => i.seat.id);

  const handleSeatClick = (seat) => {
    if (selectedSeatIds.includes(seat.id)) { removeSeat(seat.id); return; }
    if (selectedSeatIds.length >= 10) { toast.error(t('seats.maxSeatsError')); return; }
    addSeat(seat, event);
    toast.success(t('seats.seatAdded', { row: seat.row, number: seat.number }), { duration: 1200 });
  };

  const handleMapCheckout = () => {
    if (!selectedSeatIds.length) { toast.error(t('seats.selectAtLeastOneSeat')); return; }
    setExpiry(new Date(Date.now() + 10 * 60 * 1000).toISOString());
    navigate('/checkout');
  };

  const handleSimpleCheckout = (cartItems) => {
    clearCart();
    cartItems.forEach(({ seat, event: ev }) => addSeat(seat, ev));
    setExpiry(new Date(Date.now() + 10 * 60 * 1000).toISOString());
    navigate('/checkout');
  };

  if (eventLoading || (hasMap && seatsLoading)) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
        <p className="text-white/40 text-lg">{t('common.loading')}</p>
      </div>
    </div>
  );

  if (!event) return null;

  const venueLabelMap = {
    stadium: '🏟️', football: '🏟️', arena: '🏟️', theatre: '🎭',
    cinema: '🎬', concert: '🎵', standup: '🎤', exhibition: '🖼️',
  };
  const venueLabel = `${venueLabelMap[venueType] || '🎪'} ${t(`nav.categories_list.${venueType}`) || venueType}`;

  return (
    <>
      <Helmet><title>{t('seats.title', { event: event.title })}</title></Helmet>
      <div className="min-h-screen pt-20 pb-32" style={{ background: 'radial-gradient(ellipse at top, #0f0f1a 0%, #080810 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="py-6 border-b border-white/5 mb-6">
            <div className="flex items-center gap-2 text-sm text-white/35 mb-2">
              <button onClick={() => navigate(`/events/${slug}`)} className="hover:text-brand-400 transition-colors">
                {event.title}
              </button>
              <span>/</span>
              <span className="text-white/55">{t('seats.tickets')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{event.title}</h1>
              <span className="badge glass text-white/55 border border-white/10 text-xs px-3 py-1.5">{venueLabel}</span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-400" />
                {formatDate(event.startDate, 'd MMMM yyyy, HH:mm')}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-neon-pink" />
                {event.venue?.name}, {event.venue?.city}
              </span>
            </div>
          </motion.div>

          {hasMap ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-lg">{t('seats.schemeTitle')}</h2>
                    <div className="flex items-center gap-2 text-xs text-white/30 glass px-3 py-1.5 rounded-full border border-white/10">
                      <Info className="w-3.5 h-3.5" />
                      {t('seats.schemeHint')}
                    </div>
                  </div>
                  {seats.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-5xl mb-4">🎭</p>
                      <p className="text-white/40">{t('seats.noScheme')}</p>
                    </div>
                  ) : (
                    <SeatMap seats={seats} selectedSeats={selectedSeatIds} onSeatClick={handleSeatClick} venueType={venueType} />
                  )}
                </motion.div>
              </div>

              <div className="xl:col-span-1">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }} className="sticky top-24 space-y-4">
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <ShoppingCart className="w-5 h-5 text-brand-400" />
                      <h3 className="font-bold">{t('seats.selectedSeats')}</h3>
                      {items.length > 0 && (
                        <span className="ml-auto badge bg-brand-500 text-white text-xs px-2 py-0.5">{items.length}</span>
                      )}
                    </div>

                    <AnimatePresence>
                      {items.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                          <Ticket className="w-10 h-10 text-white/15 mx-auto mb-3" />
                          <p className="text-white/30 text-sm">{t('seats.clickSeat')}</p>
                          <p className="text-white/20 text-xs mt-1">{t('seats.maxSeats')}</p>
                        </motion.div>
                      ) : (
                        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto scrollbar-hide">
                          {items.map(({ seat }) => (
                            <motion.div key={seat.id}
                              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10, height: 0 }}
                              className="flex items-center justify-between p-3 glass rounded-xl border border-white/5">
                              <div>
                                <p className="text-sm font-semibold">{t('common.row', { row: seat.row })} №{seat.number}</p>
                                <p className="text-xs mt-0.5" style={{
                                  color: (seat.seatType||seat.seat_type) === 'VIP' ? '#A78BFA'
                                    : (seat.seatType||seat.seat_type) === 'PREMIUM' ? '#F472B6' : '#34D399'
                                }}>{seat.seatType || seat.seat_type}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-brand-400 font-bold text-sm">{formatPrice(seat.price)}</span>
                                <button onClick={() => removeSeat(seat.id)}
                                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>

                    {items.length > 0 && (
                      <>
                        <div className="border-t border-white/10 pt-4 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white/50 text-sm">{t('orders.tickets', { count: items.length })}</span>
                            <span className="font-display font-black text-xl text-brand-400">{formatPrice(getTotalPrice())}</span>
                          </div>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={handleMapCheckout} disabled={reserving}
                          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-semibold">
                          {reserving
                            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <><span>{t('seats.toPayment')}</span><ArrowRight className="w-4 h-4" /></>}
                        </motion.button>
                        <button onClick={clearCart}
                          className="w-full text-center text-xs text-white/25 hover:text-white/50 mt-3 transition-colors py-1">
                          {t('seats.clearSelection')}
                        </button>
                      </>
                    )}
                  </div>

                  <div className="glass-card p-4">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-3">{t('seats.prices')}</p>
                    <div className="space-y-2">
                      {[
                        { label: t('seats.standard'), color: '#10B981', price: event.minPrice },
                        { label: 'Premium',           color: '#EC4899', price: Math.round((event.minPrice||0) * 2.5) },
                        { label: t('seats.vip'),      color: '#8B5CF6', price: event.maxPrice },
                      ].map(tp => (
                        <div key={tp.label} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: tp.color }} />
                            <span className="text-white/55">{tp.label}</span>
                          </div>
                          <span className="font-semibold" style={{ color: tp.color }}>{formatPrice(tp.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-xl p-3 border border-yellow-500/20 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/40 leading-relaxed">{t('seats.timeWarning')}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <SimpleTicketPurchase event={event} onCheckout={handleSimpleCheckout} />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
