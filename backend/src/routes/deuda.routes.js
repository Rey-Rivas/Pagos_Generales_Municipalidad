"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de deudas */
const deudaController = require("../controllers/deuda.controller.js");

const {pagarDeuda} = require("../controllers/pagarDeuda.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(authenticationMiddleware);
router.get("/usuario/:RUTUsuario", deudaController.getDeudaByRUT);
router.get("/", deudaController.getDeudas);
router.post("/:id/pagarDeuda", pagarDeuda);
router.post("/",authorizationMiddleware.isAdmin, deudaController.createDeuda);
router.get("/:id", deudaController.getDeudaById);
router.put("/ActualizarImpuesto/:nuevoImpuesto", authorizationMiddleware.isAdmin, deudaController.actualizarImpuesto)

router.put("/:id",
    authorizationMiddleware.isAdmin,
    deudaController.updateDeuda
);
router.delete("/:id",
    authorizationMiddleware.isAdmin,
    deudaController.deleteDeuda
);

module.exports = router;