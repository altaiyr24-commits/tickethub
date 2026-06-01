import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Ticket, Share2 } from 'lucide-react';
import { formatDateTime, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const order = state?.order;

  const o = order ? {
    ...order,
    totalAmount: order.totalAmount ?? order.total_amount,
    qrCode: order.qrCode ?? order.qr_code,
    event: order.event ? {
      ...order.event,
      startDate: order.event.startDate ?? order.event.start_date,
    } : null,
    items: (order.items || []).map(item => ({
      ...item,
      ticketCode: item.ticketCode ?? item.ticket_code,
      seat: item.seat ? { ...item.seat, number: item.seat.number ?? item.seat.seat_number } : null,
    })),
  } : null;

  if (!order) { navigate('/'); return null; }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t('orderSuccess.linkCopied'));
  };

  return (
    <>
      <Helmet><title>{t('orderSuccess.title')} — TicketHub</title></Helmet>
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }} className="text-center">

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="font-display text-3xl font-black mb-2">{t('orderSuccess.paid')}</h1>
              <p className="text-white/50 mb-8">{t('orderSuccess.emailSent')}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }} className="glass-card p-6 mb-6 text-left">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="font-bold">{o.event?.title}</p>
                  <p className="text-xs text-white/40">{formatDateTime(o.event?.startDate)}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {o.items?.map((item, idx) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/60">
                      {item.seat?.row
                        ? t('orderSuccess.row', { row: item.seat.row, number: item.seat.number })
                        : t('orderSuccess.ticket', { number: idx + 1 })}
                    </span>
                    <span className="font-mono text-xs text-white/30">{item.ticketCode?.slice(0, 8).toUpperCase()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-white/60">{t('orderSuccess.total')}</span>
                <span className="font-display font-bold text-xl text-brand-400">{formatPrice(o.totalAmount)}</span>
              </div>

              {o.qrCode && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <p className="text-xs text-white/40">{t('orderSuccess.showQr')}</p>
                  <div className="p-3 bg-white rounded-xl">
                    <img src={o.qrCode} alt="QR" className="w-32 h-32" />
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex flex-col gap-3">
              <Link to="/orders" className="btn-primary flex items-center justify-center gap-2 py-3">
                <Ticket className="w-5 h-5" /> {t('orderSuccess.myTickets')}
              </Link>
              <div className="flex gap-3">
                <button onClick={handleShare} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> {t('orderSuccess.share')}
                </button>
                <Link to="/" className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" /> {t('orderSuccess.home')}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
