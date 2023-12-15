"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'apelacion'
const apelacionSchema = new mongoose.Schema(
    {
        descripcion:{
            type: String,
            required: true,
        },
        documento:{
            type: String,
            required: true,
        },
        estado:{
            type: String,
            required: true,
        },
        deudaID:{
            type: String,
            required: true,        
            },
        RUTEncargado:{
            type: String,
            required: false,
            },
        RUTUsuario:{
            type: String,
            required: true,  
            },
        observacion:{
            type: String,
            required: false,
        }     
    },
);

/** Modelo de datos 'apelacion' */
const Apelacion = mongoose.model("apelacion", apelacionSchema);

// Exporta el modelo de datos 'apelacion'
module.exports = Apelacion;