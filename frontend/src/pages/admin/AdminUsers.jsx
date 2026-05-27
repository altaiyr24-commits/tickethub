import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Shield, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users', { params: { limit: 50 } })
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const { data } = await api.put(`/admin/users/${user.id}/role`, { role: newRole });
      setUsers(u => u.map(x => x.id === data.id ? { ...x, role: data.role } : x));
      toast.success(`Роль изменена на ${newRole}`);
    } catch { toast.error('Ошибка'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Пользователи — Admin</title></Helmet>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-black mb-1">Пользователи</h1>
          <p className="text-white/40">{users.length} аккаунтов</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..." className="input-field pl-12" />
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Пользователь', 'Email', 'Роль', 'Заказов', 'Дата', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-neon-pink flex items-center justify-center text-sm font-bold">
                          {user.name[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/60">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${user.role === 'ADMIN' ? 'bg-brand-500/20 text-brand-400' : 'bg-white/10 text-white/50'}`}>
                        {user.role === 'ADMIN' ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/60">{user._count?.orders || 0}</td>
                    <td className="px-4 py-3 text-sm text-white/40">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleRole(user)}
                        className="btn-ghost p-1.5 text-xs flex items-center gap-1">
                        {user.role === 'ADMIN' ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </button>
                    </td>
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
