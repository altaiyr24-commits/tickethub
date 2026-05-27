import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, Camera } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState({ name: '', phone: '', avatar: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('profile');

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', phone: user.phone || '', avatar: user.avatar || '' });
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', profile);
      updateUser(data);
      toast.success('Профиль обновлён');
    } catch { toast.error('Ошибка сохранения'); }
    finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) { toast.error('Пароли не совпадают'); return; }
    setSaving(true);
    try {
      await api.put('/users/password', { currentPassword: passwords.current, newPassword: passwords.new });
      toast.success('Пароль изменён');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.error || 'Ошибка'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Helmet><title>Профиль — TicketHub</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="section-title mb-8">Мой <span className="text-gradient">профиль</span></h1>

            {/* Avatar */}
            <div className="glass-card p-6 mb-6 flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-neon-pink flex items-center justify-center text-3xl font-bold shadow-neon-purple">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div>
                <h2 className="font-bold text-xl">{user?.name}</h2>
                <p className="text-white/40 text-sm">{user?.email}</p>
                <span className={`badge mt-1 ${user?.role === 'ADMIN' ? 'bg-brand-500/20 text-brand-400' : 'bg-white/10 text-white/50'}`}>
                  {user?.role === 'ADMIN' ? '👑 Администратор' : '👤 Пользователь'}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {[{ id: 'profile', label: 'Данные' }, { id: 'security', label: 'Безопасность' }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-brand-500 text-white' : 'glass text-white/60 hover:text-white'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
                <form onSubmit={saveProfile} className="space-y-5">
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Имя</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                        className="input-field pl-12" placeholder="Ваше имя" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input value={user?.email} disabled className="input-field pl-12 opacity-50 cursor-not-allowed" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Телефон</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        className="input-field pl-12" placeholder="+7 (777) 000-00-00" />
                    </div>
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                </form>
              </motion.div>
            )}

            {tab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
                <form onSubmit={changePassword} className="space-y-5">
                  {[
                    { key: 'current', label: 'Текущий пароль' },
                    { key: 'new', label: 'Новый пароль' },
                    { key: 'confirm', label: 'Подтвердите пароль' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-sm text-white/60 mb-2 block">{f.label}</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input type="password" value={passwords[f.key]}
                          onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                          className="input-field pl-12" placeholder="••••••••" />
                      </div>
                    </div>
                  ))}
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    <Lock className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Изменить пароль'}
                  </button>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
