const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join event room for real-time seat updates
    socket.on('join:event', (eventId) => {
      socket.join(`event:${eventId}`);
      console.log(`Socket ${socket.id} joined event:${eventId}`);
    });

    socket.on('leave:event', (eventId) => {
      socket.leave(`event:${eventId}`);
    });

    // Seat hover broadcast (optional UX feature)
    socket.on('seat:hover', ({ eventId, seatId }) => {
      socket.to(`event:${eventId}`).emit('seat:hover', { seatId, socketId: socket.id });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocketHandlers };
