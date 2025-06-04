// import express from 'express';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.routes.js';
// import messageRoutes from './routes/message.routes.js';
// import userRoutes from './routes/user.routes.js';
// import { connectDB } from './lib/db.js';
// import cookieParser from 'cookie-parser';
// import { app, server } from './socket/socket.js'; // `app` from socket.js (usually Express instance)
// import cors from 'cors';

// dotenv.config();

// const PORT = process.env.PORT || 5000;

// // ✅ Apply CORS globally
// app.use(cors({
//   origin: 'https://chat-app-frontend-pafi.vercel.app', // ✅ Frontend URL
//   credentials: true
// }));

// // // ✅ Optional: Preflight requests handling
// // app.options('*', cors({
// //   origin: 'https://chat-app-frontend-pafi.vercel.app',
// //   credentials: true
// // }));

// // ✅ Middleware
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/message', messageRoutes);
// app.use('/api/users', userRoutes);

// // ✅ Start server
// server.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
//   connectDB();
// });


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

import { connectDB } from './lib/db.js';
import { app, server } from './socket/socket.js'; // Express app from socket.js

dotenv.config();

const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration for frontend on Vercel
app.use(cors({
  origin: 'https://chat-app-frontend-pafi.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle Preflight OPTIONS Requests
app.options('*', cors({
  origin: 'https://chat-app-frontend-pafi.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Debugging Middleware (Optional: Remove in prod)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Body & Cookie Parsers
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/users', userRoutes);

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB();
});
