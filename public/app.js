// Conexión a Socket.io
const socket = io();

// Escuchar si estamos en la pantalla de cocina
const contenedorComandas = document.getElementById('contenedor-comandas');

if (contenedorComandas) {
    socket.on('nuevo-pedido', (pedido) => {
        const mensajeVacio = contenedorComandas.querySelector('p');
        if (mensajeVacio) {
            mensajeVacio.remove();
        }

        const tarjeta = document.createElement('div');
        tarjeta.className = 'comanda-card';

        let itemsHtml = '';
        if (pedido.platos && Array.isArray(pedido.platos)) {
            pedido.platos.forEach(item => {
                itemsHtml += `<li>${item.cantidad}x ${item.nombre}</li>`;
            });
        }

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

        contenedorComandas.appendChild(tarjeta);
    });
}
