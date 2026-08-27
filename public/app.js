// ==========================================
// ANITA-WOK - SISTEMA DE COMANDAS & CARTA COMPLETA
// Lógica de Precios Dinámicos (Mesa / Llevar)
// ==========================================

const socket = io();

// Base de Datos Oficial con Tarifas Diferenciadas (Mesa y Llevar)
const productos = [
  // 1. CHIFA Y CRIOLLO
  { id: 1, cat: 'chifa', nombre: 'Chaufa de Pollo', mesa: 13.50, llevar: 14.00, desc: 'Arroz salteado al wok, trozos de pollo, huevo, sillao y cebollita china.', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop' },
  { id: 2, cat: 'chifa', nombre: 'Aeropuerto de Pollo', mesa: 13.50, llevar: 14.00, desc: 'Mezcla de arroz chaufa, fideo frito al wok, pollo y frijolito chino.', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop' },
  { id: 3, cat: 'chifa', nombre: 'Aeropuerto de Chancho', mesa: 14.50, llevar: 15.00, desc: 'Chaufa, fideo salteado, trozos de chancho asado char siu y frijolito chino.', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop' },
  { id: 4, cat: 'chifa', nombre: 'Chaufa de Chancho', mesa: 14.50, llevar: 15.00, desc: 'Arroz salteado al wok con jugosos cortes de chancho asado dulce.', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop' },
  { id: 5, cat: 'chifa', nombre: 'Chihaukay con Chaufa', mesa: 16.00, llevar: 16.50, desc: 'Pollo crujiente en salsa de ostión con ajonjolí acompañado de arroz chaufa.', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&auto=format&fit=crop' },
  { id: 6, cat: 'chifa', nombre: 'Chihaukay con Aeropuerto', mesa: 16.00, llevar: 16.50, desc: 'Pollo empanizado en salsa de ostión servido sobre una base de aeropuerto.', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&auto=format&fit=crop' },
  { id: 7, cat: 'chifa', nombre: 'Tipakay con Chaufa', mesa: 16.00, llevar: 16.50, desc: 'Chicharrón de pollo agridulce bañado en salsa tamarindo con chaufa.', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=400&auto=format&fit=crop' },
  { id: 8, cat: 'chifa', nombre: 'Tipakay con Aeropuerto', mesa: 16.00, llevar: 16.50, desc: 'Chicharrón de pollo en salsa tamarindo agridulce acompañado de aeropuerto.', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=400&auto=format&fit=crop' },
  { id: 9, cat: 'chifa', nombre: 'Combinado', mesa: 16.00, llevar: 16.50, desc: 'Clásica combinación de arroz chaufa de pollo y tallarín saltado chino.', img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=400&auto=format&fit=crop' },
  { id: 10, cat: 'chifa', nombre: 'Amazónico', mesa: 16.00, llevar: 16.50, desc: 'Chaufa especial salteado con cecina ahumada, plátano frito y especias.', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop' },
  { id: 11, cat: 'chifa', nombre: 'Aeropuerto Amazónico', mesa: 16.00, llevar: 16.50, desc: 'Chaufa y fideos salteados con fina cecina de la selva y platano bellaco.', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop' },
  { id: 12, cat: 'chifa', nombre: 'Salvaje', mesa: 14.50, llevar: 15.00, desc: 'Chaufa potente al wok servido con salchicha regional salteada y huevo.', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop' },
  { id: 13, cat: 'chifa', nombre: 'Pollo con Verduras', mesa: 15.00, llevar: 15.50, desc: 'Pechuga de pollo troceada con col china, pacoy, pimiento y holantao.', img: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=400&auto=format&fit=crop' },
  { id: 14, cat: 'chifa', nombre: 'Pollo Saltado', mesa: 15.00, llevar: 15.50, desc: 'Jugosos trozos de pechuga salteados con cebolla, tomate y papas fritas.', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop' },
  { id: 15, cat: 'chifa', nombre: 'Tallarín Saltado Chino', mesa: 14.00, llevar: 14.00, desc: 'Fideos salteados al wok con frijolito chino, cebolla china y pollo.', img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=400&auto=format&fit=crop' },
  { id: 16, cat: 'chifa', nombre: 'Tallarín Saltado Criollo', mesa: 15.00, llevar: 15.50, desc: 'Tallarines salteados con jugosa carne de res, tomate y cebolla en gajos.', img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=400&auto=format&fit=crop' },
  { id: 17, cat: 'chifa', nombre: 'Sopa Wantán', mesa: 10.00, llevar: 10.00, desc: 'Caldo claro de ave con wantanes rellenos, col china y gotas de aceite de ajonjolí.', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop' },
  { id: 18, cat: 'chifa', nombre: '12 Wantán Frito', mesa: 12.00, llevar: 12.00, desc: 'Docena de láminas crujientes rellenas de pollo fritas con salsa tamarindo.', img: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=400&auto=format&fit=crop' },
  { id: 19, cat: 'chifa', nombre: '6 Wantán Frito', mesa: 6.00, llevar: 6.00, desc: '6 wantanes crujientes rellenos acompañados de salsa tamarindo agridulce.', img: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=400&auto=format&fit=crop' },
  { id: 20, cat: 'chifa', nombre: 'Caldo con Huevo', mesa: 8.50, llevar: 8.50, desc: 'Sustancioso caldo de pollo caliente escalfado con huevo fresco.', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop' },
  { id: 21, cat: 'chifa', nombre: 'Caldo con Presa', mesa: 12.00, llevar: 12.00, desc: 'Caldo concentrado reconfortante servido con una presa entera de pollo.', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop' },
  { id: 22, cat: 'chifa', nombre: 'Mostrito', mesa: 16.00, llevar: 16.50, desc: 'Combinado contundente de arroz chaufa, papas fritas crocantes y pollo broaster.', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400&auto=format&fit=crop' },
  { id: 23, cat: 'chifa', nombre: 'Broaster', mesa: 13.00, llevar: 13.00, desc: 'Presa de pollo crujiente estilo broaster servido con papas fritas amarrillas.', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400&auto=format&fit=crop' },

  // 2. COMPARTIDOS
  { id: 24, cat: 'compartir', nombre: 'Chaufa de Pollo (Compartir)', mesa: 20.00, llevar: 20.00, desc: 'Porción familiar de arroz chaufa con abundante pollo y tortilla de huevo.', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop' },
  { id: 25, cat: 'compartir', nombre: 'Aeropuerto de Pollo (Compartir)', mesa: 20.00, llevar: 20.00, desc: 'Bandeja grande de chaufa con tallarín salteado al wok y frijolito chino.', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop' },
  { id: 26, cat: 'compartir', nombre: 'Aeropuerto de Chancho (Compartir)', mesa: 20.00, llevar: 20.00, desc: 'Porción familiar de aeropuerto salteado con chancho asado char siu.', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop' },
  { id: 27, cat: 'compartir', nombre: 'Chaufa de Chancho (Compartir)', mesa: 20.00, llevar: 20.00, desc: 'Bandeja familiar de chaufa salteado con jugoso chancho asado.', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop' },
  { id: 28, cat: 'compartir', nombre: 'Amazónico (Compartir)', mesa: 20.00, llevar: 20.00, desc: 'Porción gigante de chaufa de cecina con plátano maduro frito.', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop' },
  { id: 29, cat: 'compartir', nombre: 'Aeropuerto Amazónico (Compartir)', mesa: 20.00, llevar: 20.00, desc: 'Bandeja familiar de aeropuerto con trozos ahumados de cecina de la selva.', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop' },

  // 3. BEBIDAS
  { id: 30, cat: 'bebidas', nombre: 'Chicha 1L', mesa: 8.00, llevar: 8.00, desc: 'Jarra de chicha morada artesanal heladita con toques de piña y limón.', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop' },
  { id: 31, cat: 'bebidas', nombre: 'Chicha 1/2 L', mesa: 4.00, llevar: 4.00, desc: 'Medio litro de chicha morada artesanal muy helada.', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop' },
  { id: 32, cat: 'bebidas', nombre: 'Maracuyá 1L', mesa: 8.00, llevar: 8.00, desc: 'Refresco natural de pura pulpa de maracuyá helada de 1 Litro.', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400&auto=format&fit=crop' },
  { id: 33, cat: 'bebidas', nombre: 'Maracuyá 1/2 L', mesa: 4.00, llevar: 4.00, desc: 'Medio litro de refresco natural de maracuyá helado.', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400&auto=format&fit=crop' },
  { id: 34, cat: 'bebidas', nombre: 'Gaseosa Personal', mesa: 3.00, llevar: 3.00, desc: 'Gaseosa personal helada a elección (Inca Kola / Coca Cola).', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop' },
  { id: 35, cat: 'bebidas', nombre: 'Gaseosa 1/2 L', mesa: 5.00, llevar: 5.00, desc: 'Botella de gaseosa de 500ml heladita.', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop' },
  { id: 36, cat: 'bebidas', nombre: 'Descartable 1/2 L', mesa: 4.50, llevar: 4.50, desc: 'Gaseosa de medio litro en envase descartable práctico.', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop' },
  { id: 37, cat: 'bebidas', nombre: 'Gaseosa 1L', mesa: 7.00, llevar: 7.00, desc: 'Gaseosa de 1 Litro helada ideal para 2 o 3 personas.', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop' },
  { id: 38, cat: 'bebidas', nombre: 'Gaseosa 1.5L', mesa: 9.00, llevar: 9.00, desc: 'Gaseosa grande de 1.5 Litros helada.', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop' },
  { id: 39, cat: 'bebidas', nombre: 'Agua Personal', mesa: 2.00, llevar: 2.00, desc: 'Botella de agua mineral de 500ml sin gas.', img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?q=80&w=400&auto=format&fit=crop' },
  { id: 40, cat: 'bebidas', nombre: 'Guaraná Personal', mesa: 2.50, llevar: 2.50, desc: 'Lata o botella de Guaraná helada personal.', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop' },
  { id: 41, cat: 'bebidas', nombre: 'Sporade', mesa: 3.00, llevar: 3.00, desc: 'Bebida rehidratante Sporade helada.', img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?q=80&w=400&auto=format&fit=crop' },

  // 4. EXTRAS
  { id: 42, cat: 'extras', nombre: 'Huevo Frito', mesa: 2.00, llevar: 2.00, desc: 'Huevo de gallina frito con yema blanda o bien cocida.', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop' },
  { id: 43, cat: 'extras', nombre: 'Plátano Frito', mesa: 6.00, llevar: 6.00, desc: 'Porción de plátanos maduros fritos caramelizados.', img: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=400&auto=format&fit=crop' },
  { id: 44, cat: 'extras', nombre: 'Pollo Frito', mesa: 8.00, llevar: 8.00, desc: 'Porción adicional de pechuga de pollo frita salteada.', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400&auto=format&fit=crop' },
  { id: 45, cat: 'extras', nombre: 'Huevo Sancochado', mesa: 2.00, llevar: 2.00, desc: 'Huevo sancochado de gallina.', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop' },
  { id: 46, cat: 'extras', nombre: 'Presa de Caldo', mesa: 6.00, llevar: 6.00, desc: 'Presa adicional de pollo suave para caldo.', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop' },
  { id: 47, cat: 'extras', nombre: 'Chorizo Frito', mesa: 4.00, llevar: 4.00, desc: 'Porción de chorizo ahumado frito al wok.', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop' }
];

// Estado global
let pedido = [];
let categoriaActual = 'chifa';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  actualizarResumenHTML();
});

// 1. Renderizar Menú de Platos (Grid de 3 Columnas Horizontal)
function renderMenu() {
  const contenedor = document.getElementById('contenedor-menu');
  if (!contenedor) return;

  const selectorMesa = document.getElementById('mesa');
  const esLlevar = selectorMesa ? selectorMesa.value === 'Llevar' : false;

  const productosFiltrados = productos.filter(p => p.cat === categoriaActual);
  contenedor.innerHTML = '';

  if (productosFiltrados.length === 0) {
    contenedor.innerHTML = '<div class="col-12 text-center text-muted py-4">No hay productos en esta categoría.</div>';
    return;
  }

  productosFiltrados.forEach(p => {
    const precio = esLlevar ? p.llevar : p.mesa;
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="dish-card">
        <div class="dish-name">${p.nombre}</div>
        <img src="${p.img}" class="dish-img" alt="${p.nombre}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x250?text=ANITA-WOK'">
        <div class="dish-desc">${p.desc}</div>
        <div class="dish-price">S/ ${precio.toFixed(2)} ${esLlevar ? '<small style="font-size:0.65rem;" class="text-danger">(Llevar)</small>' : ''}</div>
        <button class="btn btn-add-dish" onclick="agregarAlPedido(${p.id})">
          <i class="fa-solid fa-plus me-1"></i> Agregar
        </button>
      </div>
    `;
    contenedor.appendChild(col);
  });
}

// 2. Filtro de Categorías
function verCategoria(cat, btnElement) {
  categoriaActual = cat;
  if (btnElement) {
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('btn-danger', 'active');
      btn.classList.add('btn-outline-secondary');
    });
    btnElement.classList.remove('btn-outline-secondary');
    btnElement.classList.add('btn-danger', 'active');
  }
  renderMenu();
}

// 3. Cambiar Tipo de Pedido (Recalcula Tarifas Mesa vs. Llevar)
function cambiarTipoPedido() {
  const selectorMesa = document.getElementById('mesa');
  const esLlevar = selectorMesa ? selectorMesa.value === 'Llevar' : false;

  // Actualizar los precios del pedido actual
  pedido.forEach(item => {
    const prod = productos.find(p => p.id === item.id);
    if (prod) {
      item.precio = esLlevar ? prod.llevar : prod.mesa;
    }
  });

  renderMenu();
  actualizarResumenHTML();
}

// 4. Agregar Plato a la Comanda
function agregarAlPedido(idProd) {
  const selectorMesa = document.getElementById('mesa');
  const esLlevar = selectorMesa ? selectorMesa.value === 'Llevar' : false;

  const prod = productos.find(p => p.id === idProd);
  if (!prod) return;

  const precio = esLlevar ? prod.llevar : prod.mesa;
  const itemExistente = pedido.find(p => p.id === idProd && !p.observacion);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    pedido.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: precio,
      cantidad: 1,
      observacion: ''
    });
  }

  actualizarResumenHTML();
}

// 5. Cambiar Cantidad desde la Comanda
function cambiarCantidad(index, cambio) {
  if (pedido[index]) {
    pedido[index].cantidad += cambio;
    if (pedido[index].cantidad <= 0) {
      pedido.splice(index, 1);
    }
  }
  actualizarResumenHTML();
}

// 6. Actualizar Observación por Plato (ej. Sin Cebolla China, Sin Frejol)
function actualizarObservacion(index, texto) {
  if (pedido[index]) {
    pedido[index].observacion = texto;
  }
}

// 7. Renderizar Panel Lateral (Comanda Activa)
function actualizarResumenHTML() {
  const contenedorResumen = document.getElementById('lista-pedido');
  if (!contenedorResumen) return;

  if (pedido.length === 0) {
    contenedorResumen.innerHTML = '<p class="text-muted text-center py-4 my-0 small">No hay platos agregados</p>';
    return;
  }

  let html = '<div class="d-flex flex-column gap-2">';
  let totalGeneral = 0;

  pedido.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    totalGeneral += subtotal;

    html += `
      <div class="bg-white p-2 rounded border shadow-sm">
        <div class="d-flex justify-content-between align-items-center">
          <div style="flex: 1; padding-right: 5px;">
            <div class="fw-bold text-dark" style="font-size: 0.82rem; line-height: 1.1;">${item.nombre}</div>
            <small class="text-danger fw-bold" style="font-size: 0.78rem;">S/ ${subtotal.toFixed(2)}</small>
          </div>
          <div class="d-flex align-items-center gap-1">
            <button class="btn btn-sm btn-outline-danger px-2 py-0" onclick="cambiarCantidad(${index}, -1)">-</button>
            <span class="fw-bold px-1" style="font-size: 0.85rem;">${item.cantidad}</span>
            <button class="btn btn-sm btn-outline-success px-2 py-0" onclick="cambiarCantidad(${index}, 1)">+</button>
          </div>
        </div>
        <div class="mt-1">
          <input type="text" class="form-control form-control-sm" style="font-size: 0.72rem; padding: 2px 6px;"
                 placeholder="Espec. (ej: Sin china, sin frejol)" value="${item.observacion}" 
                 onchange="actualizarObservacion(${index}, this.value)">
        </div>
      </div>
    `;
  });

  html += `
    </div>
    <div class="d-flex justify-content-between align-items-center border-top mt-3 pt-2">
      <span class="fw-bold text-uppercase text-muted small">TOTAL:</span>
      <span class="fw-extrabold text-danger fs-5">S/ ${totalGeneral.toFixed(2)}</span>
    </div>
  `;

  contenedorResumen.innerHTML = html;
}

// 8. Enviar Comanda a Cocina
function enviarComanda() {
  const selectorMesa = document.getElementById('mesa');
  const mesaSeleccionada = selectorMesa ? selectorMesa.value : 'Mesa 1';

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

  if (typeof socket !== 'undefined') {
    socket.emit('nuevo-pedido', datosPedido);
  }

  pedido = [];
  actualizarResumenHTML();
  alert(`🚀 ¡Comanda enviada a cocina para ${mesaSeleccionada}!`);
}

// Escuchar Comandas en Vista Cocina
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
        const obs = item.observacion ? `<br><small style="color: #d32f2f; font-weight: bold;">⚠️ ${item.observacion}</small>` : '';
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
    tarjeta.style.opacity = '0.75';
  }
}

function eliminarComanda(boton) {
  const tarjeta = boton.closest('.comanda-card');
  tarjeta.remove();
  if (contenedorComandas && contenedorComandas.children.length === 0) {
    contenedorComandas.innerHTML = '<p style="color: #aaa; text-align: center; width: 100%; margin-top: 30px;">Esperando comandas...</p>';
  }
}
