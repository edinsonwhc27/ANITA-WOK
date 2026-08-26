// Conexión en tiempo real mediante Socket.io
const socket = io();

// Variables globales para la pantalla de mozos
let pedidoActual = [];

// ==========================================
// FUNCIONES PARA LA PANTALLA DEL MOZO (index.html)
// ==========================================

function agregarAlPedido(nombrePlato) {
  const itemExistente = pedidoActual.find(item => item.nombre === nombrePlato);
  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    pedidoActual.push({ nombre: nombrePlato, cantidad: 1 });
  }
  actualizarVistaResumen();
}

function cambiarCantidad(index, cambio) {
  pedidoActual[index].cantidad += cambio;
  if (pedidoActual[index].cantidad <= 0) {
    pedidoActual.splice(index, 1);
  }
  actualizarVistaResumen();
}

function actualizarVistaResumen() {
  const contenedorResumen = document.getElementById('lista-pedido');
  if (!contenedorResumen) return; // Si no estamos en la vista de mozo, no hace nada

  if (pedidoActual.length === 0) {
    contenedorResumen.innerHTML = '<p style="color: #777; text-align: center;">No hay platos agregados</p>';
    return;
  }

  contenedorResumen.innerHTML = '';
  pedidoActual.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'resumen-item';
    div.innerHTML = `
      <span><b>${item.cantidad}x</b> ${item.nombre}</span>
      <div>
        <button class="btn-add" style="background:#dc3545; padding:2px 8px;" onclick="cambiarCantidad(${index}, -1)">-</button>
        <button class="btn-add" style="padding:2px 8px;" onclick="cambiarCantidad(${index}, 1)">+</button>
      </div>
    `;
    contenedorResumen.appendChild(div);
  });
}

function enviarComanda() {
  const mesa = document.getElementById('mesa').value;

  if (pedidoActual.length === 0) {
    alert('Por favor agrega al menos un plato antes de enviar.');
    return;
  }

  // Enviar el pedido al servidor
  socket.emit('nuevo_pedido', {
    mesa: mesa,
    items: pedidoActual
  });

  // Limpiar el pedido actual tras enviar
  pedidoActual = [];
  actualizarVistaResumen();
  alert('¡Comanda enviada a cocina con éxito!');
}

// ==========================================
// FUNCIONES PARA LA PANTALLA DE COCINA (cocina.html)
// ==========================================

// Cargar pedidos al conectar
socket.on('cargar_pedidos', (pedidos) => {
  const contenedor = document.getElementById('contenedor-comandas');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (pedidos.length === 0) {
    contenedor.innerHTML = '<p style="color: #adb5bd;">Esperando comandas...</p>';
    return;
  }

  pedidos.forEach(pedido => renderizarTarjetaPedido(pedido));
});

// Cuando entra una nueva comanda en tiempo real
socket.on('pedido_agregado', (pedido) => {
  const contenedor = document.getElementById('contenedor-comandas');
  if (!contenedor) return;

  // Si era el mensaje de "esperando", lo limpiamos
  if (contenedor.querySelector('p')) {
    contenedor.innerHTML = '';
  }

  renderizarTarjetaPedido(pedido);
});

// Cuando se actualiza el estado de un pedido
socket.on('estado_actualizado', (pedido) => {
  const tarjeta = document.getElementById(`pedido-${pedido.id}`);
  if (tarjeta) {
    tarjeta.className = `comanda-card ${pedido.estado.toLowerCase().replace(' ', '-')}`;
    const badgeEstado = tarjeta.querySelector('.badge-estado');
    if (badgeEstado) badgeEstado.innerText = pedido.estado;
  }
});

// Cuando se elimina/entrega un pedido
socket.on('pedido_eliminado', (id) => {
  const tarjeta = document.getElementById(`pedido-${id}`);
  if (tarjeta) tarjeta.remove();

  const contenedor = document.getElementById('contenedor-comandas');
  if (contenedor && contenedor.children.length === 0) {
    contenedor.innerHTML = '<p style="color: #adb5bd;">Esperando comandas...</p>';
  }
});

function renderizarTarjetaPedido(pedido) {
  const contenedor = document.getElementById('contenedor-comandas');
  if (!contenedor) return;

  const card = document.createElement('div');
  card.id = `pedido-${pedido.id}`;
  card.className = `comanda-card ${pedido.estado.toLowerCase().replace(' ', '-')}`;

  let itemsHtml = '';
  pedido.items.forEach(item => {
    itemsHtml += `<li><b>${item.cantidad}x</b> ${item.nombre}</li>`;
  });

  card.innerHTML = `
    <div class="header-comanda">
      <span>#${pedido.id} - ${pedido.mesa}</span>
      <span class="hora">${pedido.hora}</span>
    </div>
    <p style="margin-bottom:8px; font-size:12px; color:#ffc107;">Estado: <span class="badge-estado">${pedido.estado}</span></p>
    <ul class="lista-items">
      ${itemsHtml}
    </ul>
    <div class="acciones">
      <button class="btn btn-preparar" onclick="cambiarEstado(${pedido.id}, 'En preparación')">👨‍🍳 En Preparación</button>
      <button class="btn btn-listo" onclick="cambiarEstado(${pedido.id}, 'Listo')">✅ ¡Listo!</button>
      <button class="btn btn-entregado" onclick="eliminarPedido(${pedido.id})">🗑️ Despachar/Entregar</button>
    </div>
  `;

  contenedor.appendChild(card);
}

function cambiarEstado(id, nuevoEstado) {
  socket.emit('cambiar_estado', { id, nuevoEstado });
}

function eliminarPedido(id) {
  if (confirm('¿Marcar como entregado y quitar de pantalla?')) {
    socket.emit('eliminar_pedido', id);
  }
}
