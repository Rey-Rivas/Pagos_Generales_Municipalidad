"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'tramites'
const tramiteSchema = new mongoose.Schema(
    {
        tramiteID:{
            type: Number,
            required: true,
            unique: true,
            primaryKey: true,
        },
        nombreTramite:{
            type: String,
            required: true,
        },
        descripcionTramite:{
            type: String,
            required: true,
        },
        RUTAdmin:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",            
            },
    },
);

/** Modelo de datos 'tramite' */
const Tramite = mongoose.model("tramite", tramiteSchemaSchema);

// Exporta el modelo de datos 'Tramite'
module.exports = Tramite;