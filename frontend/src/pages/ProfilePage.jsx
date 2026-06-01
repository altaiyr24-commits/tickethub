import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, Camera } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState({ name: '', phone: '', avatar: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('profile');
  const { t } = useTranslation();

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', phone: user.phone || '', avatar: user.avatar || '' });
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', profile);
      updateUser(data);
      toast.success(t('profile.saved'));
    } catch { toast.error(t('profile.saveError')); }
    finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) { toast.error(t('profile.passwordMismatch')); return; }
    setSaving(true);
    try {
      await api.put('/users/password', { currentPassword: passwords.current, newPassword: passwords.new });
      toast.success(t('profile.passwordChanged'));
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.error || t('common.error')); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id: 'profile', label: t('profile.data') },
    { id: 'security', label: t('profile.security') },
  ];

  const passwordFields = [
    { key: 'current', label: t('profile.currentPassword') },
    { key: 'new',     label: t('profile.newPassword') },
    { key: 'confirm', label: t('profile.confirmPassword') },
  ];

  return (
    <>
      <Helmet><title>{t('profile.title')} — TicketHub</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="section-title mb-8">{t('profile.title')}</h1>

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
                  {t(`profile.roles.${user?.role || 'USER'}`)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {tabs.map(tb => (
                <button key={tb.id} onClick={() => setTab(tb.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === tb.id ? 'bg-brand-500 text-white' : 'glass text-white/60 hover:text-white'}`}>
                  {tb.label}
                </button>
              ))}
            </div>

            {tab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
                <form onSubmit={saveProfile} className="space-y-5">
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">{t('profile.name')}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                        className="input-field pl-12" placeholder={t('profile.namePlaceholder')} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">{t('profile.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input value={user?.email} disabled className="input-field pl-12 opacity-50 cursor-not-allowed" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">{t('profile.phone')}</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                      <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        className="input-field pl-12" placeholder={t('profile.phonePlaceholder')} />
                    </div>
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" /> {saving ? t('profile.saving') : t('profile.save')}
                  </button>
                </form>
              </motion.div>
            )}

            {tab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
                <form onSubmit={changePassword} className="space-y-5">
                  {passwordFields.map(f => (
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
                    <Lock className="w-4 h-4" /> {saving ? t('profile.saving') : t('profile.changePassword')}
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
