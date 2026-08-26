const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const DB_PATH = path.join(__dirname, 'ventas_db.json');

// Obtener fecha actual en zona horaria de Peru (AAAA-MM-DD)
function obtenerFechaPeru() {
    const ahora = new Date();
    const opciones = { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' };
    const partes = new Intl.DateTimeFormat('en-CA', opciones).formatToParts(ahora);
    const anio = partes.find(p => p.type === 'year').value;
    const mes = partes.find(p => p.type === 'month').value;
    const dia = partes.find(p => p.type === 'day').value;
    return `${anio}-${mes}-${dia}`;
}

// Obtener hora actual en Peru
function obtenerHoraPeru() {
    return new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour12: true });
}

// Cargar pedidos guardados
function cargarVentas() {
    if (!fs.existsSync(DB_PATH)) {
        return [];
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data || '[]');
    } catch (e) {
        return [];
    }
}

// Guardar lista de pedidos
function guardarVentas(ventas) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(ventas, null, 2), 'utf8');
    } catch (e) {
        console.error('Error guardando JSON:', e);
    }
}

// Guardar nueva comanda recibida
function registrarPedido(pedido) {
    const ventas = cargarVentas();
    const fechaHoy = obtenerFechaPeru();
    const horaHoy = obtenerHoraPeru();

    const detallePlatos = (pedido.platos || []).map(p => {
        const obs = p.observacion ? ` (${p.observacion})` : '';
        return `${p.cantidad || 1}x ${p.nombre || p.titulo}${obs}`;
    }).join(' | ');

    const nuevoRegistro = {
        id: pedido.id || Date.now(),
        fecha: fechaHoy,
        hora: pedido.hora || horaHoy,
        mesa: pedido.mesa || 'Sin ubicación',
        platos: detallePlatos || 'Sin detalle',
        total: parseFloat(pedido.total || 0)
    };

    ventas.push(nuevoRegistro);
    guardarVentas(ventas);
    console.log(`[OK] Pedido guardado en memoria. ID: ${nuevoRegistro.id} | Total: S/ ${nuevoRegistro.total}`);
}

// WebSockets para tiempo real
io.on('connection', (socket) => {
    socket.on('nuevo-pedido', (datos) => {
        registrarPedido(datos);
        io.emit('nuevo-pedido', datos);
    });
});

// Descarga directa de Excel de Cierre de Caja
app.get('/descargar-cierre', async (req, res) => {
    try {
        const ventas = cargarVentas();
        const fechaHoy = obtenerFechaPeru();

        // Filtrar pedidos del dia actual
        const ventasHoy = ventas.filter(v => v.fecha === fechaHoy);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Cierre del Dia');

        sheet.columns = [
            { header: 'ID Pedido', key: 'id', width: 15 },
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Hora', key: 'hora', width: 15 },
            { header: 'Mesa / Tipo', key: 'mesa', width: 18 },
            { header: 'Detalle de Platos', key: 'platos', width: 50 },
            { header: 'Total (S/)', key: 'total', width: 15 }
        ];

        let sumaTotal = 0;

        ventasHoy.forEach(v => {
            sumaTotal += v.total;
            sheet.addRow({
                id: v.id,
                fecha: v.fecha,
                hora: v.hora,
                mesa: v.mesa,
                platos: v.platos,
                total: v.total
            });
        });

        sheet.addRow({});
        const filaResumen = sheet.addRow({
            platos: `TOTAL GENERAL EN CAJA (${ventasHoy.length} pedidos):`,
            total: sumaTotal
        });
        filaResumen.font = { bold: true };

        const nombreArchivo = `Cierre_Caja_${fechaHoy}.xlsx`;
        const rutaArchivo = path.join(__dirname, nombreArchivo);

        await workbook.xlsx.writeFile(rutaArchivo);

        res.download(rutaArchivo, nombreArchivo, () => {
            if (fs.existsSync(rutaArchivo)) {
                fs.unlinkSync(rutaArchivo);
            }
        });

    } catch (error) {
        console.error('Error al generar Excel de Cierre:', error);
        res.status(500).send('Error interno al generar el cierre de caja.');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor de comanda activo en el puerto ${PORT}`);
});
