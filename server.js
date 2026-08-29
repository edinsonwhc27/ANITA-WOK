// ==========================================
// ANITA-WOK - SERVIDOR PRINCIPAL (server.js)
// ==========================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware para procesar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para la vista de cocina
app.get('/cocina', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cocina.html'));
});

// ==========================================
// EVENTOS DE SOCKET.IO (COMANDAS EN TIEMPO REAL)
// ==========================================

io.on('connection', (socket) => {
  console.log(`[SOCKET] Cliente conectado: ${socket.id}`);

  // Recibir nueva comanda enviada desde el mozo/caja
  socket.on('nuevaComanda', (comanda) => {
    console.log(`[PEDIDO RECIBIDO] ${comanda.mesa || 'Sin Mesa'} - Total: S/ ${comanda.total}`);
    
    // Transmitir la comanda a la pantalla de cocina y a los demás clientes conectados
    io.emit('nuevaComanda', comanda);
  });

  // Notificar cambio de estado de comanda (ej: "En Preparación" o "Atendido")
  socket.on('cambiarEstadoComanda', (datos) => {
    console.log(`[ESTADO ACTUALIZADO] Comanda ID: ${datos.id} -> ${datos.estado}`);
    io.emit('cambiarEstadoComanda', datos);
  });

  socket.on('disconnect', () => {
    console.log(`[SOCKET] Cliente desconectado: ${socket.id}`);
  });
});

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor Anita-Wok iniciado con éxito en http://localhost:${PORT}`);
});
