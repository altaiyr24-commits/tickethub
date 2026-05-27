import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useFeaturedEvents } from '@/hooks/useEvents';
import EventCard from '@/components/ui/EventCard';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';

export default function FeaturedEvents() {
  const { events, loading } = useFeaturedEvents();

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} className="flex items-end justify-between mb-12">
        <div>
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 fill-brand-400" /> Рекомендуем
          </p>
          <h2 className="section-title">
            Топ <span className="text-gradient">события</span>
          </h2>
        </div>
        <Link to="/events?featured=true"
          className="hidden sm:flex items-center gap-2 text-sm text-white/50 hover:text-brand-400 transition-colors group">
          Все события
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {loading ? <SkeletonGrid count={4} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
        </div>
      )}
    </section>
  );
}
