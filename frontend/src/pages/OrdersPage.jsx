import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar, MapPin, QrCode, ChevronDown } from 'lucide-react';
import { formatDateTime, formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import Modal from '@/components/ui/Modal';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => {
        // Normalize snake_case from Supabase to camelCase
        const normalized = (data || []).map(order => ({
          ...order,
          totalAmount: order.totalAmount ?? order.total_amount,
          qrCode: order.qrCode ?? order.qr_code,
          event: order.event ? {
            ...order.event,
            startDate: order.event.startDate ?? order.event.start_date,
            venue: order.event.venue,
          } : null,
          items: (order.items || []).map(item => ({
            ...item,
            ticketCode: item.ticketCode ?? item.ticket_code,
            seat: item.seat ? {
              ...item.seat,
              row: item.seat.row,
              number: item.seat.number ?? item.seat.seat_number,
            } : null,
          })),
        }));
        setOrders(normalized);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    CONFIRMED: 'text-green-400 bg-green-400/10',
    PENDING:   'text-yellow-400 bg-yellow-400/10',
    CANCELLED: 'text-red-400 bg-red-400/10',
  };

  return (
    <>
      <Helmet><title>Мои билеты — TicketHub</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="section-title mb-8">Мои <span className="text-gradient">билеты</span></h1>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-32 skeleton rounded-2xl" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <Ticket className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Нет билетов</h3>
                <p className="text-white/40 mb-6">Купите билеты на ближайшие события</p>
                <a href="/events" className="btn-primary">К афише</a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-5 cursor-pointer hover:border-brand-400/30 transition-all"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={order.event?.poster || 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=200'}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold truncate">{order.event?.title}</h3>
                          <span className={`badge text-xs flex-shrink-0 ${statusColors[order.status] || 'text-white/40 bg-white/5'}`}>
                            {order.status === 'CONFIRMED' ? 'Оплачен' : order.status === 'PENDING' ? 'Ожидание' : 'Отменён'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDateTime(order.event?.startDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {order.event?.venue?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Ticket className="w-3 h-3" /> {order.items?.length || 0} билет(а)
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-brand-400">{formatPrice(order.totalAmount)}</p>
                        <ChevronDown className="w-4 h-4 text-white/30 mx-auto mt-1" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Order detail modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Детали заказа" size="md">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex gap-3 p-3 glass rounded-xl">
              <img src={selectedOrder.event?.poster} alt="" className="w-14 h-14 rounded-lg object-cover" />
              <div>
                <p className="font-bold">{selectedOrder.event?.title}</p>
                <p className="text-xs text-white/40">{formatDateTime(selectedOrder.event?.startDate)}</p>
              </div>
            </div>

            <div className="space-y-2">
              {selectedOrder.items?.map((item, idx) => (
                <div key={item.id} className="flex justify-between text-sm p-3 glass rounded-xl">
                  <span>
                    {item.seat?.row
                      ? `Ряд ${item.seat.row}, Место ${item.seat.number}`
                      : `Билет ${idx + 1}`}
                  </span>
                  <span className="font-mono text-xs text-white/40">{item.ticketCode?.slice(0, 8).toUpperCase()}</span>
                </div>
              ))}
            </div>

            {selectedOrder.qrCode && (
              <div className="flex justify-center p-4 glass rounded-xl">
                <img src={selectedOrder.qrCode} alt="QR" className="w-40 h-40" />
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-white/60">Итого</span>
              <span className="font-bold text-xl text-brand-400">{formatPrice(selectedOrder.totalAmount)}</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
