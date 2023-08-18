const express = require('express');
const http = require('http'); // Require the http module
const socketIo = require('socket.io'); // Require the socket.io module

const app = express();
const server = http.createServer(app); // Create an HTTP server using Express
const io = socketIo(server); // Set up socket.io on the HTTP server
const PORT = process.env.PORT || 3000; // Use the environment's port or 3000

// Serve static files (including client.js) from the current directory
app.use(express.static(__dirname));

// Define a route to serve your HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Assuming your HTML file is named 'index.html'
});

// Object to store username-to-socket mapping
const connectedUsers = {};

// Set up a connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('setUsername', (username) => {
    connectedUsers[socket.id] = username;
    console.log(`Username associated with socket ${socket.id}: ${username}`);
  });
  

  socket.on('sendMessage', (data) => {
    const username = connectedUsers[socket.id];
    const timestamp = new Date().toLocaleTimeString();
    console.log(`Message from ${username}: ${data.message}`);
    io.emit('chatMessage', { username, message: data.message, timestamp });

  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    const username = connectedUsers[socket.id]; // Get username associated with socket ID
    console.log('User disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
