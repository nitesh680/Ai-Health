require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const setupChatSocket = require('./sockets/chatSocket');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'MindWell API',
    timestamp: new Date().toISOString(),
    disclaimer: 'This chatbot is not a replacement for professional medical advice.'
  });
});

// Setup Socket.io
setupChatSocket(io);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n🧠 MindWell API Server running on port ${PORT}`);
    console.log(`📡 Socket.io ready for connections`);
    console.log(`🔒 CORS enabled for localhost:5173`);
    console.log(`⚕️  Disclaimer: This chatbot is not a replacement for professional medical advice.\n`);
  });
}).catch(() => {
  // Start even without DB for demo purposes
  server.listen(PORT, () => {
    console.log(`\n🧠 MindWell API Server running on port ${PORT} (Demo Mode - No DB)`);
    console.log(`📡 Socket.io ready for connections\n`);
  });
});

module.exports = { app, server, io };
