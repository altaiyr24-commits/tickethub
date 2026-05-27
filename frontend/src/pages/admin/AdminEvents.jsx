import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Image, Calendar, MapPin, Tag, Flame, Star, X } from 'lucide-react';
import { formatDate, formatPrice, getEventStatusColor } from '@/lib/utils';
import api from '@/lib/api';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  title: '', description: '', short_desc: '', category_id: '', venue_id: '',
  start_date: '', min_price: '', max_price: '', status: 'DRAFT',
  is_featured: false, is_hot: false, poster: '', banner: '',
  venue_type: 'concert', tags: '', age_limit: '', duration: '',
};

const VENUE_TYPES = [
  { value: 'concert',  label: '🎵 Концертный зал' },
  { value: 'theatre',  label: '🎭 Театр' },
  { value: 'cinema',   label: '🎬 Кинотеатр' },
  { value: 'stadium',  label: '🏟️ Стадион' },
  { value: 'football', label: '⚽ Футбольный стадион' },
  { value: 'arena',    label: '🥊 Арена' },
  { value: 'standup',  label: '🎤 Зал стендапа' },
  { value: 'exhibition', label: '🖼️ Выставочный зал' },
];

export default function AdminEvents() {
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [venues, setVenues]       = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [tab, setTab]             = useState('basic'); // basic | media | settings

  const f = (key, val) => setForm(p => ({ ...p, [key]: val }));

  useEffect(() => {
    Promise.all([
      api.get('/events', { params: { limit: 100 } }),
      api.get('/categories'),
      api.get('/venues'),
    ]).then(([evRes, catRes, venRes]) => {
      setEvents(evRes.data.events || []);
      setCategories(catRes.data || []);
      setVenues(venRes.data || []);
    }).catch(() => toast.error('Ошибка загрузки')).finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditEvent(null);
    setForm(EMPTY_FORM);
    setTab('basic');
    setShowModal(true);
  };

  const openEdit = (ev) => {
    setEditEvent(ev);
    setForm({
      title:       ev.title || '',
      description: ev.description || '',
      short_desc:  ev.shortDesc || ev.short_desc || '',
      category_id: ev.category_id || ev.categoryId || ev.category?.id || '',
      venue_id:    ev.venue_id || ev.venueId || ev.venue?.id || '',
      start_date:  (ev.startDate || ev.start_date || '').slice(0, 16),
      min_price:   ev.minPrice ?? ev.min_price ?? '',
      max_price:   ev.maxPrice ?? ev.max_price ?? '',
      status:      ev.status || 'DRAFT',
      is_featured: ev.isFeatured ?? ev.is_featured ?? false,
      is_hot:      ev.isHot ?? ev.is_hot ?? false,
      poster:      ev.poster || '',
      banner:      ev.banner || '',
      venue_type:  ev.venueType || ev.venue_type || 'concert',
      tags:        (ev.tags || []).join(', '),
      age_limit:   ev.age_limit || ev.ageLimit || '',
      duration:    ev.duration || '',
    });
    setTab('basic');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        min_price:  parseFloat(form.min_price) || 0,
        max_price:  parseFloat(form.max_price) || 0,
        age_limit:  form.age_limit ? parseInt(form.age_limit) : null,
        duration:   form.duration  ? parseInt(form.duration)  : null,
        tags:       form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };

      if (editEvent) {
        const { data } = await api.put(`/events/${editEvent.id}`, payload);
        setEvents(ev => ev.map(e => e.id === data.id ? { ...e, ...data } : e));
        toast.success('✅ Мероприятие обновлено');
      } else {
        const { data } = await api.post('/events', payload);
        setEvents(ev => [data, ...ev]);
        toast.success('✅ Мероприятие создано');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить мероприятие? Это действие необратимо.')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(ev => ev.filter(e => e.id !== id));
      toast.success('Удалено');
    } catch { toast.error('Ошибка удаления'); }
  };

  const filtered = events.filter(ev =>
    ev.title?.toLowerCase().includes(search.toLowerCase()) ||
    ev.venue?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = [
    { id: 'basic',    label: '📝 Основное' },
    { id: 'media',    label: '🖼️ Медиа' },
    { id: 'settings', label: '⚙️ Настройки' },
  ];

  return (
    <>
      <Helmet><title>Мероприятия — Admin</title></Helmet>
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-black mb-1">Мероприятия</h1>
            <p className="text-white/40">{events.length} событий в базе</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={openCreate} className="btn-primary flex items-center gap-2 px-5 py-2.5">
            <Plus className="w-4 h-4" /> Добавить
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию или площадке..."
            className="input-field pl-12 rounded-2xl" />
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 skeleton rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎭</p>
            <p className="text-white/40">Нет мероприятий</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/3">
                    {['Мероприятие', 'Категория', 'Дата', 'Цена', 'Статус', 'Действия'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-white/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ev, i) => (
                    <motion.tr key={ev.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                            {ev.poster
                              ? <img src={ev.poster} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-white/20"><Image className="w-5 h-5" /></div>
                            }
                          </div>
                          <div>
                            <p className="font-semibold text-sm line-clamp-1">{ev.title}</p>
                            <p className="text-xs text-white/30 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{ev.venue?.name || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-white/60 flex items-center gap-1">
                          {ev.category?.icon} {ev.category?.name || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/60 whitespace-nowrap">
                        {formatDate(ev.startDate || ev.start_date)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-brand-400 whitespace-nowrap">
                        {formatPrice(ev.minPrice ?? ev.min_price ?? 0)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`badge text-xs w-fit ${getEventStatusColor(ev.status)}`}>{ev.status}</span>
                          <div className="flex gap-1">
                            {(ev.isHot || ev.is_hot) && <span className="badge bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5"><Flame className="w-2.5 h-2.5" /></span>}
                            {(ev.isFeatured || ev.is_featured) && <span className="badge bg-brand-500/20 text-brand-400 text-xs px-1.5 py-0.5"><Star className="w-2.5 h-2.5" /></span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <a href={`/events/${ev.slug}`} target="_blank"
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:border-brand-400/50 transition-all" title="Просмотр">
                            <Eye className="w-3.5 h-3.5 text-white/60" />
                          </a>
                          <button onClick={() => openEdit(ev)}
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:border-brand-400/50 transition-all" title="Редактировать">
                            <Edit className="w-3.5 h-3.5 text-white/60" />
                          </button>
                          <button onClick={() => handleDelete(ev.id)}
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all" title="Удалить">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Create/Edit Modal ── */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editEvent ? `✏️ ${editEvent.title}` : '➕ Новое мероприятие'} size="xl">
        <form onSubmit={handleSave}>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
            {TABS.map(t => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-brand-500 text-white' : 'glass text-white/50 hover:text-white'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── BASIC TAB ── */}
          {tab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Название *</label>
                <input value={form.title} onChange={e => f('title', e.target.value)}
                  className="input-field" placeholder="Название мероприятия" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Категория *</label>
                  <select value={form.category_id} onChange={e => f('category_id', e.target.value)} className="input-field" required>
                    <option value="">Выберите категорию...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Тип площадки *</label>
                  <select value={form.venue_type} onChange={e => f('venue_type', e.target.value)} className="input-field">
                    {VENUE_TYPES.map(vt => <option key={vt.value} value={vt.value}>{vt.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Площадка *</label>
                  <select value={form.venue_id} onChange={e => f('venue_id', e.target.value)} className="input-field" required>
                    <option value="">Выберите площадку...</option>
                    {venues.map(v => <option key={v.id} value={v.id}>{v.name} — {v.city}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Дата и время *</label>
                  <input type="datetime-local" value={form.start_date} onChange={e => f('start_date', e.target.value)} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Мин. цена ₸ *</label>
                  <input type="number" value={form.min_price} onChange={e => f('min_price', e.target.value)} className="input-field" placeholder="5000" required />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Макс. цена ₸</label>
                  <input type="number" value={form.max_price} onChange={e => f('max_price', e.target.value)} className="input-field" placeholder="50000" />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Длительность (мин)</label>
                  <input type="number" value={form.duration} onChange={e => f('duration', e.target.value)} className="input-field" placeholder="120" />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Краткое описание</label>
                <input value={form.short_desc} onChange={e => f('short_desc', e.target.value)}
                  className="input-field" placeholder="Одна строка для карточки события" />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Полное описание *</label>
                <textarea value={form.description} onChange={e => f('description', e.target.value)}
                  className="input-field h-28 resize-none" placeholder="Подробное описание мероприятия..." required />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Теги (через запятую)</label>
                <input value={form.tags} onChange={e => f('tags', e.target.value)}
                  className="input-field" placeholder="концерт, рок, алматы" />
              </div>
            </div>
          )}

          {/* ── MEDIA TAB ── */}
          {tab === 'media' && (
            <div className="space-y-5">
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">URL постера (обложка карточки)</label>
                <input value={form.poster} onChange={e => f('poster', e.target.value)}
                  className="input-field" placeholder="https://images.unsplash.com/..." />
                {form.poster && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 relative">
                    <img src={form.poster} alt="poster preview" className="w-full h-40 object-cover rounded-xl" />
                    <button type="button" onClick={() => f('poster', '')}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors">
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </motion.div>
                )}
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1.5 block">URL баннера (фон страницы события)</label>
                <input value={form.banner} onChange={e => f('banner', e.target.value)}
                  className="input-field" placeholder="https://images.unsplash.com/..." />
                {form.banner && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 relative">
                    <img src={form.banner} alt="banner preview" className="w-full h-32 object-cover rounded-xl" />
                    <button type="button" onClick={() => f('banner', '')}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors">
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="glass rounded-xl p-4 border border-white/10">
                <p className="text-xs text-white/40 mb-2">💡 Совет: используйте Unsplash для бесплатных фото</p>
                <p className="text-xs text-white/30">Формат: https://images.unsplash.com/photo-ID?w=600&q=80</p>
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === 'settings' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Статус публикации</label>
                  <select value={form.status} onChange={e => f('status', e.target.value)} className="input-field">
                    <option value="DRAFT">📝 Черновик</option>
                    <option value="PUBLISHED">✅ Опубликовано</option>
                    <option value="CANCELLED">❌ Отменено</option>
                    <option value="COMPLETED">🏁 Завершено</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Возрастное ограничение</label>
                  <select value={form.age_limit} onChange={e => f('age_limit', e.target.value)} className="input-field">
                    <option value="">Без ограничений</option>
                    <option value="6">6+</option>
                    <option value="12">12+</option>
                    <option value="16">16+</option>
                    <option value="18">18+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-white/60 font-semibold">Метки</p>
                <label className="flex items-center gap-3 p-4 glass rounded-xl border border-white/10 cursor-pointer hover:border-brand-400/40 transition-all">
                  <input type="checkbox" checked={form.is_featured} onChange={e => f('is_featured', e.target.checked)}
                    className="w-5 h-5 accent-brand-500 rounded" />
                  <div>
                    <p className="font-semibold flex items-center gap-2"><Star className="w-4 h-4 text-brand-400" /> Топ событие</p>
                    <p className="text-xs text-white/40">Показывается в разделе «Рекомендуем»</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 glass rounded-xl border border-white/10 cursor-pointer hover:border-red-400/40 transition-all">
                  <input type="checkbox" checked={form.is_hot} onChange={e => f('is_hot', e.target.checked)}
                    className="w-5 h-5 accent-red-500 rounded" />
                  <div>
                    <p className="font-semibold flex items-center gap-2"><Flame className="w-4 h-4 text-red-400" /> Горячий билет</p>
                    <p className="text-xs text-white/40">Показывается в разделе «Раскупают прямо сейчас»</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-white/10">
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
              {saving
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>{editEvent ? '💾 Сохранить изменения' : '✅ Создать мероприятие'}</>
              }
            </motion.button>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary px-6">
              Отмена
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
