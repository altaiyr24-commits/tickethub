// Mock events data for demo (used when API is unavailable)
export const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Dimash Qudaibergen — World Tour 2025',
    slug: 'dimash-world-tour-2025',
    shortDesc: 'Грандиозное шоу мирового масштаба в Алматы',
    description: 'Димаш Кудайберген возвращается на родину с масштабным мировым туром. Уникальный голос, потрясающее шоу и незабываемые эмоции. Концерт пройдёт на стадионе Алматы Арена с использованием новейших технологий звука и света.',
    poster: 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=1200&q=80',
    category: { id: '1', name: 'Концерты', slug: 'concerts', icon: '🎵', color: '#8B5CF6' },
    venue: { id: '1', name: 'Алматы Арена', city: 'Алматы' },
    startDate: '2025-07-15T19:00:00',
    minPrice: 15000,
    maxPrice: 150000,
    status: 'PUBLISHED',
    isFeatured: true,
    isHot: true,
    totalSeats: 12000,
    soldSeats: 9800,
    tags: ['концерт', 'димаш', 'мировой тур'],
    venueType: 'stadium',
  },
  {
    id: '2',
    title: 'Иммерсивный спектакль «Великий Гэтсби»',
    slug: 'gatsby-immersive-2025',
    shortDesc: 'Погрузись в эпоху джаза и роскоши 1920-х',
    description: 'Уникальный иммерсивный спектакль, где зрители становятся участниками событий. Роскошные декорации, живая музыка и профессиональные актёры создадут атмосферу настоящей вечеринки Гэтсби.',
    poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&q=80',
    category: { id: '2', name: 'Театр', slug: 'theatre', icon: '🎭', color: '#EC4899' },
    venue: { id: '2', name: 'Государственный театр оперы', city: 'Алматы' },
    startDate: '2025-06-20T18:30:00',
    minPrice: 8000,
    maxPrice: 45000,
    status: 'PUBLISHED',
    isFeatured: true,
    isHot: false,
    totalSeats: 800,
    soldSeats: 620,
    tags: ['театр', 'иммерсив', 'гэтсби'],
    venueType: 'theatre',
  },
  {
    id: '3',
    title: 'FC Astana vs Manchester City — UEFA',
    slug: 'astana-mancity-uefa-2025',
    shortDesc: 'Исторический матч на Астана Арена',
    description: 'Грандиозный футбольный матч группового этапа UEFA Champions League. ФК Астана принимает Manchester City на домашнем стадионе. Не пропусти историческое событие казахстанского футбола!',
    poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
    category: { id: '3', name: 'Спорт', slug: 'sport', icon: '⚽', color: '#10B981' },
    venue: { id: '3', name: 'Астана Арена', city: 'Астана' },
    startDate: '2025-09-17T20:00:00',
    minPrice: 5000,
    maxPrice: 80000,
    status: 'PUBLISHED',
    isFeatured: true,
    isHot: true,
    totalSeats: 30000,
    soldSeats: 25000,
    tags: ['футбол', 'UEFA', 'астана'],
    venueType: 'football',
  },
  {
    id: '4',
    title: 'Нурлан Сабуров — Stand Up «Честно»',
    slug: 'saburov-standup-2025',
    shortDesc: 'Новая программа самого популярного стендапера',
    description: 'Нурлан Сабуров представляет новую сольную программу «Честно». Два часа искреннего юмора о жизни, отношениях и современном Казахстане. Только живые эмоции и настоящий смех!',
    poster: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&q=80',
    category: { id: '4', name: 'Стендап', slug: 'standup', icon: '🎤', color: '#F59E0B' },
    venue: { id: '4', name: 'Конгресс-холл', city: 'Алматы' },
    startDate: '2025-06-28T20:00:00',
    minPrice: 6000,
    maxPrice: 25000,
    status: 'PUBLISHED',
    isFeatured: false,
    isHot: true,
    totalSeats: 1200,
    soldSeats: 1100,
    tags: ['стендап', 'сабуров', 'юмор'],
    venueType: 'concert',
  },
  {
    id: '5',
    title: 'Imagine Dragons — Live in Almaty',
    slug: 'imagine-dragons-almaty-2025',
    shortDesc: 'Легендарная рок-группа впервые в Казахстане',
    description: 'Imagine Dragons впервые выступят в Казахстане! Хиты Believer, Thunder, Enemy и другие в живом исполнении. Грандиозное шоу с потрясающими спецэффектами на открытом стадионе.',
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
    category: { id: '1', name: 'Концерты', slug: 'concerts', icon: '🎵', color: '#8B5CF6' },
    venue: { id: '1', name: 'Алматы Арена', city: 'Алматы' },
    startDate: '2025-08-10T20:00:00',
    minPrice: 20000,
    maxPrice: 200000,
    status: 'PUBLISHED',
    isFeatured: true,
    isHot: true,
    totalSeats: 12000,
    soldSeats: 7500,
    tags: ['рок', 'imagine dragons', 'концерт'],
    venueType: 'stadium',
  },
  {
    id: '6',
    title: 'Балет «Лебединое озеро» — Гала-вечер',
    slug: 'swan-lake-gala-2025',
    shortDesc: 'Классика мирового балета на сцене оперного театра',
    description: 'Государственный академический театр оперы и балета представляет грандиозный гала-вечер. Лучшие сцены из «Лебединого озера» Чайковского в исполнении звёзд мирового балета.',
    poster: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1200&q=80',
    category: { id: '2', name: 'Театр', slug: 'theatre', icon: '🎭', color: '#EC4899' },
    venue: { id: '2', name: 'Государственный театр оперы', city: 'Алматы' },
    startDate: '2025-07-05T19:00:00',
    minPrice: 10000,
    maxPrice: 60000,
    status: 'PUBLISHED',
    isFeatured: false,
    isHot: false,
    totalSeats: 800,
    soldSeats: 400,
    tags: ['балет', 'классика', 'чайковский'],
    venueType: 'theatre',
  },
  {
    id: '7',
    title: 'UFC Fight Night — Алматы 2025',
    slug: 'ufc-almaty-2025',
    shortDesc: 'Бои UFC впервые в Центральной Азии',
    description: 'UFC Fight Night впервые проходит в Центральной Азии! Главный бой вечера — казахстанский боец против чемпиона мира. Незабываемое зрелище для всех любителей единоборств.',
    poster: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200&q=80',
    category: { id: '3', name: 'Спорт', slug: 'sport', icon: '⚽', color: '#10B981' },
    venue: { id: '5', name: 'Балуан Шолак', city: 'Алматы' },
    startDate: '2025-10-04T18:00:00',
    minPrice: 12000,
    maxPrice: 100000,
    status: 'PUBLISHED',
    isFeatured: false,
    isHot: true,
    totalSeats: 5000,
    soldSeats: 3200,
    tags: ['UFC', 'бокс', 'единоборства'],
    venueType: 'arena',
  },
  {
    id: '8',
    title: 'Выставка «Цифровое искусство будущего»',
    slug: 'digital-art-expo-2025',
    shortDesc: 'Интерактивная выставка NFT и digital art',
    description: 'Уникальная интерактивная выставка, объединяющая технологии и искусство. Более 200 работ от художников со всего мира, VR-инсталляции и живые перформансы.',
    poster: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    category: { id: '5', name: 'Выставки', slug: 'exhibition', icon: '🖼️', color: '#06B6D4' },
    venue: { id: '6', name: 'EXPO Астана', city: 'Астана' },
    startDate: '2025-06-15T10:00:00',
    minPrice: 3000,
    maxPrice: 15000,
    status: 'PUBLISHED',
    isFeatured: false,
    isHot: false,
    totalSeats: 500,
    soldSeats: 180,
    tags: ['выставка', 'digital art', 'NFT'],
    venueType: 'concert',
  },
  {
    id: '9',
    title: 'Интерстеллар — IMAX Премьера',
    slug: 'interstellar-imax-2025',
    shortDesc: 'Легендарный фильм Нолана на огромном IMAX экране',
    description: 'Специальный показ культового фильма Кристофера Нолана «Интерстеллар» в формате IMAX. Потрясающий звук Dolby Atmos и экран 26 метров создадут эффект полного погружения.',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
    category: { id: '6', name: 'Кино', slug: 'cinema', icon: '🎬', color: '#EF4444' },
    venue: { id: '7', name: 'IMAX Мега', city: 'Алматы' },
    startDate: '2025-07-20T20:00:00',
    minPrice: 4000,
    maxPrice: 12000,
    status: 'PUBLISHED',
    isFeatured: false,
    isHot: true,
    totalSeats: 200,
    soldSeats: 120,
    tags: ['кино', 'IMAX', 'нолан'],
    venueType: 'cinema',
  },
  {
    id: '10',
    title: 'Дюна: Часть Третья — Премьера',
    slug: 'dune-part-three-2025',
    shortDesc: 'Эпическое завершение трилогии Вильнёва',
    description: 'Мировая премьера заключительной части эпической саги Дени Вильнёва. Пол Атрейдес ведёт фрименов к финальной битве за Арракис. Dolby Vision + Dolby Atmos.',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&q=80',
    category: { id: '6', name: 'Кино', slug: 'cinema', icon: '🎬', color: '#EF4444' },
    venue: { id: '7', name: 'IMAX Мега', city: 'Алматы' },
    startDate: '2025-08-01T19:30:00',
    minPrice: 3500,
    maxPrice: 10000,
    status: 'PUBLISHED',
    isFeatured: true,
    isHot: true,
    totalSeats: 180,
    soldSeats: 90,
    tags: ['кино', 'фантастика', 'дюна'],
    venueType: 'cinema',
  },
  {
    id: '11',
    title: 'Аватар 3 — Огонь и Пепел',
    slug: 'avatar-3-fire-ash-2025',
    shortDesc: 'Новая глава вселенной Пандоры от Джеймса Кэмерона',
    description: 'Джеймс Кэмерон возвращается с третьей частью «Аватара». Племя Пепла — огненный народ Пандоры — открывает новые миры. 3D IMAX, 48 кадров в секунду.',
    poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80',
    category: { id: '6', name: 'Кино', slug: 'cinema', icon: '🎬', color: '#EF4444' },
    venue: { id: '8', name: 'Chaplin Cinemas', city: 'Астана' },
    startDate: '2025-09-05T20:00:00',
    minPrice: 4500,
    maxPrice: 14000,
    status: 'PUBLISHED',
    isFeatured: true,
    isHot: false,
    totalSeats: 220,
    soldSeats: 60,
    tags: ['кино', '3D', 'аватар', 'кэмерон'],
    venueType: 'cinema',
  },
  {
    id: '12',
    title: 'Джокер 2: Безумие на двоих',
    slug: 'joker-2-folie-a-deux-2025',
    shortDesc: 'Хоакин Феникс и Леди Гага в мюзикальном триллере',
    description: 'Продолжение оскароносного «Джокера». Артур Флек встречает Харли Квинн в психиатрической больнице Аркхэм. Музыкальный психологический триллер от Тодда Филлипса.',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80',
    category: { id: '6', name: 'Кино', slug: 'cinema', icon: '🎬', color: '#EF4444' },
    venue: { id: '7', name: 'IMAX Мега', city: 'Алматы' },
    startDate: '2025-07-25T21:00:00',
    minPrice: 3000,
    maxPrice: 9000,
    status: 'PUBLISHED',
    isFeatured: false,
    isHot: true,
    totalSeats: 160,
    soldSeats: 140,
    tags: ['кино', 'триллер', 'джокер'],
    venueType: 'cinema',
  },
  {
    id: '13',
    title: 'Миссия невыполнима 8 — Финал',
    slug: 'mission-impossible-8-2025',
    shortDesc: 'Том Круз в последней миссии Итана Ханта',
    description: 'Финальная глава легендарной франшизы. Итан Хант против самого опасного врага — искусственного интеллекта «Сущность». Невероятные трюки, снятые без CGI.',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
    category: { id: '6', name: 'Кино', slug: 'cinema', icon: '🎬', color: '#EF4444' },
    venue: { id: '8', name: 'Chaplin Cinemas', city: 'Астана' },
    startDate: '2025-08-20T19:00:00',
    minPrice: 3500,
    maxPrice: 11000,
    status: 'PUBLISHED',
    isFeatured: false,
    isHot: false,
    totalSeats: 200,
    soldSeats: 45,
    tags: ['кино', 'боевик', 'том круз'],
    venueType: 'cinema',
  },
];

export const MOCK_CATEGORIES = [
  { id: '1', name: 'Концерты', slug: 'concerts', icon: '🎵', color: '#8B5CF6', _count: { events: 24 } },
  { id: '2', name: 'Театр', slug: 'theatre', icon: '🎭', color: '#EC4899', _count: { events: 12 } },
  { id: '3', name: 'Спорт', slug: 'sport', icon: '⚽', color: '#10B981', _count: { events: 18 } },
  { id: '4', name: 'Стендап', slug: 'standup', icon: '🎤', color: '#F59E0B', _count: { events: 8 } },
  { id: '5', name: 'Выставки', slug: 'exhibition', icon: '🖼️', color: '#06B6D4', _count: { events: 6 } },
  { id: '6', name: 'Кино', slug: 'cinema', icon: '🎬', color: '#EF4444', _count: { events: 30 } },
];

export const generateSeats = (venueType, eventId) => {
  const seats = [];

  if (venueType === 'theatre') {
    const rows = 'ABCDEFGHIJKLMNOP'.split('');
    rows.forEach((row, ri) => {
      const count = ri < 4 ? 16 : ri < 10 ? 20 : 18;
      const seatType = ri < 3 ? 'VIP' : ri < 8 ? 'PREMIUM' : 'STANDARD';
      const price = seatType === 'VIP' ? 45000 : seatType === 'PREMIUM' ? 25000 : 10000;
      for (let s = 1; s <= count; s++) {
        const pool = ['AVAILABLE','AVAILABLE','AVAILABLE','SOLD','AVAILABLE','RESERVED'];
        seats.push({ id: `${eventId}-${row}-${s}`, row, number: s, label: `${row}${s}`, seatType, status: pool[Math.floor(Math.random()*pool.length)], price, eventId });
      }
    });

  } else if (venueType === 'cinema') {
    // Cinema: rows A-L, curved, 16-22 seats
    const rows = 'ABCDEFGHIJKL'.split('');
    rows.forEach((row, ri) => {
      const count = ri < 2 ? 16 : ri < 8 ? 20 : 18;
      const seatType = ri < 2 ? 'VIP' : ri < 6 ? 'PREMIUM' : 'STANDARD';
      const price = seatType === 'VIP' ? 12000 : seatType === 'PREMIUM' ? 8000 : 4000;
      for (let s = 1; s <= count; s++) {
        const pool = ['AVAILABLE','AVAILABLE','AVAILABLE','SOLD','AVAILABLE'];
        seats.push({ id: `${eventId}-${row}-${s}`, row, number: s, label: `${row}${s}`, seatType, status: pool[Math.floor(Math.random()*pool.length)], price, eventId });
      }
    });

  } else if (venueType === 'stadium' || venueType === 'football' || venueType === 'arena') {
    const sections = ['A','B','C','D','E','F','G','H'];
    sections.forEach(section => {
      for (let row = 1; row <= 15; row++) {
        for (let seat = 1; seat <= 20; seat++) {
          const seatType = row <= 3 ? 'VIP' : row <= 8 ? 'PREMIUM' : 'STANDARD';
          const price = seatType === 'VIP' ? 80000 : seatType === 'PREMIUM' ? 40000 : 15000;
          const pool = ['AVAILABLE','AVAILABLE','SOLD','AVAILABLE','AVAILABLE','RESERVED','AVAILABLE'];
          seats.push({ id: `${eventId}-${section}${row}-${seat}`, row: `${section}${row}`, number: seat, label: `${section}${row}-${seat}`, seatType, status: pool[Math.floor(Math.random()*pool.length)], price, eventId, section });
        }
      }
    });

  } else {
    // Concert / default
    for (let row = 1; row <= 20; row++) {
      const rowLabel = String.fromCharCode(64 + row);
      const count = row <= 5 ? 20 : row <= 12 ? 28 : 24;
      const seatType = row <= 3 ? 'VIP' : row <= 8 ? 'PREMIUM' : 'STANDARD';
      const price = seatType === 'VIP' ? 25000 : seatType === 'PREMIUM' ? 15000 : 6000;
      for (let s = 1; s <= count; s++) {
        const pool = ['AVAILABLE','AVAILABLE','AVAILABLE','SOLD','AVAILABLE'];
        seats.push({ id: `${eventId}-${rowLabel}-${s}`, row: rowLabel, number: s, label: `${rowLabel}${s}`, seatType, status: pool[Math.floor(Math.random()*pool.length)], price, eventId });
      }
    }
  }
  return seats;
};
