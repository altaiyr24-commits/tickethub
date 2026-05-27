const supabase = require('../lib/supabase');
const { asyncHandler } = require('../middleware/error.middleware');
const { v4: uuidv4 } = require('uuid');

const RESERVATION_TIMEOUT = 10 * 60 * 1000;

function autoGenerateSeats(eventId, venueType, minPrice, maxPrice) {
  const seats = [];
  const rnd = () => { const p = Math.random(); return p < 0.55 ? 'AVAILABLE' : p < 0.75 ? 'SOLD' : 'AVAILABLE'; };

  if (venueType === 'theatre') {
    'ABCDEFGHIJKLMNOP'.split('').forEach((row, ri) => {
      const count = ri < 4 ? 16 : ri < 10 ? 20 : 18;
      const seatType = ri < 3 ? 'VIP' : ri < 8 ? 'PREMIUM' : 'STANDARD';
      const price = seatType === 'VIP' ? maxPrice : seatType === 'PREMIUM' ? Math.round((minPrice + maxPrice) / 2) : minPrice;
      for (let s = 1; s <= count; s++)
        seats.push({ id: uuidv4(), event_id: eventId, row, number: s, label: `${row}${s}`, seat_type: seatType, status: rnd(), price });
    });
  } else if (venueType === 'cinema') {
    'ABCDEFGHIJKL'.split('').forEach((row, ri) => {
      const count = ri < 2 ? 14 : ri < 8 ? 18 : 16;
      const seatType = ri < 2 ? 'VIP' : ri < 6 ? 'PREMIUM' : 'STANDARD';
      const price = seatType === 'VIP' ? maxPrice : seatType === 'PREMIUM' ? Math.round((minPrice + maxPrice) / 2) : minPrice;
      for (let s = 1; s <= count; s++)
        seats.push({ id: uuidv4(), event_id: eventId, row, number: s, label: `${row}${s}`, seat_type: seatType, status: rnd(), price });
    });
  } else if (['stadium','football','arena'].includes(venueType)) {
    ['A','B','C','D','E','F','G','H'].forEach(sec => {
      for (let row = 1; row <= 12; row++) {
        for (let seat = 1; seat <= 18; seat++) {
          const seatType = row <= 3 ? 'VIP' : row <= 7 ? 'PREMIUM' : 'STANDARD';
          const price = seatType === 'VIP' ? maxPrice : seatType === 'PREMIUM' ? Math.round((minPrice + maxPrice) / 2) : minPrice;
          seats.push({ id: uuidv4(), event_id: eventId, row: `${sec}${row}`, number: seat, label: `${sec}${row}-${seat}`, seat_type: seatType, status: rnd(), price, section: sec });
        }
      }
    });
  } else {
    // concert / default
    for (let r = 1; r <= 18; r++) {
      const row = String.fromCharCode(64 + r);
      const count = r <= 5 ? 18 : r <= 12 ? 24 : 20;
      const seatType = r <= 3 ? 'VIP' : r <= 8 ? 'PREMIUM' : 'STANDARD';
      const price = seatType === 'VIP' ? maxPrice : seatType === 'PREMIUM' ? Math.round((minPrice + maxPrice) / 2) : minPrice;
      for (let s = 1; s <= count; s++)
        seats.push({ id: uuidv4(), event_id: eventId, row, number: s, label: `${row}${s}`, seat_type: seatType, status: rnd(), price });
    }
  }
  return seats;
}

const getSeatsByEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // Release expired reservations
  await supabase.from('seats')
    .update({ status: 'AVAILABLE', reserved_at: null, reserved_by: null })
    .eq('event_id', eventId).eq('status', 'RESERVED')
    .lt('reserved_at', new Date(Date.now() - RESERVATION_TIMEOUT).toISOString());

  let { data: seats } = await supabase
    .from('seats')
    .select('*, ticket_type:ticket_types(*)')
    .eq('event_id', eventId)
    .order('row').order('number');

  // Auto-generate seats if none exist
  if (!seats || seats.length === 0) {
    const { data: event } = await supabase.from('events')
      .select('venue_type, min_price, max_price, hall_id').eq('id', eventId).maybeSingle();

    const venueType = event?.venue_type || 'concert';
    const minP = event?.min_price || 5000;
    const maxP = event?.max_price || 50000;
    const seatsData = autoGenerateSeats(eventId, venueType, minP, maxP);

    if (seatsData.length > 0) {
      await supabase.from('seats').insert(seatsData);
      await supabase.from('events').update({ total_seats: seatsData.length }).eq('id', eventId);
      const { data: newSeats } = await supabase.from('seats')
        .select('*').eq('event_id', eventId).order('row').order('number');
      seats = newSeats;
    }
  }

  res.json(seats || []);
});

const reserveSeats = asyncHandler(async (req, res) => {
  const { seatIds, eventId } = req.body;
  const userId = req.user.id;

  if (!seatIds?.length || seatIds.length > 10)
    return res.status(400).json({ error: 'Select 1-10 seats' });

  const { data: seats } = await supabase
    .from('seats').select('id, status, price, row, number, seat_type')
    .in('id', seatIds).eq('event_id', eventId);

  if (!seats || seats.length !== seatIds.length)
    return res.status(400).json({ error: 'Some seats not found' });

  const unavailable = seats.filter(s => s.status !== 'AVAILABLE');
  if (unavailable.length > 0)
    return res.status(409).json({ error: 'Some seats are not available', seats: unavailable });

  await supabase.from('seats')
    .update({ status: 'RESERVED', reserved_at: new Date().toISOString(), reserved_by: userId })
    .in('id', seatIds);

  const io = req.app.get('io');
  const expiresAt = new Date(Date.now() + RESERVATION_TIMEOUT);
  io?.to(`event:${eventId}`).emit('seats:reserved', { seatIds, userId, expiresAt });

  res.json({ reserved: seats, expiresAt, totalPrice: seats.reduce((s, seat) => s + seat.price, 0) });
});

const releaseSeats = asyncHandler(async (req, res) => {
  const { seatIds, eventId } = req.body;
  const userId = req.user.id;

  await supabase.from('seats')
    .update({ status: 'AVAILABLE', reserved_at: null, reserved_by: null })
    .in('id', seatIds).eq('event_id', eventId).eq('reserved_by', userId).eq('status', 'RESERVED');

  const io = req.app.get('io');
  io?.to(`event:${eventId}`).emit('seats:released', { seatIds });

  res.json({ message: 'Seats released' });
});

const generateHallSeats = asyncHandler(async (req, res) => {
  const { eventId, hallId, ticketTypes } = req.body;

  const { data: hall } = await supabase.from('halls').select('*').eq('id', hallId).maybeSingle();
  if (!hall) return res.status(404).json({ error: 'Hall not found' });

  await supabase.from('seats').delete().eq('event_id', eventId);

  const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const seatsData = [];

  for (let r = 0; r < hall.rows; r++) {
    const rowLabel = rows[r] || `R${r + 1}`;
    for (let s = 1; s <= hall.seats_per_row; s++) {
      let ticket_type_id = null, price = 5000, seat_type = 'STANDARD';
      if (ticketTypes?.length) {
        const tt = ticketTypes[Math.min(Math.floor(r / 3), ticketTypes.length - 1)];
        ticket_type_id = tt.id; price = tt.price; seat_type = tt.seatType || 'STANDARD';
      }
      seatsData.push({ hall_id: hallId, event_id: eventId, ticket_type_id, row: rowLabel, number: s, label: `${rowLabel}${s}`, seat_type, price, x: (s - 1) * 35 + 20, y: r * 35 + 20 });
    }
  }

  await supabase.from('seats').insert(seatsData);
  await supabase.from('events').update({ total_seats: seatsData.length }).eq('id', eventId);

  res.json({ message: `Generated ${seatsData.length} seats`, count: seatsData.length });
});

module.exports = { getSeatsByEvent, reserveSeats, releaseSeats, generateHallSeats };
