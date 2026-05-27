import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, Ticket, Clock, ArrowLeft, RefreshCw, CheckCircle, Mail } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatDate } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// ─── Random card generator ────────────────────────────────────────────────────
const CARD_THEMES = [
  { bg: 'from-violet-900 via-purple-800 to-indigo-900', accent: '#A78BFA', bank: 'TicketBank', logo: '💜' },
  { bg: 'from-rose-900 via-pink-800 to-red-900',        accent: '#FB7185', bank: 'KaspiCard',  logo: '🔴' },
  { bg: 'from-cyan-900 via-blue-800 to-indigo-900',     accent: '#67E8F9', bank: 'Halyk',      logo: '💙' },
  { bg: 'from-emerald-900 via-green-800 to-teal-900',   accent: '#6EE7B7', bank: 'ForteBank',  logo: '💚' },
  { bg: 'from-amber-900 via-orange-800 to-yellow-900',  accent: '#FCD34D', bank: 'Jusan',      logo: '🟡' },
];

function randomCard() {
  const theme = CARD_THEMES[Math.floor(Math.random() * CARD_THEMES.length)];
  const num = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join(' ');
  const month = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
  const year = String(26 + Math.floor(Math.random() * 5));
  const names = ['AIBEK SEITKALI', 'DANA NUROVA', 'ARMAN BEKOV', 'LEILA AKHMETOVA', 'NURALI SEILOV'];
  return { ...theme, number: num, expiry: `${month}/${year}`, name: names[Math.floor(Math.random() * names.length)], cvv: String(Math.floor(100 + Math.random() * 900)) };
}

function CreditCardVisual({ card, flipped }) {
  return (
    <div className="relative w-full h-48 cursor-pointer" style={{ perspective: 1000 }}>
      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}>
        {/* Front */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.bg} p-6 shadow-2xl`}
          style={{ backfaceVisibility: 'hidden' }}>
          <div className="flex justify-between items-start mb-6">
            <span className="text-2xl">{card.logo}</span>
            <span className="text-white/60 text-sm font-bold tracking-wider">{card.bank}</span>
          </div>
          {/* Chip */}
          <div className="w-10 h-7 rounded-md mb-4" style={{ background: 'linear-gradient(135deg, #d4af37, #f5d060)', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)' }}>
            <div className="w-full h-full rounded-md grid grid-cols-2 gap-0.5 p-0.5 opacity-60">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-yellow-600/50 rounded-sm" />)}
            </div>
          </div>
          <p className="font-mono text-lg tracking-widest text-white mb-4">{card.number}</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Владелец</p>
              <p className="font-semibold text-sm tracking-wide">{card.name}</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Срок</p>
              <p className="font-semibold text-sm">{card.expiry}</p>
            </div>
            <div className="w-10 h-10 rounded-full opacity-80" style={{ background: `radial-gradient(circle, ${card.accent}60, transparent)`, border: `2px solid ${card.accent}40` }} />
          </div>
        </div>
        {/* Back */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.bg} shadow-2xl`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="h-12 bg-black/40 mt-8" />
          <div className="px-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-8 bg-white/10 rounded" />
              <div className="w-16 h-8 bg-white rounded flex items-center justify-center">
                <span className="font-mono text-black font-bold text-sm">{card.cvv}</span>
              </div>
            </div>
            <p className="text-white/30 text-xs mt-3 text-center">CVV</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, expiresAt, getTotalPrice, getSeatIds, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [payMethod, setPayMethod] = useState('card');
  const [card, setCard] = useState(() => randomCard());
  const [flipped, setFlipped] = useState(false);
  const [step, setStep] = useState('form'); // form | processing | done

  useEffect(() => { if (!items.length) navigate('/events'); }, [items.length]);

  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => {
      const diff = new Date(expiresAt) - new Date();
      if (diff <= 0) { clearCart(); toast.error('Время истекло'); navigate('/events'); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${String(s).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setStep('processing');
    setLoading(true);

    // Simulate payment processing animation
    await new Promise(r => setTimeout(r, 1800));

    try {
      const eventId = items[0].event?.id;
      const allSeatIds = getSeatIds();

      if (!eventId) {
        toast.error('Ошибка: событие не найдено');
        setStep('form');
        setLoading(false);
        return;
      }

      const { data } = await api.post('/orders', {
        eventId,
        seatIds: allSeatIds,
        paymentMethod: payMethod,
        totalAmount: getTotalPrice(), // pass total for virtual/mock events
      });

      clearCart();
      setStep('done');
      await new Promise(r => setTimeout(r, 800));
      navigate('/orders/success', { state: { order: data } });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Ошибка при создании заказа';
      console.error('Order error:', err.response?.data || err);
      toast.error(msg);
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) return null;
  const event = items[0].event;

  // Processing overlay
  if (step === 'processing') return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-20 h-20 border-4 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h2 className="font-display text-2xl font-bold mb-2">Обрабатываем оплату...</h2>
        <p className="text-white/40">Не закрывайте страницу</p>
      </motion.div>
    </div>
  );

  return (
    <>
      <Helmet><title>Оформление заказа — TicketHub</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
            <h1 className="section-title mb-8">Оформление <span className="text-gradient">заказа</span></h1>

            {timeLeft && (
              <div className="glass border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <p className="text-sm">Места забронированы. Осталось: <span className="font-bold text-yellow-400">{timeLeft}</span></p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: payment */}
              <div className="lg:col-span-3 space-y-5">
                {/* Method selector */}
                <div className="glass-card p-5">
                  <h2 className="font-bold text-lg mb-4">Способ оплаты</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'card',  label: 'Карта',     icon: '💳' },
                      { id: 'kaspi', label: 'Kaspi Pay', icon: '🔴' },
                      { id: 'qr',    label: 'QR-код',    icon: '📱' },
                    ].map(m => (
                      <button key={m.id} type="button" onClick={() => setPayMethod(m.id)}
                        className={`p-4 rounded-xl border text-center transition-all ${payMethod === m.id ? 'border-brand-400 bg-brand-500/10 shadow-neon-purple' : 'border-white/10 glass hover:border-white/30'}`}>
                        <div className="text-2xl mb-1">{m.icon}</div>
                        <p className="text-xs font-semibold">{m.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card payment */}
                {payMethod === 'card' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-lg">Данные карты</h2>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setFlipped(f => !f)}
                          className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5" /> Перевернуть
                        </button>
                        <button type="button" onClick={() => { setCard(randomCard()); setFlipped(false); }}
                          className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5 text-brand-400">
                          🎲 Случайная
                        </button>
                      </div>
                    </div>

                    <CreditCardVisual card={card} flipped={flipped} />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm text-white/60 mb-1.5 block">Номер карты</label>
                        <input className="input-field font-mono" value={card.number} readOnly
                          onClick={() => { setCard(randomCard()); setFlipped(false); }}
                          placeholder="Нажмите 🎲 для генерации" />
                      </div>
                      <div>
                        <label className="text-sm text-white/60 mb-1.5 block">Срок действия</label>
                        <input className="input-field" value={card.expiry} readOnly />
                      </div>
                      <div>
                        <label className="text-sm text-white/60 mb-1.5 block">CVV</label>
                        <input className="input-field" value="•••" readOnly
                          onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)} />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm text-white/60 mb-1.5 block">Имя на карте</label>
                        <input className="input-field uppercase" value={card.name} readOnly />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 glass rounded-xl border border-green-500/20">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <p className="text-xs text-white/50">Демо-режим: карта сгенерирована автоматически</p>
                    </div>
                  </motion.div>
                )}

                {payMethod === 'kaspi' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
                    <div className="text-6xl mb-4">🔴</div>
                    <p className="font-bold text-xl mb-2">Kaspi Pay</p>
                    <p className="text-white/40 mb-4">Отсканируйте QR-код в приложении Kaspi.kz</p>
                    <div className="w-40 h-40 bg-white rounded-2xl mx-auto flex items-center justify-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs">QR Demo</div>
                    </div>
                  </motion.div>
                )}

                {payMethod === 'qr' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <p className="font-bold text-xl mb-2">Оплата по QR</p>
                    <p className="text-white/40">Отсканируйте код любым банковским приложением</p>
                  </motion.div>
                )}

                {/* Email notice */}
                <div className="glass-card p-4 flex items-center gap-3 border border-brand-500/20">
                  <Mail className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Билеты придут на email</p>
                    <p className="text-xs text-white/40">{user?.email || 'Ваш email'}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 rounded-xl">
                    <Lock className="w-5 h-5" />
                    Оплатить {formatPrice(getTotalPrice())}
                  </motion.button>
                  <p className="text-center text-xs text-white/25 mt-3 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Защищённое соединение SSL
                  </p>
                </form>
              </div>

              {/* Right: order summary */}
              <div className="lg:col-span-2">
                <div className="glass-card p-6 sticky top-24">
                  <h2 className="font-bold text-lg mb-4">Ваш заказ</h2>
                  <div className="flex gap-3 mb-4 p-3 glass rounded-xl">
                    <img src={event?.poster || 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=200'}
                      alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm line-clamp-2">{event?.title}</p>
                      <p className="text-xs text-white/40 mt-1">{formatDate(event?.startDate)}</p>
                      <p className="text-xs text-white/30 mt-0.5">{event?.venue?.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
                    {items.map(({ seat }) => (
                      <div key={seat.id} className="flex justify-between text-sm p-2 glass rounded-lg">
                        <span className="text-white/60">
                          {seat.row && seat.number ? `Ряд ${seat.row}, Место ${seat.number}` : seat.row}
                        </span>
                        <span className="font-semibold text-brand-400">{formatPrice(seat.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Сервисный сбор</span>
                      <span>Включён</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Итого</span>
                      <span className="font-display font-black text-2xl text-brand-400">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 glass rounded-xl flex items-center gap-2 text-xs text-white/40">
                    <Ticket className="w-4 h-4 text-brand-400" />
                    Билеты придут на email сразу после оплаты
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
