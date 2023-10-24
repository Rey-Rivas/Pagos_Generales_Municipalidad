"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'deuda'
const deudaSchema = new mongoose.Schema(
    {
        deudaID:{
            type: Number,
            required: true,
            unique: true,
            primaryKey: true,
        },
        descripcion:{
            type: String,
            required: true,
        },
        monto:{
            type: Number,
            required: true,
        },
        fechaEmision:{
            type: Date,
            required: true,
        },
        fechaVencimiento:{
            type: Date,
            required: true,
        },
        fechaPago:{
            type: Date,
            required: false,
        },
        estado:{
            type: String,
            required: true,
        },
        tramiteID:[
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tramite",            
            },
        ],
        RUTAdmin:[
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

/** Modelo de datos 'deuda' */
const Deuda = mongoose.model("deuda", tramiteSchemaSchema);

// Exporta el modelo de datos 'Deuda'
module.exports = Deuda;