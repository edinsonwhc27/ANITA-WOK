// Conexión a Socket.io
const socket = io();

// Array para guardar los elementos del pedido actual
let pedidoActual = [];

// Función para agregar o sumar un plato al hacer clic en un botón
function agregarPlato(nombre, precio) {
    const existe = pedidoActual.find(item => item.nombre === nombre);
    if (existe) {
        existe.cantidad += 1;
    } else {
        pedidoActual.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }
    renderizarPedido();
}

// Función para actualizar la vista de la lista en pantalla
function renderizarPedido() {
    const listaHtml = document.getElementById('lista-pedido');
    const totalHtml = document.getElementById('total-pedido');
    
    if (!listaHtml) return; // Si no estamos en la pantalla de pedidos, salir

    listaHtml.innerHTML = '';
    let total = 0;

    pedidoActual.forEach((item, index) => {
        total += item.precio * item.cantidad;
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.cantidad}x ${item.nombre} - $${item.precio * item.cantidad}
            <button onclick="eliminarPlato(${index})">❌</button>
        `;
        listaHtml.appendChild(li);
    });

    if (totalHtml) {
        totalHtml.innerText = total.toFixed(2);
    }
}

// Función para eliminar un plato del pedido
function eliminarPlato(index) {
    pedidoActual.splice(index, 1);
    renderizarPedido();
}

// Función para enviar la comanda a la cocina mediante Socket.io
function enviarPedido() {
    const numeroMesa = document.getElementById('numero-mesa')?.value || 'Mesa Sin Número';

    if (pedidoActual.length === 0) {
        alert('Por favor selecciona al menos un plato antes de enviar.');
        return;
    }

    const datosPedido = {
        mesa: numeroMesa,
        platos: pedidoActual,
        fecha: new Date().toLocaleTimeString()
    };

    // Emitir el evento al servidor
    socket.emit('nuevo-pedido', datosPedido);

    // Limpiar el pedido después de enviar
    pedidoActual = [];
    renderizarPedido();
    alert('¡Pedido enviado a la cocina con éxito!');
}
