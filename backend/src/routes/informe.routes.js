// importacion de librearias
const express = require('express');
const router = express.Router();
const informeExcel = require('../controllers/GenerarInforme.controller.js');

// Funcion para generar un excel con los datos de la base de datos

router.post('/generar-excel', informeExcel.informeExcel);

module.exports = router;
