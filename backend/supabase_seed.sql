-- TicketHub Seed Data
-- Запускай в Supabase Dashboard → SQL Editor
-- Можно запускать повторно — данные не задублируются

-- ─── ОЧИСТКА (безопасная) ─────────────────────────────────────────────────────
TRUNCATE TABLE reviews, favorites, order_items, orders, seats, ticket_types, events, halls, venues, categories RESTART IDENTITY CASCADE;
DELETE FROM users WHERE email IN ('admin@tickethub.kz', 'user@tickethub.kz');

-- ─── CATEGORIES ───────────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, icon, color) VALUES
  ('Концерты',  'concerts',   '🎵', '#8B5CF6'),
  ('Театр',     'theatre',    '🎭', '#EC4899'),
  ('Спорт',     'sport',      '⚽', '#10B981'),
  ('Стендап',   'standup',    '🎤', '#F59E0B'),
  ('Выставки',  'exhibition', '🖼️', '#06B6D4'),
  ('Кино',      'cinema',     '🎬', '#EF4444');

-- ─── VENUES ───────────────────────────────────────────────────────────────────
INSERT INTO venues (name, address, city, capacity) VALUES
  ('Алматы Арена',                'пр. Абая 44',          'Алматы', 12000),
  ('Государственный театр оперы', 'пл. Республики 1',     'Алматы', 800),
  ('Астана Арена',                'пр. Туран 57',         'Астана', 30000),
  ('Конгресс-холл',               'пр. Достык 12',        'Алматы', 1200),
  ('Балуан Шолак',                'ул. Сейфуллина 187',   'Алматы', 5000),
  ('EXPO Астана',                 'пр. Мангилик Ел 55',   'Астана', 500),
  ('Дворец Республики',           'пр. Достык 1',         'Алматы', 3000),
  ('Кинотеатр Арман',             'пр. Достык 111',       'Алматы', 400),
  ('Мега Алматы',                 'пр. Розыбакиева 247',  'Алматы', 2000);

-- ─── EVENTS ───────────────────────────────────────────────────────────────────

INSERT INTO events (title, slug, description, short_desc, poster, banner, category_id, venue_id, start_date, min_price, max_price, status, is_featured, is_hot, total_seats, sold_seats, tags, venue_type) VALUES

-- 1
('Dimash Qudaibergen — World Tour 2025', 'dimash-world-tour-2025',
 'Димаш Кудайберген возвращается на родину с масштабным мировым туром. Уникальный голос, потрясающее шоу и незабываемые эмоции. Концерт пройдёт на стадионе Алматы Арена с использованием новейших технологий звука и света.',
 'Грандиозное шоу мирового масштаба в Алматы',
 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=600&q=80',
 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='concerts'),
 (SELECT id FROM venues WHERE name='Алматы Арена'),
 '2025-07-15 19:00:00+06', 15000, 150000, 'PUBLISHED', TRUE, TRUE, 12000, 9800,
 ARRAY['концерт','димаш','мировой тур'], 'stadium'),

-- 2
('Иммерсивный спектакль «Великий Гэтсби»', 'gatsby-immersive-2025',
 'Уникальный иммерсивный спектакль, где зрители становятся участниками событий. Роскошные декорации, живая музыка и профессиональные актёры создадут атмосферу настоящей вечеринки Гэтсби.',
 'Погрузись в эпоху джаза и роскоши 1920-х',
 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80',
 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='theatre'),
 (SELECT id FROM venues WHERE name='Государственный театр оперы'),
 '2025-06-20 18:30:00+06', 8000, 45000, 'PUBLISHED', TRUE, FALSE, 800, 620,
 ARRAY['театр','иммерсив','гэтсби'], 'theatre'),

-- 3
('FC Astana vs Manchester City — UEFA', 'astana-mancity-uefa-2025',
 'Грандиозный футбольный матч группового этапа UEFA Champions League. ФК Астана принимает Manchester City на домашнем стадионе.',
 'Исторический матч на Астана Арена',
 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='sport'),
 (SELECT id FROM venues WHERE name='Астана Арена'),
 '2025-09-17 20:00:00+06', 5000, 80000, 'PUBLISHED', TRUE, TRUE, 30000, 25000,
 ARRAY['футбол','UEFA','астана'], 'football'),

-- 4
('Нурлан Сабуров — Stand Up «Честно»', 'saburov-standup-2025',
 'Нурлан Сабуров представляет новую сольную программу «Честно». Два часа искреннего юмора о жизни, отношениях и современном Казахстане.',
 'Новая программа самого популярного стендапера',
 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&q=80',
 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='standup'),
 (SELECT id FROM venues WHERE name='Конгресс-холл'),
 '2025-06-28 20:00:00+06', 6000, 25000, 'PUBLISHED', FALSE, TRUE, 1200, 1100,
 ARRAY['стендап','сабуров','юмор'], 'concert'),

-- 5
('Imagine Dragons — Live in Almaty', 'imagine-dragons-almaty-2025',
 'Imagine Dragons впервые выступят в Казахстане! Хиты Believer, Thunder, Enemy и другие в живом исполнении на Алматы Арена.',
 'Легендарная рок-группа впервые в Казахстане',
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='concerts'),
 (SELECT id FROM venues WHERE name='Алматы Арена'),
 '2025-08-10 20:00:00+06', 20000, 200000, 'PUBLISHED', TRUE, TRUE, 12000, 7500,
 ARRAY['рок','imagine dragons','концерт'], 'stadium');

INSERT INTO events (title, slug, description, short_desc, poster, banner, category_id, venue_id, start_date, min_price, max_price, status, is_featured, is_hot, total_seats, sold_seats, tags, venue_type) VALUES

-- 6
('Балет «Лебединое озеро» — Гала-вечер', 'swan-lake-gala-2025',
 'Государственный академический театр оперы и балета представляет грандиозный гала-вечер. Лучшие сцены из «Лебединого озера» Чайковского.',
 'Классика мирового балета на сцене оперного театра',
 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&q=80',
 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='theatre'),
 (SELECT id FROM venues WHERE name='Государственный театр оперы'),
 '2025-07-05 19:00:00+06', 10000, 60000, 'PUBLISHED', FALSE, FALSE, 800, 400,
 ARRAY['балет','классика','чайковский'], 'theatre'),

-- 7
('UFC Fight Night — Алматы 2025', 'ufc-almaty-2025',
 'UFC Fight Night впервые проходит в Центральной Азии! Главный бой вечера — казахстанский боец против чемпиона мира.',
 'Бои UFC впервые в Центральной Азии',
 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&q=80',
 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='sport'),
 (SELECT id FROM venues WHERE name='Балуан Шолак'),
 '2025-10-04 18:00:00+06', 12000, 100000, 'PUBLISHED', FALSE, TRUE, 5000, 3200,
 ARRAY['UFC','бокс','единоборства'], 'arena'),

-- 8
('Выставка «Цифровое искусство будущего»', 'digital-art-expo-2025',
 'Уникальная интерактивная выставка, объединяющая технологии и искусство. Более 200 работ от художников со всего мира.',
 'Интерактивная выставка NFT и digital art',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='exhibition'),
 (SELECT id FROM venues WHERE name='EXPO Астана'),
 '2025-06-15 10:00:00+06', 3000, 15000, 'PUBLISHED', FALSE, FALSE, 500, 180,
 ARRAY['выставка','digital art','NFT'], 'concert'),

-- 9
('Интерстеллар — IMAX Возвращение', 'interstellar-imax-2025',
 'Культовый фильм Кристофера Нолана возвращается на большой экран в формате IMAX. Незабываемое путешествие сквозь пространство и время.',
 'Нолан на большом экране — снова в кино',
 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80',
 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='cinema'),
 (SELECT id FROM venues WHERE name='Кинотеатр Арман'),
 '2025-07-01 20:00:00+06', 2500, 8000, 'PUBLISHED', TRUE, FALSE, 400, 120,
 ARRAY['кино','нолан','IMAX'], 'cinema'),

-- 10
('Jah Khalib — Большой концерт в Алматы', 'jah-khalib-almaty-2025',
 'Jah Khalib — один из самых популярных исполнителей СНГ. Хиты Медина, Leila, Вавилон и новые треки в живом исполнении.',
 'Хиты Jah Khalib вживую',
 'https://images.unsplash.com/photo-1501386761578-eaa54b4e9f4e?w=600&q=80',
 'https://images.unsplash.com/photo-1501386761578-eaa54b4e9f4e?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='concerts'),
 (SELECT id FROM venues WHERE name='Конгресс-холл'),
 '2025-07-25 21:00:00+06', 10000, 60000, 'PUBLISHED', FALSE, TRUE, 1200, 900,
 ARRAY['концерт','jah khalib','рэп'], 'concert');

INSERT INTO events (title, slug, description, short_desc, poster, banner, category_id, venue_id, start_date, min_price, max_price, status, is_featured, is_hot, total_seats, sold_seats, tags, venue_type) VALUES

-- 11
('Astana Electronic Festival 2025', 'astana-electronic-fest-2025',
 'Крупнейший фестиваль электронной музыки в Центральной Азии. 3 сцены, 20+ диджеев, 2 дня незабываемой музыки.',
 'Крупнейший электронный фестиваль ЦА',
 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='concerts'),
 (SELECT id FROM venues WHERE name='EXPO Астана'),
 '2025-08-22 18:00:00+06', 8000, 50000, 'PUBLISHED', TRUE, TRUE, 500, 350,
 ARRAY['электронная музыка','фестиваль','DJ'], 'concert'),

-- 12
('Гамлет — Современная постановка', 'hamlet-modern-2025',
 'Шекспировский «Гамлет» в современной интерпретации. Режиссёр переносит действие в наши дни, сохраняя глубину оригинала.',
 'Шекспир в современном прочтении',
 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80',
 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='theatre'),
 (SELECT id FROM venues WHERE name='Государственный театр оперы'),
 '2025-08-15 19:00:00+06', 7000, 35000, 'PUBLISHED', FALSE, FALSE, 800, 300,
 ARRAY['театр','шекспир','гамлет'], 'theatre'),

-- 13
('Kazakhstan Open — Теннисный турнир ATP', 'kazakhstan-open-tennis-2025',
 'Международный теннисный турнир серии ATP 250 в Астане. Лучшие игроки мира борются за титул на кортах Казахстана.',
 'Теннисный турнир ATP в Астане',
 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80',
 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='sport'),
 (SELECT id FROM venues WHERE name='EXPO Астана'),
 '2025-09-01 14:00:00+06', 3000, 30000, 'PUBLISHED', FALSE, FALSE, 500, 200,
 ARRAY['теннис','ATP','спорт'], 'arena'),

-- 14
('Азамат Мусагалиев — «Всё включено»', 'musagaliev-standup-2025',
 'Азамат Мусагалиев с новой программой «Всё включено». Истории из жизни, путешествий и семейного быта.',
 'Новая программа от звезды Comedy Club',
 'https://images.unsplash.com/photo-1598387993441-a364f854cfbd?w=600&q=80',
 'https://images.unsplash.com/photo-1598387993441-a364f854cfbd?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='standup'),
 (SELECT id FROM venues WHERE name='Балуан Шолак'),
 '2025-09-05 20:00:00+06', 5000, 20000, 'PUBLISHED', FALSE, FALSE, 5000, 2000,
 ARRAY['стендап','мусагалиев','comedy'], 'concert'),

-- 15
('Дюна: Часть Третья — Премьера', 'dune-part-3-premiere-2025',
 'Мировая премьера третьей части эпической саги Дени Вильнёва. Грандиозное зрелище на большом экране в формате IMAX.',
 'Мировая премьера — только в кино',
 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='cinema'),
 (SELECT id FROM venues WHERE name='Кинотеатр Арман'),
 '2025-11-15 20:00:00+06', 3000, 10000, 'PUBLISHED', TRUE, TRUE, 400, 50,
 ARRAY['кино','дюна','премьера'], 'cinema');

INSERT INTO events (title, slug, description, short_desc, poster, banner, category_id, venue_id, start_date, min_price, max_price, status, is_featured, is_hot, total_seats, sold_seats, tags, venue_type) VALUES

-- 16
('Ұлы Дала — Гала-концерт казахской музыки', 'uly-dala-concert-2025',
 'Грандиозный гала-концерт, посвящённый казахской национальной музыке. Лучшие исполнители страны на одной сцене.',
 'Лучшие исполнители казахской музыки',
 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80',
 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='concerts'),
 (SELECT id FROM venues WHERE name='Дворец Республики'),
 '2025-08-30 19:00:00+06', 5000, 40000, 'PUBLISHED', FALSE, FALSE, 3000, 1200,
 ARRAY['казахская музыка','гала','национальный'], 'concert'),

-- 17
('Stand Up Night — Женский взгляд', 'standup-women-night-2025',
 'Вечер женского стендапа с лучшими комедийными исполнительницами Казахстана. Смех, откровенность и узнаваемые истории.',
 'Вечер женского стендапа в Алматы',
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=600&q=80',
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='standup'),
 (SELECT id FROM venues WHERE name='Мега Алматы'),
 '2025-07-20 20:00:00+06', 4000, 12000, 'PUBLISHED', FALSE, TRUE, 2000, 800,
 ARRAY['стендап','юмор','женский'], 'concert'),

-- 18
('Выставка «Степь и Небо»', 'steppe-sky-art-2025',
 'Масштабная выставка современного казахского искусства. Живопись, скульптура, инсталляции от 50 художников страны.',
 'Современное казахское искусство',
 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&q=80',
 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='exhibition'),
 (SELECT id FROM venues WHERE name='Дворец Республики'),
 '2025-07-10 11:00:00+06', 2000, 8000, 'PUBLISHED', FALSE, FALSE, 3000, 500,
 ARRAY['выставка','казахское искусство','живопись'], 'concert'),

-- 19
('Астана Тайгерс vs Локомотив — БК', 'astana-tigers-basketball-2025',
 'Решающий матч Единой лиги ВТБ. Астана Тайгерс принимает Локомотив-Кубань в борьбе за выход в плей-офф.',
 'Решающий матч Единой лиги ВТБ',
 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='sport'),
 (SELECT id FROM venues WHERE name='Балуан Шолак'),
 '2025-10-18 19:00:00+06', 2000, 15000, 'PUBLISHED', FALSE, FALSE, 5000, 1500,
 ARRAY['баскетбол','ВТБ','астана'], 'arena'),

-- 20
('Наруто: Финальная битва — Спецпоказ', 'naruto-final-cinema-2025',
 'Специальный кинопоказ финальных серий Наруто в кинотеатре. Легендарная аниме-сага на большом экране с живым оркестром.',
 'Наруто на большом экране с оркестром',
 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80',
 (SELECT id FROM categories WHERE slug='cinema'),
 (SELECT id FROM venues WHERE name='Кинотеатр Арман'),
 '2025-08-03 18:00:00+06', 3500, 12000, 'PUBLISHED', FALSE, TRUE, 400, 280,
 ARRAY['аниме','наруто','кино'], 'cinema');

-- ─── ПОЛЬЗОВАТЕЛИ ─────────────────────────────────────────────────────────────
-- admin123 и user123
INSERT INTO users (email, password, name, role, is_verified) VALUES
  ('admin@tickethub.kz', '$2a$12$ZnO/5DHqO6NiToD24rqjPeRA2Yd/kBzRnQ6UI063givLFcHeLYDtK', 'Admin', 'ADMIN', TRUE),
  ('user@tickethub.kz',  '$2a$12$G5.30bUzGbm7Z07O6o2GVeH6YOJqcX2uWJ1L6qahstBvF0Ph//9bm', 'Test User', 'USER', TRUE);
