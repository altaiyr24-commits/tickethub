import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useEvents';

const FALLBACK = [
  { slug: 'concerts',  name: 'Концерты',  icon: '🎵', color: '#8B5CF6', _count: { events: 24 } },
  { slug: 'theatre',   name: 'Театр',     icon: '🎭', color: '#EC4899', _count: { events: 12 } },
  { slug: 'sport',     name: 'Спорт',     icon: '⚽', color: '#10B981', _count: { events: 18 } },
  { slug: 'standup',   name: 'Стендап',   icon: '🎤', color: '#F59E0B', _count: { events: 8  } },
  { slug: 'exhibition',name: 'Выставки',  icon: '🖼️', color: '#06B6D4', _count: { events: 6  } },
  { slug: 'cinema',    name: 'Кино',      icon: '🎬', color: '#EF4444', _count: { events: 30 } },
];

export default function CategoriesSection() {
  const { categories } = useCategories();
  const navigate = useNavigate();
  const list = categories.length ? categories : FALLBACK;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} className="text-center mb-12">
        <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Категории</p>
        <h2 className="section-title mb-3">
          Выбери <span className="text-gradient">категорию</span>
        </h2>
        <p className="text-white/40 max-w-md mx-auto">Найди событие по своему вкусу — от рок-концертов до балета</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {list.map((cat, i) => (
          <motion.button key={cat.slug}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.03 }} whileTap={{ scale: 0.96 }}
            onClick={() => navigate(`/events?category=${cat.slug}`)}
            className="group relative glass-card p-5 flex flex-col items-center gap-3 overflow-hidden cursor-pointer"
          >
            {/* Glow bg on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              style={{ background: `radial-gradient(circle at center, ${cat.color}18 0%, transparent 70%)` }} />

            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: `${cat.color}20`, boxShadow: `0 0 0 0 ${cat.color}40` }}>
              <span className="group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
            </div>

            <div className="relative text-center">
              <p className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">{cat.name}</p>
              <p className="text-xs mt-0.5" style={{ color: `${cat.color}99` }}>{cat._count?.events || 0} событий</p>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"
              style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }} />
          </motion.button>
        ))}
      </div>
    </section>
  );
}
