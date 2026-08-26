// Conexión a Socket.io
const socket = io();

// -------------------------------------------------------------
// 1. LÓGICA PARA LA COCINA (cocina.html)
// -------------------------------------------------------------
const contenedorComandas = document.getElementById('contenedor-comandas');

if (contenedorComandas) {
    // Escuchar cuando el servidor retransmite un nuevo pedido
    socket.on('nuevo-pedido', (pedido) => {
        // Si es el primer pedido, quitar el texto "Esperando comandas..."
        const mensajeVacio = contenedorComandas.querySelector('p');
        if (mensajeVacio) {
            mensajeVacio.remove();
        }

        // Crear la tarjeta de la comanda
        const tarjeta = document.createElement('div');
        tarjeta.className = 'comanda-card'; // O la clase CSS que uses

        // Construir la lista de platos
        let itemsHtml = '';
        if (pedido.platos && Array.isArray(pedido.platos)) {
            pedido.platos.forEach(item => {
                itemsHtml += `<li>${item.cantidad}x ${item.nombre}</li>`;
            });
        }

        // Insertar contenido HTML en la tarjeta
        tarjeta.innerHTML = `
            <h3>Mesa: ${pedido.mesa || 'N/A'}</h3>
            <ul class="lista-items">
                ${itemsHtml}
            </ul>
            <div class="acciones">
                <button class="btn btn-preparar">En Preparación</button>
                <button class="btn btn-listo">Listo</button>
                <button class="btn btn-entregado">Entregado</button>
            </div>
        `;

        // Agregar la nueva tarjeta al contenedor
        contenedorComandas.appendChild(tarjeta);
    });
}
  if (confirm('¿Marcar como entregado y quitar de pantalla?')) {
    socket.emit('eliminar_pedido', id);
  }
}
