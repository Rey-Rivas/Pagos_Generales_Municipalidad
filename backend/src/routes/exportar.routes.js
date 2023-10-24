const express = require('express');
const router = express.Router();
const moment = require('moment');

// Importa la función que genera el informe Excel
const { generarInformeExcel } = require('../Docs/Datosaexcel.js');

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

// Ruta para generar y servir el informe
router.get('/generar-excel', (req, res) => {
    // Se definen manualmente las fechas de momento
    const fechaInicio = moment('2023-10-01', 'YYYY-MM-DD');
    const fechaFin = moment('2023-11-30', 'YYYY-MM-DD');

    generarInformeExcel(listado_deudas, fechaInicio, fechaFin)
        .then((informe) => {
            // Configura las cabeceras de la respuesta HTTP
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${informe.nombreArchivo}`);

            // Envía el archivo como respuesta
            res.send(informe.buffer);
        })
        .catch((error) => {
            console.error('Error al generar el informe Excel:', error);
            res.status(500).send('Error al generar el informe');
        });
});


module.exports = router;
