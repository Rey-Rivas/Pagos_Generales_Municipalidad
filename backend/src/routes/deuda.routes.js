"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de deudas */
const deudaController = require("../controllers/deuda.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", deudaController.getDeudas);
router.post("/", authorizationMiddleware.isAdmin, deudaController.createDeuda);
router.get("/:id", deudaController.getDeudaById);
router.put("/:id", authorizationMiddleware.isAdmin, deudaController.updateDeuda);
router.delete("/:id", authorizationMiddleware.isAdmin, deudaController.deleteDeuda);

module.exports = router;