"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de deudas */
const roleController = require("../controllers/role.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", roleController.getRoles);
router.post("/", authorizationMiddleware.isAdmin, roleController.createRole);
router.get("/:id", roleController.getRoleById);
router.put("/:id", authorizationMiddleware.isAdmin, roleController.updateRole);
router.delete("/:id", authorizationMiddleware.isAdmin, roleController.deleteRole);

module.exports = router;