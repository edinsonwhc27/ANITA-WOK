// Conexión a Socket.io
const socket = io();

// Lista para guardar el pedido en memoria
let pedido = [];

// 1. Agregar plato o sumar cantidad
function agregarAlPedido(nombrePlato) {
    const platoExistente = pedido.find(item => item.nombre === nombrePlato);

    if (platoExistente) {
        platoExistente.cantidad += 1;
    } else {
        pedido.push({ nombre: nombrePlato, cantidad: 1 });
    }

    actualizarResumenHTML();
}

// 2. Dibujar la lista de platos en el resumen
function actualizarResumenHTML() {
    const contenedorResumen = document.getElementById('lista-pedido');
    if (!contenedorResumen) return;

    if (pedido.length === 0) {
        contenedorResumen.innerHTML = '<p style="color: #777; text-align: center;">No hay platos agregados</p>';
        return;
    }

    let html = '';
    pedido.forEach((item, index) => {
        html += `
            <div class="resumen-item">
                <span><b>${item.cantidad}x</b> ${item.nombre}</span>
                <button class="btn-danger" onclick="eliminarDelPedido(${index})">❌</button>
            </div>
        `;
    });

    contenedorResumen.innerHTML = html;
}

// 3. Quitar plato de la lista
function eliminarDelPedido(index) {
    pedido.splice(index, 1);
    actualizarResumenHTML();
}

// 4. Enviar la comanda a Socket.io / Cocina
function enviarComanda() {
    const selectorMesa = document.getElementById('mesa');
    const mesaSeleccionada = selectorMesa ? selectorMesa.value : 'Mesa Sin Definir';

    if (pedido.length === 0) {
        alert('Debes agregar al menos un plato antes de enviar a cocina.');
        return;
    }

    const datosPedido = {
        mesa: mesaSeleccionada,
        platos: pedido,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Emitir el evento hacia el servidor
    socket.emit('nuevo-pedido', datosPedido);

    // Resetear el pedido actual
    pedido = [];
    actualizarResumenHTML();
    alert(`¡Pedido enviado a la cocina con éxito para la ${mesaSeleccionada}!`);
}

// 5. Escuchar pedidos en la pantalla de Cocina (cocina.html)
const contenedorComandas = document.getElementById('contenedor-comandas');
if (contenedorComandas) {
    socket.on('nuevo-pedido', (datos) => {
        const mensajeVacio = contenedorComandas.querySelector('p');
        if (mensajeVacio) {
            mensajeVacio.remove();
        }

        const tarjeta = document.createElement('div');
        tarjeta.className = 'comanda-card';

        let itemsHtml = '';
        if (datos.platos && Array.isArray(datos.platos)) {
            datos.platos.forEach(item => {
                itemsHtml += `<li><b>${item.cantidad}x</b> ${item.nombre}</li>`;
            });
        }

        tarjeta.innerHTML = `
            <h3>${datos.mesa} <small>(${datos.hora || ''})</small></h3>
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
