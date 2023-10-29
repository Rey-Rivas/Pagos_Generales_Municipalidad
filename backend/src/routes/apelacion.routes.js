"use strict";
// Importa el modulo 'express' para crear las rutas
const express = require("express");

/** Controlador de apelacion */
const deudaController = require("../controllers/apelacion.controller.js");

/** Middlewares de autorización */
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");

/** Middleware de autenticación */
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

/** Instancia del enrutador */
const router = express.Router();
const multer = require("multer");
const upload = multer({
    dest: "uploads/" // Carpeta donde se guardarán los archivos subidos
  });

router.use(authenticationMiddleware);

router.get("/", deudaController.getApelacion);
router.post("/",authorizationMiddleware.isUsuario, deudaController.createApelacion);
router.get("/:id", deudaController.getApelacionById);

router.put("/:id",
    authorizationMiddleware.isEncargado,
    deudaController.updateDeuda
);
router.delete("/:id",
    authorizationMiddleware.isEncargado,
    deudaController.deleteDeuda
);

// Agregar una ruta para manejar la carga de archivos PDF
router.post("/uploads", upload.single("pdf"), apelacionController.uploadPDF);

module.exports = router;