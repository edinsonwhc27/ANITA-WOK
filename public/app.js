const socket = io();

// Base de Datos de Productos con tarifas para Mesa y Llevar
const productos = [
    // 1. Chifa y Criollo
    { id: 1, cat: 'chifa', nombre: 'Chaufa de Pollo', mesa: 13.50, llevar: 14.00, img: 'img/chaufa-pollo.jpg' },
    { id: 2, cat: 'chifa', nombre: 'Aeropuerto de Pollo', mesa: 13.50, llevar: 14.00, img: 'img/aeropuerto-pollo.jpg' },
    { id: 3, cat: 'chifa', nombre: 'Aeropuerto de Chancho', mesa: 14.50, llevar: 15.00, img: 'img/aeropuerto-chancho.jpg' },
    { id: 4, cat: 'chifa', nombre: 'Chaufa de Chancho', mesa: 14.50, llevar: 15.00, img: 'img/chaufa-chancho.jpg' },
    { id: 5, cat: 'chifa', nombre: 'Chihaukay con Chaufa', mesa: 16.00, llevar: 16.50, img: 'img/chihaukay-chaufa.jpg' },
    { id: 6, cat: 'chifa', nombre: 'Chihaukay con Aeropuerto', mesa: 16.00, llevar: 16.50, img: 'img/chihaukay-aero.jpg' },
    { id: 7, cat: 'chifa', nombre: 'Tipakay con Chaufa', mesa: 16.00, llevar: 16.50, img: 'img/tipakay-chaufa.jpg' },
    { id: 8, cat: 'chifa', nombre: 'Tipakay con Aeropuerto', mesa: 16.00, llevar: 16.50, img: 'img/tipakay-aero.jpg' },
    { id: 9, cat: 'chifa', nombre: 'Combinado', mesa: 16.00, llevar: 16.50, img: 'img/combinado.jpg' },
    { id: 10, cat: 'chifa', nombre: 'Amazónico', mesa: 16.00, llevar: 16.50, img: 'img/amazonico.jpg' },
    { id: 11, cat: 'chifa', nombre: 'Aeropuerto Amazónico', mesa: 16.00, llevar: 16.50, img: 'img/aero-amazonico.jpg' },
    { id: 12, cat: 'chifa', nombre: 'Salvaje', mesa: 14.50, llevar: 15.00, img: 'img/salvaje.jpg' },
    { id: 13, cat: 'chifa', nombre: 'Pollo con Verduras', mesa: 15.00, llevar: 15.50, img: 'img/pollo-verduras.jpg' },
    { id: 14, cat: 'chifa', nombre: 'Pollo Saltado', mesa: 15.00, llevar: 15.50, img: 'img/pollo-saltado.jpg' },
    { id: 15, cat: 'chifa', nombre: 'Tallarín Saltado Chino', mesa: 14.00, llevar: 14.00, img: 'img/tallarin-chino.jpg' },
    { id: 16, cat: 'chifa', nombre: 'Tallarín Saltado Criollo', mesa: 15.00, llevar: 15.50, img: 'img/tallarin-criollo.jpg' },
    { id: 17, cat: 'chifa', nombre: 'Sopa Wantán', mesa: 10.00, llevar: 10.00, img: 'img/sopa-wantan.jpg' },
    { id: 18, cat: 'chifa', nombre: '12 Wantán Frito', mesa: 12.00, llevar: 12.00, img: 'img/wantan-12.jpg' },
    { id: 19, cat: 'chifa', nombre: '6 Wantán Frito', mesa: 6.00, llevar: 6.00, img: 'img/wantan-6.jpg' },
    { id: 20, cat: 'chifa', nombre: 'Caldo con Huevo', mesa: 8.50, llevar: 8.50, img: 'img/caldo-huevo.jpg' },
    { id: 21, cat: 'chifa', nombre: 'Caldo con Presa', mesa: 12.00, llevar: 12.00, img: 'img/caldo-presa.jpg' },
    { id: 22, cat: 'chifa', nombre: 'Mostrito', mesa: 16.00, llevar: 16.50, img: 'img/mostrito.jpg' },
    { id: 23, cat: 'chifa', nombre: 'Broaster', mesa: 13.00, llevar: 13.00, img: 'img/broaster.jpg' },

    // 2. Compartidos
    { id: 24, cat: 'compartir', nombre: 'Chaufa de Pollo (Compartir)', mesa: 20.00, llevar: 20.00, img: 'img/chaufa-familia.jpg' },
    { id: 25, cat: 'compartir', nombre: 'Aeropuerto de Pollo (Compartir)', mesa: 20.00, llevar: 20.00, img: 'img/aero-familia.jpg' },
    { id: 26, cat: 'compartir', nombre: 'Aeropuerto de Chancho (Compartir)', mesa: 20.00, llevar: 20.00, img: 'img/aero-chancho-familia.jpg' },
    { id: 27, cat: 'compartir', nombre: 'Chaufa de Chancho (Compartir)', mesa: 20.00, llevar: 20.00, img: 'img/chaufa-chancho-familia.jpg' },
    { id: 28, cat: 'compartir', nombre: 'Amazónico (Compartir)', mesa: 20.00, llevar: 20.00, img: 'img/amazonico-familia.jpg' },
    { id: 29, cat: 'compartir', nombre: 'Aeropuerto Amazónico (Compartir)', mesa: 20.00, llevar: 20.00, img: 'img/aero-amazonico-familia.jpg' },

    // 3. Bebidas
    { id: 30, cat: 'bebidas', nombre: 'Chicha 1L', mesa: 8.00, llevar: 8.00, img: 'img/chicha-1l.jpg' },
    { id: 31, cat: 'bebidas', nombre: 'Chicha 1/2 L', mesa: 4.00, llevar: 4.00, img: 'img/chicha-half.jpg' },
    { id: 32, cat: 'bebidas', nombre: 'Maracuyá 1L', mesa: 8.00, llevar: 8.00, img: 'img/maracuya-1l.jpg' },
    { id: 33, cat: 'bebidas', nombre: 'Maracuyá 1/2 L', mesa: 4.00, llevar: 4.00, img: 'img/maracuya-half.jpg' },
    { id: 34, cat: 'bebidas', nombre: 'Gaseosa Personal', mesa: 3.00, llevar: 3.00, img: 'img/gaseosa-personal.jpg' },
    { id: 35, cat: 'bebidas', nombre: 'Gaseosa 1/2 L', mesa: 5.00, llevar: 5.00, img: 'img/gaseosa-500.jpg' },
    { id: 36, cat: 'bebidas', nombre: 'Descartable 1/2 L', mesa: 4.50, llevar: 4.50, img: 'img/descartable-500.jpg' },
    { id: 37, cat: 'bebidas', nombre: 'Gaseosa 1L', mesa: 7.00, llevar: 7.00, img: 'img/gaseosa-1l.jpg' },
    { id: 38, cat: 'bebidas', nombre: 'Gaseosa 1.5L', mesa: 9.00, llevar: 9.00, img: 'img/gaseosa-15l.jpg' },
    { id: 39, cat: 'bebidas', nombre: 'Agua Personal', mesa: 2.00, llevar: 2.00, img: 'img/agua.jpg' },
    { id: 40, cat: 'bebidas', nombre: 'Guaraná Personal', mesa: 2.50, llevar: 2.50, img: 'img/guarana.jpg' },
    { id: 41, cat: 'bebidas', nombre: 'Sporade', mesa: 3.00, llevar: 3.00, img: 'img/sporade.jpg' },

    // 4. Extras
    { id: 42, cat: 'extras', nombre: 'Huevo Frito', mesa: 2.00, llevar: 2.00, img: 'img/huevo-frito.jpg' },
    { id: 43, cat: 'extras', nombre: 'Plátano Frito', mesa: 6.00, llevar: 6.00, img: 'img/platano-frito.jpg' },
    { id: 44, cat: 'extras', nombre: 'Pollo Frito', mesa: 8.00, llevar: 8.00, img: 'img/pollo-frito.jpg' },
    { id: 45, cat: 'extras', nombre: 'Huevo Sancochado', mesa: 2.00, llevar: 2.00, img: 'img/huevo-sancochado.jpg' },
    { id: 46, cat: 'extras', nombre: 'Presa de Caldo', mesa: 6.00, llevar: 6.00, img: 'img/presa-caldo.jpg' },
    { id: 47, cat: 'extras', nombre: 'Chorizo Frito', mesa: 4.00, llevar: 4.00, img: 'img/chorizo-frito.jpg' }
];

let pedido = [];
let categoriaActual = 'chifa';

// Renderizar Menú
function renderMenu() {
    const contenedor = document.getElementById('contenedor-menu');
    if (!contenedor) return;

    const esLlevar = document.getElementById('mesa').value === 'Llevar';
    const productosFiltrados = productos.filter(p => p.cat === categoriaActual);

    let html = '<div class="menu-grid">';
    productosFiltrados.forEach(p => {
        const precio = esLlevar ? p.llevar : p.mesa;
        html += `
            <div class="menu-card">
                <img src="${p.img}" onerror="this.src='https://via.placeholder.com/100?text=ANITA-WOK'" alt="${p.nombre}">
                <div class="menu-card-title">${p.nombre}</div>
                <div class="menu-card-price">S/ ${precio.toFixed(2)}</div>
                <button class="btn-add" onclick="agregarAlPedido(${p.id})">+ Agregar</button>
            </div>
        `;
    });
    html += '</div>';
    contenedor.innerHTML = html;
}

function verCategoria(cat) {
    categoriaActual = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderMenu();
}

function cambiarTipoPedido() {
    // Al cambiar entre Mesa y Llevar, recalcula precios en menú y pedido actual
    const esLlevar = document.getElementById('mesa').value === 'Llevar';
    pedido.forEach(item => {
        const prod = productos.find(p => p.id === item.id);
        item.precio = esLlevar ? prod.llevar : prod.mesa;
    });
    renderMenu();
    actualizarResumenHTML();
}

function agregarAlPedido(idProd) {
    const esLlevar = document.getElementById('mesa').value === 'Llevar';
    const prod = productos.find(p => p.id === idProd);
    const precio = esLlevar ? prod.llevar : prod.mesa;

    const itemExistente = pedido.find(p => p.id === idProd && !p.observacion);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        pedido.push({ id: prod.id, nombre: prod.nombre, precio: precio, cantidad: 1, observacion: '' });
    }

    actualizarResumenHTML();
}

function actualizarObservacion(index, texto) {
    pedido[index].observacion = texto;
}

function actualizarResumenHTML() {
    const contenedorResumen = document.getElementById('lista-pedido');
    if (!contenedorResumen) return;

    if (pedido.length === 0) {
        contenedorResumen.innerHTML = '<p style="color: #777; text-align: center;">No hay platos agregados</p>';
        return;
    }

    let html = '';
    let totalGeneral = 0;

    pedido.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;
        html += `
            <div style="border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 8px;">
                <div class="resumen-item">
                    <span><b>${item.cantidad}x</b> ${item.nombre} (S/ ${subtotal.toFixed(2)})</span>
                    <button class="btn-danger" onclick="eliminarDelPedido(${index})">❌</button>
                </div>
                <input type="text" placeholder="Espec. (ej: Sin china, sin frejol)" value="${item.observacion}" 
                       onchange="actualizarObservacion(${index}, this.value)" 
                       style="font-size: 12px; padding: 4px; margin-bottom: 0;">
            </div>
        `;
    });

    html += `
        <div style="margin-top: 10px; font-weight: bold; font-size: 16px; text-align: right; color: #d32f2f;">
            TOTAL: S/ ${totalGeneral.toFixed(2)}
        </div>
    `;

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
        alert('Debes agregar al menos un plato antes de enviar.');
        return;
    }

    let totalGeneral = 0;
    pedido.forEach(item => totalGeneral += (item.precio * item.cantidad));

    const datosPedido = {
        id: Date.now(),
        mesa: mesaSeleccionada,
        platos: pedido,
        total: totalGeneral.toFixed(2),
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socket.emit('nuevo-pedido', datosPedido);

    pedido = [];
    actualizarResumenHTML();
    alert(`¡Pedido enviado a cocina para ${mesaSeleccionada}!`);
}

// Carga inicial
renderMenu();

// Lógica de Cocina
const contenedorComandas = document.getElementById('contenedor-comandas');
if (contenedorComandas) {
    socket.on('nuevo-pedido', (datos) => {
        const mensajeVacio = contenedorComandas.querySelector('p');
        if (mensajeVacio) mensajeVacio.remove();

        const tarjeta = document.createElement('div');
        tarjeta.className = 'comanda-card';
        tarjeta.id = `comanda-${datos.id}`;

        let itemsHtml = '';
        if (datos.platos && Array.isArray(datos.platos)) {
            datos.platos.forEach(item => {
                const obs = item.observacion ? `<br><small style="color: red; font-weight: bold;">⚠️ ${item.observacion}</small>` : '';
                itemsHtml += `<li style="margin-bottom: 6px;"><b>${item.cantidad}x</b> ${item.nombre} ${obs}</li>`;
            });
        }

        tarjeta.innerHTML = `
            <h3>${datos.mesa} <small>(${datos.hora || ''})</small></h3>
            <ul class="lista-items">${itemsHtml}</ul>
            <div style="margin: 10px 0; font-weight: bold; color: #28a745; font-size: 16px;">
                TOTAL: S/ ${datos.total || '0.00'}
            </div>
            <div class="acciones">
                <button class="btn btn-preparar" onclick="cambiarEstado(this, 'preparando')">En Preparación</button>
                <button class="btn btn-listo" onclick="cambiarEstado(this, 'listo')">Listo</button>
                <button class="btn btn-entregado" onclick="eliminarComanda(this)">Entregado / Borrar</button>
            </div>
        `;

        contenedorComandas.appendChild(tarjeta);
    });
}

function cambiarEstado(boton, estado) {
    const tarjeta = boton.closest('.comanda-card');
    if (estado === 'preparando') tarjeta.style.border = '3px solid #ffc107';
    else if (estado === 'listo') {
        tarjeta.style.border = '3px solid #28a745';
        tarjeta.style.opacity = '0.7';
    }
}

function eliminarComanda(boton) {
    const tarjeta = boton.closest('.comanda-card');
    tarjeta.remove();
    if (contenedorComandas.children.length === 0) {
        contenedorComandas.innerHTML = '<p style="color: #aaa; text-align: center; width: 100%; margin-top: 30px;">Esperando comandas...</p>';
    }
}
