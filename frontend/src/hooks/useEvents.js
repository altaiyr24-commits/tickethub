import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { MOCK_EVENTS, MOCK_CATEGORIES } from '@/lib/mockEvents';

// Normalize Supabase snake_case → camelCase for frontend
function normalizeEvent(e) {
  if (!e) return e;
  return {
    ...e,
    startDate:   e.startDate   || e.start_date,
    endDate:     e.endDate     || e.end_date,
    shortDesc:   e.shortDesc   || e.short_desc,
    minPrice:    e.minPrice    ?? e.min_price    ?? 0,
    maxPrice:    e.maxPrice    ?? e.max_price    ?? 0,
    isFeatured:  e.isFeatured  ?? e.is_featured  ?? false,
    isHot:       e.isHot       ?? e.is_hot       ?? false,
    totalSeats:  e.totalSeats  ?? e.total_seats  ?? 0,
    soldSeats:   e.soldSeats   ?? e.sold_seats   ?? 0,
    venueType:   e.venueType   || e.venue_type   || 'concert',
    ticketTypes: e.ticketTypes || e.ticket_types || [],
    isFavorited: e.isFavorited ?? e.is_favorited ?? false,
    // normalize nested category
    category: e.category ? {
      ...e.category,
      _count: e.category._count || { events: 0 },
    } : undefined,
    venue: e.venue || undefined,
  };
}

// Helper: filter mock events
function filterMock(params = {}) {
  let list = [...MOCK_EVENTS];
  if (params.category) list = list.filter(e => e.category?.slug === params.category);
  if (params.featured === 'true') list = list.filter(e => e.isFeatured);
  if (params.hot === 'true') list = list.filter(e => e.isHot);
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(e => e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q));
  }
  if (params.sort === 'price') list.sort((a, b) => a.minPrice - b.minPrice);
  else if (params.sort === 'popular') list.sort((a, b) => b.soldSeats - a.soldSeats);
  else list.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const page = parseInt(params.page || 1);
  const limit = parseInt(params.limit || 12);
  const total = list.length;
  const events = list.slice((page - 1) * limit, page * limit);
  return { events, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export const useEvents = (params = {}) => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/events', { params });
      setEvents((data.events || []).map(normalizeEvent));
      setPagination(data.pagination);
    } catch (err) {
      // Only fallback to mock if backend is completely unreachable (network error)
      if (!err.response) {
        const result = filterMock(params);
        setEvents(result.events.map(normalizeEvent));
        setPagination(result.pagination);
      } else {
        setError(err.response?.data?.error || 'Ошибка загрузки событий');
        setEvents([]);
        setPagination(null);
      }
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  return { events, pagination, loading, error, refetch: fetchEvents };
};

export const useEvent = (slug) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    api.get(`/events/${slug}`)
      .then(({ data }) => setEvent(normalizeEvent(data)))
      .catch((err) => {
        // Only use mock as fallback if it's a network error (backend not running)
        // If backend is running but event not found — show error
        if (!err.response) {
          // Network error — backend not running, use mock
          const found = MOCK_EVENTS.find(e => e.slug === slug);
          if (found) setEvent(normalizeEvent(found));
          else setError('Событие не найдено');
        } else {
          setError('Событие не найдено');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return { event, loading, error };
};

export const useFeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events/featured')
      .then(({ data }) => setEvents((data || []).map(normalizeEvent)))
      .catch(() => setEvents(MOCK_EVENTS.filter(e => e.isFeatured).slice(0, 6).map(normalizeEvent)))
      .finally(() => setLoading(false));
  }, []);

  return { events, loading };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories(MOCK_CATEGORIES))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
};
