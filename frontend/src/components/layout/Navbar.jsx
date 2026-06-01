import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, Search, User, Heart, ShoppingCart, Menu, X,
  LogOut, LayoutDashboard, ChevronDown, Flame, Star,
  Music, Theater, Trophy, Mic2, Image, Film
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS = {
  concerts: Music,
  theatre: Theater,
  sport: Trophy,
  standup: Mic2,
  exhibition: Image,
  cinema: Film,
};
const CATEGORY_COLORS = {
  concerts: '#8B5CF6', theatre: '#EC4899', sport: '#10B981',
  standup: '#F59E0B', exhibition: '#06B6D4', cinema: '#EF4444',
};
const CATEGORY_SLUGS = ['concerts', 'theatre', 'sport', 'standup', 'exhibition', 'cinema'];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu]     = useState(false);
  const [catMenu, setCatMenu]       = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]       = useState('');
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setCatMenu(false); setUserMenu(false); }, [location]);
  useEffect(() => { if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100); }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false); setSearchQ('');
    }
  };

  const userMenuItems = [
    { to: '/profile',   icon: User,          key: 'nav.profile' },
    { to: '/orders',    icon: Ticket,        key: 'nav.myTickets' },
    { to: '/favorites', icon: Heart,         key: 'nav.favorites' },
    ...(user?.role === 'ADMIN' ? [{ to: '/admin', icon: LayoutDashboard, key: 'nav.adminPanel' }] : []),
  ];

  return (
    <>
      <motion.header
        className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'glass-dark shadow-glass py-2' : 'bg-transparent py-4')}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-neon-pink flex items-center justify-center shadow-neon-purple group-hover:scale-110 transition-transform duration-300">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-black text-xl text-gradient hidden sm:block">TicketHub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/events" className={cn('btn-ghost text-sm px-4', location.pathname === '/events' && 'text-brand-400')}>
              {t('nav.poster')}
            </Link>

            <div className="relative" onMouseEnter={() => setCatMenu(true)} onMouseLeave={() => setCatMenu(false)}>
              <button className={cn('btn-ghost text-sm px-4 flex items-center gap-1', catMenu && 'text-brand-400')}>
                {t('nav.categories')} <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', catMenu && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {catMenu && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-64 glass-dark rounded-2xl border border-white/10 shadow-glass overflow-hidden p-2">
                    {CATEGORY_SLUGS.map(slug => {
                      const Icon = CATEGORY_ICONS[slug];
                      const color = CATEGORY_COLORS[slug];
                      return (
                        <Link key={slug} to={`/events?category=${slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group/cat">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <span className="text-sm text-white/70 group-hover/cat:text-white transition-colors">
                            {t(`nav.categories_list.${slug}`)}
                          </span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/events?hot=true" className="btn-ghost text-sm px-4 flex items-center gap-1.5 text-orange-400 hover:text-orange-300">
              <Flame className="w-3.5 h-3.5" /> {t('nav.hot')}
            </Link>
            <Link to="/events?featured=true" className="btn-ghost text-sm px-4 flex items-center gap-1.5 text-brand-400 hover:text-brand-300">
              <Star className="w-3.5 h-3.5" /> {t('nav.top')}
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />

            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.form key="form" initial={{ width: 40, opacity: 0 }} animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 40, opacity: 0 }} transition={{ duration: 0.25 }}
                  onSubmit={handleSearch} className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-brand-500/40">
                  <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
                  <input ref={searchRef} value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    placeholder={t('nav.search')} className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full" />
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQ(''); }}>
                    <X className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
                  </button>
                </motion.form>
              ) : (
                <motion.button key="btn" onClick={() => setSearchOpen(true)}
                  className="btn-ghost p-2.5 rounded-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Search className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {isAuthenticated && (
              <>
                <Link to="/favorites" className={cn('btn-ghost p-2.5 rounded-xl hidden sm:flex', location.pathname === '/favorites' && 'text-red-400')}>
                  <Heart className="w-5 h-5" />
                </Link>
                <Link to="/checkout" className="btn-ghost p-2.5 rounded-xl relative hidden sm:flex">
                  <ShoppingCart className="w-5 h-5" />
                  {items.length > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-500 rounded-full text-xs flex items-center justify-center font-bold shadow-neon-purple">
                      {items.length}
                    </motion.span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setUserMenu(v => !v)}
                  className="flex items-center gap-2 glass px-3 py-2 rounded-xl hover:border-brand-400/40 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-neon-pink flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden sm:block max-w-[90px] truncate">{user?.name}</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 text-white/40 transition-transform hidden sm:block', userMenu && 'rotate-180')} />
                </motion.button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-2xl border border-white/10 shadow-glass overflow-hidden"
                      onMouseLeave={() => setUserMenu(false)}>
                      <div className="p-3 border-b border-white/10">
                        <p className="font-semibold text-sm">{user?.name}</p>
                        <p className="text-xs text-white/40 truncate">{user?.email}</p>
                      </div>
                      {userMenuItems.map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors">
                          <item.icon className="w-4 h-4 text-brand-400" />
                          {t(item.key)}
                        </Link>
                      ))}
                      <button onClick={() => { logout(); setUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 transition-colors border-t border-white/10">
                        <LogOut className="w-4 h-4" /> {t('nav.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm px-4 py-2 hidden sm:block">{t('nav.login')}</Link>
                <Link to="/register">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="btn-primary text-sm py-2 px-4 rounded-xl">
                    {t('nav.register')}
                  </motion.div>
                </Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(v => !v)} className="btn-ghost p-2.5 rounded-xl lg:hidden">
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><X className="w-5 h-5" /></motion.div>
                  : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><Menu className="w-5 h-5" /></motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              className="lg:hidden glass-dark border-t border-white/10 overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                <Link to="/events" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-sm font-medium">
                  {t('nav.poster')}
                </Link>
                {CATEGORY_SLUGS.map(slug => {
                  const Icon = CATEGORY_ICONS[slug];
                  const color = CATEGORY_COLORS[slug];
                  return (
                    <Link key={slug} to={`/events?category=${slug}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-sm">
                      <Icon className="w-4 h-4" style={{ color }} />
                      {t(`nav.categories_list.${slug}`)}
                    </Link>
                  );
                })}
                {!isAuthenticated ? (
                  <div className="flex gap-2 pt-3 border-t border-white/10">
                    <Link to="/login" className="btn-secondary flex-1 text-center text-sm py-2.5">{t('nav.login')}</Link>
                    <Link to="/register" className="btn-primary flex-1 text-center text-sm py-2.5">{t('nav.register')}</Link>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-white/10 space-y-1">
                    <Link to="/profile"   className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-sm"><User className="w-4 h-4 text-brand-400" /> {t('nav.profile')}</Link>
                    <Link to="/orders"    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-sm"><Ticket className="w-4 h-4 text-brand-400" /> {t('nav.myTickets')}</Link>
                    <Link to="/favorites" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-sm"><Heart className="w-4 h-4 text-brand-400" /> {t('nav.favorites')}</Link>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 text-sm">
                      <LogOut className="w-4 h-4" /> {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => { setSearchOpen(false); setSearchQ(''); }} />
        )}
      </AnimatePresence>
    </>
  );
}
