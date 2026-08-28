const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const exceljs = require('exceljs');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const ARCHIVO_VENTAS = path.join(__dirname, 'ventas.json');

// --- LEER Y GUARDAR VENTAS EN ARCHIVO JSON ---
function cargarVentas() {
    try {
        if (fs.existsSync(ARCHIVO_VENTAS)) {
            const data = fs.readFileSync(ARCHIVO_VENTAS, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error al leer el archivo de ventas:', error);
    }
    return [];
}

function guardarVentasEnArchivo(listaVentas) {
    try {
        fs.writeFileSync(ARCHIVO_VENTAS, JSON.stringify(listaVentas, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al guardar el archivo de ventas:', error);
    }
}

// Cargar ventas existentes al arrancar
let ventas = cargarVentas();

// Fecha en Perú (YYYY-MM-DD)
function obtenerFechaPeru() {
    const opciones = { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' };
    const [dia, mes, anio] = new Intl.DateTimeFormat('es-PE', opciones).format(new Date()).split('/');
    return `${anio}-${mes}-${dia}`;
}

app.use(express.static('public'));

// --- SOCKET.IO: RECEPCIÓN Y ENVÍO EN TIEMPO REAL ---
io.on('connection', (socket) => {
    console.log(`[SOCKET] Cliente conectado: ${socket.id}`);

    // Evento estandarizado a 'nuevaComanda'
    socket.on('nuevaComanda', (pedido) => {
        const fechaHoy = obtenerFechaPeru();
        const horaActual = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour12: true });

        const ventaRegistrada = {
            id: pedido.id || Date.now(),
            mesa: pedido.mesa || 'Sin mesa',
            metodoPago: pedido.metodoPago || 'Efectivo',
            cliente: pedido.cliente || {},
            items: pedido.items || pedido.platos || [],
            recargoDelivery: parseFloat(pedido.recargoDelivery || 0),
            total: parseFloat(pedido.total || 0),
            fecha: fechaHoy,
            hora: pedido.hora || horaActual
        };

        // Guardar en memoria y en archivo JSON
        ventas.push(ventaRegistrada);
        guardarVentasEnArchivo(ventas);

        console.log(`[PEDIDO RECIBIDO] ${ventaRegistrada.mesa} - Total: S/ ${ventaRegistrada.total}`);

        // Emitir a la cocina usando 'nuevaComanda'
        io.emit('nuevaComanda', ventaRegistrada);
    });

    socket.on('disconnect', () => {
        console.log(`[SOCKET] Cliente desconectado: ${socket.id}`);
    });
});

// --- RUTA: DESCARGAR CIERRE EN EXCEL ---
app.get('/descargar-cierre', async (req, res) => {
    ventas = cargarVentas();
    
    const fechaHoy = obtenerFechaPeru();
    const ventasHoy = ventas.filter(v => v.fecha === fechaHoy);

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Cierre de Caja');

    worksheet.columns = [
        { header: 'ID Pedido', key: 'id', width: 15 },
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Hora', key: 'hora', width: 15 },
        { header: 'Ubicación / Mesa', key: 'mesa', width: 20 },
        { header: 'Método Pago', key: 'metodoPago', width: 15 },
        { header: 'Detalle de Platos', key: 'detalle', width: 45 },
        { header: 'Total (S/)', key: 'total', width: 15 }
    ];

    let totalGeneral = 0;

    ventasHoy.forEach((v) => {
        const listaPlatos = v.items || v.platos || [];
        const detallePlatos = Array.isArray(listaPlatos) 
            ? listaPlatos.map(p => `${p.cantidad || 1}x ${p.nombre || p.titulo}${p.observacion ? ` (${p.observacion})` : ''}`).join(' | ')
            : String(listaPlatos);

        worksheet.addRow({
            id: v.id,
            fecha: v.fecha,
            hora: v.hora,
            mesa: v.mesa,
            metodoPago: v.metodoPago || 'Efectivo',
            detalle: detallePlatos,
            total: Number(v.total)
        });

        totalGeneral += Number(v.total);
    });

    worksheet.addRow({});
    const filaTotal = worksheet.addRow({
        detalle: `TOTAL GENERAL EN CAJA (${ventasHoy.length} pedidos):`,
        total: totalGeneral
    });
    filaTotal.font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Cierre_Caja_${fechaHoy}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
const http = require('http');
const { Server } = require('socket.io');
const exceljs = require('exceljs');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const ARCHIVO_VENTAS = path.join(__dirname, 'ventas.json');

// --- LEER Y GUARDAR VENTAS EN ARCHIVO JSON ---
function cargarVentas() {
    try {
        if (fs.existsSync(ARCHIVO_VENTAS)) {
            const data = fs.readFileSync(ARCHIVO_VENTAS, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error al leer el archivo de ventas:', error);
    }
    return [];
}

function guardarVentasEnArchivo(listaVentas) {
    try {
        fs.writeFileSync(ARCHIVO_VENTAS, JSON.stringify(listaVentas, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al guardar el archivo de ventas:', error);
    }
}

// Cargar ventas existentes al arrancar
let ventas = cargarVentas();

// Fecha en Perú (YYYY-MM-DD)
function obtenerFechaPeru() {
    const opciones = { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' };
    const [dia, mes, anio] = new Intl.DateTimeFormat('es-PE', opciones).format(new Date()).split('/');
    return `${anio}-${mes}-${dia}`;
}

app.use(express.static('public'));

// --- SOCKET.IO: RECEPCIÓN Y ENVÍO EN TIEMPO REAL ---
io.on('connection', (socket) => {
    console.log(`[SOCKET] Cliente conectado: ${socket.id}`);

    // Evento unificado: 'nuevaComanda'
    socket.on('nuevaComanda', (pedido) => {
        const fechaHoy = obtenerFechaPeru();
        const horaActual = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour12: true });

        const ventaRegistrada = {
            id: pedido.id || Date.now(),
            mesa: pedido.mesa || 'Sin mesa',
            metodoPago: pedido.metodoPago || 'Efectivo',
            cliente: pedido.cliente || {},
            items: pedido.items || pedido.platos || [],
            recargoDelivery: parseFloat(pedido.recargoDelivery || 0),
            total: parseFloat(pedido.total || 0),
            fecha: fechaHoy,
            hora: pedido.hora || horaActual
        };

        // Guardar en memoria y en archivo JSON
        ventas.push(ventaRegistrada);
        guardarVentasEnArchivo(ventas);

        console.log(`[PEDIDO RECIBIDO] ${ventaRegistrada.mesa} - Total: S/ ${ventaRegistrada.total}`);

        // Reenviar a la cocina
        io.emit('nuevaComanda', ventaRegistrada);
    });

    socket.on('disconnect', () => {
        console.log(`[SOCKET] Cliente desconectado: ${socket.id}`);
    });
});

// --- RUTA: DESCARGAR CIERRE EN EXCEL ---
app.get('/descargar-cierre', async (req, res) => {
    ventas = cargarVentas();
    
    const fechaHoy = obtenerFechaPeru();
    const ventasHoy = ventas.filter(v => v.fecha === fechaHoy);

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Cierre de Caja');

    worksheet.columns = [
        { header: 'ID Pedido', key: 'id', width: 15 },
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Hora', key: 'hora', width: 15 },
        { header: 'Ubicación / Mesa', key: 'mesa', width: 20 },
        { header: 'Método Pago', key: 'metodoPago', width: 15 },
        { header: 'Detalle de Platos', key: 'detalle', width: 45 },
        { header: 'Total (S/)', key: 'total', width: 15 }
    ];

    let totalGeneral = 0;

    ventasHoy.forEach((v) => {
        const listaPlatos = v.items || v.platos || [];
        const detallePlatos = Array.isArray(listaPlatos) 
            ? listaPlatos.map(p => `${p.cantidad || 1}x ${p.nombre || p.titulo}${p.observacion ? ` (${p.observacion})` : ''}`).join(' | ')
            : String(listaPlatos);

        worksheet.addRow({
            id: v.id,
            fecha: v.fecha,
            hora: v.hora,
            mesa: v.mesa,
            metodoPago: v.metodoPago || 'Efectivo',
            detalle: detallePlatos,
            total: Number(v.total)
        });

        totalGeneral += Number(v.total);
    });

    worksheet.addRow({});
    const filaTotal = worksheet.addRow({
        detalle: `TOTAL GENERAL EN CAJA (${ventasHoy.length} pedidos):`,
        total: totalGeneral
    });
    filaTotal.font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Cierre_Caja_${fechaHoy}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
