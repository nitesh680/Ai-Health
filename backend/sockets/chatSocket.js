// Socket.io Chat Handler
const Message = require('../models/Message');

const onlineUsers = new Map();

const setupChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // User joins with their user ID
    socket.on('join', (userData) => {
      if (!userData || !userData.userId) return;
      
      onlineUsers.set(userData.userId, {
        socketId: socket.id,
        role: userData.role,
        name: userData.name
      });

      socket.join(`user-${userData.userId}`);

      // Join role-based rooms
      if (userData.role === 'admin') {
        socket.join('admin-room');
      }
      if (userData.role === 'doctor') {
        socket.join('doctors-room');
      }

      // Broadcast online status
      io.emit('user-online', { userId: userData.userId, name: userData.name });
      io.emit('online-users', Array.from(onlineUsers.keys()));
    });

    // Handle chat messages
    socket.on('send-message', async (data) => {
      const { senderId, receiverId, content, sessionId } = data;

      try {
        const message = await Message.create({
          senderId,
          receiverId,
          content,
          type: 'user',
          sessionId
        });

        // Send to receiver
        io.to(`user-${receiverId}`).emit('new-message', message);
        // Echo back to sender
        socket.emit('message-sent', message);
      } catch (error) {
        socket.emit('message-error', { error: error.message });
      }
    });

    // Typing indicators
    socket.on('typing-start', ({ userId, receiverId }) => {
      io.to(`user-${receiverId}`).emit('user-typing', { userId });
    });

    socket.on('typing-stop', ({ userId, receiverId }) => {
      io.to(`user-${receiverId}`).emit('user-stop-typing', { userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      let disconnectedUserId = null;
      for (const [userId, data] of onlineUsers.entries()) {
        if (data.socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        io.emit('user-offline', { userId: disconnectedUserId });
        io.emit('online-users', Array.from(onlineUsers.keys()));
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupChatSocket;
