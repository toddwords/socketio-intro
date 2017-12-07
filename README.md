# Intro to Socket.io


## Server-Side Cheat Sheet
```javascript
// sending to sender-client only
  socket.emit('message', "this is a test");

 // sending to all clients, include sender
  io.emit('message', "this is a test");

 // sending to all clients except sender
  socket.broadcast.emit('message', "this is a test");

 // sending to individual socketid
  socket.broadcast.to(socketid).emit('message', 'for your eyes only');
