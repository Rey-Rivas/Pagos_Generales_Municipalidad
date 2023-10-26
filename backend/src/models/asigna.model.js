"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'Asigna'
const asignaSchema = new mongoose.Schema(
    {
        beneficioID:{
            type: Number,
            required: true,
            primaryKey: true,
        },
        RUTUsuario:{
            type: String,
            required: true,
            unique: true,
            },
        fechaAsignacion:{
            type: String,
            required: true,  
            unique: true,
            },
    },
);

/** Modelo de datos 'Asigna' */
const Asigna = mongoose.model("Asigna", asignaSchema);

// Exporta el modelo de datos 'Asigna
module.exports = Asigna;