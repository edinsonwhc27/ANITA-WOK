// Memoria temporal de pedidos pendientes
let pedidosPendientes = [];

io.on('connection', (socket) => {
  // 1. Al conectar la cocina, enviar los pedidos que están pendientes
  socket.emit('cargarPedidos', pedidosPendientes);

  // 2. Cuando el usuario envía un pedido desde la carta (index.html)
  socket.on('nuevoPedido', (pedido) => {
    // Generar ID único y timestamp si no lo tiene
    const nuevoPedido = {
      id: pedido.id || Date.now().toString(),
      mesa: pedido.mesa || 'Mesa General',
      items: pedido.items || [],
      metodoPago: pedido.metodoPago || '',
      timestamp: Date.now()
    };

    pedidosPendientes.push(nuevoPedido);

    // Retransmitir a TODOS los clientes conectados (incluyendo cocina.html)
    io.emit('nuevoPedido', nuevoPedido);
  });

  // 3. Cuando la cocina marca un pedido como LISTO
  socket.on('completarPedido', (idPedido) => {
    pedidosPendientes = pedidosPendientes.filter(p => p.id !== idPedido);
    io.emit('cargarPedidos', pedidosPendientes);
  });
});
