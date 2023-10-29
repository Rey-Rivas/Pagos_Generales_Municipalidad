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
const multer = require("multer");
const upload = multer({
    dest: "uploads/" // Carpeta donde se guardarán los archivos subidos
  });

router.use(authenticationMiddleware);

router.get("/", apelacionController.getApelacion);
router.post("/",authorizationMiddleware.isUser, apelacionController.createApelacion);
router.get("/:id", apelacionController.getApelacionById);

router.put("/:id",
    authorizationMiddleware.isEncargado,
    deudaController.updateApelacion
);
router.delete("/:id",
    authorizationMiddleware.isEncargado,
    deudaController.deleteApelacion
);

// Agregar una ruta para manejar la carga de archivos PDF
router.post("/uploads", upload.single("pdf"), apelacionController.uploadPDF);

module.exports = router;