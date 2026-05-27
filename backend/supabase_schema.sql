-- TicketHub Database Schema for Supabase
-- Run this in Supabase Dashboard → SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ────────────────────────────────────────────────────────────────────
CREATE TYPE user_role      AS ENUM ('USER', 'ADMIN');
CREATE TYPE event_status   AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');
CREATE TYPE seat_status    AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'BLOCKED');
CREATE TYPE seat_type      AS ENUM ('STANDARD', 'VIP', 'PREMIUM', 'DISABLED');
CREATE TYPE order_status   AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password      TEXT NOT NULL,
  name          TEXT NOT NULL,
  phone         TEXT,
  avatar        TEXT,
  role          user_role DEFAULT 'USER',
  is_verified   BOOLEAN DEFAULT FALSE,
  refresh_token TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CATEGORIES ───────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT UNIQUE NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  icon       TEXT,
  color      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VENUES ───────────────────────────────────────────────────────────────────
CREATE TABLE venues (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  address    TEXT,
  city       TEXT NOT NULL,
  country    TEXT DEFAULT 'Kazakhstan',
  lat        FLOAT,
  lng        FLOAT,
  capacity   INT DEFAULT 0,
  image      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── HALLS ────────────────────────────────────────────────────────────────────
CREATE TABLE halls (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  venue_id      UUID REFERENCES venues(id) ON DELETE CASCADE,
  rows          INT NOT NULL,
  seats_per_row INT NOT NULL,
  total_seats   INT NOT NULL,
  schema_json   JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── EVENTS ───────────────────────────────────────────────────────────────────
CREATE TABLE events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  description  TEXT NOT NULL,
  short_desc   TEXT,
  poster       TEXT,
  banner       TEXT,
  gallery      TEXT[],
  category_id  UUID REFERENCES categories(id),
  venue_id     UUID REFERENCES venues(id),
  hall_id      UUID REFERENCES halls(id),
  start_date   TIMESTAMPTZ NOT NULL,
  end_date     TIMESTAMPTZ,
  duration     INT,
  min_price    FLOAT NOT NULL DEFAULT 0,
  max_price    FLOAT NOT NULL DEFAULT 0,
  status       event_status DEFAULT 'DRAFT',
  is_featured  BOOLEAN DEFAULT FALSE,
  is_hot       BOOLEAN DEFAULT FALSE,
  age_limit    INT,
  tags         TEXT[],
  total_seats  INT DEFAULT 0,
  sold_seats   INT DEFAULT 0,
  venue_type   TEXT DEFAULT 'concert',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TICKET TYPES ─────────────────────────────────────────────────────────────
CREATE TABLE ticket_types (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID REFERENCES events(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  price       FLOAT NOT NULL,
  color       TEXT,
  description TEXT,
  max_count   INT NOT NULL,
  sold_count  INT DEFAULT 0,
  seat_type   seat_type DEFAULT 'STANDARD'
);

-- ─── SEATS ────────────────────────────────────────────────────────────────────
CREATE TABLE seats (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hall_id        UUID REFERENCES halls(id),
  event_id       UUID REFERENCES events(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES ticket_types(id),
  row            TEXT NOT NULL,
  number         INT NOT NULL,
  label          TEXT,
  seat_type      seat_type DEFAULT 'STANDARD',
  status         seat_status DEFAULT 'AVAILABLE',
  price          FLOAT NOT NULL,
  x              FLOAT,
  y              FLOAT,
  section        TEXT,
  reserved_at    TIMESTAMPTZ,
  reserved_by    UUID REFERENCES users(id),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, row, number)
);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES users(id),
  event_id          UUID REFERENCES events(id),
  total_amount      FLOAT NOT NULL,
  status            order_status DEFAULT 'PENDING',
  payment_status    payment_status DEFAULT 'PENDING',
  payment_method    TEXT,
  stripe_payment_id TEXT,
  qr_code           TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDER ITEMS ──────────────────────────────────────────────────────────────
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  seat_id     UUID REFERENCES seats(id),
  price       FLOAT NOT NULL,
  ticket_code TEXT UNIQUE DEFAULT uuid_generate_v4()::TEXT
);

-- ─── FAVORITES ────────────────────────────────────────────────────────────────
CREATE TABLE favorites (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id   UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- ─── REVIEWS ──────────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id   UUID REFERENCES events(id) ON DELETE CASCADE,
  rating     INT CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_events_status      ON events(status);
CREATE INDEX idx_events_category    ON events(category_id);
CREATE INDEX idx_events_venue       ON events(venue_id);
CREATE INDEX idx_events_start_date  ON events(start_date);
CREATE INDEX idx_events_featured    ON events(is_featured);
CREATE INDEX idx_events_hot         ON events(is_hot);
CREATE INDEX idx_seats_event        ON seats(event_id);
CREATE INDEX idx_seats_status       ON seats(status);
CREATE INDEX idx_orders_user        ON orders(user_id);
CREATE INDEX idx_orders_event       ON orders(event_id);

-- ─── RLS (Row Level Security) — disable for service role ──────────────────────
ALTER TABLE users        DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories   DISABLE ROW LEVEL SECURITY;
ALTER TABLE venues       DISABLE ROW LEVEL SECURITY;
ALTER TABLE halls        DISABLE ROW LEVEL SECURITY;
ALTER TABLE events       DISABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE seats        DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders       DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items  DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites    DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews      DISABLE ROW LEVEL SECURITY;
