const ExcelJS = require('exceljs');
const moment = require('moment');
const Deuda = require('../models/deuda.model.js');

const listado_deudas = [];

async function generarInformeExcel(listado_deudas, fechaInicio, fechaFin) {
    try {
        // Obtiene todas las deudas dentro de la base de datos
        const deudas = await Deuda.find();
         
        // Guardar los resultados en el array "listado_deudas"
        listado_deudas.push(...deudas);

        // en este punto ya estan guardados los datos dentro de lista_deudas

        // Filtra los datos por fecha de emision y vencimiento
        const datosFiltrados = listado_deudas.filter((dato) => {

            // Convierte fecha de emision y vencimiento para ser comparadas con Moment.js
            const fechaInicioDato = moment(dato.fechaEmision, 'DD-MM-YYYY');
            const fechaFinDato = moment(dato.fechaVencimiento, 'DD-MM-YYYY');

            return fechaInicioDato.isSameOrAfter(fechaInicio) && fechaFinDato.isSameOrBefore(fechaFin);
        });
        

        // Workbook para guardar los datos
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Informe');
        
        // Estructura del excel
        worksheet.columns = [
            { header: 'Descripcion', key: 'descripcion', width: 20 },
            { header: 'FechaInicio', key: 'fechaInicio', width: 15 },
            { header: 'FechaTermino', key: 'fechaFin', width: 15 },
            { header: 'Estado Deuda', key: 'estado', width: 15 },
        ];

        // Agrega los datos que correspondan a la fecha al .xlsx
        datosFiltrados.forEach((dato) => {
            worksheet.addRow({
                descripcion: dato.descripcion,
                fechaInicio: moment(dato.fechaEmision).format('DD-MM-YYYY'),
                fechaFin: moment(dato.fechaVencimiento).format('DD-MM-YYYY'),
                estado: dato.estado,
            });
        });

        // Aca se cambia el nombre que se le va a dar al .xlsx => 'nombredelarchivo.xlsx' 
        const nombreArchivo = 'informe-deudas.xlsx';

        // Genera el archivo Excel y lo almacena en un buffer
        const buffer = await workbook.xlsx.writeBuffer();
        
        // Retorna el archivo Excel y su nombre
        return { buffer, nombreArchivo };
    } catch (error) {
        console.error('Error al generar el informe Excel:', error);
        throw error;
    }
}

module.exports = { 
    generarInformeExcel,
    listado_deudas,
};
