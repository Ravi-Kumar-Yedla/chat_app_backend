import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();

const server = createServer(app);

// 👇 CORS should allow Vercel frontend (production)
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-frontend-pafi.vercel.app", // ✅ your Vercel domain
    methods: ["GET", "POST"],
    credentials: true // 👈 important for cookies if needed
  }
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { app, server, io };
