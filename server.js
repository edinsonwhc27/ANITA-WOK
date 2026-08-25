// Importamos las librerías necesarias
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir los archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Arreglo en memoria para guardar el estado de los pedidos del día
let pedidos = [];
let contadorPedidos = 1;

// Configuración de conexiones en tiempo real con Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo dispositivo conectado:', socket.id);

  // Al conectarse, enviamos la lista actual de pedidos al cliente
  socket.emit('cargar_pedidos', pedidos);

  // Escuchar cuando un mozo envía un nuevo pedido
  socket.on('nuevo_pedido', (datosPedido) => {
    const nuevoPedido = {
      id: contadorPedidos++,
      mesa: datosPedido.mesa,
      items: datosPedido.items,
      estado: 'Pendiente', // Estados: Pendiente, En preparación, Listo
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    pedidos.push(nuevoPedido);

    // Transmitir el nuevo pedido a TODOS los dispositivos conectados (Cocina y Mozos)
    io.emit('pedido_agregado', nuevoPedido);
  });

  // Escuchar cuando la cocina cambia el estado de un pedido
  socket.on('cambiar_estado', (datos) => {
    const pedido = pedidos.find(p => p.id === datos.id);
    if (pedido) {
      pedido.estado = datos.nuevoEstado;
      // Notificar el cambio a todas las pantallas en tiempo real
      io.emit('estado_actualizado', pedido);
    }
  });

  // Escuchar cuando la cocina elimina/limpia un pedido entregado
  socket.on('eliminar_pedido', (id) => {
    pedidos = pedidos.filter(p => p.id !== id);
    io.emit('pedido_eliminado', id);
  });
});

// Arrancar el servidor en el puerto 3000
const PUERTO = 3000;
server.listen(PUERTO, () => {
  console.log(`==================================================`);
  console.log(`¡Servidor del restaurante corriendo con éxito!`);
  console.log(`Accede desde la computadora en: http://localhost:${PUERTO}`);
  console.log(`==================================================`);
});// Usar el puerto que asigna la nube (process.env.PORT) o el 3000 si es local
const PUERTO = process.env.PORT || 3000;
server.listen(PUERTO, () => {
  console.log(`¡Servidor del restaurante corriendo con éxito en puerto ${PUERTO}!`);
});