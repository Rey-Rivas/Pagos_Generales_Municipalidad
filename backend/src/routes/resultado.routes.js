"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de deudas */
const resultadoController = require("../controllers/resultado.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", resultadoController.getResultados);
router.post("/", authorizationMiddleware.isEncargado, resultadoController.createResultado);
router.get("/:apelacionID/:RUTEncargado/:RUTUsuario", resultadoController.getResultado);
router.put("/:apelacionID/:RUTEncargado/:RUTUsuario", authorizationMiddleware.isEncargado, resultadoController.updateResultado);
router.delete("/:apelacionID/:RUTEncargado/:RUTUsuario", authorizationMiddleware.isEncargado, resultadoController.deleteResultado);

module.exports = router;