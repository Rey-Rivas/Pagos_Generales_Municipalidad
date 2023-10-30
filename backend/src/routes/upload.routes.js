
// Importa el modulo 'express' para crear las rutas
const express = require("express");
/** Controlador de apelacion */
const uploadsController = require("../controllers/upload.controller.js");
/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");
/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
/** Instancia del enrutador */
const router = express.Router();

router.post(
    "/",
    authenticationMiddleware,
    uploadsController.upload,
    uploadsController.uploadPDF,
);

module.exports = router;