"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Enrutador de usuarios  */
const userRoutes = require("./user.routes.js");

/** Enrutador de autenticación */
const authRoutes = require("./auth.routes.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

// importa la ruta de exportar archivos
const informesRoutes = require("./informe.routes.js");

/** Instancia del enrutador */
const router = express.Router();


// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);
// Define las rutas para exportar archivos /api/informes
router.use("/informes", authenticationMiddleware, authorizationMiddleware.isAdmin || authorizationMiddleware.isEncargado, informesRoutes);

// Exporta el enrutador
module.exports = router;
