const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

// Endpoint untuk trigger event dari API donasi (Vercel)
app.post('/notify', (req, res) => {
  io.emit('new-donation', req.body);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Socket.io server running on port', PORT);
});