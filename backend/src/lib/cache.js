// Simple in-memory cache
const store = new Map();

const cache = {
  get(key) {
    const item = store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) { store.delete(key); return null; }
    return item.value;
  },
  set(key, value, ttlMs = 30000) {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
  },
  del(key) { store.delete(key); },
  clear() { store.clear(); },
};

module.exports = cache;
