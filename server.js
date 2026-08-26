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

// Inicializar archivo Excel si no existe
async function inicializarExcel() {
    if (!fs.existsSync(EXCEL_PATH)) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ventas');
        worksheet.columns = [
            { header: 'ID Pedido', key: 'id', width: 15 },
            { header: 'Fecha', key: 'fecha', width: 12 },
            { header: 'Hora', key: 'hora', width: 10 },
            { header: 'Mesa / Tipo', key: 'mesa', width: 15 },
            { header: 'Detalle de Platos', key: 'platos', width: 45 },
            { header: 'Total (S/)', key: 'total', width: 12 }
        ];
        await workbook.xlsx.writeFile(EXCEL_PATH);
    }
}
inicializarExcel();

// Guardar cada pedido que llega
async function guardarPedidoEnExcel(pedido) {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(EXCEL_PATH);
        const worksheet = workbook.getWorksheet('Ventas');

        const fechaActual = new Date().toLocaleDateString('es-PE');
        const detallePlatos = pedido.platos.map(p => {
            const obs = p.observacion ? ` (${p.observacion})` : '';
            return `${p.cantidad}x ${p.nombre}${obs}`;
        }).join(' | ');

        worksheet.addRow({
            id: pedido.id,
            fecha: fechaActual,
            hora: pedido.hora,
            mesa: pedido.mesa,
            platos: detallePlatos,
            total: parseFloat(pedido.total)
        });

        await workbook.xlsx.writeFile(EXCEL_PATH);
    } catch (error) {
        console.error('Error al guardar en Excel:', error);
    }
}

// Socket.io para tiempo real
io.on('connection', (socket) => {
    socket.on('nuevo-pedido', async (datos) => {
        await guardarPedidoEnExcel(datos);
        io.emit('nuevo-pedido', datos);
    });
});

// RUTA DEL CIERRE DE CAJA (Filtra solo las ventas del día)
app.get('/descargar-cierre', async (req, res) => {
    try {
        if (!fs.existsSync(EXCEL_PATH)) {
            return res.status(404).send('No hay registros de ventas guardados.');
        }

        const workbookLectura = new ExcelJS.Workbook();
        await workbookLectura.xlsx.readFile(EXCEL_PATH);
        const worksheetLectura = workbookLectura.getWorksheet('Ventas');

        const fechaHoy = new Date().toLocaleDateString('es-PE');

        const workbookCierre = new ExcelJS.Workbook();
        const sheetCierre = workbookCierre.addWorksheet('Cierre del Día');

        sheetCierre.columns = [
            { header: 'ID Pedido', key: 'id', width: 15 },
            { header: 'Fecha', key: 'fecha', width: 12 },
            { header: 'Hora', key: 'hora', width: 10 },
            { header: 'Mesa / Tipo', key: 'mesa', width: 15 },
            { header: 'Detalle de Platos', key: 'platos', width: 45 },
            { header: 'Total (S/)', key: 'total', width: 12 }
        ];

        let sumaTotalDia = 0;

        worksheetLectura.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const fechaFila = row.getCell(2).value;
                if (fechaFila === fechaHoy) {
                    const totalFila = parseFloat(row.getCell(6).value) || 0;
                    sumaTotalDia += totalFila;

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

        sheetCierre.addRow({});
        const filaTotal = sheetCierre.addRow({
            platos: 'TOTAL GENERAL EN CAJA:',
            total: sumaTotalDia
        });
        filaTotal.font = { bold: true };

        const nombreArchivo = `Cierre_Caja_${fechaHoy.replace(/\//g, '-')}.xlsx`;
        const rutaTemporal = path.join(__dirname, nombreArchivo);

        await workbookCierre.xlsx.writeFile(rutaTemporal);

        res.download(rutaTemporal, nombreArchivo, () => {
            if (fs.existsSync(rutaTemporal)) {
                fs.unlinkSync(rutaTemporal);
            }
        });

    } catch (error) {
        console.error('Error al generar cierre:', error);
        res.status(500).send('Error interno al generar el reporte.');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});
