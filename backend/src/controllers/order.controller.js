const supabase = require('../lib/supabase');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { asyncHandler } = require('../middleware/error.middleware');
const { sendTicketEmail } = require('../lib/mailer');

const createOrder = asyncHandler(async (req, res) => {
  const { eventId, seatIds, paymentMethod = 'card' } = req.body;
  const userId = req.user.id;

  if (!seatIds || !seatIds.length) {
    return res.status(400).json({ error: 'No seats selected' });
  }

  // Check if these are virtual seat IDs (from SimpleTicketPurchase — no real seats)
  const isVirtual = seatIds.every(id => id.startsWith('std-') || id.startsWith('vip-'));

  // Validate eventId is a real UUID in DB
  const { data: dbEvent } = await supabase.from('events')
    .select('id, min_price, max_price, title, sold_seats').eq('id', eventId).maybeSingle();

  if (!dbEvent) {
    return res.status(404).json({ error: 'Событие не найдено в базе данных. Убедитесь что события загружены через seed.' });
  }

  let seats = [];
  let totalAmount = 0;

  if (isVirtual) {
    // Virtual seats — calculate price from event
    const basePrice = dbEvent.min_price || 0;
    totalAmount = seatIds.reduce((sum, id) => {
      const price = id.startsWith('vip-') ? (dbEvent.max_price || basePrice) : basePrice;
      return sum + price;
    }, 0);
    // Fallback to client-provided total if event prices are 0
    if (totalAmount === 0) {
      totalAmount = parseFloat(req.body.totalAmount) || 0;
    }
  } else {
    // Real seats — verify they are reserved by this user
    const { data: reservedSeats } = await supabase.from('seats')
      .select('*').in('id', seatIds).eq('event_id', eventId)
      .eq('status', 'RESERVED').eq('reserved_by', userId);

    if (!reservedSeats || reservedSeats.length !== seatIds.length)
      return res.status(400).json({ error: 'Seats reservation expired or invalid' });

    seats = reservedSeats;
    totalAmount = seats.reduce((sum, s) => sum + s.price, 0);
  }

  // Create order
  const { data: order, error } = await supabase.from('orders')
    .insert({ id: uuidv4(), user_id: userId, event_id: eventId, total_amount: totalAmount, payment_method: paymentMethod, status: 'PENDING', payment_status: 'PENDING' })
    .select('*').single();

  if (error) return res.status(400).json({ error: error.message });

  // Create order items
  let items;
  if (isVirtual) {
    items = seatIds.map((seatId, i) => ({
      id: uuidv4(),
      order_id: order.id,
      seat_id: null,
      price: totalAmount / seatIds.length,
      ticket_code: uuidv4(),
    }));
  } else {
    items = seats.map(seat => ({
      id: uuidv4(),
      order_id: order.id,
      seat_id: seat.id,
      price: seat.price,
      ticket_code: uuidv4(),
    }));
    // Mark real seats as SOLD
    await supabase.from('seats').update({ status: 'SOLD', reserved_by: null, reserved_at: null }).in('id', seatIds);
  }

  await supabase.from('order_items').insert(items);

  // Update sold count
  const newSoldSeats = (dbEvent.sold_seats || 0) + seatIds.length;
  await supabase.from('events').update({ sold_seats: newSoldSeats }).eq('id', eventId);

  // Generate QR
  const qrData = JSON.stringify({ orderId: order.id, eventId, userId, tickets: items.map(i => i.ticket_code) });
  const qrCode = await QRCode.toDataURL(qrData);

  await supabase.from('orders').update({ qr_code: qrCode, status: 'CONFIRMED', payment_status: 'COMPLETED' }).eq('id', order.id);

  // Emit socket
  const io = req.app.get('io');
  if (!isVirtual) {
    io?.to(`event:${eventId}`).emit('seats:sold', { seatIds });
  }

  // Fetch full order
  const { data: fullOrder } = await supabase.from('orders')
    .select(`*, event:events(title, start_date, poster, venue:venues(name,city)), items:order_items(*, seat:seats(*))`)
    .eq('id', order.id).single();

  // Send ticket email
  const { data: userRecord } = await supabase.from('users').select('email, name').eq('id', userId).maybeSingle();
  if (userRecord?.email) {
    sendTicketEmail({
      to: userRecord.email,
      userName: userRecord.name || 'Покупатель',
      order: { ...fullOrder, qr_code: qrCode },
      event: fullOrder?.event,
      items: fullOrder?.items || [],
    });
  }

  res.status(201).json({ ...fullOrder, qrCode });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { data: orders } = await supabase.from('orders')
    .select(`*, event:events(title, poster, start_date, venue:venues(name,city)), items:order_items(*, seat:seats(*))`)
    .eq('user_id', req.user.id).order('created_at', { ascending: false });
  res.json(orders || []);
});

const getOrderById = asyncHandler(async (req, res) => {
  const { data: order } = await supabase.from('orders')
    .select(`*, event:events(*, venue:venues(*)), items:order_items(*, seat:seats(*, ticket_type:ticket_types(*)))`)
    .eq('id', req.params.id).eq('user_id', req.user.id).single();
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'kzt' } = req.body;
  res.json({ clientSecret: `mock_secret_${uuidv4()}`, amount, currency });
});

module.exports = { createOrder, getUserOrders, getOrderById, createPaymentIntent };
