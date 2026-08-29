const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// In-memory order storage
let comandas = [];

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Send initial orders to newly connected client
  socket.emit('cargarComandas', comandas);

  // New order event
  socket.on('nuevaComanda', (comanda) => {
    comandas.push(comanda);
    io.emit('nuevaComanda', comanda);
  });

  // Update status event (e.g., 'Atendido' / 'Entregado')
  socket.on('cambiarEstado', ({ id, estado }) => {
    const item = comandas.find(c => c.id === id);
    if (item) {
      item.estado = estado;
      io.emit('estadoCambiado', { id, estado });
    }
  });

  // Clear orders / Reset day
  socket.on('resetComandas', () => {
    comandas = [];
    io.emit('cargarComandas', []);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor ANITA-WOK corriendo en http://localhost:${PORT}`);
});
