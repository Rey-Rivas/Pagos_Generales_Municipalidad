"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Enrutador de usuarios  */
const userRoutes = require("./user.routes.js");

/** Enrutador de deudas */
const deudaRoutes = require("./deuda.routes.js");

/** Enrutador de autenticación */
const authRoutes = require("./auth.routes.js");

/** Middlewares*/
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

// Enrutador de informes */
const informesRoutes = require("./informe.routes.js");

/** Instancia del enrutador */
const router = express.Router();


// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);


// Define las rutas para las deudas /api/deudas
router.use("/deudas", authenticationMiddleware, deudaRoutes);

// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);

/* 
Define las rutas para exportar archivos 
    - api/informes
    - api/informes/generar-excel
*/
router.use("/informes", authenticationMiddleware, authorizationMiddleware.isAdmin || authorizationMiddleware.isEncargado, informesRoutes);

// Exporta el enrutador
module.exports = router;
