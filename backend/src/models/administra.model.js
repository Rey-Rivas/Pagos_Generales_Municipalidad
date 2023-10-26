"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'Administra'
const administraSchema = new mongoose.Schema(
    {
        beneficioID:{
            type: Number,
            required: true,
            primaryKey: true,
        },
        RUTAdmin:{
            type: String,
            required: true,
            unique: true,
            },
    },
);

/** Modelo de datos 'Administra' */
const Administra = mongoose.model("Administra", administraSchema);

// Exporta el modelo de datos 'Administra
module.exports = Administra;