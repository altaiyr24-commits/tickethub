import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Calendar, ShoppingBag, TrendingUp, ArrowUpRight } from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';
import api from '@/lib/api';

const StatCard = ({ icon: Icon, label, value, color, change }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      {change && (
        <span className="flex items-center gap-1 text-green-400 text-sm font-semibold">
          <ArrowUpRight className="w-4 h-4" /> {change}
        </span>
      )}
    </div>
    <p className="text-3xl font-display font-black mb-1">{value}</p>
    <p className="text-white/40 text-sm">{label}</p>
  </motion.div>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => {
        // Normalize snake_case in recentOrders and topEvents
        const normalized = {
          ...data,
          recentOrders: (data.recentOrders || []).map(o => ({
            ...o,
            totalAmount: o.totalAmount ?? o.total_amount,
            createdAt: o.createdAt ?? o.created_at,
          })),
          topEvents: (data.topEvents || []).map(e => ({
            ...e,
            soldSeats: e.soldSeats ?? e.sold_seats ?? 0,
            totalSeats: e.totalSeats ?? e.total_seats ?? 0,
            minPrice: e.minPrice ?? e.min_price ?? 0,
          })),
        };
        setData(normalized);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>Дашборд — Admin</title></Helmet>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-black mb-1">Дашборд</h1>
          <p className="text-white/40">Обзор платформы TicketHub</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-36 skeleton rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={Users} label="Пользователей" value={data?.stats.totalUsers?.toLocaleString()} color="bg-brand-500/20 text-brand-400" change="+12%" />
            <StatCard icon={Calendar} label="Мероприятий" value={data?.stats.totalEvents?.toLocaleString()} color="bg-neon-pink/20 text-neon-pink" change="+5%" />
            <StatCard icon={ShoppingBag} label="Заказов" value={data?.stats.totalOrders?.toLocaleString()} color="bg-neon-cyan/20 text-neon-cyan" change="+23%" />
            <StatCard icon={TrendingUp} label="Выручка" value={formatPrice(data?.stats.revenue || 0)} color="bg-green-500/20 text-green-400" change="+18%" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent orders */}
          <div className="glass-card p-6">
            <h2 className="font-bold text-lg mb-4">Последние заказы</h2>
            <div className="space-y-3">
              {data?.recentOrders?.slice(0, 6).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 glass rounded-xl">
                  <div>
                    <p className="text-sm font-semibold">{order.user?.name}</p>
                    <p className="text-xs text-white/40">{order.event?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-400">{formatPrice(order.totalAmount)}</p>
                    <p className="text-xs text-white/30">{formatDateTime(order.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top events */}
          <div className="glass-card p-6">
            <h2 className="font-bold text-lg mb-4">Топ мероприятий</h2>
            <div className="space-y-3">
              {data?.topEvents?.map((event, i) => (
                <div key={event.id} className="flex items-center gap-3 p-3 glass rounded-xl">
                  <span className="text-2xl font-display font-black text-white/20 w-8">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-neon-pink rounded-full"
                          style={{ width: `${(event.soldSeats / event.totalSeats) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/40">{event.soldSeats}/{event.totalSeats}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
