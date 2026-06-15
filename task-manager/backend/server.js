const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: '*', // We can specify frontend URL later or keep it open for local development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// Set up socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Share socket.io instance with our route files
app.set('socketio', io);

// Basic test route
app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

// Bind routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
