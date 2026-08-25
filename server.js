const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de conexiones con Socket.io
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Recibir pedido de un mozo y enviarlo a la cocina
  socket.on('nuevo-pedido', (data) => {
    io.emit('pedido-para-cocina', data);
  });

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

// Configuración del puerto para Render / Local
const PUERTO = process.env.PORT || 3000;
server.listen(PUERTO, () => {
  console.log(`¡Servidor del restaurante corriendo con éxito en puerto ${PUERTO}!`);
});
