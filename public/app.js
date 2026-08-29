// CARTA COMPLETA OFICIAL - ANITA WOK (47 PRODUCTOS)
const PRODUCTOS = [
  // CHAUFAS Y AROPAS
  { id: 1, nombre: "Arroz Chaufa de Pollo", cat: "Chaufas", precioMesa: 14.00, precioLlevar: 15.00 },
  { id: 2, nombre: "Arroz Chaufa de Carne", cat: "Chaufas", precioMesa: 16.00, precioLlevar: 17.00 },
  { id: 3, nombre: "Arroz Chaufa de Cerdo / Chancho", cat: "Chaufas", precioMesa: 16.00, precioLlevar: 17.00 },
  { id: 4, nombre: "Arroz Chaufa Mixto (Pollo y Carne)", cat: "Chaufas", precioMesa: 18.00, precioLlevar: 19.00 },
  { id: 5, nombre: "Arroz Chaufa Especial Anita Wok", cat: "Chaufas", precioMesa: 22.00, precioLlevar: 23.00 },
  { id: 6, nombre: "Arroz Chaufa Camaron", cat: "Chaufas", precioMesa: 24.00, precioLlevar: 25.00 },
  { id: 7, nombre: "Arroz Chaufa Marisco", cat: "Chaufas", precioMesa: 24.00, precioLlevar: 25.00 },
  { id: 8, nombre: "Chaufa Aeropuerto de Pollo", cat: "Chaufas", precioMesa: 16.00, precioLlevar: 17.00 },
  { id: 9, nombre: "Chaufa Aeropuerto Especial", cat: "Chaufas", precioMesa: 22.00, precioLlevar: 23.00 },

  // TALLARINES SALTADOS
  { id: 10, nombre: "Tallarin Saltado de Pollo", cat: "Tallarines", precioMesa: 15.00, precioLlevar: 16.00 },
  { id: 11, nombre: "Tallarin Saltado de Carne", cat: "Tallarines", precioMesa: 17.00, precioLlevar: 18.00 },
  { id: 12, nombre: "Tallarin Saltado Mixto", cat: "Tallarines", precioMesa: 19.00, precioLlevar: 20.00 },
  { id: 13, nombre: "Tallarin Saltado Especial Anita", cat: "Tallarines", precioMesa: 23.00, precioLlevar: 24.00 },
  { id: 14, nombre: "Tallarin Samsi de Pollo", cat: "Tallarines", precioMesa: 17.00, precioLlevar: 18.00 },
  { id: 15, nombre: "Taypa Especial en Wok", cat: "Especiales", precioMesa: 26.00, precioLlevar: 27.00 },

  // TIPAKAY Y CHIFA CLÁSICO
  { id: 16, nombre: "Pollo Tipakay con Chaufa", cat: "Chifa Clásico", precioMesa: 18.00, precioLlevar: 19.00 },
  { id: 17, nombre: "Pollo Chijaukay con Chaufa", cat: "Chifa Clásico", precioMesa: 18.00, precioLlevar: 19.00 },
  { id: 18, nombre: "Pollo con Verduras y Chaufa", cat: "Chifa Clásico", precioMesa: 17.00, precioLlevar: 18.00 },
  { id: 19, nombre: "Pollo Piña con Chaufa", cat: "Chifa Clásico", precioMesa: 19.00, precioLlevar: 20.00 },
  { id: 20, nombre: "Kam Lu Wantan", cat: "Chifa Clásico", precioMesa: 25.00, precioLlevar: 26.00 },

  // ENTRADAS Y BOKITAS
  { id: 21, nombre: "Sopa Wantan Simple", cat: "Entradas", precioMesa: 8.00, precioLlevar: 9.00 },
  { id: 22, nombre: "Sopa Wantan Especial", cat: "Entradas", precioMesa: 14.00, precioLlevar: 15.00 },
  { id: 23, nombre: "Sopa Fuchifu", cat: "Entradas", precioMesa: 10.00, precioLlevar: 11.00 },
  { id: 24, nombre: "Wantan Frito (6 unidades)", cat: "Entradas", precioMesa: 7.00, precioLlevar: 8.00 },
  { id: 25, nombre: "Wantan Frito (12 unidades)", cat: "Entradas", precioMesa: 12.00, precioLlevar: 13.00 },
  { id: 26, nombre: "Siukai / Dumplings Wok (6 un)", cat: "Entradas", precioMesa: 12.00, precioLlevar: 13.00 },

  // CRIOLLO / LOMO SALTADO
  { id: 27, nombre: "Lomo Saltado de Res Tradicional", cat: "Criollo", precioMesa: 22.00, precioLlevar: 23.00 },
  { id: 28, nombre: "Lomo Saltado de Pollo", cat: "Criollo", precioMesa: 18.00, precioLlevar: 19.00 },
  { id: 29, nombre: "Mostrito de Pollo + Chaufa + Papas", cat: "Criollo", precioMesa: 16.00, precioLlevar: 17.00 },
  { id: 30, nombre: "Pollo a la Plancha con Papas y Ensalada", cat: "Criollo", precioMesa: 17.00, precioLlevar: 18.00 },

  // PORCIONES EXTRA
  { id: 31, nombre: "Porcion de Arroz Chaufa Blanco/Simple", cat: "Porciones", precioMesa: 6.00, precioLlevar: 7.00 },
  { id: 32, nombre: "Porcion de Papas Fritas", cat: "Porciones", precioMesa: 6.00, precioLlevar: 7.00 },
  { id: 33, nombre: "Porcion Naranjitas / Tamarindo extra", cat: "Porciones", precioMesa: 3.00, precioLlevar: 3.00 },

  // BEBIDAS Y GASEOSAS
  { id: 34, nombre: "Inca Kola 500ml", cat: "Bebidas", precioMesa: 4.50, precioLlevar: 4.50 },
  { id: 35, nombre: "Coca Cola 500ml", cat: "Bebidas", precioMesa: 4.50, precioLlevar: 4.50 },
  { id: 36, nombre: "Inca Kola 1.5 Litros", cat: "Bebidas", precioMesa: 9.00, precioLlevar: 9.00 },
  { id: 37, nombre: "Coca Cola 1.5 Litros", cat: "Bebidas", precioMesa: 9.00, precioLlevar: 9.00 },
  { id: 38, nombre: "Chicha Morada Jarra 1L", cat: "Bebidas", precioMesa: 10.00, precioLlevar: 11.00 },
  { id: 39, nombre: "Chicha Morada Vaso", cat: "Bebidas", precioMesa: 3.50, precioLlevar: 4.00 },
  { id: 40, nombre: "Agua Mineral sin Gas 600ml", cat: "Bebidas", precioMesa: 3.00, precioLlevar: 3.00 },

  // FAMILIARES & COMBOS
  { id: 41, nombre: "Combo Familiar 1 (Chaufa + Wantan + Bebida)", cat: "Combos", precioMesa: 45.00, precioLlevar: 47.00 },
  { id: 42, nombre: "Combo Familiar 2 (Chaufa + Chijaukay + Wantan)", cat: "Combos", precioMesa: 52.00, precioLlevar: 54.00 },
  { id: 43, nombre: "Combo Dueto (2 Chaufas + Wantan 6un)", cat: "Combos", precioMesa: 32.00, precioLlevar: 34.00 },
  { id: 44, nombre: "Banquete Anita Wok (3 Platos Fuertes + Bebida 1.5L)", cat: "Combos", precioMesa: 75.00, precioLlevar: 78.00 },
  { id: 45, nombre: "Sopa Familiar Wok (3 Litros)", cat: "Combos", precioMesa: 28.00, precioLlevar: 30.00 },
  { id: 46, nombre: "Chaufa Familiar Gigante (3-4 personas)", cat: "Combos", precioMesa: 38.00, precioLlevar: 40.00 },
  { id: 47, nombre: "Tallarin Familiar Gigante (3-4 personas)", cat: "Combos", precioMesa: 40.00, precioLlevar: 42.00 }
];

// Socket.io
const socket = io();

// Variables Globales de Comanda
let comandaActual = [];
let categoriaActiva = "Todos";
let historialVentas = JSON.parse(localStorage.getItem("anita_ventas_v2")) || [];

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderCategorias();
  renderProductos();
  actualizarComandaUI();

  // Escuchar cambio de tipo servicio
  document.getElementById("tipoServicio").addEventListener("change", (e) => {
    const isMesa = e.target.value === "Mesa";
    document.getElementById("boxMesa").style.display = isMesa ? "block" : "none";
  });
});

// Renderizar Botones de Categoría
function renderCategorias() {
  const categorias = ["Todos", ...new Set(PRODUCTOS.map(p => p.cat))];
  const cont = document.getElementById("contenedorCategorias");
  
  cont.innerHTML = categorias.map(c => `
    <button class="btn btn-sm ${c === categoriaActiva ? 'btn-danger' : 'btn-outline-secondary'} btn-cat text-nowrap" 
            onclick="filtrarCategoria('${c}')">
      ${c}
    </button>
  `).join("");
}

function filtrarCategoria(cat) {
  categoriaActiva = cat;
  renderCategorias();
  filtrarProductos();
}

// BUSCADOR EN TIEMPO REAL
function filtrarProductos() {
  const query = document.getElementById("inputBuscar").value.toLowerCase().trim();
  
  const filtrados = PRODUCTOS.filter(p => {
    const coincideCat = (categoriaActiva === "Todos" || p.cat === categoriaActiva);
    const coincideNombre = p.nombre.toLowerCase().includes(query);
    return coincideCat && coincideNombre;
  });

  renderProductos(filtrados);
}

// Renderizar Productos en Grid
function renderProductos(lista = PRODUCTOS) {
  const grid = document.getElementById("gridProductos");
  const tipoServicio = document.getElementById("tipoServicio").value;

  if (lista.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center text-muted py-4">No se encontraron productos.</div>`;
    return;
  }

  grid.innerHTML = lista.map(p => {
    const precio = (tipoServicio === "Mesa") ? p.precioMesa : p.precioLlevar;
    return `
      <div class="col">
        <div class="card card-product h-100 p-2" onclick="agregarAComanda(${p.id})">
          <div class="card-body p-2 d-flex flex-column justify-content-between">
            <div>
              <span class="badge bg-light text-dark mb-1 border" style="font-size:0.7rem;">${p.cat}</span>
              <h6 class="fw-bold text-dark mb-1 fs-6">${p.nombre}</h6>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <span class="fw-bold text-danger fs-5">S/ ${precio.toFixed(2)}</span>
              <button class="btn btn-sm btn-danger rounded-circle"><i class="bi bi-plus-lg"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// AGREGAR PRODUCTO A COMANDA
function agregarAComanda(id) {
  const prod = PRODUCTOS.find(p => p.id === id);
  if (!prod) return;

  const exist = comandaActual.find(item => item.id === id);
  if (exist) {
    exist.cant++;
  } else {
    comandaActual.push({
      id: prod.id,
      nombre: prod.nombre,
      precioMesa: prod.precioMesa,
      precioLlevar: prod.precioLlevar,
      cant: 1
    });
  }

  actualizarComandaUI();
}

// MODIFICAR CANTIDADES
function cambiarCantidad(id, delta) {
  const item = comandaActual.find(i => i.id === id);
  if (!item) return;

  item.cant += delta;
  if (item.cant <= 0) {
    comandaActual = comandaActual.filter(i => i.id !== id);
  }
  actualizarComandaUI();
}

// VACIAR COMANDA
function vaciarComanda() {
  if (comandaActual.length === 0) return;
  if (confirm("¿Deseas vaciar todos los platos de esta comanda?")) {
    comandaActual = [];
    document.getElementById("obsComanda").value = "";
    actualizarComandaUI();
  }
}

// ACTUALIZAR INTERFAZ DE COMANDA Y CÁLCULO DE TOTALES
function actualizarComandaUI() {
  const tbody = document.getElementById("bodyComanda");
  const tipoServicio = document.getElementById("tipoServicio").value;

  if (comandaActual.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No hay platos agregados.</td></tr>`;
    document.getElementById("txtSubtotal").innerText = "S/ 0.00";
    document.getElementById("txtRecargo").innerText = "S/ 0.00";
    document.getElementById("txtTotal").innerText = "S/ 0.00";
    return;
  }

  let subtotal = 0;

  tbody.innerHTML = comandaActual.map(item => {
    const precioUnit = (tipoServicio === "Mesa") ? item.precioMesa : item.precioLlevar;
    const itemSubtotal = precioUnit * item.cant;
    subtotal += itemSubtotal;

    return `
      <tr>
        <td class="fw-semibold small">${item.nombre}</td>
        <td class="text-center">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary px-1 py-0" onclick="cambiarCantidad(${item.id}, -1)">-</button>
            <span class="px-2 fw-bold">${item.cant}</span>
            <button class="btn btn-outline-secondary px-1 py-0" onclick="cambiarCantidad(${item.id}, 1)">+</button>
          </div>
        </td>
        <td class="text-end fw-bold small">S/ ${itemSubtotal.toFixed(2)}</td>
        <td class="text-center">
          <button class="btn btn-sm text-danger p-0" onclick="cambiarCantidad(${item.id}, -${item.cant})">
            <i class="bi bi-x-circle"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");

  // Recargo por envase/delivery
  let recargo = 0;
  if (tipoServicio === "Llevar" || tipoServicio === "Delivery") {
    recargo = 1.00;
  }

  const total = subtotal + recargo;

  document.getElementById("txtSubtotal").innerText = `S/ ${subtotal.toFixed(2)}`;
  document.getElementById("txtRecargo").innerText = `S/ ${recargo.toFixed(2)}`;
  document.getElementById("txtTotal").innerText = `S/ ${total.toFixed(2)}`;
}

function actualizarPreciosYTotales() {
  renderProductos();
  actualizarComandaUI();
}

// REGISTRAR Y ENVIAR PEDIDO
function enviarPedido() {
  if (comandaActual.length === 0) {
    alert("Por favor agrega al menos un producto a la comanda.");
    return;
  }

  const tipo = document.getElementById("tipoServicio").value;
  const numMesa = document.getElementById("numMesa").value;
  const obs = document.getElementById("obsComanda").value.trim();
  const metodo = document.querySelector('input[name="metodoPago"]:checked').value;

  let subtotal = 0;
  const itemsFormat = comandaActual.map(i => {
    const pu = (tipo === "Mesa") ? i.precioMesa : i.precioLlevar;
    subtotal += pu * i.cant;
    return {
      id: i.id,
      nombre: i.nombre,
      cant: i.cant,
      precioUnit: pu,
      subtotal: pu * i.cant
    };
  });

  const recargo = (tipo !== "Mesa") ? 1.00 : 0.00;
  const total = subtotal + recargo;

  const comanda = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    tipo: tipo,
    mesa: tipo === "Mesa" ? numMesa : "-",
    items: itemsFormat,
    subtotal: subtotal,
    recargo: recargo,
    total: total,
    metodoPago: metodo,
    obs: obs,
    estado: "Pendiente"
  };

  // 1. Guardar localmente para Cierre de Caja
  historialVentas.push(comanda);
  localStorage.setItem("anita_ventas_v2", JSON.stringify(historialVentas));

  // 2. Enviar a Servidor / Cocina mediante Socket.io
  socket.emit("nuevaComanda", comanda);

  // 3. Imprimir Ticketera en Letra Grande
  imprimirTicket(comanda);

  // Reset Formulario
  comandaActual = [];
  document.getElementById("obsComanda").value = "";
  actualizarComandaUI();

  alert(" Comanda N° " + comanda.id.toString().slice(-4) + " registrada con éxito.");
}

// IMPRESIÓN DE TICKET TÉRMICO (LETRA GRANDE 18PX-22PX)
function imprimirTicket(c) {
  const ticketDiv = document.getElementById("ticketImpresion");
  
  const itemsTxt = c.items.map(it => `
    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <span>${it.cant}x ${it.nombre}</span>
      <span>S/ ${it.subtotal.toFixed(2)}</span>
    </div>
  `).join('');

  ticketDiv.innerHTML = `
    <div style="text-align:center; padding:10px 0; border-bottom:2px dashed #000;">
      <h2 style="margin:0; font-size:22px; font-weight:bold;">ANITA-WOK</h2>
      <p style="margin:0; font-size:14px;">Chifa & Wok Gourmet</p>
      <p style="margin:5px 0 0 0; font-size:16px;">TICKET N° #${c.id.toString().slice(-4)}</p>
    </div>
    
    <div style="margin:10px 0; font-size:16px;">
      <div>FECHA: ${new Date(c.fecha).toLocaleString()}</div>
      <div>TIPO: <strong>${c.tipo} ${c.tipo === 'Mesa' ? 'MESA ' + c.mesa : ''}</strong></div>
      <div>PAGO: ${c.metodoPago}</div>
    </div>

    <div style="border-top:1px dashed #000; border-bottom:1px dashed #000; padding:10px 0; margin:10px 0;">
      ${itemsTxt}
    </div>

    ${c.recargo > 0 ? `<div style="display:flex; justify-content:space-between;"><span>RECARGO/DELIVERY:</span><span>S/ ${c.recargo.toFixed(2)}</span></div>` : ''}

    <div style="display:flex; justify-content:space-between; font-size:20px; font-weight:bold; margin-top:8px; border-top:2px solid #000; padding-top:5px;">
      <span>TOTAL:</span>
      <span>S/ ${c.total.toFixed(2)}</span>
    </div>

    ${c.obs ? `<div style="margin-top:10px; font-size:14px; border:1px solid #000; padding:4px;"><strong>OBS:</strong> ${c.obs}</div>` : ''}

    <div style="text-align:center; margin-top:15px; font-size:14px;">
      ¡GRACIAS POR SU PREFERENCIA!
    </div>
  `;

  window.print();
}

// CIERRE DE CAJA
function abrirCierreCaja() {
  const modal = new bootstrap.Modal(document.getElementById("modalCierre"));
  const body = document.getElementById("bodyCierreCaja");

  const totalVentas = historialVentas.reduce((sum, v) => sum + v.total, 0);
  const efectivo = historialVentas.filter(v => v.metodoPago === "Efectivo").reduce((sum, v) => sum + v.total, 0);
  const yape = historialVentas.filter(v => v.metodoPago === "Yape/Plin").reduce((sum, v) => sum + v.total, 0);
  const tarjeta = historialVentas.filter(v => v.metodoPago === "Tarjeta").reduce((sum, v) => sum + v.total, 0);

  body.innerHTML = `
    <div class="alert alert-success text-center py-2">
      <span class="small fw-bold">TOTAL RECAUDADO EN CAJA</span>
      <h2 class="fw-bold my-1 text-success">S/ ${totalVentas.toFixed(2)}</h2>
      <span class="small text-muted">${historialVentas.length} Pedidos Procesados</span>
    </div>

    <h6 class="fw-bold border-bottom pb-2">Desglose por Método de Pago:</h6>
    <div class="list-group mb-3">
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <span> Efectivo</span>
        <span class="fw-bold text-success">S/ ${efectivo.toFixed(2)}</span>
      </div>
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <span> Yape / Plin</span>
        <span class="fw-bold text-primary">S/ ${yape.toFixed(2)}</span>
      </div>
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <span> Tarjeta Débito/Crédito</span>
        <span class="fw-bold text-warning">S/ ${tarjeta.toFixed(2)}</span>
      </div>
    </div>
  `;

  modal.show();
}

// EXPORTACIÓN A EXCEL / CSV DIRECTO Y SIN ERRORES (CON UTF-8 BOM)
function exportarExcelCSV() {
  if (historialVentas.length === 0) {
    alert("No hay ventas registradas para exportar.");
    return;
  }

  // Encabezados limpios
  let csvContent = "\uFEFFID Comanda,Fecha,Hora,Tipo Servicio,Mesa,Metodo Pago,Platos Pedidos,Subtotal,Recargo,Total\n";

  historialVentas.forEach(v => {
    const f = new Date(v.fecha);
    const fechaStr = f.toLocaleDateString('es-PE');
    const horaStr = f.toLocaleTimeString('es-PE');
    
    // Concatenar ítems
    const resumenItems = v.items.map(i => `${i.cant}x ${i.nombre}`).join(' | ').replace(/"/g, '""');

    csvContent += `"${v.id}","${fechaStr}","${horaStr}","${v.tipo}","${v.mesa}","${v.metodoPago}","${resumenItems}","${v.subtotal.toFixed(2)}","${v.recargo.toFixed(2)}","${v.total.toFixed(2)}"\n`;
  });

  // Generar Blob con codificación UTF-8
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Cierre_Caja_ANITA_WOK_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
