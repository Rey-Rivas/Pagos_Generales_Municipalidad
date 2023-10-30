"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const express = require("express");

/** Controlador de deudas */
const notificaController = require("../controllers/notifica.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(authenticationMiddleware);


router.get("/", notificaController.getNotificaciones);
router.post("/", authorizationMiddleware.isEncargado, notificaController.createNotifica);
router.get("/:deudaID/:RUTEncargado?/:RUTUsuario?", authorizationMiddleware.isEncargado, notificaController.getNotificaById);
router.put(
    "/:deudaID/:RUTEncargado/:RUTUsuario",
    authorizationMiddleware.isEncargado,
    notificaController.updateNotifica);
router.delete(
    "/:deudaID/:RUTEncargado?/:RUTUsuario?",
    authorizationMiddleware.isEncargado,
    notificaController.deleteNotifica);

module.exports = router;