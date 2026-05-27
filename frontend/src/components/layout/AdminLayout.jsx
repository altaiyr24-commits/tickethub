import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, ShoppingBag, LogOut, Ticket, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Дашборд', exact: true },
  { to: '/admin/events', icon: Calendar, label: 'Мероприятия' },
  { to: '/admin/users', icon: Users, label: 'Пользователи' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Заказы' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-neon-pink flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-gradient">TicketHub</p>
              <p className="text-xs text-white/30">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-neon-pink flex items-center justify-center text-xs font-bold">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/30">Administrator</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
