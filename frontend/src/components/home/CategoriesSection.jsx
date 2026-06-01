import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useEvents';
import { useTranslation } from 'react-i18next';

const FALLBACK = [
  { slug: 'concerts',   icon: '🎵', color: '#8B5CF6', _count: { events: 24 } },
  { slug: 'theatre',    icon: '🎭', color: '#EC4899', _count: { events: 12 } },
  { slug: 'sport',      icon: '⚽', color: '#10B981', _count: { events: 18 } },
  { slug: 'standup',    icon: '🎤', color: '#F59E0B', _count: { events: 8  } },
  { slug: 'exhibition', icon: '🖼️', color: '#06B6D4', _count: { events: 6  } },
  { slug: 'cinema',     icon: '🎬', color: '#EF4444', _count: { events: 30 } },
];

export default function CategoriesSection() {
  const { categories } = useCategories();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Merge API categories with fallback icons/colors, use translated names
  const list = FALLBACK.map(fb => {
    const api = categories.find(c => c.slug === fb.slug);
    return {
      ...fb,
      name: t(`nav.categories_list.${fb.slug}`),
      _count: api?._count || fb._count,
    };
  });

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} className="text-center mb-12">
        <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">
          {t('home.categories.title')}
        </p>
        <h2 className="section-title mb-3">
          {t('home.categories.subtitle')}
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {list.map((cat, i) => (
          <motion.button key={cat.slug}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.03 }} whileTap={{ scale: 0.96 }}
            onClick={() => navigate(`/events?category=${cat.slug}`)}
            className="group relative glass-card p-5 flex flex-col items-center gap-3 overflow-hidden cursor-pointer">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              style={{ background: `radial-gradient(circle at center, ${cat.color}18 0%, transparent 70%)` }} />
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: `${cat.color}20` }}>
              <span className="group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
            </div>
            <div className="relative text-center">
              <p className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">{cat.name}</p>
              <p className="text-xs mt-0.5" style={{ color: `${cat.color}99` }}>
                {cat._count?.events || 0} {t('events.total', { count: '' }).replace(' ', '')}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"
              style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }} />
          </motion.button>
        ))}
      </div>
    </section>
  );
}
