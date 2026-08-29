// ==========================================
// ANITA-WOK - SISTEMA DE COMANDAS & CARTA COMPLETA
// ==========================================

const socket = io();

// Array de ventas acumuladas
let historialVentas = [];

// Base de Datos de Clientes Frecuentes (Persistente en el navegador)
let baseClientes = JSON.parse(localStorage.getItem('anita_wok_clientes')) || [
  { telefono: '987654321', nombre: 'Juan Pérez', direccion: 'Av. Brasil 450', referencia: 'Frente al parque' }
];

// Variable global para filtro por texto en tiempo real
let textoBusqueda = '';

// Base de Datos Oficial (47 Productos)
const productos = [
  // 1. CHIFA Y CRIOLLO
  { id: 1, cat: 'chifa', nombre: 'Chaufa de Pollo', mesa: 13.50, llevar: 14.00, desc: 'Arroz salteado al wok, trozos de pollo, huevo, sillao y cebollita china.', img: 'https://cdn.blog.paulinacocina.net/wp-content/uploads/2021/12/arroz-chaufa-peruano-receta.jpg' },
  { id: 2, cat: 'chifa', nombre: 'Aeropuerto de Pollo', mesa: 13.50, llevar: 14.00, desc: 'Mezcla de arroz chaufa, fideo frito al wok, pollo y frijolito chino.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJawZvEG8_kKwAvSzH9p949H4oUV6W0dJA4qBX4wd9-h2v5uq_CZ7p4VKB&s=10' },
  { id: 3, cat: 'chifa', nombre: 'Aeropuerto de Chancho', mesa: 14.50, llevar: 15.00, desc: 'Chaufa, fideo salteado, trozos de chancho asado char siu y frijolito chino.', img: 'https://www.renacerelpunto.com/wp-content/uploads/2024/09/AEROPUERTO-CON-CHANCHO.jpg' },
  { id: 4, cat: 'chifa', nombre: 'Chaufa de Chancho', mesa: 14.50, llevar: 15.00, desc: 'Arroz salteado al wok con jugosos cortes de chancho asado dulce.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj4V9ObLZd4U7U-hQS-lOj1ZaPczrhIVqDFmqhUJS4P_LQqpFTw341Ubc&s=10' },
  { id: 5, cat: 'chifa', nombre: 'Chihaukay', mesa: 16.00, llevar: 16.50, desc: 'Pollo crujiente en salsa de ostión con ajonjolí acompañado de arroz chaufa.', img: 'https://www.kioninternacional.com/wp-content/uploads/2025/01/chijaukaychaufa.jpg' },
  { id: 7, cat: 'chifa', nombre: 'Tipakay', mesa: 16.00, llevar: 16.50, desc: 'Chicharrón de pollo agridulce bañado en salsa tamarindo con chaufa.', img: 'https://img-global.cpcdn.com/recipes/819cb89210d39293/1200x630cq80/photo.jpg' },
  { id: 9, cat: 'chifa', nombre: 'Combinado', mesa: 16.00, llevar: 16.50, desc: 'Clásica combinación de arroz chaufa de pollo y tallarín saltado chino.', img: 'https://www.barcidda.pe/wp-content/uploads/2025/03/ThumbComi.jpg' },
  { id: 10, cat: 'chifa', nombre: 'Amazónico', mesa: 16.00, llevar: 16.50, desc: 'Chaufa especial salteado con cecina ahumada, plátano frito y especias.', img: 'https://thumbs.dreamstime.com/b/gastronom%C3%ADa-de-la-selva-peruana-arroz-chaufa-cecina-chino-con-en-un-plato-217503353.jpg' },
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
  { id: 30, cat: 'bebidas', nombre: 'Chicha 1L', mesa: 8.00, llevar: 8.00, desc: 'Jarra de chicha morada artesanal heladita con toques de piña y limón.', img: 'https://tofuu.getjusto.com/orioneat-local/resized2/Dq2a9m4rfFWNFDPuP-2400-x.webp' },
  { id: 31, cat: 'bebidas', nombre: 'Chicha 1/2 L', mesa: 4.00, llevar: 4.00, desc: 'Medio litro de chicha morada artesanal muy helada.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9T1qiLe8pWLGu8p51FZhs3WRfQRdKFBiUs7UY7PocH1gO_XQSGVS5TuA&s=10' },
  { id: 32, cat: 'bebidas', nombre: 'Maracuyá 1L', mesa: 8.00, llevar: 8.00, desc: 'Refresco natural de pura pulpa de maracuyá helada de 1 Litro.', img: 'https://89acebichados.pe/55-large_default/1l-refresco-de-maracuya.jpg' },
  { id: 33, cat: 'bebidas', nombre: 'Maracuyá 1/2 L', mesa: 4.00, llevar: 4.00, desc: 'Medio litro de refresco natural de maracuyá helado.', img: 'https://brasaycarbon.pe/wp-content/uploads/2020/12/bebida-limonada.jpg' },
  { id: 34, cat: 'bebidas', nombre: 'Gaseosa Personal', mesa: 3.00, llevar: 3.00, desc: 'Gaseosa personal helada a elección (Inca Kola / Coca Cola).', img: 'https://www.luchoschiken.com/wp-content/uploads/2025/02/personal-gas-450x450.jpg' },
  { id: 35, cat: 'bebidas', nombre: 'Gaseosa 1/2 L', mesa: 5.00, llevar: 5.00, desc: 'Botella de gaseosa de 500ml heladita.', img: 'https://www.luchoschiken.com/wp-content/uploads/2025/02/472001034_10160486343646297_4116197570323198730_n.jpg' },
  { id: 36, cat: 'bebidas', nombre: 'Descartable 1/2 L', mesa: 4.50, llevar: 4.50, desc: 'Gaseosa de medio litro en envase descartable práctico.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiBFMz87E6PPiKlCuvS0qtmuDyGWGLIxJvccV3I3EDGpKA5BMnyvpO7_Y&s=10' },
  { id: 37, cat: 'bebidas', nombre: 'Gaseosa 1L', mesa: 7.00, llevar: 7.00, desc: 'Gaseosa de 1 Litro helada ideal para 2 o 3 personas.', img: 'https://bodegamiguelito.com/wp-content/uploads/2024/12/coca-cola-1L-retornable-1-scaled.jpg' },
  { id: 38, cat: 'bebidas', nombre: 'Gaseosa 1.5L', mesa: 9.00, llevar: 9.00, desc: 'Gaseosa grande de 1.5 Litros helada.', img: 'https://bodegamiguelito.com/wp-content/uploads/2024/12/7801610231517_1.webp' },
  { id: 39, cat: 'bebidas', nombre: 'Agua Personal', mesa: 2.00, llevar: 2.00, desc: 'Botella de agua mineral de 500ml sin gas.', img: 'https://wongfood.vtexassets.com/arquivos/ids/724665/113736002-01-4590.jpg?v=638621159557400000' },
  { id: 40, cat: 'bebidas', nombre: 'Guaraná Personal', mesa: 2.50, llevar: 2.50, desc: 'Lata o botella de Guaraná helada personal.', img: 'https://plazavea.vteximg.com.br/arquivos/ids/6760540-450-450/20171726.jpg?v=637805496954900000' },
  { id: 41, cat: 'bebidas', nombre: 'Sporade', mesa: 3.00, llevar: 3.00, desc: 'Bebida rehidratante Sporade helada.', img: 'https://dojiw2m9tvv09.cloudfront.net/53648/product/X_sintitulo5393.png?77&t=1779419926' },

  // 4. EXTRAS
  { id: 42, cat: 'extras', nombre: 'Huevo Frito', mesa: 2.00, llevar: 2.00, desc: 'Huevo de gallina frito con yema blanda o bien cocida.', img: 'https://cadenaser.com/resizer/v2/4IP2ZGKZ5FBUBACTKMXQWXYYQY.jpg?auth=e2b8ad0529c7ef63cb6839e0e346719136f7152237cdf58f29c29c5891e8c357&quality=70&width=650&height=487&smart=true' },
  { id: 43, cat: 'extras', nombre: 'Plátano Frito', mesa: 6.00, llevar: 6.00, desc: 'Porción de plátanos maduros fritos caramelizados.', img: 'https://i.blogs.es/76517f/platano-frito/450_1000.jpeg' },
  { id: 44, cat: 'extras', nombre: 'Pollo Frito', mesa: 8.00, llevar: 8.00, desc: 'Porción adicional de pollo broaster.', img: 'https://images.getrecipekit.com/20230327184729-CompactAF_ButtermilkFriedChicken.jpg?quality=90&' },
  { id: 45, cat: 'extras', nombre: 'Huevo Sancochado', mesa: 2.00, llevar: 2.00, desc: 'Huevo sancochado de gallina.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIph_hkc1_D5IiX8CS4wLvyk3dtq1dzQaqV3cspf1cByPkgOELWLjaFNOw&s=10' },
  { id: 46, cat: 'extras', nombre: 'Presa de Caldo', mesa: 6.00, llevar: 6.00, desc: 'Presa adicional de pollo suave para caldo.', img: 'https://emofly.b-cdn.net/hbd_exvhac6ayb3ZKT/width:2048/plain/https%3A%2F%2Fstorage.googleapis.com%2Ftakeapp%2Fmedia%2Fcm3i7zt2j00000cjh7rdzelwd.jpg' },
  { id: 47, cat: 'extras', nombre: 'Chorizo Frito', mesa: 4.00, llevar: 4.00, desc: 'Porción de chorizo ahumado frito al wok.', img: 'https://i.blogs.es/3a13ea/chorizo-frito-arguinano/1200_630.jpeg' }
];

let pedido = [];
let categoriaActual = 'chifa';

document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  actualizarResumenHTML();

  // Escuchar automáticamente cualquier input de búsqueda existente en el HTML
  const buscadorHTML = document.getElementById('input-buscador') || document.getElementById('buscador');
  if (buscadorHTML) {
    buscadorHTML.addEventListener('input', (e) => {
      filtrarPorNombre(e.target.value);
    });
  }
});

// Función para filtrar por nombre en tiempo real
function filtrarPorNombre(texto) {
  textoBusqueda = texto.toLowerCase().trim();
  renderMenu();
}

// Renderizar Menú
function renderMenu() {
  const contenedor = document.getElementById('contenedor-menu');
  if (!contenedor) return;

  const selectorMesa = document.getElementById('mesa');
  const opcion = selectorMesa ? selectorMesa.value : '';
  const esLlevarODelivery = (opcion === 'Llevar' || opcion === 'Delivery');

  const productosFiltrados = productos.filter(p => {
    const coincideCat = (p.cat === categoriaActual);
    const coincideTexto = p.nombre.toLowerCase().includes(textoBusqueda);
    return coincideCat && coincideTexto;
  });

  contenedor.innerHTML = '';

  if (productosFiltrados.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-4">
        <p class="text-muted fw-bold">No se encontraron platos que coincidan.</p>
      </div>
    `;
    return;
  }

  productosFiltrados.forEach(p => {
    const precio = esLlevarODelivery ? p.llevar : p.mesa;
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="dish-card">
        <div class="dish-name">${p.nombre}</div>
        <img src="${p.img}" class="dish-img" alt="${p.nombre}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x250?text=ANITA-WOK'">
        <div class="dish-desc">${p.desc}</div>
        <div class="dish-price">S/ ${precio.toFixed(2)} ${esLlevarODelivery ? '<small style="font-size:0.65rem;" class="text-danger">(Llevar/Deliv.)</small>' : ''}</div>
        <button class="btn btn-add-dish" onclick="agregarAlPedido(${p.id})">
          <i class="fa-solid fa-plus me-1"></i> Agregar
        </button>
      </div>
    `;
    contenedor.appendChild(col);
  });
}

// Filtro por Categorías
function verCategoria(cat, btnElement) {
  categoriaActual = cat;
  textoBusqueda = '';
  
  const inputBuscador = document.getElementById('input-buscador') || document.getElementById('buscador');
  if (inputBuscador) inputBuscador.value = '';

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

// Opciones de Ubicación (Mesa 1-10 / Llevar / Delivery)
function cambiarTipoPedido() {
  const selectorMesa = document.getElementById('mesa');
  if (!selectorMesa) return;
  
  const opcion = selectorMesa.value;
  const contenedorDelivery = document.getElementById('contenedor-recargo-delivery');
  const bloqueCliente = document.getElementById('bloque-datos-cliente');
  const contDireccion = document.getElementById('contenedor-cliente-direccion');
  const contReferencia = document.getElementById('contenedor-cliente-referencia');

  if (opcion === 'Delivery') {
    if (contenedorDelivery) contenedorDelivery.classList.remove('d-none');
    if (bloqueCliente) bloqueCliente.classList.remove('d-none');
    if (contDireccion) contDireccion.classList.remove('d-none');
    if (contReferencia) contReferencia.classList.remove('d-none');
  } else if (opcion === 'Llevar') {
    if (contenedorDelivery) contenedorDelivery.classList.add('d-none');
    if (bloqueCliente) bloqueCliente.classList.remove('d-none');
    if (contDireccion) contDireccion.classList.add('d-none');
    if (contReferencia) contReferencia.classList.add('d-none');
  } else {
    if (contenedorDelivery) contenedorDelivery.classList.add('d-none');
    if (bloqueCliente) bloqueCliente.classList.add('d-none');
  }

  const esLlevarODelivery = (opcion === 'Llevar' || opcion === 'Delivery');
  pedido.forEach(item => {
    const prod = productos.find(p => p.id === item.id);
    if (prod) {
      item.precio = esLlevarODelivery ? prod.llevar : prod.mesa;
    }
  });

  renderMenu();
  actualizarResumenHTML();
}

// Buscador de Clientes
function buscarCliente(query) {
  const sugerencias = document.getElementById('lista-sugerencias');
  if (!sugerencias) return;
  
  sugerencias.innerHTML = '';
  if (query.trim().length < 2) { 
    sugerencias.classList.add('d-none'); 
    return; 
  }

  const coincidencias = baseClientes.filter(c => 
    c.telefono.includes(query) || c.nombre.toLowerCase().includes(query.toLowerCase())
  );

  if (coincidencias.length === 0) { 
    sugerencias.classList.add('d-none'); 
    return; 
  }

  coincidencias.forEach(cliente => {
    const item = document.createElement('div');
    item.className = 'item-sugerencia border-bottom p-2 bg-light cursor-pointer';
    item.style.cursor = 'pointer';
    item.innerHTML = `<strong>${cliente.nombre}</strong> — <span class="text-muted">${cliente.telefono}</span>`;
    item.onclick = () => seleccionarCliente(cliente);
    sugerencias.appendChild(item);
  });
  
  sugerencias.classList.remove('d-none');
}

function seleccionarCliente(cliente) {
  const tel = document.getElementById('cliente-telefono');
  const nom = document.getElementById('cliente-nombre');
  const dir = document.getElementById('cliente-direccion');
  const ref = document.getElementById('cliente-referencia');

  if (tel) tel.value = cliente.telefono;
  if (nom) nom.value = cliente.nombre;
  if (dir) dir.value = cliente.direccion || '';
  if (ref) ref.value = cliente.referencia || '';
  
  const sugerencias = document.getElementById('lista-sugerencias');
  if (sugerencias) sugerencias.classList.add('d-none');
}

function guardarClienteNuevo(telefono, nombre, direccion, referencia) {
  if (!telefono || !nombre) return;
  const existe = baseClientes.find(c => c.telefono === telefono);
  if (!existe) {
    baseClientes.push({ telefono, nombre, direccion, referencia });
    localStorage.setItem('anita_wok_clientes', JSON.stringify(baseClientes));
  }
}

document.addEventListener('click', function(e) {
  const sugerencias = document.getElementById('lista-sugerencias');
  const inputTelefono = document.getElementById('cliente-telefono');
  if (sugerencias && inputTelefono && e.target !== inputTelefono && !sugerencias.contains(e.target)) {
    sugerencias.classList.add('d-none');
  }
});

// Agregar Plato al Pedido
function agregarAlPedido(idProd) {
  const selectorMesa = document.getElementById('mesa');
  const opcion = selectorMesa ? selectorMesa.value : '';
  const esLlevarODelivery = (opcion === 'Llevar' || opcion === 'Delivery');

  const prod = productos.find(p => p.id === idProd);
  if (!prod) return;

  const precio = esLlevarODelivery ? prod.llevar : prod.mesa;
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

function cambiarCantidad(index, cambio) {
  if (pedido[index]) {
    pedido[index].cantidad += cambio;
    if (pedido[index].cantidad <= 0) {
      pedido.splice(index, 1);
    }
  }
  actualizarResumenHTML();
}

function actualizarObservacion(index, texto) {
  if (pedido[index]) {
    pedido[index].observacion = texto;
  }
}

// Actualizar Comanda Activa
function actualizarResumenHTML() {
  const contenedorResumen = document.getElementById('lista-pedido');
  const badgeTotal = document.getElementById('badge-total-items');
  const selectorMesa = document.getElementById('mesa');
  const selectorDelivery = document.getElementById('recargo-delivery');

  if (!contenedorResumen) return;

  const totalCantidad = pedido.reduce((sum, item) => sum + item.cantidad, 0);
  if (badgeTotal) badgeTotal.textContent = `${totalCantidad} ítems`;

  if (pedido.length === 0) {
    contenedorResumen.innerHTML = '<p class="text-muted text-center py-4 my-0 small">No hay platos agregados</p>';
    return;
  }

  let html = '<div class="d-flex flex-column gap-2">';
  let subtotalPlatos = 0;

  pedido.forEach((item, index) => {
    const sub = item.precio * item.cantidad;
    subtotalPlatos += sub;

    html += `
      <div class="bg-white p-2 rounded border shadow-sm">
        <div class="d-flex justify-content-between align-items-center">
          <div style="flex: 1; padding-right: 5px;">
            <div class="fw-bold text-dark" style="font-size: 0.82rem; line-height: 1.1;">${item.nombre}</div>
            <small class="text-danger fw-bold" style="font-size: 0.78rem;">S/ ${sub.toFixed(2)}</small>
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

  const tipo = selectorMesa ? selectorMesa.value : '';
  let recargoDelivery = 0;

  if (tipo === 'Delivery' && selectorDelivery) {
    recargoDelivery = parseFloat(selectorDelivery.value) || 0;
  }

  const totalFinal = subtotalPlatos + recargoDelivery;

  html += `</div>
    <div class="border-top mt-3 pt-2">
      <div class="d-flex justify-content-between small text-muted">
        <span>Subtotal Platos:</span>
        <span>S/ ${subtotalPlatos.toFixed(2)}</span>
      </div>
  `;

  if (tipo === 'Delivery') {
    html += `
      <div class="d-flex justify-content-between small text-muted">
        <span>Recargo Delivery:</span>
        <span>S/ ${recargoDelivery.toFixed(2)}</span>
      </div>
    `;
  }

  html += `
      <div class="d-flex justify-content-between fw-bold text-danger h6 mt-1 mb-0">
        <span>TOTAL:</span>
        <span>S/ ${totalFinal.toFixed(2)}</span>
      </div>
    </div>
  `;

  contenedorResumen.innerHTML = html;
}

// Enviar Comanda a Cocina
function enviarComanda() {
  if (pedido.length === 0) {
    alert('Agrega al menos un plato antes de enviar la comanda.');
    return;
  }

  const selectorMesa = document.getElementById('mesa');
  const selectorDelivery = document.getElementById('recargo-delivery');
  const selectorMetodo = document.getElementById('metodo-pago');

  const mesa = selectorMesa ? selectorMesa.value : 'Mesa 1';
  const metodoPago = selectorMetodo ? selectorMetodo.value : 'Efectivo';

  let subtotal = pedido.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  let recargoDelivery = 0;

  if (mesa === 'Delivery' && selectorDelivery) {
    recargoDelivery = parseFloat(selectorDelivery.value) || 0;
  }

  const total = subtotal + recargoDelivery;

  const tel = document.getElementById('cliente-telefono')?.value.trim() || '';
  const nom = document.getElementById('cliente-nombre')?.value.trim() || '';
  const dir = document.getElementById('cliente-direccion')?.value.trim() || '';
  const ref = document.getElementById('cliente-referencia')?.value.trim() || '';

  if ((mesa === 'Llevar' || mesa === 'Delivery') && tel && nom) {
    guardarClienteNuevo(tel, nom, dir, ref);
  }

  const idCorrelativo = String(historialVentas.length + 1).padStart(6, '0');

  const datosComanda = {
    id: idCorrelativo,
    mesa: mesa,
    metodoPago: metodoPago,
    cliente: { telefono: tel, nombre: nom, direccion: dir, referencia: ref },
    items: [...pedido],
    recargoDelivery: recargoDelivery,
    total: total,
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString('es-PE', { hour12: true })
  };

  if (typeof socket !== 'undefined') {
    socket.emit('nuevaComanda', datosComanda);
  } else {
    console.error('Socket no está disponible.');
  }

  historialVentas.push(datosComanda);

  alert(`¡Comanda #${idCorrelativo} enviada a Cocina! Ubicación: ${mesa} | Pago: ${metodoPago}`);

  pedido = [];
  actualizarResumenHTML();
}

// Cerrar Caja y Mostrar Modal
function cerrarCaja() {
  const modalElem = document.getElementById('modalCaja');
  const cuerpoModal = document.getElementById('cuerpo-modal-caja');
  if (!modalElem || !cuerpoModal) return;

  if (historialVentas.length === 0) {
    cuerpoModal.innerHTML = '<p class="text-muted text-center py-3 mb-0">No se registran ventas en el turno actual.</p>';
  } else {
    let totalGeneral = 0;
    let porMetodo = { Efectivo: 0, Yape: 0, Plin: 0, Tarjeta: 0 };

    let tablaHTML = `
      <div class="table-responsive">
        <table class="table table-sm table-striped align-middle" style="font-size:0.85rem;">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Hora</th>
              <th>Mesa/Tipo</th>
              <th>Método</th>
              <th>Ítems</th>
              <th class="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
    `;

    historialVentas.forEach(v => {
      totalGeneral += v.total;
      if (porMetodo[v.metodoPago] !== undefined) {
        porMetodo[v.metodoPago] += v.total;
      } else {
        porMetodo[v.metodoPago] = v.total;
      }

      const resumenItems = v.items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ');

      tablaHTML += `
        <tr>
          <td><span class="fw-bold">#${v.id}</span></td>
          <td>${v.hora || v.fecha}</td>
          <td><span class="badge bg-secondary">${v.mesa}</span></td>
          <td><span class="badge bg-info text-dark">${v.metodoPago}</span></td>
          <td>${resumenItems}</td>
          <td class="text-end fw-bold">S/ ${v.total.toFixed(2)}</td>
        </tr>
      `;
    });

    tablaHTML += `
          </tbody>
        </table>
      </div>

      <div class="row g-2 mt-2 pt-2 border-top">
        <div class="col-6 col-md-3">
          <div class="p-2 bg-light rounded text-center border">
            <small class="text-muted d-block">Efectivo</small>
            <strong class="text-success">S/ ${(porMetodo.Efectivo || 0).toFixed(2)}</strong>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-2 bg-light rounded text-center border">
            <small class="text-muted d-block">Yape</small>
            <strong class="text-primary">S/ ${(porMetodo.Yape || 0).toFixed(2)}</strong>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-2 bg-light rounded text-center border">
            <small class="text-muted d-block">Plin</small>
            <strong class="text-info">S/ ${(porMetodo.Plin || 0).toFixed(2)}</strong>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-2 bg-light rounded text-center border">
            <small class="text-muted d-block">Tarjeta</small>
            <strong class="text-warning text-dark">S/ ${(porMetodo.Tarjeta || 0).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div class="alert alert-danger mt-3 mb-0 d-flex justify-content-between align-items-center">
        <strong class="h6 mb-0">TOTAL VENTAS TURNO:</strong>
        <strong class="h5 mb-0">S/ ${totalGeneral.toFixed(2)}</strong>
      </div>
    `;

    cuerpoModal.innerHTML = tablaHTML;
  }

  const modal = new bootstrap.Modal(modalElem);
  modal.show();
}

// Descargar Registro de Ventas en Formato CSV
function descargarExcelVentas() {
  if (historialVentas.length === 0) {
    alert('No hay ventas registradas para exportar.');
    return;
  }

  let sumaTotalDia = 0;
  
  let csvContent = "\uFEFF"; 
  csvContent += "ID Comanda;Hora;Ubicación;Método de Pago;Cliente;Teléfono;Dirección;Pedidos;Delivery;Total del Pedido\n";

  historialVentas.forEach((v) => {
    const idCorrelativo = v.id;
    const hora = v.hora || v.fecha;
    const ubicacion = v.mesa || '';
    const metodoPago = v.metodoPago || '';
    const clienteNombre = (v.cliente && v.cliente.nombre) ? v.cliente.nombre : 'N/A';
    const clienteTel = (v.cliente && v.cliente.telefono) ? v.cliente.telefono : 'N/A';
    const clienteDir = (v.cliente && v.cliente.direccion) ? v.cliente.direccion : 'N/A';

    const listaPedidos = v.items.map(i => {
      let detalle = `${i.cantidad}x ${i.nombre}`;
      if (i.observacion) detalle += ` (${i.observacion})`;
      return detalle;
    }).join(' + ').replace(/"/g, '""');

    const delivery = (v.recargoDelivery || 0).toFixed(2);
    const totalPedido = v.total.toFixed(2);

    sumaTotalDia += v.total;

    csvContent += `"${idCorrelativo}";"${hora}";"${ubicacion}";"${metodoPago}";"${clienteNombre}";"${clienteTel}";"${clienteDir}";"${listaPedidos}";"S/ ${delivery}";"S/ ${totalPedido}"\n`;
  });

  csvContent += `\n;;;;;;;;"TOTAL DÍA";"S/ ${sumaTotalDia.toFixed(2)}"\n`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Reporte_Ventas_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
