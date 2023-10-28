// importacion de librearias
const express = require('express');
const router = express.Router();
const moment = require('moment');

// importacion de funciones de Datosaexcel.js
const { generarInformeExcel } = require('../Docs/Datosaexcel.js');
const { listado_deudas } = require('../Docs/Datosaexcel.js');

// Funcion para generar un excel con los datos de la base de datos

router.post('/generar-excel', async (req, res) => {
    // Accede a las fechas desde el cuerpo JSON de la solicitud
    const { fechaInicio, fechaFin } = req.body;

    // Define una expresión regular para validar el formato 'DD-MM-YYYY'
    const formatoFechaRegex = /^\d{2}-\d{2}-\d{4}$/;

    // Validación de formato de fechas
    if (!fechaInicio || !fechaFin || !formatoFechaRegex.test(fechaInicio) || !formatoFechaRegex.test(fechaFin)) {
        return res.status(400).json({ error: 'Fechas inválidas. Deben estar en formato DD-MM-YYYY' });
    }

    // Convierte las fechas en objetos Moment.js para su posterior uso
    const fechaInicioMoment = moment(fechaInicio, 'DD-MM-YYYY');
    const fechaFinMoment = moment(fechaFin, 'DD-MM-YYYY');

    // Verifica si las fechas son reales
    if (!fechaInicioMoment.isValid() || !fechaFinMoment.isValid()) {
        return res.status(400).json({ error: 'Las fechas son inválidas' });
    }

    // Se genera el informe con las fechas especificadas en el body
    generarInformeExcel(listado_deudas, fechaInicioMoment, fechaFinMoment)
        .then((informe) => {

            // Configura las cabeceras de la respuesta HTTP
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${informe.nombreArchivo}`);

            // Envia mensaje de exito y el archivo como respuesta
            console.log('Informe Excel generado correctamente, este archivo se llama:', informe.nombreArchivo);
            res.send(informe.buffer);
        })
        .catch((error) => {
            console.error('Error al generar el informe Excel:', error);
            res.status(500).send('Error al generar el informe');
        });
});

module.exports = router;
