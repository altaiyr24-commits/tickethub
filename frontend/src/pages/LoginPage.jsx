import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Ticket } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) navigate('/');
  };

  return (
    <>
      <Helmet><title>{t('auth.login.submit')} — TicketHub</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-neon-pink flex items-center justify-center mx-auto mb-4 shadow-neon-purple">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-3xl font-black mb-2">{t('auth.login.title')}</h1>
            <p className="text-white/40">{t('auth.login.subtitle')}</p>
          </div>
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-white/60 mb-2 block">{t('auth.login.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com" className="input-field pl-12" />
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">{t('auth.login.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input type={showPass ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••" className="input-field pl-12 pr-12" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-brand-400 hover:text-brand-300">
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>
              <motion.button type="submit" disabled={isLoading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="btn-primary w-full py-3.5 text-base">
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  : t('auth.login.submit')}
              </motion.button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center text-xs text-white/30">
                <span className="bg-dark-800 px-3">или</span>
              </div>
            </div>
            <div className="glass rounded-xl p-4 mb-4">
              <p className="text-xs text-white/40 mb-2 font-semibold uppercase tracking-wider">{t('auth.login.demo')}</p>
              <div className="space-y-1 text-xs text-white/50">
                <p>👤 user@tickethub.kz / user123</p>
                <p>🔑 admin@tickethub.kz / admin123</p>
              </div>
            </div>
            <p className="text-center text-sm text-white/40">
              {t('auth.login.noAccount')}{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
                {t('auth.login.registerLink')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
