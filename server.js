const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir los archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Escuchar conexiones en tiempo real con Socket.io
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado:', socket.id);

    // Escuchar cuando la mesa envía un nuevo pedido
    socket.on('nuevo-pedido', (pedido) => {
        console.log('Nuevo pedido recibido:', pedido);
        // Reemitir el pedido a la cocina y a todas las demás pantallas
        io.emit('nuevo-pedido', pedido);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Arrancar el servidor en el puerto asignado por Render (o 3000 localmente)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
