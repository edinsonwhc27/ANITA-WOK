// ==========================================
// ANITA-WOK - LÓGICA DEL CLIENTE Y CARTA COMPLETA
// ==========================================

const socket = io();

// Base de datos completa del menú de ANITA-WOK
const menuPlatos = [
  // ================= CHIFA Y CRIOLLO =================
  {
    id: 1,
    categoria: 'chifa',
    nombre: 'Arroz Chaufa de Pollo',
    imagen: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Arroz salteado al wok con trozos de pollo, huevo, sillao y cebollita china.',
    precio: 18.00
  },
  {
    id: 2,
    categoria: 'chifa',
    nombre: 'Arroz Chaufa de Carne',
    imagen: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Arroz salteado con finos cortes de carne de res, tortilla de huevo y sillao.',
    precio: 22.00
  },
  {
    id: 3,
    categoria: 'chifa',
    nombre: 'Arroz Chaufa Especial',
    imagen: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Mezcla perfecta de pollo, carne de res, cerdo char siu y langostinos.',
    precio: 26.00
  },
  {
    id: 4,
    categoria: 'chifa',
    nombre: 'Lomo Saltado',
    imagen: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Trozos de lomo de res salteados con cebolla, tomate, ají amarillo y papas fritas.',
    precio: 26.00
  },
  {
    id: 5,
    categoria: 'chifa',
    nombre: 'Tallarín Saltado de Pollo',
    imagen: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Fideos salteados al wok con pechuga de pollo, pimiento, cebolla y verdura china.',
    precio: 20.00
  },
  {
    id: 6,
    categoria: 'chifa',
    nombre: 'Tallarín Saltado de Carne',
    imagen: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Fideos salteados al estilo chifa con trozos de res y salsa de ostión.',
    precio: 24.00
  },
  {
    id: 7,
    categoria: 'chifa',
    nombre: 'Aeropuerto Especial',
    imagen: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Combinación de arroz chaufa, tallarín frito, frijolito chino y mixtura de carnes.',
    precio: 25.00
  },
  {
    id: 8,
    categoria: 'chifa',
    nombre: 'Pollo Tipakay',
    imagen: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Crujiente chicharrón de pollo empanizado bañado en salsa tamarindo agridulce.',
    precio: 22.00
  },
  {
    id: 9,
    categoria: 'chifa',
    nombre: 'Pollo Chi Jau Kay',
    imagen: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Muslo de pollo sin hueso crocante, bañado en salsa de ostión y semillas de ajonjolí.',
    precio: 22.00
  },
  {
    id: 10,
    categoria: 'chifa',
    nombre: 'Kam Lu Wantan',
    imagen: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Wantanes fritos con pollo, cerdo char siu, piña, pimiento y salsa agridulce.',
    precio: 28.00
  },

  // ================= COMPARTIDOS Y ENTRADAS =================
  {
    id: 11,
    categoria: 'compartir',
    nombre: 'Wantan Frito (12 uds)',
    imagen: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Docena de láminas crujientes rellenas de carne servidas con salsa tamarindo.',
    precio: 14.00
  },
  {
    id: 12,
    categoria: 'compartir',
    nombre: 'Sopa Wantan Especial',
    imagen: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Sustancioso caldo con wantanes rellenos, verdura china, pollo y col china.',
    precio: 18.00
  },
  {
    id: 13,
    categoria: 'compartir',
    nombre: 'Sopa FuchifÚ',
    imagen: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Sopa espesa y caliente a base de pollo deshilachado, clara de huevo y kión.',
    precio: 16.00
  },
  {
    id: 14,
    categoria: 'compartir',
    nombre: 'Enrollado de Pollo',
    imagen: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Pollo rellenado con verduras frito y cortado en rodajas para compartir.',
    precio: 24.00
  },

  // ================= BEBIDAS =================
  {
    id: 15,
    categoria: 'bebidas',
    nombre: 'Chicha Morada (1 Litro)',
    imagen: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Jarra de chicha casera heladita, maíz morado con frutas, canela y limón.',
    precio: 10.00
  },
  {
    id: 16,
    categoria: 'bebidas',
    nombre: 'Inca Kola 1.5L',
    imagen: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Gaseosa Inca Kola helada de litro y medio.',
    precio: 10.00
  },
  {
    id: 17,
    categoria: 'bebidas',
    nombre: 'Coca Cola 1.5L',
    imagen: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Gaseosa Coca Cola helada de litro y medio.',
    precio: 10.00
  },
  {
    id: 18,
    categoria: 'bebidas',
    nombre: 'Agua Mineral Sin Gas',
    imagen: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Botella de agua personal de 500ml.',
    precio: 3.50
  },

  // ================= EXTRAS =================
  {
    id: 19,
    categoria: 'extras',
    nombre: 'Porción de Chaufa Personal',
    imagen: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Porción adicional de arroz chaufa salteado al wok.',
    precio: 8.00
  },
  {
    id: 20,
    categoria: 'extras',
    nombre: 'Porción de Papas Fritas',
    imagen: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Papas amarillas fritos crocantes recién hechas.',
    precio: 7.00
  },
  {
    id: 21,
    categoria: 'extras',
    nombre: 'Salsa Tamarindo Extra',
    imagen: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=400&auto=format&fit=crop',
    descripcion: 'Pote de salsa agridulce tamarindo artesanal.',
    precio: 3.00
  }
];

// Estado global de la comanda actual
let pedidoActual = [];
let categoriaSeleccionada = 'chifa';

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
  renderizarMenu(categoriaSeleccionada);
  actualizarResumenPedido();
});

// Renderizar Menú de Platos (Grid Horizontal de 3 columnas de Izquierda a Derecha)
function renderizarMenu(categoria) {
  categoriaSeleccionada = categoria;
  const contenedor = document.getElementById('contenedor-menu');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  const platosFiltrados = menuPlatos.filter(p => p.categoria === categoria);

  if (platosFiltrados.length === 0) {
    contenedor.innerHTML = '<div class="col-12 text-center text-muted py-4">No hay platos disponibles en esta categoría.</div>';
    return;
  }

  platosFiltrados.forEach(plato => {
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="dish-card">
        <div class="dish-name">${plato.nombre}</div>
        <img src="${plato.imagen}" class="dish-img" alt="${plato.nombre}" loading="lazy">
        <div class="dish-desc">${plato.descripcion}</div>
        <div class="dish-price">S/ ${plato.precio.toFixed(2)}</div>
        <button class="btn btn-add-dish" onclick="agregarAlPedido('${plato.nombre}', ${plato.precio})">
          <i class="fa-solid fa-plus me-1"></i> Agregar
        </button>
      </div>
    `;
    contenedor.appendChild(col);
  });
}

// Filtro por Categorías
function verCategoria(categoria) {
  renderizarMenu(categoria);
}

// Agregar elementos
function agregarAlPedido(nombre, precio) {
  const itemExistente = pedidoActual.find(item => item.nombre === nombre);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    pedidoActual.push({
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
  }

  actualizarResumenPedido();
}

// Cambiar cantidades
function cambiarCantidad(index, cambio) {
  if (pedidoActual[index]) {
    pedidoActual[index].cantidad += cambio;
    if (pedidoActual[index].cantidad <= 0) {
      pedidoActual.splice(index, 1);
    }
  }
  actualizarResumenPedido();
}

// Renderizar el resumen de la comanda
function actualizarResumenPedido() {
  const contenedorPedido = document.getElementById('lista-pedido');
  if (!contenedorPedido) return;

  if (pedidoActual.length === 0) {
    contenedorPedido.innerHTML = `<p class="text-muted text-center py-4 my-0 small">No hay platos agregados</p>`;
    return;
  }

  let html = '<div class="d-flex flex-column gap-2">';
  let totalCalculado = 0;

  pedidoActual.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    totalCalculado += subtotal;

    html += `
      <div class="d-flex justify-content-between align-items-center bg-white p-2 rounded border shadow-sm">
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
    `;
  });

  html += `
    </div>
    <div class="d-flex justify-content-between align-items-center border-top mt-3 pt-2">
      <span class="fw-bold text-uppercase text-muted small">Total:</span>
      <span class="fw-extrabold text-danger fs-5">S/ ${totalCalculado.toFixed(2)}</span>
    </div>
  `;

  contenedorPedido.innerHTML = html;
}

// Enviar Comanda mediante Socket.io
function enviarComanda() {
  if (pedidoActual.length === 0) {
    alert('Por favor, agrega al menos un plato a la comanda antes de enviar.');
    return;
  }

  const selectMesa = document.getElementById('mesa');
  const mesaUbicacion = selectMesa ? selectMesa.value : 'Mesa 1';

  const comanda = {
    id: Date.now(),
    mesa: mesaUbicacion,
    items: pedidoActual,
    total: pedidoActual.reduce((acc, item) => acc + (item.precio * item.cantidad), 0),
    fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  if (typeof socket !== 'undefined') {
    socket.emit('nueva-comanda', comanda);
  }

  alert(`🚀 Comanda de ${mesaUbicacion} enviada con éxito a cocina.`);

  pedidoActual = [];
  actualizarResumenPedido();
}
