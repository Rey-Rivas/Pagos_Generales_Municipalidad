// importacion de librearias
const express = require('express');
const router = express.Router();
const moment = require('moment');

// importacion de funciones
const { generarInformeExcel } = require('../Docs/Datosaexcel.js');
const { listado_deudas } = require('../Docs/Datosaexcel.js');


// Generar un excel con los datos de la base de datos

router.post('/generar-excel', (req, res) => {
    // Accede a las fechas desde el cuerpo JSON de la solicitud
    const { fechaInicio, fechaFin } = req.body;

    // Validacion de fechas
    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Las fechas son obligatorias en el cuerpo de la solicitud' });
    }

    // Convierte las fechas en objetos Moment.js para ver luego si es una fecha real o no
    const fechaInicioMoment = moment(fechaInicio, 'YYYY-MM-DD');
    const fechaFinMoment = moment(fechaFin, 'YYYY-MM-DD');

    // Verifica si las fechas son reales
    if (!fechaInicioMoment.isValid() || !fechaFinMoment.isValid()) {
        return res.status(400).json({ error: 'Las fechas son inválidas' });
    }

    // Generacion de informe con las fechas especificadas en el body
    generarInformeExcel(listado_deudas, fechaInicioMoment, fechaFinMoment)
        .then((informe) => {
            // Configura las cabeceras de la respuesta HTTP
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${informe.nombreArchivo}`);
            
            // Envia mensaje de exito y el archivo como respuesta
            console.log('Informe Excel generado correctamente. Nombre de archivo:', informe.nombreArchivo);
            res.send(informe.buffer);
        })
        .catch((error) => {
            console.error('Error al generar el informe Excel:', error);
            res.status(500).send('Error al generar el informe');
        });
});

// Generar un pdf con los datos de la base de datos
// :D
module.exports = router;
