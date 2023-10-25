"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de deudas */
const tramiteController = require("../controllers/tramite.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", tramiteController.getTramites);
router.post("/", authorizationMiddleware.isAdmin, tramiteController.createTramite);
router.get("/:id", tramiteController.getTramiteById);
router.put("/:id", authorizationMiddleware.isAdmin, tramiteController.updateTramite);
router.delete("/:id", authorizationMiddleware.isAdmin, tramiteController.deleteTramite);

module.exports = router;