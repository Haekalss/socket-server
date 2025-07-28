const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    clients: io.engine.clientsCount,
    timestamp: new Date().toISOString()
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: [
      'http://localhost:3000',
      'https://nyumbangin-sini.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id, 'from origin:', socket.handshake.headers.origin);
  
  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'reason:', reason);
  });
});

// Endpoint untuk trigger event dari API donasi (Vercel)
app.post('/notify', (req, res) => {
  console.log('📨 Received notification request:', req.body);
  console.log('🔄 Broadcasting to', io.engine.clientsCount, 'connected clients');
  
  io.emit('new-donation', req.body);
  
  res.json({ 
    success: true, 
    clientsCount: io.engine.clientsCount,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Socket.io server running on port', PORT);
});