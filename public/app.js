// Conexión a Socket.io
const socket = io();

// Lista para guardar el pedido en memoria
let pedido = [];

// --- LÓGICA MOZOS (index.html) ---

function agregarAlPedido(nombrePlato) {
    const platoExistente = pedido.find(item => item.nombre === nombrePlato);
    if (platoExistente) {
        platoExistente.cantidad += 1;
    } else {
        pedido.push({ nombre: nombrePlato, cantidad: 1 });
    }
    actualizarResumenHTML();
}

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

function eliminarDelPedido(index) {
    pedido.splice(index, 1);
    actualizarResumenHTML();
}

function enviarComanda() {
    const selectorMesa = document.getElementById('mesa');
    const mesaSeleccionada = selectorMesa ? selectorMesa.value : 'Mesa Sin Definir';

    if (pedido.length === 0) {
        alert('Debes agregar al menos un plato antes de enviar a cocina.');
        return;
    }

    const datosPedido = {
        id: Date.now(), // ID único para identificar la comanda
        mesa: mesaSeleccionada,
        platos: pedido,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socket.emit('nuevo-pedido', datosPedido);

    pedido = [];
    actualizarResumenHTML();
    alert(`¡Pedido enviado a la cocina con éxito para la ${mesaSeleccionada}!`);
}


// --- LÓGICA COCINA (cocina.html) ---

const contenedorComandas = document.getElementById('contenedor-comandas');

if (contenedorComandas) {
    socket.on('nuevo-pedido', (datos) => {
        const mensajeVacio = contenedorComandas.querySelector('p');
        if (mensajeVacio) {
            mensajeVacio.remove();
        }

        const tarjeta = document.createElement('div');
        tarjeta.className = 'comanda-card';
        tarjeta.id = `comanda-${datos.id}`;

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
                <button class="btn btn-preparar" onclick="cambiarEstado(this, 'preparando')">En Preparación</button>
                <button class="btn btn-listo" onclick="cambiarEstado(this, 'listo')">Listo</button>
                <button class="btn btn-entregado" onclick="eliminarComanda(this)">Entregado / Borrar</button>
            </div>
        `;

        contenedorComandas.appendChild(tarjeta);
    });
}

// Funciones para interactuar con la comanda en la cocina
function cambiarEstado(boton, estado) {
    const tarjeta = boton.closest('.comanda-card');
    if (estado === 'preparando') {
        tarjeta.style.border = '2px solid #ffc107';
    } else if (estado === 'listo') {
        tarjeta.style.border = '2px solid #28a745';
        tarjeta.style.opacity = '0.7';
    }
}

function eliminarComanda(boton) {
    const tarjeta = boton.closest('.comanda-card');
    tarjeta.remove();

    // Si no quedan más comandas, muestra el mensaje por defecto
    if (contenedorComandas.children.length === 0) {
        contenedorComandas.innerHTML = '<p style="color: #aaa; text-align: center; width: 100%; margin-top: 30px;">Esperando comandas...</p>';
    }
}
