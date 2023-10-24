"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'resultado'
const resultadoSchema = new mongoose.Schema(
    {
        apelacionID:{
            type: Number,
            required: true,
            primaryKey: true,
        },
        RUTEncargado:{
            type: String,
            required: true,
            },
        RUTUsuario:{
            type: String,
            required: true,  
            },
    },
);

/** Modelo de datos 'resultado' */
const Resultado = mongoose.model("resultado", tramiteSchemaSchema);

// Exporta el modelo de datos 'resultado
module.exports = Resultado;