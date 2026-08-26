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

// --- FUNCIONES PARA LEER Y GUARDAR EN ARCHIVO JSON ---

// Función para cargar las ventas desde el archivo si existe
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

// Función para guardar las ventas en el archivo json
function guardarVentasEnArchivo(listaVentas) {
    try {
        fs.writeFileSync(ARCHIVO_VENTAS, JSON.stringify(listaVentas, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al guardar el archivo de ventas:', error);
    }
}

// Inicializar la variable de ventas cargando lo guardado en disco
let ventas = cargarVentas();

// Función auxiliar para obtener la fecha de Perú (YYYY-MM-DD)
function obtenerFechaPeru() {
    const opciones = { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' };
    const [dia, mes, anio] = new Intl.DateTimeFormat('es-PE', opciones).format(new Date()).split('/');
    return `${anio}-${mes}-${dia}`;
}

app.use(express.static('public'));

// --- SOCKET.IO: NUEVOS PEDIDOS ---
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('nuevo-pedido', (pedido) => {
        const fechaHoy = obtenerFechaPeru();
        const horaActual = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour12: true });

        const ventaRegistrada = {
            id: pedido.id || Date.now(),
            mesa: pedido.mesa,
            platos: pedido.platos,
            total: pedido.total,
            fecha: fechaHoy,
            hora: horaActual
        };

        // Se agrega a la lista en memoria
        ventas.push(ventaRegistrada);

        // PERSISTENCIA: Se guarda inmediatamente en el archivo ventas.json
        guardarVentasEnArchivo(ventas);

        console.log(`[VENTA REGISTRADA] ${pedido.mesa} - Total: S/ ${pedido.total}`);

        // Reenviar a cocina
        io.emit('pedido-cocina', ventaRegistrada);
    });
});

// --- RUTA: DESCARGAR CIERRE EN EXCEL ---
app.get('/descargar-cierre', async (req, res) => {
    // Nos aseguramos de leer los datos actualizados del archivo
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
        { header: 'Detalle de Platos', key: 'detalle', width: 45 },
        { header: 'Total (S/)', key: 'total', width: 15 }
    ];

    let totalGeneral = 0;

    ventasHoy.forEach((v) => {
        const detallePlatos = v.platos
            .map(p => `${p.cantidad || 1}x ${p.nombre || p.titulo}${p.observacion ? ` (${p.observacion})` : ''}`)
            .join(', ');

        worksheet.addRow({
            id: v.id,
            fecha: v.fecha,
            hora: v.hora,
            mesa: v.mesa,
            detalle: detallePlatos,
            total: Number(v.total)
        });

        totalGeneral += Number(v.total);
    });

    // Fila del Total General
    worksheet.addRow({});
    const filaTotal = worksheet.addRow({
        mesa: 'TOTAL GENERAL',
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
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
