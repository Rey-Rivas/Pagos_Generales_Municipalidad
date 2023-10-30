"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de apelacion */
const apelacionController = require("../controllers/apelacion.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", apelacionController.getApelacion);
router.post("/",authorizationMiddleware.isUser, apelacionController.createApelacion);
router.get("/:id", apelacionController.getApelacionById);

router.put("/:id",
    authorizationMiddleware.isEncargado,
    apelacionController.updateApelacion
);
router.delete("/:id",
    authorizationMiddleware.isEncargado,
    apelacionController.deleteApelacion
);

module.exports = router;
