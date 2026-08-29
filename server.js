const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos de la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Servir la página de cocina en la ruta /cocina
app.get('/cocina', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cocina.html'));
});

// Memoria en vivo de pedidos pendientes
let pedidosPendientes = [];

// Manejo de conexiones WebSockets
io.on('connection', (socket) => {
  // Cargar pedidos actuales al conectar
  socket.emit('cargarPedidos', pedidosPendientes);

  // Recibir nuevo pedido desde la carta (index.html)
  socket.on('nuevoPedido', (pedido) => {
    const nuevoPedido = {
      id: pedido.id || Date.now().toString(),
      mesa: pedido.mesa || 'Mesa General',
      items: pedido.items || [],
      metodoPago: pedido.metodoPago || 'Efectivo',
      timestamp: Date.now()
    };

    pedidosPendientes.push(nuevoPedido);
    io.emit('nuevoPedido', nuevoPedido);
  });

  // Completar pedido desde la cocina (cocina.html)
  socket.on('completarPedido', (idPedido) => {
    pedidosPendientes = pedidosPendientes.filter(p => p.id !== idPedido);
    io.emit('cargarPedidos', pedidosPendientes);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor ANITA-WOK corriendo en el puerto ${PORT}`);
});
