import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Ticket } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Минимум 2 символа';
    if (!form.email.includes('@')) e.email = 'Некорректный email';
    if (form.password.length < 6) e.password = 'Минимум 6 символов';
    if (form.password !== form.confirm) e.confirm = 'Пароли не совпадают';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await register(form.email, form.password, form.name.trim());
    if (result.success) navigate('/');
  };

  return (
    <>
      <Helmet><title>Регистрация — TicketHub</title></Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-neon-pink flex items-center justify-center mx-auto mb-4 shadow-neon-purple">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-3xl font-black mb-2">Создать аккаунт</h1>
            <p className="text-white/40">Присоединяйся к TicketHub</p>
          </div>

          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Имя */}
              <div>
                <label className="text-sm text-white/60 mb-2 block">Имя</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ваше имя"
                    className={`input-field pl-12 ${errors.name ? 'border-red-500/50' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-white/60 mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className={`input-field pl-12 ${errors.email ? 'border-red-500/50' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Пароль */}
              <div>
                <label className="text-sm text-white/60 mb-2 block">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Минимум 6 символов"
                    className={`input-field pl-12 pr-12 ${errors.password ? 'border-red-500/50' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Подтверждение пароля */}
              <div>
                <label className="text-sm text-white/60 mb-2 block">Подтвердите пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                    placeholder="Повторите пароль"
                    className={`input-field pl-12 ${errors.confirm ? 'border-red-500/50' : ''}`}
                  />
                </div>
                {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="btn-primary w-full py-3.5 text-base"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : 'Зарегистрироваться'}
              </motion.button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">Войти</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
