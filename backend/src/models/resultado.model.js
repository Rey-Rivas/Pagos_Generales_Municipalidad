"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'resultado'
const resultadoSchema = new mongoose.Schema(
    {
        apelacionID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Apelacion",
            primaryKey: true,          
            },
        RUTEncargado:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                primaryKey: true,            
            },
        RUTUsuario:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                primaryKey: true,          
            },
    },
);

/** Modelo de datos 'resultado' */
const Resultado = mongoose.model("resultado", tramiteSchemaSchema);

// Exporta el modelo de datos 'resultado
module.exports = Resultado;