import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import api from '@/lib/api';
import EventCard from '@/components/ui/EventCard';
import { useTranslation } from 'react-i18next';

export default function FavoritesPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    api.get('/users/favorites')
      .then(({ data }) => {
        const normalized = (data || []).map(event => ({
          ...event,
          startDate: event.startDate ?? event.start_date,
          endDate: event.endDate ?? event.end_date,
          minPrice: event.minPrice ?? event.min_price,
          maxPrice: event.maxPrice ?? event.max_price,
          totalSeats: event.totalSeats ?? event.total_seats,
          soldSeats: event.soldSeats ?? event.sold_seats,
          isHot: event.isHot ?? event.is_hot,
          isFeatured: event.isFeatured ?? event.is_featured,
          shortDesc: event.shortDesc ?? event.short_desc,
        }));
        setEvents(normalized);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>{t('favorites.title')} — TicketHub</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="section-title mb-8">
              <Heart className="inline w-8 h-8 text-red-400 mr-2" />
              {t('favorites.title')}
            </h1>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-72 skeleton rounded-2xl" />)}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{t('favorites.empty')}</h3>
                <p className="text-white/40 mb-6">{t('favorites.emptySub')}</p>
                <a href="/events" className="btn-primary">{t('favorites.toPoster')}</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
