const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'concerts' }, update: {}, create: { name: 'Концерты', slug: 'concerts', icon: '🎵', color: '#8B5CF6' } }),
    prisma.category.upsert({ where: { slug: 'theatre' }, update: {}, create: { name: 'Театр', slug: 'theatre', icon: '🎭', color: '#EC4899' } }),
    prisma.category.upsert({ where: { slug: 'sport' }, update: {}, create: { name: 'Спорт', slug: 'sport', icon: '⚽', color: '#10B981' } }),
    prisma.category.upsert({ where: { slug: 'cinema' }, update: {}, create: { name: 'Кино', slug: 'cinema', icon: '🎬', color: '#F59E0B' } }),
    prisma.category.upsert({ where: { slug: 'standup' }, update: {}, create: { name: 'Стендап', slug: 'standup', icon: '🎤', color: '#EF4444' } }),
    prisma.category.upsert({ where: { slug: 'exhibition' }, update: {}, create: { name: 'Выставки', slug: 'exhibition', icon: '🖼️', color: '#06B6D4' } }),
  ]);

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tickethub.kz' },
    update: {},
    create: { email: 'admin@tickethub.kz', password: adminPassword, name: 'Admin', role: 'ADMIN', isVerified: true },
  });

  // Test user
  const userPassword = await bcrypt.hash('user123', 12);
  await prisma.user.upsert({
    where: { email: 'user@tickethub.kz' },
    update: {},
    create: { email: 'user@tickethub.kz', password: userPassword, name: 'Нурали Тестов', isVerified: true },
  });

  // Venues
  const venue1 = await prisma.venue.upsert({
    where: { id: 'venue-almaty-arena' },
    update: {},
    create: {
      id: 'venue-almaty-arena',
      name: 'Almaty Arena', address: 'пр. Аль-Фараби, 1', city: 'Алматы',
      capacity: 12000, image: 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=800',
    },
  });

  const venue2 = await prisma.venue.upsert({
    where: { id: 'venue-astana-opera' },
    update: {},
    create: {
      id: 'venue-astana-opera',
      name: 'Астана Опера', address: 'пр. Достык, 1', city: 'Астана',
      capacity: 1200, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    },
  });

  const venue3 = await prisma.venue.upsert({
    where: { id: 'venue-sport-palace' },
    update: {},
    create: {
      id: 'venue-sport-palace',
      name: 'Дворец Спорта', address: 'ул. Абая, 44', city: 'Алматы',
      capacity: 5000, image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    },
  });

  // Halls
  const hall1 = await prisma.hall.upsert({
    where: { id: 'hall-main-arena' },
    update: {},
    create: { id: 'hall-main-arena', name: 'Главная арена', venueId: venue1.id, rows: 20, seatsPerRow: 30, totalSeats: 600 },
  });

  const hall2 = await prisma.hall.upsert({
    where: { id: 'hall-opera-main' },
    update: {},
    create: { id: 'hall-opera-main', name: 'Главный зал', venueId: venue2.id, rows: 15, seatsPerRow: 20, totalSeats: 300 },
  });

  // Events
  const eventsData = [
    {
      id: 'event-dimash-2025',
      title: 'Dimash Qudaibergen — World Tour 2025',
      slug: 'dimash-world-tour-2025',
      description: 'Грандиозный концерт мирового исполнителя Димаша Кудайбергена. Уникальный голос, охватывающий 6 октав, завораживающее шоу с потрясающими спецэффектами и живым оркестром.',
      shortDesc: 'Мировой тур легендарного Димаша',
      poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
      banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
      gallery: ['https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800','https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=800'],
      categoryId: categories[0].id,
      venueId: venue1.id, hallId: hall1.id,
      startDate: new Date('2025-07-15T19:00:00'),
      duration: 150, minPrice: 15000, maxPrice: 80000,
      status: 'PUBLISHED', isFeatured: true, isHot: true,
      tags: ['концерт', 'димаш', 'мировой тур'], totalSeats: 600, soldSeats: 234,
    },
    {
      id: 'event-opera-carmen',
      title: 'Кармен — Опера Бизе',
      slug: 'carmen-opera-bizet-2025',
      description: 'Бессмертная опера Жоржа Бизе в постановке Астана Оперы. Роскошные декорации, великолепные костюмы и блестящий состав исполнителей.',
      shortDesc: 'Легендарная опера в исполнении Астана Оперы',
      poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
      banner: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200',
      gallery: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
      categoryId: categories[1].id,
      venueId: venue2.id, hallId: hall2.id,
      startDate: new Date('2025-06-20T18:30:00'),
      duration: 180, minPrice: 8000, maxPrice: 45000,
      status: 'PUBLISHED', isFeatured: true, isHot: false,
      tags: ['опера', 'классика', 'бизе'], totalSeats: 300, soldSeats: 89,
    },
    {
      id: 'event-fc-almaty',
      title: 'ФК Алматы vs ФК Астана — Суперкубок',
      slug: 'fc-almaty-vs-astana-supercup-2025',
      description: 'Главный футбольный матч сезона! Два лучших клуба Казахстана сразятся за Суперкубок страны.',
      shortDesc: 'Главный матч сезона казахстанского футбола',
      poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600',
      banner: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200',
      gallery: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'],
      categoryId: categories[2].id,
      venueId: venue3.id,
      startDate: new Date('2025-06-28T17:00:00'),
      duration: 120, minPrice: 3000, maxPrice: 20000,
      status: 'PUBLISHED', isFeatured: false, isHot: true,
      tags: ['футбол', 'суперкубок', 'алматы'], totalSeats: 5000, soldSeats: 1200,
    },
    {
      id: 'event-standup-nurlan',
      title: 'Нурлан Сабуров — Новая программа',
      slug: 'nurlan-saburov-new-show-2025',
      description: 'Самый популярный стендап-комик Казахстана представляет абсолютно новую программу. Два часа непрерывного смеха!',
      shortDesc: 'Новая программа короля казахстанского стендапа',
      poster: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600',
      banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200',
      gallery: [],
      categoryId: categories[4].id,
      venueId: venue1.id, hallId: hall1.id,
      startDate: new Date('2025-07-05T20:00:00'),
      duration: 120, minPrice: 5000, maxPrice: 25000,
      status: 'PUBLISHED', isFeatured: true, isHot: true,
      tags: ['стендап', 'комедия', 'нурлан'], totalSeats: 600, soldSeats: 450,
    },
    {
      id: 'event-imagine-dragons',
      title: 'Imagine Dragons — Live in Almaty',
      slug: 'imagine-dragons-almaty-2025',
      description: 'Легендарная американская рок-группа Imagine Dragons впервые выступит в Алматы! Грандиозное шоу с пиротехникой и световыми эффектами.',
      shortDesc: 'Легендарная рок-группа впервые в Алматы',
      poster: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600',
      banner: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200',
      gallery: ['https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800','https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800'],
      categoryId: categories[0].id,
      venueId: venue1.id, hallId: hall1.id,
      startDate: new Date('2025-08-10T20:00:00'),
      duration: 180, minPrice: 20000, maxPrice: 120000,
      status: 'PUBLISHED', isFeatured: true, isHot: true,
      tags: ['рок', 'imagine dragons', 'концерт'], totalSeats: 600, soldSeats: 580,
    },
    {
      id: 'event-ballet-swan',
      title: 'Лебединое озеро — Государственный балет',
      slug: 'swan-lake-ballet-2025',
      description: 'Шедевр мировой хореографии в исполнении Государственного академического театра оперы и балета.',
      shortDesc: 'Классический балет Чайковского',
      poster: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600',
      banner: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200',
      gallery: [],
      categoryId: categories[1].id,
      venueId: venue2.id, hallId: hall2.id,
      startDate: new Date('2025-07-22T19:00:00'),
      duration: 150, minPrice: 6000, maxPrice: 35000,
      status: 'PUBLISHED', isFeatured: false, isHot: false,
      tags: ['балет', 'чайковский', 'классика'], totalSeats: 300, soldSeats: 120,
    },
  ];

  for (const eventData of eventsData) {
    await prisma.event.upsert({
      where: { id: eventData.id },
      update: {},
      create: eventData,
    });
  }

  console.log('✅ Seed completed!');
  console.log('👤 Admin: admin@tickethub.kz / admin123');
  console.log('👤 User:  user@tickethub.kz / user123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
