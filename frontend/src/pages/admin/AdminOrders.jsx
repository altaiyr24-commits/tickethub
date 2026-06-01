import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { formatDateTime, formatPrice } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    api.get('/admin/orders', { params: { limit: 50 } })
      .then(({ data }) => {
        const normalized = (data.orders || []).map(o => ({
          ...o,
          totalAmount: o.totalAmount ?? o.total_amount,
          createdAt: o.createdAt ?? o.created_at,
        }));
        setOrders(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    CONFIRMED: 'text-green-400 bg-green-400/10',
    PENDING:   'text-yellow-400 bg-yellow-400/10',
    CANCELLED: 'text-red-400 bg-red-400/10',
  };

  const columns = [
    'ID',
    t('admin.orders.columns.client'),
    t('admin.orders.columns.event'),
    t('admin.orders.columns.tickets'),
    t('admin.orders.columns.amount'),
    t('admin.orders.columns.status'),
    t('admin.orders.columns.date'),
  ];

  return (
    <>
      <Helmet><title>{t('admin.orders.title')} — Admin</title></Helmet>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-black mb-1">{t('admin.orders.title')}</h1>
          <p className="text-white/40">{orders.length} {t('admin.orders.title').toLowerCase()}</p>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {columns.map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-white/30">{order.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{order.user?.name}</td>
                    <td className="px-4 py-3 text-sm text-white/60 max-w-[200px] truncate">{order.event?.title}</td>
                    <td className="px-4 py-3 text-sm text-white/60">{order.items?.length}</td>
                    <td className="px-4 py-3 text-sm font-bold text-brand-400">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${statusColors[order.status] || 'text-white/40 bg-white/5'}`}>
                        {t(`orders.status.${order.status}`) || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/30">{formatDateTime(order.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
