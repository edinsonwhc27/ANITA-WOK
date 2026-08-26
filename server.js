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

const EXCEL_PATH = path.join(__dirname, 'ventas.xlsx');

// Formato de fecha estandarizado AAAA-MM-DD ajustado a Peru (UTC-5)
function obtenerFechaPeru() {
    const ahora = new Date();
    const opciones = { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' };
    const partes = new Intl.DateTimeFormat('en-CA', opciones).formatToParts(ahora);
    const anio = partes.find(p => p.type === 'year').value;
    const mes = partes.find(p => p.type === 'month').value;
    const dia = partes.find(p => p.type === 'day').value;
    return `${anio}-${mes}-${dia}`;
}

// Formato de hora de Peru
function obtenerHoraPeru() {
    return new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour12: true });
}

// Inicializar base de datos Excel si no existe
async function inicializarExcel() {
    if (!fs.existsSync(EXCEL_PATH)) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ventas');
        worksheet.columns = [
            { header: 'ID Pedido', key: 'id', width: 15 },
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Hora', key: 'hora', width: 12 },
            { header: 'Mesa / Tipo', key: 'mesa', width: 15 },
            { header: 'Detalle de Platos', key: 'platos', width: 45 },
            { header: 'Total (S/)', key: 'total', width: 12 }
        ];
        await workbook.xlsx.writeFile(EXCEL_PATH);
    }
}
inicializarExcel();

// Guardar cada comanda que envia el mozo
async function guardarPedidoEnExcel(pedido) {
    try {
        await inicializarExcel();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(EXCEL_PATH);
        const worksheet = workbook.getWorksheet('Ventas');

        const fechaHoy = obtenerFechaPeru();
        const horaHoy = obtenerHoraPeru();
        
        const detallePlatos = (pedido.platos || []).map(p => {
            const obs = p.observacion ? ` (${p.observacion})` : '';
            return `${p.cantidad || 1}x ${p.nombre || p.titulo}${obs}`;
        }).join(' | ');

        worksheet.addRow({
            id: pedido.id || Date.now(),
            fecha: fechaHoy,
            hora: pedido.hora || horaHoy,
            mesa: pedido.mesa || 'Sin mesa',
            platos: detallePlatos,
            total: parseFloat(pedido.total || 0)
        });

        await workbook.xlsx.writeFile(EXCEL_PATH);
    } catch (error) {
        console.error('Error al guardar comanda en Excel:', error);
    }
}

// Comunicacion en tiempo real con Socket.io
io.on('connection', (socket) => {
    socket.on('nuevo-pedido', async (datos) => {
        await guardarPedidoEnExcel(datos);
        io.emit('nuevo-pedido', datos);
    });
});

// Ruta para descargar el Cierre de Caja del dia
app.get('/descargar-cierre', async (req, res) => {
    try {
        if (!fs.existsSync(EXCEL_PATH)) {
            return res.status(404).send('No hay registros de ventas guardados aun.');
        }

        const workbookLectura = new ExcelJS.Workbook();
        await workbookLectura.xlsx.readFile(EXCEL_PATH);
        const worksheetLectura = workbookLectura.getWorksheet('Ventas');

        const fechaHoy = obtenerFechaPeru();

        const workbookCierre = new ExcelJS.Workbook();
        const sheetCierre = workbookCierre.addWorksheet('Cierre del Dia');

        sheetCierre.columns = [
            { header: 'ID Pedido', key: 'id', width: 15 },
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Hora', key: 'hora', width: 12 },
            { header: 'Mesa / Tipo', key: 'mesa', width: 15 },
            { header: 'Detalle de Platos', key: 'platos', width: 45 },
            { header: 'Total (S/)', key: 'total', width: 12 }
        ];

        let sumaTotalDia = 0;
        let cantidadPedidos = 0;

        worksheetLectura.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const fechaFila = String(row.getCell(2).value).trim();
                
                if (fechaFila === fechaHoy || fechaFila.includes(fechaHoy)) {
                    const totalFila = parseFloat(row.getCell(6).value) || 0;
                    sumaTotalDia += totalFila;
                    cantidadPedidos++;

                    sheetCierre.addRow({
                        id: row.getCell(1).value,
                        fecha: fechaFila,
                        hora: row.getCell(3).value,
                        mesa: row.getCell(4).value,
                        platos: row.getCell(5).value,
                        total: totalFila
                    });
                }
            }
        });

        // Fila final de resumen
        sheetCierre.addRow({});
        const filaTotal = sheetCierre.addRow({
            platos: `TOTAL GENERAL DEL DIA (${cantidadPedidos} pedidos):`,
            total: sumaTotalDia
        });
        filaTotal.font = { bold: true };

        const nombreArchivo = `Cierre_Caja_${fechaHoy}.xlsx`;
        const rutaTemporal = path.join(__dirname, nombreArchivo);

        await workbookCierre.xlsx.writeFile(rutaTemporal);

        res.download(rutaTemporal, nombreArchivo, () => {
            if (fs.existsSync(rutaTemporal)) {
                fs.unlinkSync(rutaTemporal);
            }
        });

    } catch (error) {
        console.error('Error al generar cierre:', error);
        res.status(500).send('Error al generar el reporte.');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
