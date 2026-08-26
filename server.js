const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('nuevo-pedido', (data) => {
    io.emit('pedido-para-cocina', data);
  });

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

const PUERTO = process.env.PORT || 3000;
server.listen(PUERTO, () => {
  console.log(`¡Servidor corriendo con éxito en puerto ${PUERTO}!`);
});
