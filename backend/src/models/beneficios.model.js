"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'beneficios'
const beneficiosSchema = new mongoose.Schema(
    {
        beneficiosID:{
            type: Number,
            required: true,
            unique: true,
            primaryKey: true,
        },
        nombreBeneficio:{
            type: String,
            required: true,
        },
        descripcion:{
            type: String,
            required: true,
        },
        monto:{
            type: Number,
            required: true,
        },
    },
);

/** Modelo de datos 'beneficios' */
const Beneficios = mongoose.model("beneficios", beneficiosSchema);

// Exporta el modelo de datos 'beneficios'
module.exports = Beneficios;