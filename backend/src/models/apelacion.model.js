"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'apelacion'
const apelacionSchema = new mongoose.Schema(
    {
        apelacionID:{
            type: Number,
            required: true,
            unique: true,
            primaryKey: true,
        },
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
        deudaID:[
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Deuda",            
            },
        ],
        RUTEncargado:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",            
            },
        ],
        RUTUsuario:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",            
            },
        ],  
    },
);

/** Modelo de datos 'apelacion' */
const Apelacion = mongoose.model("apelacion", tramiteSchemaSchema);

// Exporta el modelo de datos 'apelacion'
module.exports = Apelacion;