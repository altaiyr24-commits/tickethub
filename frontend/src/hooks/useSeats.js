import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { connectSocket } from '@/lib/socket';
import { MOCK_EVENTS, generateSeats } from '@/lib/mockEvents';

function normalizeSeat(s) {
  if (!s) return s;
  return {
    ...s,
    seatType:   s.seatType   || s.seat_type   || 'STANDARD',
    eventId:    s.eventId    || s.event_id,
    reservedBy: s.reservedBy || s.reserved_by,
    reservedAt: s.reservedAt || s.reserved_at,
    ticketType: s.ticketType || s.ticket_type,
    section:    s.section    || s.row?.charAt(0),
  };
}

export const useSeats = (eventId) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSeats = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/seats/event/${eventId}`);
      setSeats((data || []).map(normalizeSeat));
    } catch {
      const event = MOCK_EVENTS.find(e => e.id === eventId);
      const venueType = event?.venueType || 'concert';
      setSeats(generateSeats(venueType, eventId).map(normalizeSeat));
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchSeats();

    // Real-time socket updates (only when API is available)
    let socket = null;
    try {
      socket = connectSocket();
      socket.emit('join:event', eventId);

      socket.on('seats:reserved', ({ seatIds }) => {
        setSeats(prev => prev.map(s => seatIds.includes(s.id) ? { ...s, status: 'RESERVED' } : s));
      });
      socket.on('seats:released', ({ seatIds }) => {
        setSeats(prev => prev.map(s => seatIds.includes(s.id) ? { ...s, status: 'AVAILABLE' } : s));
      });
      socket.on('seats:sold', ({ seatIds }) => {
        setSeats(prev => prev.map(s => seatIds.includes(s.id) ? { ...s, status: 'SOLD' } : s));
      });
    } catch {}

    return () => {
      if (socket) {
        socket.emit('leave:event', eventId);
        socket.off('seats:reserved');
        socket.off('seats:released');
        socket.off('seats:sold');
      }
    };
  }, [eventId, fetchSeats]);

  const updateSeatStatus = (seatIds, status) => {
    setSeats(prev => prev.map(s => seatIds.includes(s.id) ? { ...s, status } : s));
  };

  return { seats, loading, refetch: fetchSeats, updateSeatStatus };
};
