const ExcelJS = require('exceljs');
const moment = require('moment');

function generarInformeExcel(listado_deudas, fechaInicio, fechaFin) {
    try {
        // Crea un workbook donde guardar los datos
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Informe');

        // se crean la estructura del excel
        worksheet.columns = [
            { header: 'Nombre', key: 'nombre', width: 20 },
            { header: 'FechaInicio', key: 'fechaInicio', width: 15 },
            { header: 'FechaTermino', key: 'fechaTermino', width: 15 },
        ];

        // filtra los datos por la fecha especificada
        const datosFiltrados = listado_deudas.filter((dato) => {
            const fechaInicioDato = moment(dato.fechaInicio, 'YYYY-MM-DD');
            const fechaFinDato = moment(dato.fechaTermino, 'YYYY-MM-DD');
            return fechaInicioDato.isSameOrAfter(fechaInicio) && fechaFinDato.isSameOrBefore(fechaFin);
        });

        // añade los datos que correspondan a la fecha al .xlsx
        datosFiltrados.forEach((dato) => {
            worksheet.addRow(dato);
        });

        // le da un nombre al archivo (bastante generico)
        const nombreArchivo = 'informe.xlsx';

        // retorna el excel
        return workbook.xlsx.writeBuffer()
            .then((buffer) => {
                return { buffer, nombreArchivo };
            });
    } catch (error) {
        console.error('Error al generar el informe Excel:', error);
        throw error;
    }
}

// data
const listado_deudas = [
    {
        id: 1,
        nombre: 'Basura',
        fechaInicio: '2023-10-01',
        fechaTermino: '2023-11-01'
    },
    {
        id: 2,
        nombre: 'Pagos Pendientes',
        fechaInicio: '2023-05-10',
        fechaTermino: '2023-11-25'
    },
    {
        id: 3,
        nombre: 'Permisos de Circulación',
        fechaInicio: '2023-01-01',
        fechaTermino: '2023-12-31'
    }
];

const fechaInicio = moment('2023-10-01', 'YYYY-MM-DD');
const fechaFin = moment('2023-11-30', 'YYYY-MM-DD');

generarInformeExcel(listado_deudas, fechaInicio, fechaFin)
    .then((informe) => {
        // `informe.buffer` guarda el .xlsx en el buffer
        console.log('Informe Excel generado correctamente. Nombre de archivo:', informe.nombreArchivo);
    })
    .catch((error) => {
        console.error('Error al generar el informe Excel:', error);
    });

module.exports = { 
    generarInformeExcel,
    listado_deudas,
};
