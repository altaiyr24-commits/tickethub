require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setup() {
  console.log('🚀 Setting up TicketHub database...\n');

  // ── Categories ──────────────────────────────────────────────────────────────
  console.log('📁 Creating categories...');
  const { error: catErr } = await supabase.from('categories').upsert([
    { name: 'Концерты',  slug: 'concerts',   icon: '🎵', color: '#8B5CF6' },
    { name: 'Театр',     slug: 'theatre',    icon: '🎭', color: '#EC4899' },
    { name: 'Спорт',     slug: 'sport',      icon: '⚽', color: '#10B981' },
    { name: 'Стендап',   slug: 'standup',    icon: '🎤', color: '#F59E0B' },
    { name: 'Выставки',  slug: 'exhibition', icon: '🖼️', color: '#06B6D4' },
    { name: 'Кино',      slug: 'cinema',     icon: '🎬', color: '#EF4444' },
  ], { onConflict: 'slug' });
  if (catErr) { console.error('❌ Categories:', catErr.message); return; }
  console.log('✅ Categories created');

  // ── Venues ──────────────────────────────────────────────────────────────────
  console.log('🏟️  Creating venues...');
  // Delete existing and re-insert
  await supabase.from('venues').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: venErr } = await supabase.from('venues').insert([
    { name: 'Алматы Арена',                 address: 'пр. Абая 44',        city: 'Алматы', capacity: 12000 },
    { name: 'Государственный театр оперы',  address: 'пл. Республики 1',   city: 'Алматы', capacity: 800   },
    { name: 'Астана Арена',                 address: 'пр. Туран 57',        city: 'Астана', capacity: 30000 },
    { name: 'Конгресс-холл',                address: 'пр. Достык 12',       city: 'Алматы', capacity: 1200  },
    { name: 'Балуан Шолак',                 address: 'ул. Сейфуллина 187',  city: 'Алматы', capacity: 5000  },
    { name: 'EXPO Астана',                  address: 'пр. Мангилик Ел 55',  city: 'Астана', capacity: 500   },
    { name: 'IMAX Мега',                    address: 'пр. Розыбакиева 247', city: 'Алматы', capacity: 220   },
    { name: 'Chaplin Cinemas',              address: 'пр. Туран 24',        city: 'Астана', capacity: 200   },
  ]);
  if (venErr) { console.error('❌ Venues:', venErr.message); return; }
  console.log('✅ Venues created');

  // ── Fetch IDs ────────────────────────────────────────────────────────────────
  const { data: cats }   = await supabase.from('categories').select('id,slug');
  const { data: venues } = await supabase.from('venues').select('id,name');

  const catMap   = Object.fromEntries(cats.map(c => [c.slug, c.id]));
  const venueMap = Object.fromEntries(venues.map(v => [v.name, v.id]));

  // ── Events ──────────────────────────────────────────────────────────────────
  console.log('🎭 Creating events...');
  const events = [
    {
      title: 'Dimash Qudaibergen — World Tour 2025', slug: 'dimash-world-tour-2025',
      description: 'Димаш Кудайберген возвращается на родину с масштабным мировым туром. Уникальный голос, потрясающее шоу и незабываемые эмоции.',
      short_desc: 'Грандиозное шоу мирового масштаба в Алматы',
      poster: 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=1200&q=80',
      category_id: catMap['concerts'], venue_id: venueMap['Алматы Арена'],
      start_date: '2025-07-15T19:00:00+06:00', min_price: 15000, max_price: 150000,
      status: 'PUBLISHED', is_featured: true, is_hot: true, total_seats: 12000, sold_seats: 9800,
      tags: ['концерт','димаш'], venue_type: 'stadium',
    },
    {
      title: 'Иммерсивный спектакль «Великий Гэтсби»', slug: 'gatsby-immersive-2025',
      description: 'Уникальный иммерсивный спектакль, где зрители становятся участниками событий. Роскошные декорации, живая музыка.',
      short_desc: 'Погрузись в эпоху джаза и роскоши 1920-х',
      poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&q=80',
      category_id: catMap['theatre'], venue_id: venueMap['Государственный театр оперы'],
      start_date: '2025-06-20T18:30:00+06:00', min_price: 8000, max_price: 45000,
      status: 'PUBLISHED', is_featured: true, is_hot: false, total_seats: 800, sold_seats: 620,
      tags: ['театр','иммерсив'], venue_type: 'theatre',
    },
    {
      title: 'FC Astana vs Manchester City — UEFA', slug: 'astana-mancity-uefa-2025',
      description: 'Грандиозный футбольный матч группового этапа UEFA Champions League. ФК Астана принимает Manchester City.',
      short_desc: 'Исторический матч на Астана Арена',
      poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
      category_id: catMap['sport'], venue_id: venueMap['Астана Арена'],
      start_date: '2025-09-17T20:00:00+06:00', min_price: 5000, max_price: 80000,
      status: 'PUBLISHED', is_featured: true, is_hot: true, total_seats: 30000, sold_seats: 25000,
      tags: ['футбол','UEFA'], venue_type: 'football',
    },
    {
      title: 'Нурлан Сабуров — Stand Up «Честно»', slug: 'saburov-standup-2025',
      description: 'Нурлан Сабуров представляет новую сольную программу «Честно». Два часа искреннего юмора.',
      short_desc: 'Новая программа самого популярного стендапера',
      poster: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&q=80',
      category_id: catMap['standup'], venue_id: venueMap['Конгресс-холл'],
      start_date: '2025-06-28T20:00:00+06:00', min_price: 6000, max_price: 25000,
      status: 'PUBLISHED', is_featured: false, is_hot: true, total_seats: 1200, sold_seats: 1100,
      tags: ['стендап','сабуров'], venue_type: 'concert',
    },
    {
      title: 'Imagine Dragons — Live in Almaty', slug: 'imagine-dragons-almaty-2025',
      description: 'Imagine Dragons впервые выступят в Казахстане! Хиты Believer, Thunder, Enemy в живом исполнении.',
      short_desc: 'Легендарная рок-группа впервые в Казахстане',
      poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
      category_id: catMap['concerts'], venue_id: venueMap['Алматы Арена'],
      start_date: '2025-08-10T20:00:00+06:00', min_price: 20000, max_price: 200000,
      status: 'PUBLISHED', is_featured: true, is_hot: true, total_seats: 12000, sold_seats: 7500,
      tags: ['рок','imagine dragons'], venue_type: 'stadium',
    },
    {
      title: 'Балет «Лебединое озеро» — Гала-вечер', slug: 'swan-lake-gala-2025',
      description: 'Государственный академический театр оперы и балета представляет грандиозный гала-вечер.',
      short_desc: 'Классика мирового балета на сцене оперного театра',
      poster: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1200&q=80',
      category_id: catMap['theatre'], venue_id: venueMap['Государственный театр оперы'],
      start_date: '2025-07-05T19:00:00+06:00', min_price: 10000, max_price: 60000,
      status: 'PUBLISHED', is_featured: false, is_hot: false, total_seats: 800, sold_seats: 400,
      tags: ['балет','классика'], venue_type: 'theatre',
    },
    {
      title: 'UFC Fight Night — Алматы 2025', slug: 'ufc-almaty-2025',
      description: 'UFC Fight Night впервые проходит в Центральной Азии! Главный бой вечера — казахстанский боец против чемпиона мира.',
      short_desc: 'Бои UFC впервые в Центральной Азии',
      poster: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200&q=80',
      category_id: catMap['sport'], venue_id: venueMap['Балуан Шолак'],
      start_date: '2025-10-04T18:00:00+06:00', min_price: 12000, max_price: 100000,
      status: 'PUBLISHED', is_featured: false, is_hot: true, total_seats: 5000, sold_seats: 3200,
      tags: ['UFC','бокс'], venue_type: 'arena',
    },
    {
      title: 'Выставка «Цифровое искусство будущего»', slug: 'digital-art-expo-2025',
      description: 'Уникальная интерактивная выставка, объединяющая технологии и искусство. Более 200 работ от художников со всего мира.',
      short_desc: 'Интерактивная выставка NFT и digital art',
      poster: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      category_id: catMap['exhibition'], venue_id: venueMap['EXPO Астана'],
      start_date: '2025-06-15T10:00:00+06:00', min_price: 3000, max_price: 15000,
      status: 'PUBLISHED', is_featured: false, is_hot: false, total_seats: 500, sold_seats: 180,
      tags: ['выставка','digital art'], venue_type: 'concert',
    },
    // ── CINEMA ──
    {
      title: 'Интерстеллар — IMAX Премьера', slug: 'interstellar-imax-2025',
      description: 'Специальный показ культового фильма Кристофера Нолана «Интерстеллар» в формате IMAX. Потрясающий звук Dolby Atmos и экран 26 метров создадут эффект полного погружения в космос.',
      short_desc: 'Легендарный фильм Нолана на огромном IMAX экране',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
      category_id: catMap['cinema'], venue_id: venueMap['IMAX Мега'],
      start_date: '2025-07-20T20:00:00+06:00', min_price: 4000, max_price: 12000,
      status: 'PUBLISHED', is_featured: false, is_hot: true, total_seats: 200, sold_seats: 120,
      tags: ['кино','IMAX','нолан'], venue_type: 'cinema',
    },
    {
      title: 'Дюна: Часть Третья — Премьера', slug: 'dune-part-three-2025',
      description: 'Мировая премьера заключительной части эпической саги Дени Вильнёва. Пол Атрейдес ведёт фрименов к финальной битве за Арракис. Dolby Vision + Dolby Atmos.',
      short_desc: 'Эпическое завершение трилогии Вильнёва',
      poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&q=80',
      category_id: catMap['cinema'], venue_id: venueMap['IMAX Мега'],
      start_date: '2025-08-01T19:30:00+06:00', min_price: 3500, max_price: 10000,
      status: 'PUBLISHED', is_featured: true, is_hot: true, total_seats: 180, sold_seats: 90,
      tags: ['кино','фантастика','дюна'], venue_type: 'cinema',
    },
    {
      title: 'Аватар 3 — Огонь и Пепел', slug: 'avatar-3-fire-ash-2025',
      description: 'Джеймс Кэмерон возвращается с третьей частью «Аватара». Племя Пепла — огненный народ Пандоры — открывает новые миры. 3D IMAX, 48 кадров в секунду.',
      short_desc: 'Новая глава вселенной Пандоры от Джеймса Кэмерона',
      poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80',
      category_id: catMap['cinema'], venue_id: venueMap['Chaplin Cinemas'],
      start_date: '2025-09-05T20:00:00+06:00', min_price: 4500, max_price: 14000,
      status: 'PUBLISHED', is_featured: true, is_hot: false, total_seats: 220, sold_seats: 60,
      tags: ['кино','3D','аватар'], venue_type: 'cinema',
    },
    {
      title: 'Джокер 2: Безумие на двоих', slug: 'joker-2-folie-a-deux-2025',
      description: 'Продолжение оскароносного «Джокера». Артур Флек встречает Харли Квинн в психиатрической больнице Аркхэм. Музыкальный психологический триллер от Тодда Филлипса.',
      short_desc: 'Хоакин Феникс и Леди Гага в мюзикальном триллере',
      poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80',
      category_id: catMap['cinema'], venue_id: venueMap['IMAX Мега'],
      start_date: '2025-07-25T21:00:00+06:00', min_price: 3000, max_price: 9000,
      status: 'PUBLISHED', is_featured: false, is_hot: true, total_seats: 160, sold_seats: 140,
      tags: ['кино','триллер','джокер'], venue_type: 'cinema',
    },
    {
      title: 'Миссия невыполнима 8 — Финал', slug: 'mission-impossible-8-2025',
      description: 'Финальная глава легендарной франшизы. Итан Хант против самого опасного врага — искусственного интеллекта «Сущность». Невероятные трюки, снятые без CGI.',
      short_desc: 'Том Круз в последней миссии Итана Ханта',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
      category_id: catMap['cinema'], venue_id: venueMap['Chaplin Cinemas'],
      start_date: '2025-08-20T19:00:00+06:00', min_price: 3500, max_price: 11000,
      status: 'PUBLISHED', is_featured: false, is_hot: false, total_seats: 200, sold_seats: 45,
      tags: ['кино','боевик','том круз'], venue_type: 'cinema',
    },
  ];

  await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: evErr } = await supabase.from('events').insert(events);
  if (evErr) { console.error('❌ Events:', evErr.message); return; }
  console.log('✅ Events created');

  // ── Admin user ───────────────────────────────────────────────────────────────
  console.log('👤 Creating users...');
  const adminPass = await bcrypt.hash('admin123', 12);
  const userPass  = await bcrypt.hash('user123',  12);

  await supabase.from('users').delete().in('email', ['admin@tickethub.kz', 'user@tickethub.kz']);
  const { error: usrErr } = await supabase.from('users').insert([
    { email: 'admin@tickethub.kz', password: adminPass, name: 'Admin',     role: 'ADMIN', is_verified: true },
    { email: 'user@tickethub.kz',  password: userPass,  name: 'Test User', role: 'USER',  is_verified: true },
  ]);
  if (usrErr) { console.error('❌ Users:', usrErr.message); return; }
  console.log('✅ Users created');

  console.log('\n🎉 Database setup complete!');
  console.log('   Admin: admin@tickethub.kz / admin123');
  console.log('   User:  user@tickethub.kz  / user123');
}

setup().catch(console.error);
