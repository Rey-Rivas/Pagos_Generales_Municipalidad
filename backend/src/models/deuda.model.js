"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'deuda'
const deudaSchema = new mongoose.Schema(
    {
        
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
        tramiteID:{
            type: Number, 
            required: true,
            },
        RUTAdmin:{
            type: String,
            required: true,  
            unique: false,       
            },
        RUTUsuario:{
            type: String,
            required: true,  
            unique: false,       
            },
    },
);

/** Modelo de datos 'deuda' */
const Deuda = mongoose.model("deuda", deudaSchema);

// Exporta el modelo de datos 'Deuda'
module.exports = Deuda;